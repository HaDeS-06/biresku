"""
test_auth_suite.py - Biresku Auth API Bütünleşik Test Paketi
"""

import os
import json
import unittest
import uuid

# Benzersiz test veritabanı yolu
TEST_DB = f"test_biresku_{uuid.uuid4().hex[:8]}.db"
os.environ["DATABASE_PATH"] = TEST_DB

import database as db
import auth_tokens
from app import app

class BireskuAuthTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        db.DB_PATH = TEST_DB
        db.init_db()

    @classmethod
    def tearDownClass(cls):
        try:
            if os.path.exists(TEST_DB):
                os.remove(TEST_DB)
        except Exception:
            pass

    def setUp(self):
        self.client = app.test_client()

    def test_full_auth_flow(self):
        print("\n--- 1. Register Test ---")
        reg_payload = {
            "email": "sanatci@biresku.com",
            "password": "Password123!",
            "full_name": "Mustafa Ayaz",
            "phone": "+905551234567"
        }
        res = self.client.post("/api/auth/register", json=reg_payload)
        self.assertEqual(res.status_code, 201)
        data = json.loads(res.data)
        self.assertTrue(data["success"])
        self.assertTrue(data["requires_verification"])

        # Test verification code in DB
        user = db.get_user_by_email("sanatci@biresku.com")
        self.assertIsNotNone(user)
        self.assertIsNotNone(user["verification_code"])
        code = user["verification_code"]
        print(f"Kullanıcı ID: {user['id']}, Doğrulama Kodu: {code}")

        print("\n--- 2. Verify Code Test ---")
        ver_res = self.client.post("/api/auth/verify-code", json={
            "email": "sanatci@biresku.com",
            "code": code
        })
        self.assertEqual(ver_res.status_code, 200)
        user_activated = db.get_user_by_email("sanatci@biresku.com")
        self.assertEqual(user_activated["is_verified"], 1)

        print("\n--- 3. Login Test ---")
        login_res = self.client.post("/api/auth/login", json={
            "email": "sanatci@biresku.com",
            "password": "Password123!"
        })
        self.assertEqual(login_res.status_code, 200)
        login_data = json.loads(login_res.data)
        self.assertTrue(login_data["success"])
        access_token = login_data["access_token"]
        refresh_token = login_data["refresh_token"]
        self.assertIsNotNone(access_token)
        self.assertIsNotNone(refresh_token)
        print("Access Token (ilk 25 karakter):", access_token[:25] + "...")
        print("Refresh Token (ilk 25 karakter):", refresh_token[:25] + "...")

        print("\n--- 4. Me (Current User) Test via Bearer Token ---")
        me_res = self.client.get("/api/auth/me", headers={
            "Authorization": f"Bearer {access_token}"
        })
        self.assertEqual(me_res.status_code, 200)
        me_data = json.loads(me_res.data)
        self.assertEqual(me_data["user"]["email"], "sanatci@biresku.com")
        self.assertEqual(me_data["user"]["full_name"], "Mustafa Ayaz")

        print("\n--- 5. Token Refresh & Rotation Test ---")
        ref_res = self.client.post("/api/auth/refresh", json={
            "refresh_token": refresh_token
        })
        self.assertEqual(ref_res.status_code, 200)
        ref_data = json.loads(ref_res.data)
        new_access_token = ref_data["access_token"]
        new_refresh_token = ref_data["refresh_token"]
        self.assertNotEqual(access_token, new_access_token)
        self.assertNotEqual(refresh_token, new_refresh_token)
        print("Eski Refresh Token revoke edildi, yeni Refresh Token üretildi.")

        # Replay attack test: Eski refresh token tekrar kullanılamaz!
        replay_res = self.client.post("/api/auth/refresh", json={
            "refresh_token": refresh_token
        })
        self.assertEqual(replay_res.status_code, 401)
        print("Replay Attack Başarıyla Engellendi (Eski token 401 döndü).")

        print("\n--- 6. Logout Test ---")
        logout_res = self.client.post("/api/auth/logout", json={
            "refresh_token": new_refresh_token
        })
        self.assertEqual(logout_res.status_code, 200)

        # After logout, new_refresh_token is also revoked
        after_logout_res = self.client.post("/api/auth/refresh", json={
            "refresh_token": new_refresh_token
        })
        self.assertEqual(after_logout_res.status_code, 401)
        print("Çıkış sonrası refresh token iptal edildi.")

if __name__ == "__main__":
    unittest.main()
