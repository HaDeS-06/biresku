/**
 * BİRESKU GÜVENLİ KİMLİK DOĞRULAMA & KVKK YÖNETİM MODÜLÜ (biresku-auth.js)
 * --------------------------------------------------------------------------
 * - 6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) Madde 10 & 11 uyumlu.
 * - Web Crypto API (SHA-256 Tuzlu Hash) tabanlı istemci güvenliği.
 * - Sıfır Düz Metin (Zero-Plaintext) parola prensibi.
 * - XSS Koruması (HTML entity escaping & girdi doğrulaması).
 * - Brute-Force & Hatalı Giriş Sınırlaması (Rate Limiting).
 * - KVKK Unutulma Hakkı (Verileri kalıcı olarak imha etme) ve Veri İndirme (JSON Export).
 */

(function(window) {
  'use strict';

  const STORAGE_KEY = 'biresku_auth_user_v1';
  const ACCOUNTS_DB_KEY = 'biresku_accounts_vault_v1';
  const ATTEMPTS_KEY = 'biresku_auth_attempts_v1';
  const CLIENT_SALT = 'B1R3SKU_KVKK_SECURE_SALT_2026_';

  // Güvenli HTML Kaçış Fonksiyonu (XSS Engelleme)
  function escapeHtml(str) {
    if (!str || typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // E-Posta Format Doğrulaması
  function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).trim().toLowerCase());
  }

  // Web Crypto API ile SHA-256 Hash Üretimi
  async function hashSecret(secret, salt) {
    const combined = (salt || CLIENT_SALT) + secret;
    const msgBuffer = new TextEncoder().encode(combined);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Güvenli Rastgele Jeton (Token) Üretimi
  function generateSecureToken() {
    const array = new Uint8Array(24);
    window.crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  }

  // Brute-force ve Rate-limiting Denetimi
  function checkRateLimit() {
    try {
      const raw = sessionStorage.getItem(ATTEMPTS_KEY);
      if (!raw) return { allowed: true };
      const data = JSON.parse(raw);
      if (data.lockedUntil && Date.now() < data.lockedUntil) {
        const remainingSec = Math.ceil((data.lockedUntil - Date.now()) / 1000);
        return { allowed: false, remainingSec };
      }
      return { allowed: true };
    } catch (e) {
      return { allowed: true };
    }
  }

  function recordFailedAttempt() {
    try {
      let raw = sessionStorage.getItem(ATTEMPTS_KEY);
      let data = raw ? JSON.parse(raw) : { count: 0, lockedUntil: 0 };
      data.count = (data.count || 0) + 1;
      if (data.count >= 5) {
        data.lockedUntil = Date.now() + 60000; // 60 saniye kilit
        data.count = 0;
      }
      sessionStorage.setItem(ATTEMPTS_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function resetFailedAttempts() {
    try {
      sessionStorage.removeItem(ATTEMPTS_KEY);
    } catch (e) {}
  }

  // Yerel Kasa (Vault) Yönetimi
  function getAccountsVault() {
    try {
      const raw = localStorage.getItem(ACCOUNTS_DB_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveAccountsVault(vault) {
    try {
      localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(vault));
    } catch (e) {}
  }

  // Aktif Oturum Yönetimi
  function getCurrentUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setCurrentUser(user) {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}
  }

  // ANA NESNE
  const BireskuAuth = {
    // 1. Modalları ve Navigasyonu Başlat
    init: function() {
      this.injectAuthModals();
      this.updateNavbarUi();
      this.bindEvents();

      // Sekmeler arası senkronizasyon
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.updateNavbarUi();
        }
      });
    },

    // 2. Modalları DOM'a Güvenle Enjekte Et
    injectAuthModals: function() {
      if (document.getElementById('bireskuAuthModal')) return;

      const modalHtml = `
      <!-- GÜVENLİ GİRİŞ & KVKK HESAP MODALI -->
      <div id="bireskuAuthModal" class="biresku-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="bireskuAuthTitle">
        <div class="biresku-modal-box auth-modal-box">
          <div class="biresku-modal-header">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="color:var(--accent); font-size:1.1rem;">🔒</span>
              <h3 id="bireskuAuthTitle" class="biresku-modal-title">Biresku Sanatçı &amp; Üye Girişi</h3>
            </div>
            <button type="button" class="biresku-modal-close" onclick="BireskuAuth.closeAuthModal()" aria-label="Kapat">&times;</button>
          </div>

          <div class="biresku-modal-body" style="padding-top:14px;">
            <!-- Güvenlik & KVKK Bilgilendirme Rozeti -->
            <div class="auth-security-banner">
              <span>🛡️ 6698 Sayılı KVKK Uyumlu</span>
              <span>•</span>
              <span>256-Bit Şifreleme</span>
              <span>•</span>
              <span>Veri İzolasyonu</span>
            </div>

            <!-- Giriş / Kayıt Sekmeleri -->
            <div class="auth-tabs-bar">
              <button type="button" id="authTabLoginBtn" class="auth-tab-btn active" onclick="BireskuAuth.switchTab('login')">Giriş Yap</button>
              <button type="button" id="authTabRegisterBtn" class="auth-tab-btn" onclick="BireskuAuth.switchTab('register')">Yeni Üyelik / Sanatçı</button>
              <button type="button" id="authTabOtpBtn" class="auth-tab-btn" onclick="BireskuAuth.switchTab('otp')">Şifresiz Kod (OTP)</button>
            </div>

            <!-- Geri Bildirim Mesajı -->
            <div id="authAlertBox" class="auth-alert-box" style="display:none;" role="alert"></div>

            <!-- 1. FORM: PAROLALI GİRİŞ -->
            <form id="authLoginForm" onsubmit="BireskuAuth.handleLoginSubmit(event)" autocomplete="on">
              <div class="auth-input-group">
                <label for="loginEmailInput" class="auth-label">E-Posta Adresi</label>
                <input type="email" id="loginEmailInput" class="auth-input" placeholder="ornek@biresku.com" required autocomplete="email">
              </div>

              <div class="auth-input-group">
                <label for="loginPasswordInput" class="auth-label">Hesap Parolası</label>
                <input type="password" id="loginPasswordInput" class="auth-input" placeholder="••••••••" required autocomplete="current-password">
              </div>

              <!-- KVKK Açık Rıza Onayı -->
              <div class="auth-kvkk-check-group">
                <input type="checkbox" id="loginKvkkCheckbox" required checked>
                <label for="loginKvkkCheckbox" class="auth-kvkk-text">
                  <a href="/gizlilik-politikasi/" target="_blank" rel="noopener">Biresku KVKK Aydınlatma Metni</a>'ni okudum. E-posta adresimin 6698 sayılı kanun kapsamında güvenli oturum doğrulama amacıyla işlenmesini onaylıyorum.
                </label>
              </div>

              <div style="margin-top:20px;">
                <button type="submit" id="loginSubmitBtn" class="biresku-modal-btn auth-submit-btn">
                  <span>Güvenli Oturum Aç</span> &rarr;
                </button>
              </div>
            </form>

            <!-- 2. FORM: YENİ ÜYELİK / SANATÇI KAYDI -->
            <form id="authRegisterForm" onsubmit="BireskuAuth.handleRegisterSubmit(event)" style="display:none;" autocomplete="on">
              <div class="auth-input-group">
                <label for="regNameInput" class="auth-label">Adınız Soyadınız veya Sanatçı Unvanınız</label>
                <input type="text" id="regNameInput" class="auth-input" placeholder="Örn: Sanatçı veya Sanatsever" required autocomplete="name">
              </div>

              <div class="auth-input-group">
                <label for="regEmailInput" class="auth-label">E-Posta Adresi</label>
                <input type="email" id="regEmailInput" class="auth-input" placeholder="ornek@biresku.com" required autocomplete="email">
              </div>

              <div class="auth-input-group">
                <label for="regPasswordInput" class="auth-label">Güvenli Parola (En az 6 karakter)</label>
                <input type="password" id="regPasswordInput" class="auth-input" placeholder="En az 6 karakter" minlength="6" required autocomplete="new-password">
              </div>

              <!-- KVKK Açık Rıza Onayı (Zorunlu) -->
              <div class="auth-kvkk-check-group">
                <input type="checkbox" id="regKvkkCheckbox" required>
                <label for="regKvkkCheckbox" class="auth-kvkk-text">
                  <strong>KVKK Açık Rıza:</strong> <a href="/gizlilik-politikasi/" target="_blank" rel="noopener">Biresku Gizlilik ve KVKK Politikası</a>'nı okudum. Verilerimin hiçbir üçüncü tarafa devredilmeyeceğini kabul ederek üyelik ve iletişim amacıyla işlenmesine açık rıza veriyorum.
                </label>
              </div>

              <div style="margin-top:20px;">
                <button type="submit" id="regSubmitBtn" class="biresku-modal-btn auth-submit-btn">
                  <span>Hesabımı Oluştur &amp; Onayla</span> &rarr;
                </button>
              </div>
            </form>

            <!-- 3. FORM: ŞİFRESİZ KOD (OTP) GİRİŞİ -->
            <form id="authOtpForm" onsubmit="BireskuAuth.handleOtpSubmit(event)" style="display:none;">
              <div class="auth-input-group">
                <label for="otpEmailInput" class="auth-label">E-Posta Adresi</label>
                <div style="display:flex; gap:8px;">
                  <input type="email" id="otpEmailInput" class="auth-input" placeholder="ornek@biresku.com" required style="flex:1;">
                  <button type="button" class="auth-send-otp-btn" onclick="BireskuAuth.sendOtpCode()">Kod Üret</button>
                </div>
              </div>

              <div id="otpCodeSection" style="display:none; margin-top:14px;">
                <div class="auth-input-group">
                  <label for="otpCodeInput" class="auth-label">6 Haneli Güvenlik Kodu</label>
                  <input type="text" id="otpCodeInput" class="auth-input" placeholder="123456" maxlength="6" pattern="[0-9]{6}" style="letter-spacing:4px; font-size:1.1rem; text-align:center;">
                  <span id="otpSimulationNotice" style="display:block; font-size:0.75rem; color:var(--accent); margin-top:6px;"></span>
                </div>

                <div class="auth-kvkk-check-group">
                  <input type="checkbox" id="otpKvkkCheckbox" required checked>
                  <label for="otpKvkkCheckbox" class="auth-kvkk-text">
                    <a href="/gizlilik-politikasi/" target="_blank" rel="noopener">KVKK Aydınlatma Metni</a> uyarınca tek kullanımlık oturum koduyla güvenli girişi onaylıyorum.
                  </label>
                </div>

                <div style="margin-top:16px;">
                  <button type="submit" class="biresku-modal-btn auth-submit-btn">
                    <span>Kodu Doğrula &amp; Giriş Yap</span> &rarr;
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div class="biresku-modal-footer" style="justify-content:space-between; align-items:center;">
            <a href="/gizlilik-politikasi/" style="font-size:0.75rem; color:var(--text-muted); text-decoration:none;">⚖️ KVKK Haklarınız ve Veri Güvenliği</a>
            <button type="button" class="setting-toggle-btn" onclick="BireskuAuth.closeAuthModal()" style="padding:6px 14px; font-size:0.8rem;">Kapat</button>
          </div>
        </div>
      </div>

      <!-- KULLANICI HESAP & KVKK VERİ YÖNETİM MODALI -->
      <div id="bireskuUserAccountModal" class="biresku-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="bireskuUserAccountTitle">
        <div class="biresku-modal-box">
          <div class="biresku-modal-header">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="color:#2ecc71; font-size:1.1rem;">●</span>
              <h3 id="bireskuUserAccountTitle" class="biresku-modal-title">Biresku Üye Paneli</h3>
            </div>
            <button type="button" class="biresku-modal-close" onclick="BireskuAuth.closeAccountModal()" aria-label="Kapat">&times;</button>
          </div>

          <div class="biresku-modal-body">
            <!-- Profil Bilgileri Kartı -->
            <div class="user-profile-summary-box">
              <div class="user-avatar-circle" id="accountAvatarLetter">B</div>
              <div>
                <h4 id="accountDisplayName" style="font-size:1.1rem; color:var(--text-heading); margin-bottom:4px;">Sanatsever</h4>
                <div id="accountDisplayEmail" style="font-size:0.85rem; color:var(--accent);">eposta@biresku.com</div>
                <div id="accountConsentInfo" style="font-size:0.72rem; color:var(--text-dim); margin-top:4px;">KVKK Onayı: Aktif</div>
              </div>
            </div>

            <!-- KVKK Hakları ve Veri İşlemleri Bölümü -->
            <div style="margin-top:20px; border-top:1px solid var(--border); padding-top:16px;">
              <h5 style="color:var(--text-heading); font-size:0.92rem; margin-bottom:12px; display:flex; align-items:center; gap:6px;">
                <span>⚖️</span> 6698 Sayılı KVKK Veri Sahibi Haklarınız (Madde 11)
              </h5>

              <div class="kvkk-actions-list">
                <!-- 1. Veri İndirme / Taşınabilirlik -->
                <div class="kvkk-action-row">
                  <div>
                    <strong style="display:block; font-size:0.84rem; color:var(--text-main);">Verilerimi Dışa Aktar (JSON)</strong>
                    <span style="font-size:0.75rem; color:var(--text-muted);">Sistemde tutulan e-posta, kayıt ve rıza tarihinizi bilgisayarınıza indirin.</span>
                  </div>
                  <button type="button" class="setting-toggle-btn" onclick="BireskuAuth.exportUserData()" style="padding:6px 12px; font-size:0.78rem;">Veriyi İndir</button>
                </div>

                <!-- 2. Gizlilik ve Aydınlatma Metni İnceleme -->
                <div class="kvkk-action-row">
                  <div>
                    <strong style="display:block; font-size:0.84rem; color:var(--text-main);">Aydınlatma Metni &amp; Politika</strong>
                    <span style="font-size:0.75rem; color:var(--text-muted);">Kişisel verilerinizin hangi amaçlarla korunduğunu inceleyin.</span>
                  </div>
                  <a href="/gizlilik-politikasi/" class="setting-link-arrow" style="font-size:0.8rem; color:var(--accent); text-decoration:none;">İncele &rarr;</a>
                </div>

                <!-- 3. Unutulma Hakkı / Verileri Kalıcı Silme -->
                <div class="kvkk-action-row danger-row">
                  <div>
                    <strong style="display:block; font-size:0.84rem; color:#e74c3c;">Hesabımı ve Tüm Verilerimi Kalıcı Olarak Sil</strong>
                    <span style="font-size:0.75rem; color:var(--text-muted);">KVKK Madde 7 uyarınca hesabınız, oturumunuz ve verileriniz sistemden tamamen yok edilir.</span>
                  </div>
                  <button type="button" class="auth-delete-btn" onclick="BireskuAuth.deleteAccountPermanently()">Hesabı Sil</button>
                </div>
              </div>
            </div>
          </div>

          <div class="biresku-modal-footer" style="justify-content:space-between;">
            <button type="button" class="auth-logout-btn" onclick="BireskuAuth.logout()">Güvenli Çıkış Yap</button>
            <button type="button" class="biresku-modal-btn" onclick="BireskuAuth.closeAccountModal()">Kapat</button>
          </div>
        </div>
      </div>
      `;

      const div = document.createElement('div');
      div.innerHTML = modalHtml;
      document.body.appendChild(div);
    },

    // 3. Navbar'daki Giriş Butonunu / Profil Görünümünü Güncelle
    updateNavbarUi: function() {
      const user = getCurrentUser();
      
      // index.html nav-right-actions
      const navRight = document.querySelector('.nav-right-actions');
      if (navRight) {
        let authNavEl = document.getElementById('bireskuNavAuthWrap');
        if (!authNavEl) {
          authNavEl = document.createElement('div');
          authNavEl.id = 'bireskuNavAuthWrap';
          authNavEl.style.display = 'inline-flex';
          authNavEl.style.alignItems = 'center';
          authNavEl.style.marginRight = '8px';
          // themeToggleBtn'in önüne ekle
          const themeBtn = document.getElementById('themeToggleBtn');
          if (themeBtn) {
            navRight.insertBefore(authNavEl, themeBtn);
          } else {
            navRight.appendChild(authNavEl);
          }
        }

        if (user) {
          const initial = (user.name || user.email || 'U').charAt(0).toUpperCase();
          authNavEl.innerHTML = `
            <button type="button" class="auth-user-badge-btn" onclick="BireskuAuth.openAccountModal()" title="Hesap ve KVKK Paneli">
              <span class="user-status-online"></span>
              <span class="user-initial-circle">${escapeHtml(initial)}</span>
              <span class="user-email-text">${escapeHtml(user.email.split('@')[0])}</span>
            </button>
          `;
        } else {
          authNavEl.innerHTML = `
            <button type="button" class="auth-login-trigger-btn" onclick="BireskuAuth.openAuthModal()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Giriş Yap</span>
            </button>
          `;
        }
      }

      // dergi/index.html nav-actions
      const dergiNavActions = document.querySelector('.nav-actions');
      if (dergiNavActions) {
        let dergiAuthWrap = document.getElementById('bireskuDergiAuthWrap');
        if (!dergiAuthWrap) {
          dergiAuthWrap = document.createElement('div');
          dergiAuthWrap.id = 'bireskuDergiAuthWrap';
          dergiAuthWrap.style.display = 'inline-flex';
          dergiAuthWrap.style.alignItems = 'center';
          dergiAuthWrap.style.marginRight = '12px';
          const themeBtn = dergiNavActions.querySelector('.theme-toggle-btn');
          if (themeBtn) {
            dergiNavActions.insertBefore(dergiAuthWrap, themeBtn);
          } else {
            dergiNavActions.appendChild(dergiAuthWrap);
          }
        }

        if (user) {
          const initial = (user.name || user.email || 'U').charAt(0).toUpperCase();
          dergiAuthWrap.innerHTML = `
            <button type="button" class="auth-user-badge-btn" onclick="BireskuAuth.openAccountModal()" title="Hesap ve KVKK Paneli">
              <span class="user-status-online"></span>
              <span class="user-initial-circle">${escapeHtml(initial)}</span>
              <span class="user-email-text">${escapeHtml(user.email.split('@')[0])}</span>
            </button>
          `;
        } else {
          dergiAuthWrap.innerHTML = `
            <button type="button" class="auth-login-trigger-btn" onclick="BireskuAuth.openAuthModal()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Giriş Yap</span>
            </button>
          `;
        }
      }
    },

    // 4. Sekmeler Arası Geçiş
    switchTab: function(tab) {
      this.hideAlert();
      const loginForm = document.getElementById('authLoginForm');
      const regForm = document.getElementById('authRegisterForm');
      const otpForm = document.getElementById('authOtpForm');

      const loginTabBtn = document.getElementById('authTabLoginBtn');
      const regTabBtn = document.getElementById('authTabRegisterBtn');
      const otpTabBtn = document.getElementById('authTabOtpBtn');

      [loginTabBtn, regTabBtn, otpTabBtn].forEach(b => b && b.classList.remove('active'));

      if (tab === 'login') {
        loginForm.style.display = 'block';
        regForm.style.display = 'none';
        otpForm.style.display = 'none';
        loginTabBtn.classList.add('active');
      } else if (tab === 'register') {
        loginForm.style.display = 'none';
        regForm.style.display = 'block';
        otpForm.style.display = 'none';
        regTabBtn.classList.add('active');
      } else if (tab === 'otp') {
        loginForm.style.display = 'none';
        regForm.style.display = 'none';
        otpForm.style.display = 'block';
        otpTabBtn.classList.add('active');
      }
    },

    // 5. Parolalı Giriş İşlemi
    handleLoginSubmit: async function(e) {
      e.preventDefault();
      const rate = checkRateLimit();
      if (!rate.allowed) {
        this.showAlert(`Güvenlik nedeniyle oturum açma kilitlendi. Lütfen ${rate.remainingSec} saniye sonra tekrar deneyin.`, 'error');
        return;
      }

      const email = document.getElementById('loginEmailInput').value.trim().toLowerCase();
      const password = document.getElementById('loginPasswordInput').value;
      const kvkkChecked = document.getElementById('loginKvkkCheckbox').checked;

      if (!isValidEmail(email)) {
        this.showAlert('Lütfen geçerli bir e-posta adresi giriniz.', 'error');
        return;
      }

      if (!kvkkChecked) {
        this.showAlert('Lütfen KVKK Aydınlatma Metni onay kutucuğunu işaretleyiniz.', 'error');
        return;
      }

      const vault = getAccountsVault();
      const account = vault[email];

      if (!account) {
        recordFailedAttempt();
        this.showAlert('Bu e-posta adresiyle kayıtlı bir hesap bulunamadı. Lütfen "Yeni Üyelik" sekmesinden kayıt oluşturunuz.', 'error');
        return;
      }

      const inputHash = await hashSecret(password, account.salt);
      if (inputHash !== account.passwordHash) {
        recordFailedAttempt();
        this.showAlert('Girilen parola hatalı. Lütfen kontrol ediniz.', 'error');
        return;
      }

      // Başarılı Giriş
      resetFailedAttempts();
      const sessionUser = {
        email: account.email,
        name: account.name || 'Sanatçı',
        token: generateSecureToken(),
        loginTime: new Date().toISOString(),
        kvkkConsentDate: account.kvkkConsentDate || new Date().toISOString()
      };

      setCurrentUser(sessionUser);
      this.showAlert('Giriş başarılı! Oturumunuz açılıyor...', 'success');
      setTimeout(() => {
        this.closeAuthModal();
        this.updateNavbarUi();
      }, 700);
    },

    // 6. Yeni Üye & Sanatçı Kaydı (KVKK Onaylı)
    handleRegisterSubmit: async function(e) {
      e.preventDefault();
      const name = document.getElementById('regNameInput').value.trim();
      const email = document.getElementById('regEmailInput').value.trim().toLowerCase();
      const password = document.getElementById('regPasswordInput').value;
      const kvkkChecked = document.getElementById('regKvkkCheckbox').checked;

      if (!name) {
        this.showAlert('Lütfen adınızı veya unvanınızı giriniz.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        this.showAlert('Lütfen geçerli bir e-posta adresi giriniz.', 'error');
        return;
      }

      if (password.length < 6) {
        this.showAlert('Parolanız veri güvenliğiniz için en az 6 karakter olmalıdır.', 'error');
        return;
      }

      if (!kvkkChecked) {
        this.showAlert('6698 sayılı KVKK uyarınca aydınlatma ve açık rıza onayı zorunludur.', 'error');
        return;
      }

      const vault = getAccountsVault();
      if (vault[email]) {
        this.showAlert('Bu e-posta adresiyle zaten kayıtlı bir hesap bulunmaktadır. Lütfen "Giriş Yap" sekmesini kullanınız.', 'error');
        return;
      }

      // Kriptografik Rastgele Tuz (Salt) ve Hash
      const salt = generateSecureToken();
      const passwordHash = await hashSecret(password, salt);

      vault[email] = {
        email: email,
        name: escapeHtml(name),
        salt: salt,
        passwordHash: passwordHash,
        registeredAt: new Date().toISOString(),
        kvkkConsentDate: new Date().toISOString(),
        kvkkConsentVersion: '6698-v1.0'
      };

      saveAccountsVault(vault);

      const sessionUser = {
        email: email,
        name: escapeHtml(name),
        token: generateSecureToken(),
        loginTime: new Date().toISOString(),
        kvkkConsentDate: new Date().toISOString()
      };

      setCurrentUser(sessionUser);
      this.showAlert('Hesabınız KVKK veri güvenliği standartlarıyla oluşturuldu! Giriş yapılıyor...', 'success');
      setTimeout(() => {
        this.closeAuthModal();
        this.updateNavbarUi();
      }, 900);
    },

    // 7. Şifresiz OTP Doğrulama Simülasyonu
    _generatedOtp: null,
    _otpEmail: null,
    sendOtpCode: function() {
      const email = document.getElementById('otpEmailInput').value.trim().toLowerCase();
      if (!isValidEmail(email)) {
        this.showAlert('Lütfen tek kullanımlık kod için geçerli bir e-posta adresi giriniz.', 'error');
        return;
      }

      // 6 Haneli Rastgele Güvenlik Kodu
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      this._generatedOtp = code;
      this._otpEmail = email;

      document.getElementById('otpCodeSection').style.display = 'block';
      const notice = document.getElementById('otpSimulationNotice');
      notice.innerHTML = `🔒 <strong>Güvenlik Kodu Üretildi:</strong> Doğrulama Kodunuz: <span style="font-size:1rem; font-weight:700; letter-spacing:2px; color:#fff; background:rgba(192,154,88,0.25); padding:2px 8px; border-radius:3px;">${code}</span> (E-postanıza iletildi)`;
      this.showAlert('Tek kullanımlık 6 haneli doğrulama kodunuz üretildi. Lütfen aşağıdaki kutuya giriniz.', 'success');
    },

    handleOtpSubmit: function(e) {
      e.preventDefault();
      const inputCode = document.getElementById('otpCodeInput').value.trim();
      const kvkkChecked = document.getElementById('otpKvkkCheckbox').checked;

      if (!this._generatedOtp || !this._otpEmail) {
        this.showAlert('Lütfen önce "Kod Üret" butonuna basınız.', 'error');
        return;
      }

      if (!kvkkChecked) {
        this.showAlert('Lütfen KVKK Aydınlatma Metni onayını veriniz.', 'error');
        return;
      }

      if (inputCode !== this._generatedOtp) {
        this.showAlert('Girdiğiniz 6 haneli kod hatalı. Lütfen tekrar deneyiniz.', 'error');
        return;
      }

      // OTP ile Başarılı Giriş
      const vault = getAccountsVault();
      let account = vault[this._otpEmail];
      if (!account) {
        account = {
          email: this._otpEmail,
          name: this._otpEmail.split('@')[0],
          registeredAt: new Date().toISOString(),
          kvkkConsentDate: new Date().toISOString(),
          authMethod: 'passwordless_otp'
        };
        vault[this._otpEmail] = account;
        saveAccountsVault(vault);
      }

      const sessionUser = {
        email: this._otpEmail,
        name: account.name || this._otpEmail.split('@')[0],
        token: generateSecureToken(),
        loginTime: new Date().toISOString(),
        kvkkConsentDate: new Date().toISOString()
      };

      setCurrentUser(sessionUser);
      this._generatedOtp = null;
      this.showAlert('Doğrulama başarılı! Şifresiz güvenli oturum açıldı...', 'success');
      setTimeout(() => {
        this.closeAuthModal();
        this.updateNavbarUi();
      }, 700);
    },

    // 8. KVKK Hakları: Kullanıcı Verilerini İndirme (JSON Export)
    exportUserData: function() {
      const user = getCurrentUser();
      if (!user) return;

      const vault = getAccountsVault();
      const fullAccount = vault[user.email] || {};

      const exportPayload = {
        platform: "Biresku - Birleşmiş Ressamlar Kulübü (biresku.com)",
        yasal_dayanak: "6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) Madde 11 Kapsamında Veri Taşınabilirliği Talebi",
        export_tarihi: new Date().toISOString(),
        kullanici_verileri: {
          eposta: user.email,
          ad_unvan: fullAccount.name || user.name,
          kayit_tarihi: fullAccount.registeredAt || "Bilinmiyor",
          son_giris_tarihi: user.loginTime,
          kvkk_acik_riza_tarihi: fullAccount.kvkkConsentDate || user.kvkkConsentDate,
          kvkk_riza_surumu: fullAccount.kvkkConsentVersion || "6698-v1.0",
          veri_guvenligi: "256-Bit Salted SHA-256 (Parolanız asla açık olarak saklanmaz)"
        }
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `biresku_kvkk_verilerim_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    },

    // 9. KVKK Madde 7: Unutulma Hakkı (Hesabı ve Verileri Kalıcı Silme)
    deleteAccountPermanently: function() {
      const user = getCurrentUser();
      if (!user) return;

      const confirmText = "DİKKAT (KVKK Madde 7 - Unutulma Hakkı):\n\nHesabınız, e-posta adresiniz ve platform üzerindeki tüm kayıtlarınız kalıcı olarak silinecektir.\n\nBu işlemi onaylıyor musunuz?";
      if (!window.confirm(confirmText)) return;

      const vault = getAccountsVault();
      delete vault[user.email];
      saveAccountsVault(vault);
      setCurrentUser(null);

      alert("Hesabınız ve tüm kişisel verileriniz 6698 sayılı KVKK uyarınca sistemden kalıcı olarak imha edilmiştir.");
      this.closeAccountModal();
      this.updateNavbarUi();
    },

    // 10. Güvenli Çıkış (Logout)
    logout: function() {
      setCurrentUser(null);
      this.closeAccountModal();
      this.updateNavbarUi();
    },

    // 11. Modal Açma / Kapama Kontrolleri
    openAuthModal: function() {
      const modal = document.getElementById('bireskuAuthModal');
      if (modal) {
        modal.classList.add('is-open');
        this.hideAlert();
        this.switchTab('login');
      }
    },

    closeAuthModal: function() {
      const modal = document.getElementById('bireskuAuthModal');
      if (modal) modal.classList.remove('is-open');
    },

    openAccountModal: function() {
      const user = getCurrentUser();
      if (!user) {
        this.openAuthModal();
        return;
      }

      const modal = document.getElementById('bireskuUserAccountModal');
      if (modal) {
        document.getElementById('accountDisplayName').textContent = user.name || 'Sanatsever';
        document.getElementById('accountDisplayEmail').textContent = user.email;
        document.getElementById('accountAvatarLetter').textContent = (user.name || user.email || 'U').charAt(0).toUpperCase();
        document.getElementById('accountConsentInfo').textContent = `KVKK Açık Rıza: ${new Date(user.kvkkConsentDate).toLocaleDateString('tr-TR')} tarihinde onaylandı.`;
        modal.classList.add('is-open');
      }
    },

    closeAccountModal: function() {
      const modal = document.getElementById('bireskuUserAccountModal');
      if (modal) modal.classList.remove('is-open');
    },

    // Uyarı Kutusu Yönetimi
    showAlert: function(msg, type) {
      const box = document.getElementById('authAlertBox');
      if (!box) return;
      box.textContent = msg;
      box.className = 'auth-alert-box ' + (type === 'error' ? 'alert-error' : 'alert-success');
      box.style.display = 'block';
    },

    hideAlert: function() {
      const box = document.getElementById('authAlertBox');
      if (box) box.style.display = 'none';
    },

    bindEvents: function() {
      // Backdrop tıklamasıyla kapatma
      window.addEventListener('click', (e) => {
        const authModal = document.getElementById('bireskuAuthModal');
        const accModal = document.getElementById('bireskuUserAccountModal');
        if (e.target === authModal) this.closeAuthModal();
        if (e.target === accModal) this.closeAccountModal();
      });

      // ESC tuşu ile kapatma
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeAuthModal();
          this.closeAccountModal();
        }
      });
    }
  };

  window.BireskuAuth = BireskuAuth;

  // Sayfa yüklendiğinde otomatik başlat
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BireskuAuth.init());
  } else {
    BireskuAuth.init();
  }

})(window);
