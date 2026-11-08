/**
 * biresku-artist-admin.js - Biresku Gizli Admin Sanatçı Yönetim & Şablon Motoru
 * --------------------------------------------------------------------------
 * GİZLİLİK VE GÜVENLİK STANDARTLARI:
 * 1. Kaynak Kod Gizliliği: HTML dosyalarında statik hiçbir buton veya "+" kartı yer almaz.
 * 2. Çalışma Zamanı Enjeksiyonu: Yalnızca yetkili Admin (ardaumay06@gmail.com / role: admin)
 *    giriş yaptığında JavaScript ile DOM'a sol üstte "+" kartı ve "Düzenle" butonları enjekte edilir.
 * 3. Oturum Yoksa Sıfır İz: Giriş yapılmadığında DOM'da veya HTML'de hiçbir iz bulunamaz.
 * 4. Mevcut Sanatçıları Düzenleme: Eski eklenen tüm sanatçılar (biyo, felsefe, alıntı, eserler)
 *    doğrudan seçilip güncellenebilir veya silinebilir.
 * 5. Tam XSS Koruması: escapeHtml, URL şema kontrolü ve parametrik sanitizasyon.
 */

(function(window) {
  'use strict';

  const STORAGE_KEY = 'biresku_custom_artists_v1';
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  let currentEditingId = null; // null ise yeni sanatçı modu

  // 1. GÜVENLİK YARDIMCILARI (XSS & Protocol Sanitization)
  function escapeHtml(str) {
    if (!str || typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return '';
    const trimmed = url.trim();
    if (/^(https?:\/\/|data:image\/(jpeg|png|webp|gif);base64,|\/assets\/)/i.test(trimmed)) {
      return trimmed;
    }
    return '';
  }

  function slugify(text) {
    if (!text || typeof text !== 'string') return '';
    const trMap = {
      'ç':'c', 'Ç':'c', 'ğ':'g', 'Ğ':'g', 'ı':'i', 'I':'i', 'İ':'i',
      'ö':'o', 'Ö':'o', 'ş':'s', 'Ş':'s', 'ü':'u', 'Ü':'u'
    };
    let slug = text.trim();
    for (const key in trMap) {
      slug = slug.replace(new RegExp(key, 'g'), trMap[key]);
    }
    return slug
      .toLowerCase()
      .replace(/[^a-z0-9\- ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  // 2. ADMİN YETKİ KONTROLÜ (Kesin Doğrulama)
  function checkAdminAuth() {
    let user = null;
    if (typeof window.BireskuAuth !== 'undefined' && typeof window.BireskuAuth.getCurrentUser === 'function') {
      user = window.BireskuAuth.getCurrentUser();
    }
    if (!user) {
      try {
        const raw = localStorage.getItem('biresku_auth_user_v1');
        if (raw) user = JSON.parse(raw);
      } catch (e) {}
    }
    if (!user) return false;
    return (user.role === 'admin' || (user.email && user.email.toLowerCase() === 'ardaumay06@gmail.com'));
  }

  // 3. HAZIR ÖRNEK ŞABLON VERİSİ
  const TEMPLATE_EXAMPLE = {
    id: "ornek-sanatci",
    name: "Ressam Defne Karaca",
    discipline: "Çağdaş Türk Resmi, Lirik Soyutlama & Pentür",
    category: "Ressam",
    city: "İstanbul / Kadıköy",
    studio: "Karaca Sanat Atölyesi",
    period: "1985 – Günümüz",
    coverImage: "/assets/biresku-banner.jpg",
    shortBio: "Mimar Sinan Güzel Sanatlar Fakültesi mezunu; renk katmanları ve lirik fırça tuşlarıyla doğanın içsel ritmini tuvale aktaran çağdaş ressam.",
    quote: "Sanat, doğayı taklit etmek değil; onun ruhumuzda bıraktığı renk titreşimlerini tuvalde özgürleştirmektir.",
    biography: [
      "1985 yılında İstanbul'da doğan Defne Karaca, 2008 yılında Mimar Sinan Güzel Sanatlar Üniversitesi Resim Bölümü'nden mezun oldu.",
      "Yurt içi ve yurt dışında çok sayıda sergiye katılan sanatçı, çalışmalarını İstanbul Kadıköy'deki atölyesinde sürdürmektedir."
    ],
    philosophy: [
      "Sanatçıya göre resim; bilincin sınırlarını aşan sezgisel bir arayış, doğadaki gizli geometrinin lirik boya lekesiyle buluştuğu kutsal bir andır.",
      "Canlı renk paleti ve katmanlı pentür tekniği, izleyiciye dingin ama aynı zamanda coşkulu bir iç yolculuk sunar."
    ],
    artworks: [
      {
        id: "art-1",
        title: "Gündoğumu Lirizmi",
        technique: "Tuval üzerine yağlıboya",
        dimensions: "100 × 120 cm",
        year: "2024",
        image: "/assets/adnan-turani/marmaris-serisi.jpg",
        imageUrl: "/assets/adnan-turani/marmaris-serisi.jpg"
      },
      {
        id: "art-2",
        title: "Sessizliğin Yankısı",
        technique: "Tuval üzerine yağlıboya",
        dimensions: "80 × 100 cm",
        year: "2023",
        image: "/assets/adnan-turani/viyolonsel-calan-kadin.jpg",
        imageUrl: "/assets/adnan-turani/viyolonsel-calan-kadin.jpg"
      }
    ]
  };

  // 4. MODAL HTML ENJEKSİYONU
  function injectStudioModal() {
    if (document.getElementById('bireskuArtistStudioModal')) return;

    const modalHtml = `
    <div id="bireskuArtistStudioModal" class="biresku-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="artistStudioTitle">
      <div class="biresku-modal-box artist-studio-modal-box">
        
        <!-- ÜST BAŞLIK & BİLGİ -->
        <div class="biresku-modal-header" style="background: linear-gradient(135deg, rgba(192,154,88,0.15), rgba(20,23,29,0.95)); border-bottom: 1px solid rgba(192,154,88,0.3);">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:1.3rem;">🎨</span>
            <div>
              <h3 id="artistStudioTitle" class="biresku-modal-title" style="color:#c09a58; font-size:1.15rem;">Biresku Sanatçı Yönetim &amp; Düzenleme Stüdyosu</h3>
              <span id="studioModeSubtitle" style="font-size:0.75rem; color:var(--text-muted);">Yönetici Gizli Paneli &bull; Sıfır-Açık Güvenli Motor</span>
            </div>
          </div>
          <button type="button" class="biresku-modal-close" onclick="BireskuArtistAdmin.closeStudio()" aria-label="Kapat">&times;</button>
        </div>

        <!-- ÜST SEÇİCİ & HIZLI ARAÇ ÇUBUĞU -->
        <div class="studio-quick-toolbar">
          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <div style="display:flex; align-items:center; gap:6px;">
              <label style="font-size:0.75rem; color:#c09a58; font-weight:700; text-transform:uppercase;">Sanatçı Seç:</label>
              <select id="studioArtistSelector" style="background:#171a21; color:#fff; border:1px solid #c09a58; border-radius:6px; padding:4px 8px; font-size:0.8rem; font-weight:600;" onchange="BireskuArtistAdmin.onSelectArtistChange(this.value)">
                <option value="__NEW__">✨ + Yeni Sanatçı Ekle</option>
              </select>
            </div>
            <button type="button" class="studio-btn studio-btn-gold" style="font-size:0.75rem; padding:4px 10px;" onclick="BireskuArtistAdmin.loadExampleTemplate()">
              ⚡ Örnek Taslak Doldur
            </button>
            <button type="button" class="studio-btn studio-btn-ghost" style="font-size:0.75rem; padding:4px 8px;" onclick="BireskuArtistAdmin.clearForm()">
              🧹 Temizle
            </button>
          </div>
          <span id="studioStatusInfo" style="font-size:0.75rem; color:#2ecc71; font-weight:600;"></span>
        </div>

        <!-- ANA GÖVDE: FORM + CANLI ÖNİZLEME -->
        <div class="biresku-modal-body studio-modal-body">
          <div class="studio-grid-layout">
            
            <!-- SOL KOLON: GİRİŞ FORMU -->
            <div class="studio-form-col">
              
              <!-- BÖLÜM 1: KİMLİK & KATEGORİ -->
              <div class="studio-section-card">
                <h4 class="studio-section-title"><span>1</span> Sanatçı Kimlik Bilgileri</h4>
                
                <div class="studio-form-row">
                  <div class="studio-form-group">
                    <label>Sanatçı Adı ve Unvanı *</label>
                    <input type="text" id="studioArtistName" placeholder="örn: Ressam Gülbin Nurgenç" oninput="BireskuArtistAdmin.onNameChange(this.value)">
                  </div>
                  <div class="studio-form-group">
                    <label>URL ID Kodu (Slug) *</label>
                    <input type="text" id="studioArtistId" placeholder="örn: gulbin-nurgenc" oninput="BireskuArtistAdmin.updateLivePreview()">
                  </div>
                </div>

                <div class="studio-form-row">
                  <div class="studio-form-group">
                    <label>Kategori</label>
                    <select id="studioArtistCategory" onchange="BireskuArtistAdmin.updateLivePreview()">
                      <option value="Ressam">Ressam</option>
                      <option value="Ressam &amp; Özgün Baskı Ustası">Ressam &amp; Özgün Baskı Ustası</option>
                      <option value="Ressam &amp; Sanat Eğitmeni">Ressam &amp; Sanat Eğitmeni</option>
                      <option value="Ressam &amp; Sanat Tarihçisi">Ressam &amp; Sanat Tarihçisi</option>
                      <option value="Heykeltıraş">Heykeltıraş</option>
                      <option value="Özgün Baskı Sanatçısı">Özgün Baskı Sanatçısı</option>
                      <option value="Çağdaş Sanatçı">Çağdaş Sanatçı</option>
                    </select>
                  </div>
                  <div class="studio-form-group">
                    <label>Dönem / Doğum</label>
                    <input type="text" id="studioArtistPeriod" placeholder="örn: 1970 – Günümüz" oninput="BireskuArtistAdmin.updateLivePreview()">
                  </div>
                </div>

                <div class="studio-form-row">
                  <div class="studio-form-group">
                    <label>Disiplin &amp; Ekol *</label>
                    <input type="text" id="studioArtistDiscipline" placeholder="örn: Çağdaş Türk Resmi, Lirik Soyutlama &amp; Pentür" oninput="BireskuArtistAdmin.updateLivePreview()">
                  </div>
                  <div class="studio-form-group">
                    <label>Şehir / Atölye</label>
                    <input type="text" id="studioArtistCity" placeholder="örn: İstanbul / Kadıköy" oninput="BireskuArtistAdmin.updateLivePreview()">
                  </div>
                </div>
              </div>

              <!-- BÖLÜM 2: İÇERİK, BİYOGRAFİ & ALINTI -->
              <div class="studio-section-card">
                <h4 class="studio-section-title"><span>2</span> Biyografi, Alıntı &amp; Sanat Felsefesi</h4>
                
                <div class="studio-form-group">
                  <label>Kısa Özet Tanıtım (Vitrin Kartı Metni) *</label>
                  <textarea id="studioArtistShortBio" rows="2" placeholder="Vitrin kartında görünen 1-2 cümlelik biyografi özeti..." oninput="BireskuArtistAdmin.updateLivePreview()"></textarea>
                </div>

                <div class="studio-form-group">
                  <label>Otantik Sanat Alıntısı (Tırnak İçi Sözü) *</label>
                  <textarea id="studioArtistQuote" rows="2" placeholder='Sanatçının sanata ve hayata bakışını özetleyen alıntı...' oninput="BireskuArtistAdmin.updateLivePreview()"></textarea>
                </div>

                <div class="studio-form-group">
                  <label>Detaylı Biyografi (1. Paragraf - Doğum &amp; Eğitim)</label>
                  <textarea id="studioArtistBio1" rows="2" placeholder="Doğum yeri, eğitimi, hocaları ve ilk dönemleri..."></textarea>
                </div>

                <div class="studio-form-group">
                  <label>Detaylı Biyografi (2. Paragraf - Kariyer &amp; Sergiler)</label>
                  <textarea id="studioArtistBio2" rows="2" placeholder="Sergileri, müzeleri, ödülleri ve güncel atölye çalışmaları..."></textarea>
                </div>

                <div class="studio-form-group">
                  <label>Sanat Felsefesi (1. Paragraf)</label>
                  <textarea id="studioArtistPhil1" rows="2" placeholder="Sanat anlayışı, akım ve felsefi temeller..."></textarea>
                </div>

                <div class="studio-form-group">
                  <label>Sanat Felsefesi (2. Paragraf)</label>
                  <textarea id="studioArtistPhil2" rows="2" placeholder="Teknik ustalığı, renk paleti ve biçimsel dili..."></textarea>
                </div>
              </div>

              <!-- BÖLÜM 3: PROFİL FOTOĞRAFI -->
              <div class="studio-section-card">
                <h4 class="studio-section-title"><span>3</span> Profil Fotoğrafı</h4>
                <div class="studio-form-row">
                  <div class="studio-form-group" style="flex:2;">
                    <label>Görsel URL veya Dosya Seç</label>
                    <input type="text" id="studioArtistCoverUrl" placeholder="https://... veya dosya yükleyin" oninput="BireskuArtistAdmin.updateLivePreview()">
                  </div>
                  <div class="studio-form-group" style="flex:1;">
                    <label>&nbsp;</label>
                    <label class="file-picker-label">
                      📁 Dosya Seç
                      <input type="file" id="studioCoverFileInput" accept="image/jpeg,image/png,image/webp" style="display:none;" onchange="BireskuArtistAdmin.handleCoverFile(this)">
                    </label>
                  </div>
                </div>
                <div id="coverUploadStatus" style="font-size:0.75rem; color:#2ecc71; margin-top:4px; display:none;"></div>
              </div>

              <!-- BÖLÜM 4: ESERLER YÖNETİMİ -->
              <div class="studio-section-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                  <h4 class="studio-section-title" style="margin:0;"><span>4</span> Koleksiyon Eserleri</h4>
                  <button type="button" class="studio-btn studio-btn-gold" style="font-size:0.75rem; padding:4px 10px;" onclick="BireskuArtistAdmin.addArtworkRow()">
                    + Yeni Eser Ekle
                  </button>
                </div>
                <div id="studioArtworksContainer" class="studio-artworks-list">
                  <!-- Dinamik eser satırları -->
                </div>
              </div>

            </div>

            <!-- SAĞ KOLON: CANLI ÖNİZLEME & ÇIKTILAR -->
            <div class="studio-preview-col">
              
              <!-- CANLI VİTRİN KARTI ÖNİZLEMESİ -->
              <div class="studio-preview-box">
                <div class="preview-box-header">
                  <span>👁️ Canlı Vitrin Kartı Önizlemesi</span>
                  <span class="preview-live-badge">Canlı Simülasyon</span>
                </div>
                <div class="preview-card-wrap">
                  <div class="flow-card artist-flow-card" style="width:100%; max-width:320px; margin:0 auto; pointer-events:none;">
                    <div class="artist-card-cover" style="position:relative;">
                      <img id="prevCardImg" src="/assets/biresku-banner.jpg" alt="Önizleme" style="width:100%; height:260px; object-fit:cover; display:block;">
                    </div>
                    <div class="artist-card-body" style="padding:14px;">
                      <div>
                        <h3 id="prevCardName" class="artist-name-title" style="font-size:1.05rem; color:#fff; margin-bottom:4px;">Sanatçı Adı</h3>
                        <span id="prevCardDiscipline" class="artist-cat-sub" style="font-size:0.75rem; color:#c09a58; display:block; margin-bottom:8px;">Disiplin ve Ekol</span>
                        <p id="prevCardShortBio" class="artist-card-discipline" style="font-size:0.8rem; color:#8b92a0; line-height:1.5;">Kısa biyografi özeti...</p>
                      </div>
                      <div class="artist-card-bottom" style="margin-top:12px; display:flex; justify-content:space-between; font-size:0.75rem; border-top:1px solid rgba(255,255,255,0.08); padding-top:8px;">
                        <span id="prevCardCity" class="artist-city-tag" style="color:#8b92a0;">📍 Şehir</span>
                        <span class="card-link-action" style="color:#c09a58; font-weight:700;">Özel Alanına Git &rarr;</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- CANLI ALINTI ÖNİZLEMESİ -->
              <div class="studio-preview-box" style="margin-top:16px;">
                <div class="preview-box-header">
                  <span>📜 Profil Alıntısı Önizlemesi</span>
                </div>
                <div style="padding:14px; background:rgba(192,154,88,0.05); border-left:3px solid #c09a58; border-radius:4px; font-style:italic; font-size:0.88rem; color:#d6d8db; line-height:1.6;" id="prevCardQuote">
                  "Sanatçının sanata ve hayata bakışını yansıtan alıntı metni burada görüntülenir."
                </div>
                <div style="margin-top:8px; font-size:0.75rem; color:#c09a58; font-weight:700;" id="prevArtworksCountBadge">
                  0 Koleksiyon Eseri Kayıtlı
                </div>
              </div>

              <!-- HIZLI KOD DIŞA AKTARMA -->
              <div class="studio-preview-box" style="margin-top:16px;">
                <div class="preview-box-header">
                  <span>📋 Hazır Kod Şablonu</span>
                  <button type="button" class="studio-btn studio-btn-gold" style="font-size:0.72rem; padding:3px 8px;" onclick="BireskuArtistAdmin.copyGeneratedCode()">
                    Kodu Kopyala
                  </button>
                </div>
                <div class="code-export-box">
                  <pre id="studioGeneratedCode" style="margin:0; font-family:Consolas, monospace; font-size:0.75rem; color:#a5d6a7; white-space:pre-wrap; max-height:160px; overflow-y:auto;"></pre>
                </div>
              </div>

            </div>

          </div>
        </div>

        <!-- ALT EYLEM ÇUBUĞU -->
        <div class="biresku-modal-footer studio-modal-footer">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <button type="button" id="studioSaveBtn" class="studio-btn studio-btn-green" onclick="BireskuArtistAdmin.saveAndDeployArtist()">
              🚀 Sisteme Ekle ve Vitrine Al (Canlı)
            </button>
            <button type="button" class="studio-btn studio-btn-gold" onclick="BireskuArtistAdmin.downloadJson()">
              💾 JSON İndir
            </button>
            <button type="button" id="studioDeleteArtistBtn" class="studio-btn" style="background:#e74c3c; color:#fff; display:none;" onclick="BireskuArtistAdmin.deleteCurrentArtist()">
              🗑️ Sanatçıyı Sil
            </button>
          </div>
          <button type="button" class="biresku-modal-btn" onclick="BireskuArtistAdmin.closeStudio()">Kapat</button>
        </div>

      </div>
    </div>
    `;

    const wrap = document.createElement('div');
    wrap.id = 'bireskuArtistStudioWrap';
    wrap.innerHTML = modalHtml;
    document.body.appendChild(wrap);
  }

  // 5. YEREL RESİM OKUYUCU
  function readFileAsDataUrl(file, callback) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Hata: Yalnızca resim dosyaları (JPEG, PNG, WebP) yüklenebilir.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert("Hata: Resim boyutu maksimum 5MB olabilir.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      callback(e.target.result);
    };
    reader.onerror = function() {
      alert("Dosya okunurken bir hata oluştu.");
    };
    reader.readAsDataURL(file);
  }

  // 6. SANATÇI STÜDYOSU ANA NESNESİ
  window.BireskuArtistAdmin = {
    artworksCount: 0,

    // Stüdyoyu Aç (Sadece Admin)
    openStudio: function(targetArtistId) {
      if (!checkAdminAuth()) {
        console.warn("Yetkisiz: Sanatçı stüdyosuna yalnızca admin erişebilir.");
        return;
      }
      injectStudioModal();
      this.populateArtistSelector();

      if (targetArtistId && targetArtistId !== '__NEW__') {
        this.loadArtistForEditing(targetArtistId);
      } else {
        this.setModeNew();
      }

      const modal = document.getElementById('bireskuArtistStudioModal');
      if (modal) {
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
      this.updateLivePreview();
    },

    // Stüdyoyu Kapat
    closeStudio: function() {
      const modal = document.getElementById('bireskuArtistStudioModal');
      if (modal) {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    },

    // Sanatçı Seçici Dropdown'ını Doldur
    populateArtistSelector: function() {
      const select = document.getElementById('studioArtistSelector');
      if (!select) return;
      select.innerHTML = '<option value="__NEW__">✨ + Yeni Sanatçı Ekle (Boş/Şablon)</option>';

      if (window.ARTISTS_DATA && Array.isArray(window.ARTISTS_DATA)) {
        window.ARTISTS_DATA.forEach(artist => {
          if (artist && artist.id) {
            const opt = document.createElement('option');
            opt.value = artist.id;
            opt.textContent = `✏️ ${artist.name || artist.id} (Düzenle)`;
            select.appendChild(opt);
          }
        });
      }
    },

    // Dropdown Değişimi
    onSelectArtistChange: function(val) {
      if (val === '__NEW__') {
        this.setModeNew();
      } else {
        this.loadArtistForEditing(val);
      }
    },

    // Yeni Ekleme Moduna Geç
    setModeNew: function() {
      currentEditingId = null;
      const title = document.getElementById('artistStudioTitle');
      if (title) title.textContent = "Biresku Sanatçı Yönetim & Şablon Stüdyosu";
      const sub = document.getElementById('studioModeSubtitle');
      if (sub) sub.textContent = "Yeni Sanatçı Ekleme Modu";
      const saveBtn = document.getElementById('studioSaveBtn');
      if (saveBtn) saveBtn.textContent = "🚀 Sisteme Ekle ve Vitrine Al (Canlı)";
      const delBtn = document.getElementById('studioDeleteArtistBtn');
      if (delBtn) delBtn.style.display = "none";
      const idInput = document.getElementById('studioArtistId');
      if (idInput) idInput.readOnly = false;
      const select = document.getElementById('studioArtistSelector');
      if (select) select.value = "__NEW__";

      this.clearForm();
    },

    // Mevcut Sanatçıyı Düzenleme Moduna Al
    loadArtistForEditing: function(artistId) {
      if (!window.ARTISTS_DATA) return;
      const artist = window.ARTISTS_DATA.find(a => a.id === artistId);
      if (!artist) return;

      currentEditingId = artist.id;
      const title = document.getElementById('artistStudioTitle');
      if (title) title.textContent = `✏️ Düzenleniyor: ${artist.name}`;
      const sub = document.getElementById('studioModeSubtitle');
      if (sub) sub.textContent = `Mevcut Sanatçı Verisi Güncelleniyor (ID: ${artist.id})`;
      const saveBtn = document.getElementById('studioSaveBtn');
      if (saveBtn) saveBtn.textContent = "💾 Değişiklikleri Kaydet & Vitrine Uygula";
      const delBtn = document.getElementById('studioDeleteArtistBtn');
      if (delBtn) delBtn.style.display = "inline-flex";

      const select = document.getElementById('studioArtistSelector');
      if (select) select.value = artist.id;

      // Alanları doldur
      document.getElementById('studioArtistName').value = artist.name || '';
      const idInput = document.getElementById('studioArtistId');
      if (idInput) {
        idInput.value = artist.id;
        idInput.readOnly = true; // ID değiştirilemez
      }
      document.getElementById('studioArtistCategory').value = artist.category || 'Ressam';
      document.getElementById('studioArtistPeriod').value = artist.period || '';
      document.getElementById('studioArtistDiscipline').value = artist.discipline || '';
      document.getElementById('studioArtistCity').value = artist.city || '';
      document.getElementById('studioArtistCoverUrl').value = artist.coverImage || '';
      document.getElementById('studioArtistShortBio').value = artist.shortBio || artist.bio || '';
      document.getElementById('studioArtistQuote').value = artist.quote || '';

      const bios = Array.isArray(artist.biography) ? artist.biography : [artist.biography || ''];
      document.getElementById('studioArtistBio1').value = bios[0] || '';
      document.getElementById('studioArtistBio2').value = bios[1] || '';

      const phils = Array.isArray(artist.philosophy) ? artist.philosophy : [artist.philosophy || ''];
      document.getElementById('studioArtistPhil1').value = phils[0] || '';
      document.getElementById('studioArtistPhil2').value = phils[1] || '';

      // Eserleri doldur
      const container = document.getElementById('studioArtworksContainer');
      if (container) {
        container.innerHTML = '';
        this.artworksCount = 0;
        if (artist.artworks && Array.isArray(artist.artworks)) {
          artist.artworks.forEach(art => this.addArtworkRow(art));
        } else {
          this.addArtworkRow();
        }
      }

      this.updateLivePreview();
    },

    // Sanatçı Kartından Doğrudan Düzenleme Aç
    editArtist: function(artistId) {
      this.openStudio(artistId);
    },

    // Sanatçı Adı Değiştikçe Otomatik Slug Üret (Sadece yeni modda)
    onNameChange: function(name) {
      if (!currentEditingId) {
        const idInput = document.getElementById('studioArtistId');
        if (idInput) idInput.value = slugify(name);
      }
      this.updateLivePreview();
    },

    // Profil Fotoğrafı Dosya Seçimi
    handleCoverFile: function(input) {
      const file = input.files && input.files[0];
      if (!file) return;
      const statusEl = document.getElementById('coverUploadStatus');
      readFileAsDataUrl(file, (dataUrl) => {
        const coverInput = document.getElementById('studioArtistCoverUrl');
        if (coverInput) coverInput.value = dataUrl;
        if (statusEl) {
          statusEl.style.display = 'block';
          statusEl.textContent = `✓ ${escapeHtml(file.name)} (${Math.round(file.size / 1024)} KB) yüklendi.`;
        }
        this.updateLivePreview();
      });
    },

    // Eser Resmi Dosya Seçimi
    handleArtFile: function(input, rowId) {
      const file = input.files && input.files[0];
      if (!file) return;
      readFileAsDataUrl(file, (dataUrl) => {
        const urlInput = document.getElementById(`artUrl_${rowId}`);
        if (urlInput) urlInput.value = dataUrl;
        const prevImg = document.getElementById(`artPrev_${rowId}`);
        if (prevImg) prevImg.src = dataUrl;
        this.updateLivePreview();
      });
    },

    // Dinamik Eser Satırı Ekle
    addArtworkRow: function(data) {
      this.artworksCount++;
      const rowId = this.artworksCount;
      const container = document.getElementById('studioArtworksContainer');
      if (!container) return;

      const art = data || {
        title: "",
        image: "",
        technique: "Tuval üzerine yağlıboya",
        dimensions: "80 × 100 cm",
        year: "2024"
      };

      const rowDiv = document.createElement('div');
      rowDiv.className = 'studio-artwork-item';
      rowDiv.id = `artworkRow_${rowId}`;
      rowDiv.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-weight:700; font-size:0.8rem; color:#c09a58;">Eser #${rowId}</span>
          <button type="button" class="studio-remove-art-btn" onclick="BireskuArtistAdmin.removeArtworkRow(${rowId})" title="Eseri Kaldır">&times; Kaldır</button>
        </div>
        <div class="studio-form-row">
          <div class="studio-form-group" style="flex:2;">
            <label>Eser Başlığı *</label>
            <input type="text" id="artTitle_${rowId}" value="${escapeHtml(art.title)}" placeholder="örn: Mavi Sonsuzluk" oninput="BireskuArtistAdmin.updateLivePreview()">
          </div>
          <div class="studio-form-group" style="flex:1;">
            <label>Yıl / Durum</label>
            <input type="text" id="artYear_${rowId}" value="${escapeHtml(art.year)}" placeholder="2024 veya Özgün Eser" oninput="BireskuArtistAdmin.updateLivePreview()">
          </div>
        </div>
        <div class="studio-form-row">
          <div class="studio-form-group" style="flex:2;">
            <label>Teknik</label>
            <input type="text" id="artTech_${rowId}" value="${escapeHtml(art.technique)}" placeholder="Tuval üzerine yağlıboya" oninput="BireskuArtistAdmin.updateLivePreview()">
          </div>
          <div class="studio-form-group" style="flex:1;">
            <label>Kesin Ölçü</label>
            <input type="text" id="artDim_${rowId}" value="${escapeHtml(art.dimensions)}" placeholder="80 × 100 cm" oninput="BireskuArtistAdmin.updateLivePreview()">
          </div>
        </div>
        <div class="studio-form-row" style="align-items:flex-end;">
          <div class="studio-form-group" style="flex:3;">
            <label>Görsel URL veya Dosya</label>
            <input type="text" id="artUrl_${rowId}" value="${escapeHtml(art.image || art.imageUrl || '')}" placeholder="https://... veya dosya seçin" oninput="BireskuArtistAdmin.onArtUrlChange(${rowId}, this.value)">
          </div>
          <div class="studio-form-group" style="flex:1;">
            <label class="file-picker-label" style="font-size:0.75rem; padding:6px 8px;">
              📁 Dosya
              <input type="file" accept="image/*" style="display:none;" onchange="BireskuArtistAdmin.handleArtFile(this, ${rowId})">
            </label>
          </div>
          <div style="flex-shrink:0;">
            <img id="artPrev_${rowId}" src="${art.image || '/assets/biresku-banner.jpg'}" alt="Önizleme" style="width:40px; height:40px; object-fit:cover; border-radius:4px; border:1px solid rgba(255,255,255,0.2);">
          </div>
        </div>
      `;
      container.appendChild(rowDiv);
      this.updateLivePreview();
    },

    removeArtworkRow: function(rowId) {
      const row = document.getElementById(`artworkRow_${rowId}`);
      if (row) {
        row.remove();
        this.updateLivePreview();
      }
    },

    onArtUrlChange: function(rowId, val) {
      const prev = document.getElementById(`artPrev_${rowId}`);
      if (prev) {
        prev.src = sanitizeUrl(val) || '/assets/biresku-banner.jpg';
      }
      this.updateLivePreview();
    },

    // Formu Topla ve Doğrulanmış Nesne Üret
    collectFormData: function() {
      const name = (document.getElementById('studioArtistName')?.value || '').trim();
      let id = (document.getElementById('studioArtistId')?.value || '').trim();
      if (!id && name) id = slugify(name);
      id = id.toLowerCase().replace(/[^a-z0-9\-]/g, '');

      const discipline = (document.getElementById('studioArtistDiscipline')?.value || '').trim();
      const category = (document.getElementById('studioArtistCategory')?.value || 'Ressam').trim();
      const city = (document.getElementById('studioArtistCity')?.value || '').trim();
      const period = (document.getElementById('studioArtistPeriod')?.value || '').trim();
      const coverUrl = sanitizeUrl(document.getElementById('studioArtistCoverUrl')?.value) || '/assets/biresku-banner.jpg';
      const shortBio = (document.getElementById('studioArtistShortBio')?.value || '').trim();
      const quote = (document.getElementById('studioArtistQuote')?.value || '').trim();

      const bio1 = (document.getElementById('studioArtistBio1')?.value || '').trim();
      const bio2 = (document.getElementById('studioArtistBio2')?.value || '').trim();
      const biography = [];
      if (bio1) biography.push(bio1);
      if (bio2) biography.push(bio2);

      const phil1 = (document.getElementById('studioArtistPhil1')?.value || '').trim();
      const phil2 = (document.getElementById('studioArtistPhil2')?.value || '').trim();
      const philosophy = [];
      if (phil1) philosophy.push(phil1);
      if (phil2) philosophy.push(phil2);

      const artworks = [];
      const rows = document.querySelectorAll('.studio-artwork-item');
      rows.forEach((row, idx) => {
        const rowId = row.id.replace('artworkRow_', '');
        const title = (document.getElementById(`artTitle_${rowId}`)?.value || '').trim();
        const year = (document.getElementById(`artYear_${rowId}`)?.value || '').trim();
        const technique = (document.getElementById(`artTech_${rowId}`)?.value || '').trim();
        const dimensions = (document.getElementById(`artDim_${rowId}`)?.value || '').trim();
        const rawUrl = document.getElementById(`artUrl_${rowId}`)?.value || '';
        const image = sanitizeUrl(rawUrl) || '/assets/biresku-banner.jpg';

        if (title || image) {
          artworks.push({
            id: `${id || 'art'}-${idx + 1}`,
            title: title || `Eser #${idx + 1}`,
            technique: technique || 'Tuval üzerine yağlıboya',
            dimensions: dimensions || 'Özgün Boyut',
            year: year || 'Özgün Koleksiyon Eseri',
            image: image,
            imageUrl: image
          });
        }
      });

      return {
        id: id || "yeni-sanatci",
        name: name || "İsimsiz Sanatçı",
        discipline: discipline || "Çağdaş Türk Resmi",
        category: category || "Ressam",
        city: city || "İstanbul",
        studio: city ? `${city} Atölyesi` : "Sanatçı Atölyesi",
        coverImage: coverUrl,
        shortBio: shortBio || "Biresku tescilli çağdaş Türk ressamı.",
        quote: quote || "Sanat, insanın içindeki tutkuların ve hakikatin tuvaldeki saf yankısıdır.",
        biography: biography.length ? biography : [shortBio],
        philosophy: philosophy.length ? philosophy : [quote],
        artworks: artworks,
        addedDate: new Date().toISOString().split('T')[0],
        period: period || "Çağdaş Dönem"
      };
    },

    // Canlı Önizlemeyi Güncelle
    updateLivePreview: function() {
      const data = this.collectFormData();

      const imgEl = document.getElementById('prevCardImg');
      if (imgEl) imgEl.src = data.coverImage;

      const nameEl = document.getElementById('prevCardName');
      if (nameEl) nameEl.textContent = data.name;

      const discEl = document.getElementById('prevCardDiscipline');
      if (discEl) discEl.textContent = data.discipline;

      const bioEl = document.getElementById('prevCardShortBio');
      if (bioEl) bioEl.textContent = data.shortBio;

      const cityEl = document.getElementById('prevCardCity');
      if (cityEl) cityEl.textContent = `📍 ${data.city}`;

      const quoteEl = document.getElementById('prevCardQuote');
      if (quoteEl) quoteEl.textContent = `"${data.quote}"`;

      const countBadge = document.getElementById('prevArtworksCountBadge');
      if (countBadge) countBadge.textContent = `${data.artworks.length} Koleksiyon Eseri Kayıtlı`;

      const codeEl = document.getElementById('studioGeneratedCode');
      if (codeEl) {
        codeEl.textContent = JSON.stringify(data, null, 2);
      }
    },

    // Hazır Örnek Şablonu Yükle
    loadExampleTemplate: function() {
      const ex = TEMPLATE_EXAMPLE;
      document.getElementById('studioArtistName').value = ex.name;
      document.getElementById('studioArtistId').value = ex.id;
      document.getElementById('studioArtistDiscipline').value = ex.discipline;
      document.getElementById('studioArtistCategory').value = ex.category;
      document.getElementById('studioArtistCity').value = ex.city;
      document.getElementById('studioArtistPeriod').value = ex.period;
      document.getElementById('studioArtistCoverUrl').value = ex.coverImage;
      document.getElementById('studioArtistShortBio').value = ex.shortBio;
      document.getElementById('studioArtistQuote').value = ex.quote;
      document.getElementById('studioArtistBio1').value = ex.biography[0] || '';
      document.getElementById('studioArtistBio2').value = ex.biography[1] || '';
      document.getElementById('studioArtistPhil1').value = ex.philosophy[0] || '';
      document.getElementById('studioArtistPhil2').value = ex.philosophy[1] || '';

      const container = document.getElementById('studioArtworksContainer');
      if (container) {
        container.innerHTML = '';
        this.artworksCount = 0;
        ex.artworks.forEach(art => this.addArtworkRow(art));
      }
      this.updateLivePreview();
    },

    // Formu Temizle
    clearForm: function() {
      ['studioArtistName', 'studioArtistId', 'studioArtistDiscipline', 'studioArtistCity', 
       'studioArtistPeriod', 'studioArtistCoverUrl', 'studioArtistShortBio', 'studioArtistQuote', 
       'studioArtistBio1', 'studioArtistBio2', 'studioArtistPhil1', 'studioArtistPhil2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      const container = document.getElementById('studioArtworksContainer');
      if (container) {
        container.innerHTML = '';
        this.artworksCount = 0;
        this.addArtworkRow();
      }
      this.updateLivePreview();
    },

    // Kod Şablonunu Panoya Kopyala
    copyGeneratedCode: function() {
      const data = this.collectFormData();
      const codeStr = JSON.stringify(data, null, 2);
      navigator.clipboard.writeText(codeStr).then(() => {
        alert("✓ Sanatçı kodu başarıyla panoya kopyalandı!");
      }).catch(() => {
        prompt("Kodu kopyalamak için Ctrl+C tuşlarına basınız:", codeStr);
      });
    },

    // JSON Olarak İndir
    downloadJson: function() {
      const data = this.collectFormData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${data.id || 'sanatci'}.json`;
      a.click();
    },

    // SİSTEME EKLE VEYA GÜNCELLE
    saveAndDeployArtist: function() {
      if (!checkAdminAuth()) {
        alert("Yetkisiz Erişim: Bu işlem yalnızca yönetici tarafından yapılabilir.");
        return;
      }

      const data = this.collectFormData();
      if (!data.name || data.name === "İsimsiz Sanatçı") {
        alert("Lütfen sanatçının adını giriniz.");
        document.getElementById('studioArtistName')?.focus();
        return;
      }
      if (!data.id) {
        alert("Lütfen geçerli bir URL ID kodu giriniz.");
        return;
      }

      if (typeof window.ARTISTS_DATA === 'undefined') {
        window.ARTISTS_DATA = [];
      }
      
      const isUpdate = currentEditingId !== null;
      const targetId = isUpdate ? currentEditingId : data.id;

      // 1. window.ARTISTS_DATA'da güncelle veya ekle
      const existingIdx = window.ARTISTS_DATA.findIndex(a => a.id === targetId);
      if (existingIdx !== -1) {
        window.ARTISTS_DATA[existingIdx] = data;
      } else {
        window.ARTISTS_DATA.push(data); // yeni ise sona ekle (vitrin reverse ile başa alır)
      }

      // 2. LocalStorage'a kaydet
      try {
        let stored = [];
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) stored = JSON.parse(raw);
        if (!Array.isArray(stored)) stored = [];
        
        const stIdx = stored.findIndex(a => a.id === targetId);
        if (stIdx !== -1) {
          stored[stIdx] = data;
        } else {
          stored.push(data);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      } catch (e) {
        console.warn("LocalStorage save error:", e);
      }

      // 3. Vitrin ve Kataloğu güncelle
      if (typeof syncArtistsRailWithData === 'function') {
        syncArtistsRailWithData();
      }
      if (typeof renderCatalog === 'function' && typeof getArtistsList === 'function') {
        renderCatalog(getArtistsList());
      }
      this.injectAdminCards(); // Admin kartlarını tekrar iliştir

      // 4. Başarı Bildirimi
      if (isUpdate) {
        alert(`✓ "${data.name}" sanatçısının bilgileri ve eserleri başarıyla GÜNCELLENDİ!`);
      } else {
        alert(`🎉 TEBRİKLER!\n\n"${data.name}" başarıyla Biresku'ya eklendi!\n\n• Vitrinin 1. sırasına (en sola) yerleşti.\n• Kataloğa kaydedildi.\n• Özel alanı aktif: /dergi/sanatcilar/#profil=${data.id}`);
      }

      this.closeStudio();
    },

    // Sanatçıyı Sil
    deleteCurrentArtist: function() {
      if (!currentEditingId) return;
      if (!checkAdminAuth()) return;

      const confirmDel = confirm(`"${currentEditingId}" sanatçısını sistemden ve vitrinden KALDIRMAK istediğinize emin misiniz?`);
      if (!confirmDel) return;

      // 1. window.ARTISTS_DATA'dan çıkar
      if (window.ARTISTS_DATA && Array.isArray(window.ARTISTS_DATA)) {
        window.ARTISTS_DATA = window.ARTISTS_DATA.filter(a => a.id !== currentEditingId);
      }

      // 2. LocalStorage'dan çıkar
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          let stored = JSON.parse(raw);
          if (Array.isArray(stored)) {
            stored = stored.filter(a => a.id !== currentEditingId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
          }
        }
      } catch (e) {}

      // 3. Yeniden çiz
      if (typeof syncArtistsRailWithData === 'function') {
        syncArtistsRailWithData();
      }
      if (typeof renderCatalog === 'function' && typeof getArtistsList === 'function') {
        renderCatalog(getArtistsList());
      }
      this.injectAdminCards();

      alert("✓ Sanatçı başarıyla sistemden kaldırıldı.");
      this.closeStudio();
    },

    // 7. GİZLİ "+" KARTINI VE DÜZENLE BUTONLARINI ENJEKTE ET (SADECE ADMİNE GÖRÜNÜR)
    injectAdminCards: function() {
      // Güvenlik: Admin değilse ASLA DOM'a dokunma, sıfır iz bırak
      if (!checkAdminAuth()) {
        // Varsa temizle
        document.querySelectorAll('.admin-only-injected-card, .admin-card-edit-btn').forEach(el => el.remove());
        return;
      }

      // A. dergi/sanatcilar/ Kataloğu (#catalogGrid)
      const catalogGrid = document.getElementById('catalogGrid');
      if (catalogGrid) {
        // Mevcut "+" kartı yoksa sol üste (1. sıraya) ekle
        let existingAddCard = document.getElementById('adminCatalogAddCard');
        if (!existingAddCard) {
          const addCard = document.createElement('article');
          addCard.id = 'adminCatalogAddCard';
          addCard.className = 'artist-card admin-only-injected-card admin-plus-card';
          addCard.onclick = () => BireskuArtistAdmin.openStudio('__NEW__');
          addCard.style.cursor = 'pointer';
          addCard.innerHTML = `
            <div class="artist-card-cover admin-plus-cover">
              <div class="admin-plus-circle-inner">
                <span class="admin-plus-sign">+</span>
                <span class="admin-plus-label">Yeni Sanatçı Ekle</span>
              </div>
            </div>
            <div class="artist-card-body" style="padding:16px;">
              <div>
                <h3 class="artist-name" style="color:#c09a58; font-size:1.1rem; display:flex; align-items:center; gap:6px;">
                  <span>✨</span> Yeni Sanatçı &amp; Şablon
                </h3>
                <div class="artist-discipline" style="color:var(--text-muted); font-size:0.78rem;">Yönetici Hızlı Ekleme Alanı</div>
                <p class="artist-statement" style="font-size:0.8rem; line-height:1.5;">
                  Tıklayarak yeni sanatçı profili, biyografisi ve eserlerini vitrinin en soluna ekleyin.
                </p>
              </div>
              <div class="artist-card-footer" style="margin-top:14px; border-top:1px solid rgba(192,154,88,0.2); padding-top:10px;">
                <span style="font-size:0.75rem; color:#c09a58; font-weight:700;">👑 Yönetici Alanı</span>
                <span class="view-profile-btn" style="background:#c09a58; color:#0e1015; font-weight:700; border-radius:4px; padding:4px 8px; font-size:0.75rem;">
                  <span>+ Şablonu Aç</span>
                  <span>&rarr;</span>
                </span>
              </div>
            </div>
          `;
          catalogGrid.insertBefore(addCard, catalogGrid.firstChild);
        }

        // Mevcut tüm kartlara "Düzenle" butonu iliştir
        const artistCards = catalogGrid.querySelectorAll('.artist-card:not(.admin-plus-card)');
        artistCards.forEach(card => {
          const artistId = card.getAttribute('data-artist-id');
          if (artistId && !card.querySelector('.admin-card-edit-btn')) {
            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'admin-card-edit-btn';
            editBtn.innerHTML = '✏️ Düzenle';
            editBtn.title = 'Bu Sanatçıyı Düzenle';
            editBtn.onclick = (e) => {
              e.stopPropagation();
              BireskuArtistAdmin.editArtist(artistId);
            };
            const cover = card.querySelector('.artist-card-cover');
            if (cover) cover.appendChild(editBtn);
          }
        });
      }

      // B. index.html Vitrin Rayı (#artistsRail)
      const artistsRail = document.getElementById('artistsRail');
      if (artistsRail) {
        let existingRailAdd = document.getElementById('adminRailAddCard');
        if (!existingRailAdd) {
          const railCard = document.createElement('div');
          railCard.id = 'adminRailAddCard';
          railCard.className = 'flow-card artist-flow-card admin-only-injected-card admin-plus-card';
          railCard.onclick = () => BireskuArtistAdmin.openStudio('__NEW__');
          railCard.style.cursor = 'pointer';
          railCard.innerHTML = `
            <div class="artist-card-cover admin-plus-cover">
              <div class="admin-plus-circle-inner">
                <span class="admin-plus-sign">+</span>
                <span class="admin-plus-label">Yeni Sanatçı Ekle</span>
              </div>
            </div>
            <div class="artist-card-body">
              <div>
                <h3 class="artist-name-title" style="color:#c09a58;">+ Yeni Sanatçı Ekle</h3>
                <span class="artist-cat-sub" style="color:var(--text-muted);">Yönetici Hızlı Şablonu</span>
                <p class="artist-card-discipline">
                  Yeni sanatçı profili, biyografisi ve eserlerini vitrinin en soluna ekleyin.
                </p>
              </div>
              <div class="artist-card-bottom">
                <span class="artist-city-tag" style="color:#c09a58;">👑 Yönetici</span>
                <span class="card-link-action" style="color:#c09a58; font-weight:700;">+ Şablonu Aç &rarr;</span>
              </div>
            </div>
          `;
          artistsRail.insertBefore(railCard, artistsRail.firstChild);
        }

        // Raydaki kartlara "Düzenle" butonu iliştir
        const railCards = artistsRail.querySelectorAll('.artist-flow-card:not(.admin-plus-card)');
        railCards.forEach(card => {
          const href = card.getAttribute('href') || '';
          const match = href.match(/#profil=([a-z0-9\-]+)/);
          if (match && match[1] && !card.querySelector('.admin-card-edit-btn')) {
            const artistId = match[1];
            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'admin-card-edit-btn';
            editBtn.innerHTML = '✏️ Düzenle';
            editBtn.title = 'Bu Sanatçıyı Düzenle';
            editBtn.onclick = (e) => {
              e.preventDefault();
              e.stopPropagation();
              BireskuArtistAdmin.editArtist(artistId);
            };
            const cover = card.querySelector('.artist-card-cover');
            if (cover) cover.appendChild(editBtn);
          }
        });
      }
    }
  };

  // Sayfa yüklendiğinde LocalStorage'daki özel sanatçıları ARTISTS_DATA ile birleştir
  function hydrateCustomArtists() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw && window.ARTISTS_DATA && Array.isArray(window.ARTISTS_DATA)) {
        const stored = JSON.parse(raw);
        if (Array.isArray(stored)) {
          stored.forEach(art => {
            if (art && art.id) {
              const exIdx = window.ARTISTS_DATA.findIndex(a => a.id === art.id);
              if (exIdx !== -1) {
                window.ARTISTS_DATA[exIdx] = art; // Güncelle
              } else {
                window.ARTISTS_DATA.push(art); // Ekle
              }
            }
          });
          if (typeof syncArtistsRailWithData === 'function') {
            syncArtistsRailWithData();
          }
        }
      }
    } catch (e) {}

    // Admin kartlarını ve "+" simgesini kontrol edip enjekte et
    setTimeout(() => {
      BireskuArtistAdmin.injectAdminCards();
    }, 300);
  }

  // Oturum durumu değiştiğinde (Giriş / Çıkış) anında güncelle
  window.addEventListener("biresku:auth_state_changed", function(e) {
    setTimeout(() => {
      BireskuArtistAdmin.injectAdminCards();
    }, 150);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrateCustomArtists);
  } else {
    hydrateCustomArtists();
  }

})(window);
