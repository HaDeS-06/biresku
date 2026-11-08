"""
database.py - Kullanıcı, Token ve Denetim (Audit) Veritabanı Modülü
Güvenlik Standardı:
- Tam Parametrik SQL Sorguları (SQL Injection Bağışıklığı)
- PBKDF2:SHA256 Şifre Hashleme (16-bayt Salt)
- HMAC-SHA256 Refresh Token Saklama
- KVKK Uyumlu İstemci Loglama (SIEM / Audit Trail)
"""

import os
import sqlite3
import hmac
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from werkzeug.security import generate_password_hash, check_password_hash

DB_PATH = os.environ.get("DATABASE_PATH", os.path.join(os.path.dirname(__file__), "biresku_auth.db"))


def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    """Veritabanı tablolarını ve performans/güvenlik indekslerini oluşturur."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # 1. users tablosu
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                full_name TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                phone TEXT,
                is_verified INTEGER DEFAULT 0,
                verification_code TEXT,
                verification_code_expires TEXT,
                created_at TEXT NOT NULL,
                last_login TEXT
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")

        # 2. user_refresh_tokens tablosu
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_refresh_tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token_hash TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                created_at TEXT NOT NULL,
                revoked INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_tokens_hash ON user_refresh_tokens(token_hash)")

        # 3. user_activity_logs tablosu
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_activity_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                action TEXT NOT NULL,
                status TEXT NOT NULL,
                ip_address TEXT,
                user_agent TEXT,
                created_at TEXT NOT NULL
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_logs_user_action ON user_activity_logs(user_id, action)")
        conn.commit()


# --- KULLANICI İŞLEMLERİ ---

def create_user(email: str, password: str, full_name: str, role: str = "user", phone: Optional[str] = None) -> Optional[int]:
    """Yeni kullanıcı oluşturur, şifreyi PBKDF2 ile hashler."""
    now_str = datetime.now(timezone.utc).isoformat()
    pwd_hash = generate_password_hash(password, method="pbkdf2:sha256", salt_length=16)
    
    with get_db_connection() as conn:
        try:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO users (email, password_hash, full_name, role, phone, is_verified, created_at)
                VALUES (?, ?, ?, ?, ?, 0, ?)
            """, (email.lower().strip(), pwd_hash, full_name.strip(), role, phone, now_str))
            conn.commit()
            return cursor.lastrowid
        except sqlite3.IntegrityError:
            return None


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email.lower().strip(),))
        row = cursor.fetchone()
        return dict(row) if row else None


def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        return dict(row) if row else None


def verify_user_password(user: Dict[str, Any], password: str) -> bool:
    return check_password_hash(user["password_hash"], password)


def update_last_login(user_id: int):
    now_str = datetime.now(timezone.utc).isoformat()
    with get_db_connection() as conn:
        conn.execute("UPDATE users SET last_login = ? WHERE id = ?", (now_str, user_id))
        conn.commit()


# --- E-POSTA DOĞRULAMA KODU YÖNETİMİ ---

def set_verification_code(user_id: int, code: str, expires_at: datetime):
    with get_db_connection() as conn:
        conn.execute("""
            UPDATE users SET verification_code = ?, verification_code_expires = ?
            WHERE id = ?
        """, (code, expires_at.isoformat(), user_id))
        conn.commit()


def verify_code_and_activate(email: str, code: str) -> bool:
    user = get_user_by_email(email)
    if not user or not user["verification_code"] or not user["verification_code_expires"]:
        return False
    
    expires = datetime.fromisoformat(user["verification_code_expires"])
    if datetime.now(timezone.utc) > expires:
        return False
    
    if not hmac.compare_digest(user["verification_code"], code):
        return False
    
    with get_db_connection() as conn:
        conn.execute("""
            UPDATE users SET is_verified = 1, verification_code = NULL, verification_code_expires = NULL
            WHERE id = ?
        """, (user["id"],))
        conn.commit()
    return True


# --- REFRESH TOKEN ROTASYONU ---

def save_refresh_token(user_id: int, token_hash: str, expires_at: datetime):
    now_str = datetime.now(timezone.utc).isoformat()
    with get_db_connection() as conn:
        conn.execute("""
            INSERT INTO user_refresh_tokens (user_id, token_hash, expires_at, created_at, revoked)
            VALUES (?, ?, ?, ?, 0)
        """, (user_id, token_hash, expires_at.isoformat(), now_str))
        conn.commit()


def get_valid_refresh_token(token_hash: str) -> Optional[Dict[str, Any]]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM user_refresh_tokens 
            WHERE token_hash = ? AND revoked = 0
        """, (token_hash,))
        row = cursor.fetchone()
        if not row:
            return None
        
        token_data = dict(row)
        expires = datetime.fromisoformat(token_data["expires_at"])
        if datetime.now(timezone.utc) > expires:
            return None
        return token_data


def revoke_refresh_token(token_hash: str):
    with get_db_connection() as conn:
        conn.execute("UPDATE user_refresh_tokens SET revoked = 1 WHERE token_hash = ?", (token_hash,))
        conn.commit()


def revoke_all_user_tokens(user_id: int):
    with get_db_connection() as conn:
        conn.execute("UPDATE user_refresh_tokens SET revoked = 1 WHERE user_id = ?", (user_id,))
        conn.commit()


# --- AKTİVİTE LOGLAMA (SIEM / AUDIT) ---

def log_activity(user_id: Optional[int], action: str, status: str, ip: str, user_agent: str):
    now_str = datetime.now(timezone.utc).isoformat()
    with get_db_connection() as conn:
        conn.execute("""
            INSERT INTO user_activity_logs (user_id, action, status, ip_address, user_agent, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (user_id, action, status, ip, user_agent[:255] if user_agent else "Unknown", now_str))
        conn.commit()
