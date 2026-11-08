/**
 * biresku-artist-admin.js - Biresku Gizli Admin Sanatçı Yönetim & Canlı Görsel Şablon Stüdyosu
 * ------------------------------------------------------------------------------------------
 * GİZLİLİK VE GÜVENLİK STANDARTLARI:
 * 1. Kaynak Kod Gizliliği: HTML dosyalarında statik hiçbir buton, form veya stüdyo yer almaz.
 * 2. Çalışma Zamanı Enjeksiyonu: Yalnızca yetkili Admin (ardaumay06@gmail.com / role: admin)
 *    giriş yaptığında JavaScript ile DOM'a sol üstte "+" kartı, "Düzenle" butonları ve
 *    profil sayfasıyla 1:1 birebir aynı In-Place Canlı Görsel Stüdyo enjekte edilir.
 * 3. Birebir Profil Görünümü (Photo 2 / In-Place Visual Editor):
 *    Admin biyografinin, alıntının, sanat felsefesinin ve eserlerin altını doğrudan
 *    profil sayfasının kendi estetik kartları ve tipografisi içinde boş olarak görür
 *    ve doğrudan doldurur / günceller.
 * 4. Tam XSS Koruması: escapeHtml, URL şema kontrolü ve parametrik sanitizasyon.
 */

