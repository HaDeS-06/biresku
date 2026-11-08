"""
app.py - Biresku Kimlik Doğrulama Servisi & API Endpointleri
Çift Katman: JWT (Authorization: Bearer) + Session Cookie
"""

import os
import secrets
from functools import wraps
from typing import Optional, Dict, Any
from flask import Flask, Blueprint, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import requests

from auth_tokens import (
    generate_access_token, decode_access_token,
    generate_refresh_token, hash_refresh_token, generate_verification_code
)
import database as db

# Flask Uygulaması
app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", secrets.token_hex(32))

# CORS Ayarları (Frontend ile tam uyumlu)
CORS(app, supports_credentials=True, origins=["https://biresku.com", "http://localhost:5000", "http://127.0.0.1:5000", "*"])

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# Google OAuth Ayarları
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")


# --- GÜVENLİK YARDIMCILARI & DEKORATÖRLER ---

def get_client_ip() -> str:
    """Cloudflare veya Reverse Proxy ardındaki gerçek istemci IP adresini bulur."""
    if request.headers.get("CF-Connecting-IP"):
        return request.headers.get("CF-Connecting-IP")
    if request.headers.get("X-Forwarded-For"):
        return request.headers.get("X-Forwarded-For").split(",")[0].strip()
    return request.remote_addr or "0.0.0.0"


def get_current_user() -> Optional[Dict[str, Any]]:
    """
    Hibrit Kimlik Doğrulama:
    1. Authorization: Bearer <jwt> başlığına bakar.
    2. Bulamazsa session['user_id'] cookie kontrolü yapar.
    """
    # 1. Bearer JWT Kontrolü
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1].strip()
        payload = decode_access_token(token)
        if payload and "sub" in payload:
            return db.get_user_by_id(payload["sub"])

    # 2. Session Kontrolü
    user_id = session.get("user_id")
    if user_id:
        return db.get_user_by_id(user_id)

    return None


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"success": False, "error": "UNAUTHORIZED", "message": "Oturum açmanız gerekiyor."}), 401
        return f(user, *args, **kwargs)
    return decorated


def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"success": False, "error": "UNAUTHORIZED", "message": "Oturum açmanız gerekiyor."}), 401
        if user.get("role") != "admin":
            return jsonify({"success": False, "error": "FORBIDDEN", "message": "Bu işlem için yönetici yetkisi gerekir."}), 403
        return f(user, *args, **kwargs)
    return decorated


