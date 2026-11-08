/**
 * auth-client.js - Biresku Güvenli Kimlik Doğrulama İstemcisi
 * Çift Katman: JWT (Authorization: Bearer) + Refresh Token Rotasyonu
 * Mimari Standardı: OWASP & RFC 7519 Uyumlu
 */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    ACCESS: "biresku_access_token",
    REFRESH: "biresku_refresh_token",
    USER: "biresku_user_profile"
  };

  const API_BASE = ""; // Aynı kök dizin veya "http://localhost:5000"

  function getAccessToken() {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACCESS);
    } catch (e) {
      return null;
    }
  }

  function getRefreshToken() {
    try {
      return localStorage.getItem(STORAGE_KEYS.REFRESH);
    } catch (e) {
      return null;
    }
  }

  function setTokens(accessToken, refreshToken, user) {
    try {
      if (accessToken) localStorage.setItem(STORAGE_KEYS.ACCESS, accessToken);
      if (refreshToken) localStorage.setItem(STORAGE_KEYS.REFRESH, refreshToken);
      if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      window.dispatchEvent(new CustomEvent("biresku:auth_state_changed", { detail: { loggedIn: true, user } }));
    } catch (e) {}
  }

  function clearTokens() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS);
      localStorage.removeItem(STORAGE_KEYS.REFRESH);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.dispatchEvent(new CustomEvent("biresku:auth_state_changed", { detail: { loggedIn: false } }));
    } catch (e) {}
  }

  function getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Otomatik Token Yenileyen Akıllı Fetch (Interceptor)
   */
  async function secureFetch(url, options = {}) {
    options.headers = options.headers || {};
    const token = getAccessToken();
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    let response;
    try {
      response = await fetch(API_BASE + url, options);
    } catch (err) {
      throw err;
    }

    // Access token süresi dolmuşsa (401), arka planda refresh token ile sessizce yenile
    if (response.status === 401 && getRefreshToken()) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        options.headers["Authorization"] = `Bearer ${getAccessToken()}`;
        response = await fetch(API_BASE + url, options); // İsteği yeniden dene
      } else {
        clearTokens();
      }
    }
    return response;
  }

  async function refreshAccessToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const res = await fetch(API_BASE + "/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      const data = await res.json();
      if (data.success && data.access_token) {
        setTokens(data.access_token, data.refresh_token, getCurrentUser());
        return true;
      }
      return false;
    } catch (e) {
      console.warn("[AUTH] Token yenileme başarısız:", e);
      return false;
    }
  }

  async function login(email, password) {
    const res = await fetch(API_BASE + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      setTokens(data.access_token, data.refresh_token, data.user);
    }
    return data;
  }

  async function register(fullName, email, password, phone = null) {
    const res = await fetch(API_BASE + "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName, email, password, phone })
    });
    return await res.json();
  }

  async function verifyCode(email, code) {
    const res = await fetch(API_BASE + "/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code })
    });
    return await res.json();
  }

  async function logout() {
    const refreshToken = getRefreshToken();
    try {
      await fetch(API_BASE + "/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
    } catch (e) {}
    clearTokens();
  }

  // URL'de Google OAuth dönüşü varsa yakala (?auth_success=1)
  (function initOAuthListener() {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("auth_success") === "1") {
        const acc = params.get("access_token");
        const ref = params.get("refresh_token");
        if (acc && ref) {
          setTokens(acc, ref, null);
          secureFetch("/api/auth/me").then(r => r.json()).then(d => {
            if (d && d.success && d.user) setTokens(acc, ref, d.user);
          }).catch(() => {});
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    } catch (e) {}
  })();

  window.BireskuAuthClient = {
    login,
    register,
    verifyCode,
    logout,
    secureFetch,
    getCurrentUser,
    getAccessToken,
    getRefreshToken,
    isLoggedIn: () => !!getAccessToken()
  };

})(window);
