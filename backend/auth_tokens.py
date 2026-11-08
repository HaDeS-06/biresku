"""
auth_tokens.py - Kriptografik Token & Rotasyon Yönetimi
Güvenlik Standardı: OWASP & NIST Uyumlu (RFC 7519)
- Access Token: HS256 JWT (15 Dakika) + Benzersiz jti (JWT ID)
- Refresh Token: 512-bit URL-Safe Random String (30 Gün)
- Saklama Güvenliği: HMAC-SHA256 Hashleme (Zero-Plaintext Storage)
"""

import os
import hmac
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any, Tuple
import jwt

# Güvenlik Anahtarları (Ortam değişkenlerinden alınır)
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "biresku_jwt_master_secret_key_2026_secure")
REFRESH_HMAC_SECRET = os.environ.get("REFRESH_HMAC_SECRET", "biresku_refresh_hmac_secret_2026_secure").encode("utf-8")

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_LIFETIME_MINUTES = 15
REFRESH_TOKEN_LIFETIME_DAYS = 30


def hash_refresh_token(raw_token: str) -> str:
    """
    Düz metin refresh token'ı HMAC-SHA256 ile tek yönlü hashler.
    Veritabanına asla ham token yazılmaz.
    """
    return hmac.new(REFRESH_HMAC_SECRET, raw_token.encode("utf-8"), hashlib.sha256).hexdigest()


def generate_access_token(user_id: int, email: str, role: str) -> str:
    """
    15 dakikalık kısa ömürlü, imzalı JWT Access Token üretir.
    Payload: sub, email, role, type="access", jti (benzersiz token kimliği), iat, exp
    """
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "type": "access",
        "jti": secrets.token_hex(8),
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=ACCESS_TOKEN_LIFETIME_MINUTES)).timestamp())
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Access token'ın imzasını, geçerliliğini ve süresini doğrular.
    Geçersizse veya süresi dolmuşsa None döner.
    """
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            return None
        return payload
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


def generate_refresh_token() -> Tuple[str, str, datetime]:
    """
    64 baytlık (512-bit entropili) rastgele URL-safe string üretir.
    Dönüş: (raw_token, token_hash, expires_at)
    """
    raw_token = secrets.token_urlsafe(64)
    token_hash = hash_refresh_token(raw_token)
    expires_at = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_LIFETIME_DAYS)
    return raw_token, token_hash, expires_at


def generate_verification_code() -> Tuple[str, datetime]:
    """
    E-posta aktivasyonu için 6 haneli kriptografik rastgele kod ve 15 dakikalık süre üretir.
    """
    code = f"{secrets.randbelow(900000) + 100000}"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)
    return code, expires_at