# --- AUTH ENDPOINTLERİ ---

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    full_name = data.get("full_name", "").strip()
    phone = data.get("phone", "").strip() or None

    if not email or not password or not full_name:
        return jsonify({"success": False, "message": "Ad, e-posta ve şifre zorunludur."}), 400

    if len(password) < 8:
        return jsonify({"success": False, "message": "Şifreniz en az 8 karakter olmalıdır."}), 400

    user_id = db.create_user(email, password, full_name, role="user", phone=phone)
    ip = get_client_ip()
    ua = request.headers.get("User-Agent", "")

    if not user_id:
        db.log_activity(None, "REGISTER", "FAILED", ip, ua)
        return jsonify({"success": False, "message": "Bu e-posta adresi zaten kayıtlı."}), 409

    # 6 Haneli Aktivasyon Kodu
    code, expires_at = generate_verification_code()
    db.set_verification_code(user_id, code, expires_at)
    db.log_activity(user_id, "REGISTER", "SUCCESS", ip, ua)

    print(f"\n[BİRESKU GÜVENLİK BİLDİRİMİ] Aktivasyon Kodu -> '{email}': {code}\n")

    return jsonify({
        "success": True,
        "message": "Kayıt başarılı! E-posta adresinize 6 haneli aktivasyon kodu gönderildi.",
        "requires_verification": True,
        "email": email
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    ip = get_client_ip()
    ua = request.headers.get("User-Agent", "")

    user = db.get_user_by_email(email)
    if not user or not db.verify_user_password(user, password):
        db.log_activity(user["id"] if user else None, "LOGIN_FAILED", "FAILED", ip, ua)
        return jsonify({"success": False, "message": "E-posta adresi veya şifre hatalı."}), 401

    # Token üretimi
    access_token = generate_access_token(user["id"], user["email"], user["role"])
    raw_refresh_token, token_hash, expires_at = generate_refresh_token()
    db.save_refresh_token(user["id"], token_hash, expires_at)
    db.update_last_login(user["id"])
    db.log_activity(user["id"], "LOGIN_SUCCESS", "SUCCESS", ip, ua)

    # Çift katman: Session da tutulur
    session["user_id"] = user["id"]
    session["role"] = user["role"]
    session.permanent = True

    return jsonify({
        "success": True,
        "message": "Giriş başarılı.",
        "access_token": access_token,
        "refresh_token": raw_refresh_token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "is_verified": bool(user["is_verified"])
        }
    }), 200


@auth_bp.route("/me", methods=["GET"])
@login_required
def me(current_user):
    return jsonify({
        "success": True,
        "user": {
            "id": current_user["id"],
            "email": current_user["email"],
            "full_name": current_user["full_name"],
            "role": current_user["role"],
            "phone": current_user["phone"],
            "is_verified": bool(current_user["is_verified"]),
            "last_login": current_user["last_login"]
        }
    }), 200


@auth_bp.route("/refresh", methods=["POST"])
def refresh():
    data = request.get_json(silent=True) or {}
    raw_refresh_token = data.get("refresh_token", "").strip()

    if not raw_refresh_token:
        return jsonify({"success": False, "error": "MISSING_TOKEN", "message": "Refresh token gerekli."}), 400

    token_hash = hash_refresh_token(raw_refresh_token)
    token_record = db.get_valid_refresh_token(token_hash)

    if not token_record:
        return jsonify({"success": False, "error": "INVALID_REFRESH_TOKEN", "message": "Oturum süresi dolmuş veya geçersiz."}), 401

    user = db.get_user_by_id(token_record["user_id"])
    if not user:
        return jsonify({"success": False, "message": "Kullanıcı bulunamadı."}), 404

    # Token Rotasyonu
    db.revoke_refresh_token(token_hash)
    new_raw_refresh, new_token_hash, expires_at = generate_refresh_token()
    db.save_refresh_token(user["id"], new_token_hash, expires_at)
    new_access_token = generate_access_token(user["id"], user["email"], user["role"])

    ip = get_client_ip()
    ua = request.headers.get("User-Agent", "")
    db.log_activity(user["id"], "TOKEN_REFRESH", "SUCCESS", ip, ua)

    return jsonify({
        "success": True,
        "access_token": new_access_token,
        "refresh_token": new_raw_refresh
    }), 200


@auth_bp.route("/logout", methods=["POST"])
def logout():
    data = request.get_json(silent=True) or {}
    raw_refresh_token = data.get("refresh_token", "").strip()
    if raw_refresh_token:
        token_hash = hash_refresh_token(raw_refresh_token)
        db.revoke_refresh_token(token_hash)

    user_id = session.get("user_id")
    if user_id:
        ip = get_client_ip()
        ua = request.headers.get("User-Agent", "")
        db.log_activity(user_id, "LOGOUT", "SUCCESS", ip, ua)

    session.clear()
    return jsonify({"success": True, "message": "Başarıyla çıkış yapıldı."}), 200


@auth_bp.route("/verify-code", methods=["POST"])
def verify_code():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    code = data.get("code", "").strip()

    if not email or not code:
        return jsonify({"success": False, "message": "E-posta ve 6 haneli kod gereklidir."}), 400

    success = db.verify_code_and_activate(email, code)
    ip = get_client_ip()
    ua = request.headers.get("User-Agent", "")
    user = db.get_user_by_email(email)

    if success:
        db.log_activity(user["id"], "VERIFY_EMAIL", "SUCCESS", ip, ua)
        return jsonify({"success": True, "message": "E-posta onaylandı. Giriş yapabilirsiniz."}), 200
    else:
        db.log_activity(user["id"] if user else None, "VERIFY_EMAIL", "FAILED", ip, ua)
        return jsonify({"success": False, "message": "Kod hatalı veya süresi dolmuş."}), 400


@auth_bp.route("/google/login", methods=["GET"])
def google_login():
    if not GOOGLE_CLIENT_ID:
        return jsonify({"error": "Google OAuth yapılandırılmamış."}), 500

    redirect_uri = url_for("auth.google_callback", _external=True)
    google_endpoint = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&response_type=code"
        f"&scope=openid%20email%20profile"
        f"&redirect_uri={redirect_uri}"
        f"&access_type=offline"
        f"&prompt=consent"
    )
    return redirect(google_endpoint)


@auth_bp.route("/google/callback", methods=["GET"])
def google_callback():
    code = request.args.get("code")
    if not code:
        return redirect("/?auth_error=google_denied")

    redirect_uri = url_for("auth.google_callback", _external=True)
    token_url = "https://oauth2.googleapis.com/token"
    token_res = requests.post(token_url, data={
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code"
    }, timeout=10)

    if token_res.status_code != 200:
        return redirect("/?auth_error=google_token_failed")

    google_tokens = token_res.json()
    user_info = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {google_tokens.get('access_token')}"},
        timeout=10
    ).json()

    email = user_info.get("email")
    name = user_info.get("name", "Google Sanatçısı/Üyesi")

    if not email:
        return redirect("/?auth_error=missing_email")

    user = db.get_user_by_email(email)
    if not user:
        random_pwd = secrets.token_hex(16)
        user_id = db.create_user(email, random_pwd, name, role="user")
        user = db.get_user_by_id(user_id)
        with db.get_db_connection() as conn:
            conn.execute("UPDATE users SET is_verified = 1 WHERE id = ?", (user["id"],))
            conn.commit()

    session["user_id"] = user["id"]
    session["role"] = user["role"]
    db.update_last_login(user["id"])

    raw_refresh_token, token_hash, expires_at = generate_refresh_token()
    db.save_refresh_token(user["id"], token_hash, expires_at)
    access_token = generate_access_token(user["id"], user["email"], user["role"])

    return redirect(f"/?auth_success=1&access_token={access_token}&refresh_token={raw_refresh_token}")


# Blueprint'i Kaydet
app.register_blueprint(auth_bp)

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "service": "biresku_auth_api", "version": "1.0.0"})

# İlk Başlatmada Tabloları Kur
with app.app_context():
    db.init_db()

if __name__ == "__main__":
    print("=" * 60)
    print("BİRESKU AUTH API BAŞLATILIYOR (Port: 5000)...")
    print("Endpointler: /api/auth/register, /api/auth/login, /api/auth/me vb.")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=True)