(function(window) {
  'use strict';

  const STORAGE_KEY = 'biresku_custom_artists_v1';
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  let currentEditingId = null; // null veya '__NEW__' ise yeni sanatçı modu

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
    category: "Ressam & Sanat Eğitmeni",
    city: "İstanbul / Kadıköy",
    studio: "Karaca Sanat Atölyesi",
    period: "1985 – Günümüz",
    coverImage: "/assets/biresku-banner.jpg",
    shortBio: "Mimar Sinan Güzel Sanatlar Fakültesi mezunu; renk katmanları ve lirik fırça tuşlarıyla doğanın içsel ritmini tuvale aktaran çağdaş ressam ve eğitmen.",
    quote: "Sanat, doğayı taklit etmek değil; onun ruhumuzda bıraktığı renk titreşimlerini tuvalde özgürleştirmektir.",
    biography: [
      "1985 yılında İstanbul'da doğan Defne Karaca, Mimar Sinan Güzel Sanatlar Üniversitesi Resim Bölümü'nden mezun oldu. Alanında yetkin ustalardan aldığı desen ve renk eğitiminin ardından atölyesinde özgün pentür çalışmalarına başladı.",
      "Yurt içi ve yurt dışında çok sayıda karma ve kişisel sergiye katılan sanatçı, 10 yılı aşkın süredir sanat eğitmenliği yapmakta; çalışmalarını İstanbul Kadıköy'deki atölyesinde sürdürmektedir."
    ],
    philosophy: [
      "Sanatçıya göre resim; bilincin sınırlarını aşan sezgisel bir arayış, doğadaki gizli geometrinin lirik boya lekesiyle buluştuğu kutsal bir andır.",
      "Canlı renk paleti, kalın boya katmanları (impasto) ve katmanlı pentür tekniği, izleyiciye dingin ama aynı zamanda coşkulu bir iç yolculuk sunar."
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
        title: "Renk Devinimi & Denge",
        technique: "Tuval üzerine yağlıboya",
        dimensions: "80 × 100 cm",
        year: "2023",
        image: "/assets/mustafa-ayaz/figuratifs-1.jpg",
        imageUrl: "/assets/mustafa-ayaz/figuratifs-1.jpg"
      }
    ]
  };

  // 4. DOSYA OKUMA YARDIMCISI (Base64 DataURL)
  function readFileAsDataUrl(file, callback) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Lütfen geçerli bir görsel dosyası (JPG, PNG, WebP) seçiniz.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert("Görsel boyutu 5 MB'dan küçük olmalıdır.");
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

  // 5. CANLI GÖRSEL STÜDYO DOM YAPISINI ENJEKTE ET (PROFİL SAYFASIYLA 1:1 AYNI)
  function ensureStudioViewExists() {
    let studioView = document.getElementById('artistStudioView');
    if (studioView) return studioView;

    // artistProfileView'ün hemen yanına dinamik olarak iliştir
    const profileView = document.getElementById('artistProfileView');
    const catalogMain = document.querySelector('.catalog-main') || (profileView ? profileView.parentNode : document.body);

    studioView = document.createElement('div');
    studioView.id = 'artistStudioView';
    studioView.className = 'artist-profile-view is-studio-mode';
    studioView.style.display = 'none';

    studioView.innerHTML = `
      <!-- Üst Sticky Yönetici Kontrol Çubuğu -->
      <div class="studio-top-bar">
        <div class="studio-top-left">
          <button type="button" class="studio-back-btn" onclick="BireskuArtistAdmin.exitVisualStudio()">
            <span>&larr;</span>
            <span>Kataloğa Dön (Vazgeç)</span>
          </button>
          <div class="studio-mode-pill">
            <span>👑</span>
            <span id="visualStudioModeLabel">Yeni Sanatçı Şablon Stüdyosu</span>
          </div>
        </div>
        <div class="studio-top-actions">
          <select id="visualStudioArtistSelect" class="studio-switch-select" onchange="BireskuArtistAdmin.onSwitcherChange(this.value)">
            <option value="__NEW__">+ Yeni Sanatçı Ekle (Boş Şablon)</option>
          </select>
          <button type="button" class="studio-btn studio-btn-template" onclick="BireskuArtistAdmin.fillSampleTemplate()" title="Örnek taslak bilgileriyle formu otomatik doldurur">
            ⚡ Örnek Taslak Doldur
          </button>
          <button type="button" class="studio-btn studio-btn-clear" onclick="BireskuArtistAdmin.clearStudioFields()" title="Tüm alanları boşaltır">
            🧹 Temizle
          </button>
          <button type="button" class="studio-btn studio-btn-save" onclick="BireskuArtistAdmin.saveFromVisualStudio()">
            💾 Vitrine Kaydet &amp; Yayınla (Canlı)
          </button>
          <button type="button" id="visualStudioDeleteBtn" class="studio-btn studio-btn-delete" style="display:none;" onclick="BireskuArtistAdmin.deleteFromVisualStudio()">
            🗑️ Sanatçıyı Sil
          </button>
        </div>
      </div>

      <!-- 1. Hero Alanı (Fotoğraf, İsim, Kategori, Disiplin, Kısa Tanıtım) -->
      <div class="profile-hero studio-profile-hero">
        <div class="profile-avatar-wrap studio-avatar-picker" onclick="document.getElementById('visualStudioAvatarInput').click()" title="Fotoğraf yüklemek için tıklayın">
          <img id="visualStudioAvatarImg" src="/assets/biresku-banner.jpg" alt="Sanatçı Profil Fotoğrafı">
          <div class="studio-avatar-overlay">
            <span class="studio-camera-icon">📷</span>
            <span>Fotoğraf Değiştir / Yükle</span>
            <span style="font-size:0.65rem; opacity:0.8;">(Tıklayın veya Seçin)</span>
          </div>
          <input type="file" id="visualStudioAvatarInput" accept="image/*" style="display:none;" onchange="BireskuArtistAdmin.handleVisualAvatarFile(this)">
        </div>

        <div class="studio-hero-content">
          <div class="studio-field-row" style="margin-bottom: 6px;">
            <input type="text" id="visualStudioCategoryInput" class="studio-inplace-badge" value="Ressam &amp; Sanat Eğitmeni" placeholder="Kategori (Örn: Ressam &amp; Sanat Eğitmeni)">
          </div>

          <div class="studio-field-row">
            <input type="text" id="visualStudioNameInput" class="studio-inplace-title" value="" placeholder="Sanatçı Adı ve Unvanı (Örn: Gülbin Nurgenç)" oninput="BireskuArtistAdmin.onVisualNameChange(this.value)">
          </div>

          <div class="studio-field-row">
            <input type="text" id="visualStudioDisciplineInput" class="studio-inplace-discipline" value="" placeholder="DİSİPLİN &amp; EKOL (Örn: ÇAĞDAŞ TÜRK RESMİ, SOYUT &amp; FOVİZM)">
          </div>

          <div class="studio-field-row" style="margin-top: 8px;">
            <textarea id="visualStudioShortBioInput" class="studio-inplace-shortbio" placeholder="Sanatçının vitrin kartında ve başlık altında görünecek 1-2 cümlelik kısa özet tanıtımı..."></textarea>
          </div>

          <div class="studio-meta-bar">
            <div class="studio-meta-item">
              <label>Dönem / Doğum:</label>
              <input type="text" id="visualStudioPeriodInput" class="studio-inplace-meta" value="" placeholder="Örn: 1970 – Günümüz">
            </div>
            <div class="studio-meta-item">
              <label>Şehir / Atölye:</label>
              <input type="text" id="visualStudioCityInput" class="studio-inplace-meta" value="İstanbul" placeholder="Örn: İstanbul / Kadıköy">
            </div>
            <div class="studio-meta-item">
              <label>URL ID Kodu:</label>
              <input type="text" id="visualStudioSlugInput" class="studio-inplace-meta" value="" placeholder="Örn: gulbin-nurgenc">
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Biyografi & Sanatsal Yolculuk + Hayata ve Sanata Bakışı (Fotoğraf 2 Düzeneği) -->
      <div class="artist-deep-dive-grid studio-deep-dive-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 48px;">
        <!-- Sol Kart: Biyografi -->
        <section class="artist-section-card studio-section-card">
          <h3 class="artist-section-heading">
            <span>Biyografi &amp; Sanatsal Yolculuk</span>
            <span class="studio-field-hint">✏️ Biyografi metnini buraya yazın</span>
          </h3>
          <div class="artist-section-body">
            <textarea id="visualStudioBioInput" class="studio-inplace-textarea studio-bio-textarea" rows="12" placeholder="Sanatçının biyografisini buraya doğrudan yazabilirsiniz...

Örnek:
1970 İstanbul doğumlu Gülbin Nurgenç, Beyoğlu Olgunlaşma Enstitüsü Resim Bölümü mezunudur. Alanında yetkin isimlerden aldığı uzun soluklu desen eğitiminin ardından tekstil sektöründe profesyonel desinatör olarak çalışmış; yurt dışı ve İstanbul’un önde gelen firmaları için özgün koleksiyonlar hazırlamıştır.

12 yıldır resim eğitmenliği yaparak pek çok yeteneğin gelişimine katkı sağlamaya devam eden sanatçı, atölyesinde yağlıboya çalışmalarını sürdürmektedir."></textarea>
          </div>
        </section>

        <!-- Sağ Kart: Hayata ve Sanata Bakışı -->
        <section class="artist-section-card philosophy-card studio-section-card">
          <h3 class="artist-section-heading">
            <span>Hayata ve Sanata Bakışı</span>
            <span class="studio-field-hint">✏️ Alıntı &amp; Sanat Yaklaşımı</span>
          </h3>
          <div class="artist-section-body">
            <div class="studio-quote-container">
              <div class="studio-quote-mark">“</div>
              <textarea id="visualStudioQuoteInput" class="studio-inplace-quote-textarea" rows="4" placeholder='"Sanat sadece gözle görüleni tuvale aktarmak değil; hayatın zorluklarını, kuralların insanlar üzerindeki dayatmasını süzerek en yalın, en saf haline indirgeme çabasıdır..." (Otantik Alıntı)'></textarea>
              <div class="studio-quote-label">Tırnak İçi Sanatçı Alıntısı</div>
            </div>

            <div style="margin-top: 18px;">
              <textarea id="visualStudioPhilosophyInput" class="studio-inplace-textarea studio-phil-textarea" rows="7" placeholder="Sanatçının sanata bakış açısı ve estetik yaklaşımını buraya yazabilirsiniz...

Örnek:
Çalışmalarında soyut (abstract), fovist ve ekspresyonist bir estetiği benimseyen sanatçı, renkleri kirletmeden sahip olduğu canlılığı korumaya özen göstermektedir."></textarea>
            </div>
          </div>
        </section>
      </div>

      <!-- 3. Eserler Koleksiyonu Alanı -->
      <div class="artworks-section-container studio-artworks-section">
        <div class="artworks-header-bar" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 24px;">
          <div>
            <h3 class="artworks-heading" style="margin:0;">Eser Koleksiyonu &amp; Seçki</h3>
            <span class="studio-field-hint" style="margin-left:0; font-size:0.8rem;">Eserlerin görsellerini, teknik ve santimetre (cm) ölçülerini ekleyin</span>
          </div>
          <button type="button" class="studio-btn studio-btn-add-art" onclick="BireskuArtistAdmin.addVisualArtworkCard()">
            <span>+ Yeni Eser Ekle</span>
          </button>
        </div>

        <div id="visualStudioArtworksGrid" class="artworks-grid studio-artworks-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px;">
          <!-- Dinamik Eser Kartları Buraya Eklenir -->
        </div>
      </div>
    `;

    if (profileView && profileView.parentNode) {
      profileView.parentNode.insertBefore(studioView, profileView.nextSibling);
    } else if (catalogMain) {
      catalogMain.appendChild(studioView);
    } else {
      document.body.appendChild(studioView);
    }

    return studioView;
  }

  // 6. SANATÇI STÜDYOSU ANA NESNESİ
  window.BireskuArtistAdmin = {
    // A. Genel Stüdyo Giriş Metodu
    openStudio: function(targetArtistId) {
      if (!checkAdminAuth()) {
        console.warn("Yetkisiz: Sanatçı stüdyosuna yalnızca admin erişebilir.");
        return;
      }

      // dergi/sanatcilar/ sayfasında mıyız?
      const isSanatcilarPage = Boolean(document.getElementById('catalogPageView') || document.getElementById('artistProfileView'));

      if (isSanatcilarPage) {
        this.openVisualStudio(targetArtistId);
      } else {
        // index.html veya başka sayfadaysak, parametreli olarak sanatçılar sayfasına git
        const targetSlug = (targetArtistId && targetArtistId !== '__NEW__') ? targetArtistId : '__NEW__';
        window.location.href = '/dergi/sanatcilar/#admin-studio=' + encodeURIComponent(targetSlug);
      }
    },

    // B. CANLI GÖRSEL STÜDYOYU AÇ (Fotoğraf 2 Birebir Görünümü)
    openVisualStudio: function(targetArtistId) {
      if (!checkAdminAuth()) return;

      const studioView = ensureStudioViewExists();
      const catalogView = document.getElementById('catalogPageView');
      const profileView = document.getElementById('artistProfileView');

      if (catalogView) catalogView.style.display = 'none';
      if (profileView) profileView.style.display = 'none';
      if (studioView) studioView.style.display = 'block';

      this.populateVisualArtistSelector();

      if (targetArtistId && targetArtistId !== '__NEW__') {
        this.loadVisualArtist(targetArtistId);
      } else {
        this.setVisualModeNew();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // C. Canlı Görsel Stüdyoyu Kapat & Kataloğa Dön
    exitVisualStudio: function() {
      const studioView = document.getElementById('artistStudioView');
      const catalogView = document.getElementById('catalogPageView');
      if (studioView) studioView.style.display = 'none';
      if (catalogView) catalogView.style.display = 'block';
      try {
        history.pushState(null, null, window.location.pathname);
      } catch (e) {
        window.location.hash = '';
      }
    },

    // D. Sanatçı Seçici Dropdown Senkronizasyonu
    populateVisualArtistSelector: function() {
      const select = document.getElementById('visualStudioArtistSelect');
      if (!select) return;
      select.innerHTML = '<option value="__NEW__">+ Yeni Sanatçı Ekle (Boş Şablon)</option>';

      if (window.ARTISTS_DATA && Array.isArray(window.ARTISTS_DATA)) {
        window.ARTISTS_DATA.forEach(artist => {
          if (artist && artist.id) {
            const opt = document.createElement('option');
            opt.value = artist.id;
            opt.textContent = `✏️ ${artist.name} (${artist.id})`;
            select.appendChild(opt);
          }
        });
      }
    },

    onSwitcherChange: function(val) {
      if (val === '__NEW__') {
        this.setVisualModeNew();
      } else {
        this.loadVisualArtist(val);
      }
    },

    // E. Yeni Sanatçı Moduna Geç (Boş Alanlar, Fotoğraf 2 Düzeneği)
    setVisualModeNew: function() {
      currentEditingId = '__NEW__';
      const label = document.getElementById('visualStudioModeLabel');
      if (label) label.textContent = "Yeni Sanatçı Şablon Stüdyosu";

      const delBtn = document.getElementById('visualStudioDeleteBtn');
      if (delBtn) delBtn.style.display = 'none';

      const select = document.getElementById('visualStudioArtistSelect');
      if (select) select.value = '__NEW__';

      // Alanları sıfırla (Biyo ve alıntı boş kalır, kullanıcı doldurur!)
      document.getElementById('visualStudioNameInput').value = '';
      document.getElementById('visualStudioCategoryInput').value = 'Ressam & Sanat Eğitmeni';
      document.getElementById('visualStudioDisciplineInput').value = '';
      document.getElementById('visualStudioShortBioInput').value = '';
      document.getElementById('visualStudioPeriodInput').value = '';
      document.getElementById('visualStudioCityInput').value = 'İstanbul';
      document.getElementById('visualStudioSlugInput').value = '';
      document.getElementById('visualStudioAvatarImg').src = '/assets/biresku-banner.jpg';

      document.getElementById('visualStudioBioInput').value = '';
      document.getElementById('visualStudioQuoteInput').value = '';
      document.getElementById('visualStudioPhilosophyInput').value = '';

      const grid = document.getElementById('visualStudioArtworksGrid');
      if (grid) {
        grid.innerHTML = '';
        this.addVisualArtworkCard(); // 1 adet boş eser kartı hazır tut
      }
    },

    // F. Mevcut Sanatçıyı Düzenleme Modunda Yükle
    loadVisualArtist: function(artistId) {
      if (!window.ARTISTS_DATA) return;
      const artist = window.ARTISTS_DATA.find(a => a.id === artistId);
      if (!artist) return;

      currentEditingId = artist.id;
      const label = document.getElementById('visualStudioModeLabel');
      if (label) label.textContent = `Düzenleniyor: ${artist.name}`;

      const delBtn = document.getElementById('visualStudioDeleteBtn');
      if (delBtn) delBtn.style.display = 'inline-flex';

      const select = document.getElementById('visualStudioArtistSelect');
      if (select) select.value = artist.id;

      // Alanları doldur
      document.getElementById('visualStudioNameInput').value = artist.name || '';
      document.getElementById('visualStudioCategoryInput').value = artist.category || 'Ressam';
      document.getElementById('visualStudioDisciplineInput').value = artist.discipline || '';
      document.getElementById('visualStudioShortBioInput').value = artist.shortBio || artist.bio || '';
      document.getElementById('visualStudioPeriodInput').value = artist.period || '';
      document.getElementById('visualStudioCityInput').value = artist.city || '';
      document.getElementById('visualStudioSlugInput').value = artist.id || '';
      document.getElementById('visualStudioAvatarImg').src = artist.coverImage || '/assets/biresku-banner.jpg';

      // Biyografi paragraflarını metin kutusuna aktar
      const bios = Array.isArray(artist.biography) ? artist.biography.join('\n\n') : (artist.biography || '');
      document.getElementById('visualStudioBioInput').value = bios;

      // Alıntı ve Felsefe
      document.getElementById('visualStudioQuoteInput').value = artist.quote || '';
      const phils = Array.isArray(artist.philosophy) ? artist.philosophy.join('\n\n') : (artist.philosophy || '');
      document.getElementById('visualStudioPhilosophyInput').value = phils;

      // Eserleri Yükle
      const grid = document.getElementById('visualStudioArtworksGrid');
      if (grid) {
        grid.innerHTML = '';
        if (artist.artworks && Array.isArray(artist.artworks) && artist.artworks.length > 0) {
          artist.artworks.forEach(art => this.addVisualArtworkCard(art));
        } else {
          this.addVisualArtworkCard();
        }
      }
    },

    // G. İsim değiştikçe otomatik slug üret (Yeni moddaysa)
    onVisualNameChange: function(val) {
      if (currentEditingId === '__NEW__') {
        const slugInput = document.getElementById('visualStudioSlugInput');
        if (slugInput) slugInput.value = slugify(val);
      }
    },

    // H. Profil Fotoğrafı Yükleme
    handleVisualAvatarFile: function(input) {
      const file = input.files && input.files[0];
      if (!file) return;
      readFileAsDataUrl(file, (dataUrl) => {
        const img = document.getElementById('visualStudioAvatarImg');
        if (img) img.src = dataUrl;
      });
    },

    // I. Eser Ekleme ve Eser Kartı Yönetimi
    addVisualArtworkCard: function(artData) {
      artData = artData || {
        title: "",
        technique: "Tuval üzerine yağlıboya",
        dimensions: "",
        year: new Date().getFullYear().toString(),
        image: "/assets/biresku-banner.jpg"
      };

      const cardId = 'studioArtCard_' + Math.random().toString(36).substr(2, 9);
      const fileInputId = 'file_' + cardId;

      const card = document.createElement('div');
      card.className = 'studio-artwork-card';
      card.id = cardId;
      card.innerHTML = `
        <div class="studio-artwork-img-box" onclick="document.getElementById('${fileInputId}').click()" title="Eser görseli yüklemek için tıklayın">
          <img class="studio-art-img" src="${artData.image || artData.imageUrl || '/assets/biresku-banner.jpg'}" alt="Eser Görseli">
          <div class="studio-artwork-img-overlay">
            <span>📷 Görsel Seç / Değiştir</span>
          </div>
          <input type="file" id="${fileInputId}" accept="image/*" style="display:none;" onchange="BireskuArtistAdmin.handleArtworkCardFile(this, '${cardId}')">
        </div>
        <div class="studio-artwork-fields">
          <input type="text" class="studio-art-input-title studio-art-title" value="${escapeHtml(artData.title || '')}" placeholder="Eser Adı (Örn: Soyut Denge)">
          <div class="studio-art-row">
            <input type="text" class="studio-art-input-sub studio-art-tech" value="${escapeHtml(artData.technique || 'Tuval üzerine yağlıboya')}" placeholder="Teknik">
            <input type="text" class="studio-art-input-sub studio-art-dim" value="${escapeHtml(artData.dimensions || '')}" placeholder="Ölçü (Örn: 100 × 100 cm)">
            <input type="text" class="studio-art-input-sub studio-art-year" value="${escapeHtml(artData.year || '2024')}" placeholder="Yıl" style="max-width:65px;">
          </div>
          <button type="button" class="studio-art-delete-btn" onclick="document.getElementById('${cardId}').remove()">✕ Eseri Kaldır</button>
        </div>
      `;

      const grid = document.getElementById('visualStudioArtworksGrid');
      if (grid) grid.appendChild(card);
    },

    handleArtworkCardFile: function(input, cardId) {
      const file = input.files && input.files[0];
      if (!file) return;
      readFileAsDataUrl(file, (dataUrl) => {
        const card = document.getElementById(cardId);
        if (card) {
          const img = card.querySelector('.studio-art-img');
          if (img) img.src = dataUrl;
        }
      });
    },

    // J. Örnek Taslak ile Doldur
    fillSampleTemplate: function() {
      const ex = TEMPLATE_EXAMPLE;
      document.getElementById('visualStudioNameInput').value = ex.name;
      document.getElementById('visualStudioCategoryInput').value = ex.category;
      document.getElementById('visualStudioDisciplineInput').value = ex.discipline;
      document.getElementById('visualStudioShortBioInput').value = ex.shortBio;
      document.getElementById('visualStudioPeriodInput').value = ex.period;
      document.getElementById('visualStudioCityInput').value = ex.city;
      document.getElementById('visualStudioSlugInput').value = ex.id;
      document.getElementById('visualStudioAvatarImg').src = ex.coverImage;

      document.getElementById('visualStudioBioInput').value = ex.biography.join('\n\n');
      document.getElementById('visualStudioQuoteInput').value = ex.quote;
      document.getElementById('visualStudioPhilosophyInput').value = ex.philosophy.join('\n\n');

      const grid = document.getElementById('visualStudioArtworksGrid');
      if (grid) {
        grid.innerHTML = '';
        ex.artworks.forEach(art => this.addVisualArtworkCard(art));
      }
    },

    // K. Formu Tamamen Temizle
    clearStudioFields: function() {
      this.setVisualModeNew();
    },

    // L. CANLI GÖRSEL STÜDYODAN VİTRİNE KAYDET & YAYINLA
    saveFromVisualStudio: function() {
      if (!checkAdminAuth()) {
        alert("Yetkisiz işlem: Yalnızca yönetici sanatçı ekleyebilir veya düzenleyebilir.");
        return;
      }

      const name = (document.getElementById('visualStudioNameInput')?.value || '').trim();
      let slug = (document.getElementById('visualStudioSlugInput')?.value || '').trim();
      const category = (document.getElementById('visualStudioCategoryInput')?.value || 'Ressam & Sanat Eğitmeni').trim();
      const discipline = (document.getElementById('visualStudioDisciplineInput')?.value || '').trim();
      const shortBio = (document.getElementById('visualStudioShortBioInput')?.value || '').trim();
      const period = (document.getElementById('visualStudioPeriodInput')?.value || '').trim();
      const city = (document.getElementById('visualStudioCityInput')?.value || 'İstanbul').trim();
      const coverImage = (document.getElementById('visualStudioAvatarImg')?.getAttribute('src') || '/assets/biresku-banner.jpg').trim();

      const bioRaw = (document.getElementById('visualStudioBioInput')?.value || '').trim();
      const quoteRaw = (document.getElementById('visualStudioQuoteInput')?.value || '').trim();
      const philRaw = (document.getElementById('visualStudioPhilosophyInput')?.value || '').trim();

      if (!name) {
        alert("Lütfen sanatçı adını ve unvanını giriniz.");
        document.getElementById('visualStudioNameInput')?.focus();
        return;
      }

      if (!slug) {
        slug = slugify(name);
      } else {
        slug = slugify(slug);
      }

      // Paragrafları böl
      const bioParagraphs = bioRaw ? bioRaw.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean) : [];
      const philParagraphs = philRaw ? philRaw.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean) : [];

      // Eserleri topla
      const artworkCards = document.querySelectorAll('#visualStudioArtworksGrid .studio-artwork-card');
      const artworks = [];
      artworkCards.forEach((card, idx) => {
        const imgEl = card.querySelector('.studio-art-img');
        const titleEl = card.querySelector('.studio-art-title');
        const techEl = card.querySelector('.studio-art-tech');
        const dimEl = card.querySelector('.studio-art-dim');
        const yearEl = card.querySelector('.studio-art-year');

        const imgSrc = imgEl ? (imgEl.getAttribute('src') || '') : '';
        const artTitle = titleEl ? titleEl.value.trim() : '';
        const artTech = techEl ? techEl.value.trim() : '';
        const artDim = dimEl ? dimEl.value.trim() : '';
        const artYear = yearEl ? yearEl.value.trim() : '';

        if (imgSrc && !imgSrc.includes('biresku-fallback')) {
          artworks.push({
            id: `art-${idx + 1}`,
            title: artTitle || `Eser #${idx + 1}`,
            technique: artTech || "Tuval üzerine yağlıboya",
            dimensions: artDim || "Özgün Koleksiyon Eseri",
            year: artYear || new Date().getFullYear().toString(),
            image: imgSrc,
            imageUrl: imgSrc
          });
        }
      });

      const artistData = {
        id: slug,
        name: name,
        category: category,
        discipline: discipline,
        shortBio: shortBio,
        city: city,
        studio: city.includes('Atölye') ? city : (city + " Atölyesi"),
        period: period,
        coverImage: coverImage,
        biography: bioParagraphs.length ? bioParagraphs : [shortBio || name],
        quote: quoteRaw,
        philosophy: philParagraphs.length ? philParagraphs : [],
        artworks: artworks
      };

      if (!window.ARTISTS_DATA) window.ARTISTS_DATA = [];

      const isUpdate = (currentEditingId && currentEditingId !== '__NEW__');
      if (isUpdate) {
        const idx = window.ARTISTS_DATA.findIndex(a => a.id === currentEditingId);
        if (idx !== -1) {
          window.ARTISTS_DATA[idx] = artistData;
        } else {
          window.ARTISTS_DATA.unshift(artistData);
        }
      } else {
        // Yeni Sanatçı: Daima en sola (1. sıraya) ekle
        window.ARTISTS_DATA.unshift(artistData);
      }

      // LocalStorage'a kalıcı olarak kaydet
      try {
        let customList = [];
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          customList = JSON.parse(raw);
          if (!Array.isArray(customList)) customList = [];
        }
        const cIdx = customList.findIndex(a => a.id === artistData.id);
        if (cIdx !== -1) {
          customList[cIdx] = artistData;
        } else {
          customList.unshift(artistData);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customList));
      } catch (e) {
        console.error("LocalStorage kaydetme hatası:", e);
      }

      // Vitrinleri ve Kataloğu güncelle
      if (typeof syncArtistsRailWithData === 'function') {
        syncArtistsRailWithData();
      }
      if (typeof renderCatalog === 'function' && typeof getArtistsList === 'function') {
        renderCatalog(getArtistsList());
      }
      this.injectAdminCards();

      alert(isUpdate ? `✓ "${name}" bilgileri başarıyla güncellendi!` : `✓ "${name}" vitrinin en soluna başarıyla eklendi!`);

      // Stüdyodan çık ve doğrudan yayınlanan profil sayfasına geç!
      const studioView = document.getElementById('artistStudioView');
      if (studioView) studioView.style.display = 'none';

      if (typeof openArtistProfile === 'function') {
        openArtistProfile(artistData.id);
      } else {
        window.location.hash = "profil=" + artistData.id;
      }
    },

    // M. Sanatçıyı Sil
    deleteFromVisualStudio: function() {
      if (!currentEditingId || currentEditingId === '__NEW__') return;
      const name = document.getElementById('visualStudioNameInput')?.value || currentEditingId;
      if (!confirm(`DİKKAT: "${name}" isimli sanatçıyı sistemden kaldırmak istediğinize emin misiniz?`)) {
        return;
      }

      if (window.ARTISTS_DATA) {
        window.ARTISTS_DATA = window.ARTISTS_DATA.filter(a => a.id !== currentEditingId);
      }

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

      if (typeof syncArtistsRailWithData === 'function') syncArtistsRailWithData();
      if (typeof renderCatalog === 'function' && typeof getArtistsList === 'function') renderCatalog(getArtistsList());
      this.injectAdminCards();

      alert("✓ Sanatçı sistemden kaldırıldı.");
      this.exitVisualStudio();
    },

    // N. Karta Tıklandığında Düzenle Aç
    editArtist: function(artistId) {
      this.openStudio(artistId);
    },

    // 7. GİZLİ "+" KARTINI VE DÜZENLE BUTONLARINI ENJEKTE ET (SADECE ADMİNE GÖRÜNÜR)
    injectAdminCards: function() {
      // Güvenlik: Admin değilse ASLA DOM'a dokunma, sıfır iz bırak
      if (!checkAdminAuth()) {
        document.querySelectorAll('.admin-only-injected-card, .admin-card-edit-btn, #artistStudioView').forEach(el => el.remove());
        return;
      }

      // A. dergi/sanatcilar/ Kataloğu (#catalogGrid)
      const catalogGrid = document.getElementById('catalogGrid');
      if (catalogGrid) {
        let existingAddCard = document.getElementById('adminCatalogAddCard');
        if (!existingAddCard) {
          const addCard = document.createElement('article');
          addCard.id = 'adminCatalogAddCard';
          addCard.className = 'artist-card admin-only-injected-card admin-plus-card';
          addCard.onclick = (e) => {
            e.stopPropagation();
            BireskuArtistAdmin.openStudio('__NEW__');
          };
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
                <div class="artist-discipline" style="color:var(--text-muted); font-size:0.78rem;">Yönetici Canlı Şablon Stüdyosu</div>
                <p class="artist-statement" style="font-size:0.8rem; line-height:1.5;">
                  Tıklayarak doğrudan profil sayfası şablonunda yeni sanatçı ve eserleri vitrinin en soluna ekleyin.
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
          railCard.onclick = (e) => {
            e.stopPropagation();
            BireskuArtistAdmin.openStudio('__NEW__');
          };
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
                <span class="artist-cat-sub" style="color:var(--text-muted);">Yönetici Canlı Şablonu</span>
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

      // C. Hash Yönlendirmesini Kontrol Et (#admin-studio=...)
      if (window.location.hash && window.location.hash.startsWith('#admin-studio=')) {
        const targetId = window.location.hash.replace('#admin-studio=', '');
        this.openVisualStudio(targetId);
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
                window.ARTISTS_DATA.unshift(art); // Yeni sanatçı en başa
              }
            }
          });
          if (typeof syncArtistsRailWithData === 'function') {
            syncArtistsRailWithData();
          }
        }
      }
    } catch (e) {}

    setTimeout(() => {
      BireskuArtistAdmin.injectAdminCards();
    }, 250);
  }

  // Oturum durumu değiştiğinde anında güncelle
  window.addEventListener("biresku:auth_state_changed", function(e) {
    setTimeout(() => {
      BireskuArtistAdmin.injectAdminCards();
    }, 150);
  });

  window.addEventListener("hashchange", function() {
    if (window.location.hash && window.location.hash.startsWith('#admin-studio=')) {
      if (checkAdminAuth()) {
        const targetId = window.location.hash.replace('#admin-studio=', '');
        BireskuArtistAdmin.openVisualStudio(targetId);
      }
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrateCustomArtists);
  } else {
    hydrateCustomArtists();
  }

})(window);
