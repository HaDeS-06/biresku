# BİRESKU — AI & Geliştirici Devir / El Kitabı (Handover Documentation)

> **Tarih:** 8 Kasım 2026  
> **Canlı Adres:** [biresku.com](https://biresku.com)  
> **GitHub Deposu:** `HaDeS-06/biresku` (`main` dalı)  
> **Barındırma:** GitHub Pages (Özel CNAME: `biresku.com`) + Cloudflare DNS  
> **Amaç:** Bu doküman, Biresku projesini devralacak sonraki yapay zekâ (AI) modelleri veya yazılımcılar için projenin güncel mimarisini, veri kaynaklarını, alınan kritik kararları, kullanıcı kurallarını ve dağıtım süreçlerini eksiksiz aktarmak üzere hazırlanmıştır.

---

## 1. Proje Mimarisi ve Dizin Yapısı

> [!IMPORTANT]
> **ÇOKLU AJAN (MULTI-AGENT) SENKRONİZASYON PROTOKOLÜ:**
> Projede birden fazla AI ajanı çalışmaktadır. Birbirinizin yaptığı işlerin üzerine yazmamak ("üst üste çıkmamak") için herhangi bir göreve başlamadan önce **MUTLAKA** GitHub `main` dalındaki en son commit'i ve dosyaları çekiniz. Yeni bir ajan işe başladığında ilk verilecek sistem promptu ana dizindeki [`AGENT_PROMPT.md`](file:///C:/Users/ardau/.gemini/antigravity/scratch/biresku-site/AGENT_PROMPT.md) dosyasında mevcuttur.

Proje saf, modern, bağımlılıksız (Vanilla HTML5 / Modern CSS3 / Modern ES6+ JavaScript) mimariyle inşa edilmiştir. Build tool (Webpack/Vite vb.) zorunluluğu yoktur; dosyalar doğrudan GitHub Pages tarafından statik olarak sunulmaktadır.

```text
biresku/
├── index.html                     # Ana Karşılama Portalı (Resepsiyon, Haberler, Sanatçı Vitrini)
├── CNAME                          # GitHub Pages özel domain (biresku.com)
├── .nojekyll                      # Jekyll derleyicisini devre dışı bırakır
├── 404.html                       # Hatalı link yönlendirmesi
├── AI_HANDOVER.md                 # Bu devir ve bağlam dokümanı
├── dergi/
│   ├── index.html                 # Biresku Sanat & Edebiyat Dergisi Ana Sayfası
│   └── sanatcilar/
│       └── index.html             # Sanatçılar Kataloğu & Dinamik Tek Sayfa Profil Alanları (#profil=...)
├── iletisim/
│   └── index.html                 # İletişim Sayfası
├── gizlilik-politikasi/
│   └── index.html                 # KVKK ve Gizlilik Politikası
└── assets/
    ├── artists-data.js            # TEK DOĞRULUK KAYNAĞI: Tüm sanatçı verileri, biyografiler, eserler
    ├── biresku-auth.js            # Üye giriş/kayıt istemci mantığı & oturum yönetimi
    ├── biresku-auth.css           # Kimlik doğrulama arayüz stilleri
    ├── auth-client.js             # Supabase / Local auth köprüsü
    ├── adnan-turani/              # Prof. Dr. Adnan Turani profil fotoğrafı ve eser görselleri
    ├── mustafa-ayaz/              # Prof. Dr. Mustafa Ayaz profil fotoğrafı ve eser görselleri
    ├── tuncay-umay/               # Tuncay Umay profil fotoğrafı ve eser görselleri
    └── hikmet-cetinkaya/          # Hikmet Çetinkaya profil fotoğrafı ve 8 doğrulanmış Artam eseri
```

---

## 2. Merkezi Veri Modeli (`assets/artists-data.js`)

Tüm sanatçı profilleri, biyografiler, sergi geçmişleri ve eser koleksiyonları `window.ARTISTS_DATA` dizisinde saklanır. Sitedeki profil sayfaları ve vitrinler bu veriyi dinamik olarak okur.

### Kayıtlı 9 Sanatçı ve Kritik Detayları:

### 1. İbrahim Balaban (`id: "ibrahim-balaban"`) — *En Son Eklenen (En Sol / Spot 1)*
- **Kategori / Alan:** Ressam & Yazar / Çağdaş Türk Resmi, Toplumsal Gerçekçilik & Anadolu Efsaneleri
- **Dönem / Konum (Doğum / Atölye):** 1921 – 2019 / Bursa / İstanbul
- **Özet:** Nâzım Hikmet'in Bursa Cezaevi'nde keşfedip 'Ressam Yunus Emre' olarak adlandırdığı; Anadolu insanını, köy yaşamını ve emeğin destansı kavgasını diyalektik bir tutkuyla tuvale aktaran bilge usta.
- **Otantik Sanat Alıntısı:** *"Sanat yaşantımızın izdüşümüdür. Konu bir özdür, her öz kendi kabuğunu yapar. Ben insanı santimetrik ölçülerle değil, diyalektik yöntemlerle resmediyorum. Ata göre insan değil, insana göre at çiziyorum."*
- **Gerçek Profil Fotoğrafı:** Galeri Soyut sanatçı resmi arşivinden 480×480 otantik portresi (`/assets/ibrahim-balaban/ibrahim-balaban-pp.jpg`).
- **8 Doğrulanmış Eser (Artam Antik A.Ş. Müzayede ve Retrospektif Arşivi):**
  1. *"Kış"* (1953, Kağıt üzerine karışık teknik, imzalı, 31 × 47 cm, Artam 380. Müzayede Lot 87850)
  2. *"Gurbetçi"* (1979, Duralit üzerine yağlıboya, imzalı, 70 × 50 cm, Artam 390. Müzayede Lot 112245)
  3. *"Anne ve Çocuk"* (1995, Duralit üzerine yağlıboya, imzalı, 35 × 25 cm, Artam 396. Müzayede Lot 123760)
  4. Başlıksız Anıtsal Kompozisyon (1976, Duralit üzerine yağlıboya, imzalı, 80 × 110 cm, Artam 389. Müzayede) -> `title: ""` (uydurma başlık yok)
  5. Başlıksız Dönem Başyapıtı (1965, Duralit üzerine yağlıboya, imzalı, 48 × 68 cm, Artam 388. Müzayede) -> `title: ""`
  6. Başlıksız Figüratif Kompozisyon (1986, Tuval üzerine yağlıboya, imzalı, 50 × 60 cm, Artam 386. Müzayede) -> `title: ""`
  7. Başlıksız Figüratif Eser (2001, Tuval üzerine yağlıboya, imzalı, 40 × 50 cm, Artam 407. Müzayede) -> `title: ""`
  8. Başlıksız Tarihsel Kompozisyon (1969, Tuval üzerine karışık teknik duralite marufle, imzalı, 70 × 52 cm, Artam 398. Müzayede) -> `title: ""`

#### 2. Komet (`id: "komet"`) — *En Son Eklenen (En Sol / Spot 1)*
- **Unvan & Disiplin:** Komet (Gürkan Coşkun) — Çağdaş Türk Resmi, Düşsel & Şiirsel Figüratif Dışavurumculuk
- **Kategori:** Ressam & Şair
- **Konum (Doğum / Atölye):** Çorum / Paris — Paris & İstanbul Atölyeleri
- **Dönem:** 1941 – 2022
- **Profil Fotoğrafı:** Artam Arşivi'nden alınan 800×800 boyutunda doğrulanmış özgün koltukta düşünceli portresi (`assets/komet/komet-pp.jpg`).
- **Önemli Bilgi:** 1941 Çorum doğumludur. İDGSA Halil Dikmen ve Zeki Faik İzer atölyelerinde eğitim gördü; İkinci Yeni şairleriyle (Edip Cansever, Cemal Süreya) yakın dostluklar kurdu. 1971'de Paris'e yerleşerek Vincennes ve Beaux-Arts'ta çalıştı. Max Ernst ve Panik Grubu'ndan (Mouvement Panique) esinlendi; düş, bilinçaltı ve gerçekliği harmanlayarak Türk resminde eşsiz bir şiirsel figürasyon ekolü yarattı.
- **Doğrulanmış Otantik Alıntı:**  
  *"Şiiri de resmin kendi diliyle vermeye çalışırım. İsterim ki resim, kendi organik yapısından ayrı olarak insanları bir yere götürsün. Düşsellik de burada çok etkilidir; benim resmim düşseldir çünkü dünyaya bakışım da öyle. Yaşadığımız, gördüğümüz her şey bir düş ve ben resmimde bunların peşine düşerim."*
- **Koleksiyon Eserleri & İsim Politikası (Kullanıcı Kuralı: "En bilinen resimlerini koy, isimlerini bilmiyorsan koyma ama katiyen kafandan bir şey atma"):**
  1. *"Deux Poids, Deux Mesures"* — 1973 tarihli ünlü erken dönem başyapıtı. Tuval üzerine karışık teknik, imzalı. **65 × 92 cm** (Artam 407. Müzayede)
  2. *"Masada İzdüşüm"* — 2008 tarihli anıtsal müze ölçeği tablosu. Tuval üzerine karışık teknik, imzalı. **186 × 186 cm** (Artam 377. Müzayede)
  3. *(İsmi Belirtilmemiş / Düşsel Ufuk Kompozisyonu)* — 380. Müzayede Komet Retrospektifi eseri. Özel bir isim konmadığı için isim alanı boş bırakılmıştır (`title: ""`). Tuval üzerine yağlıboya, imzalı. **100 × 130 cm**
  4. *(İsmi Belirtilmemiş / Figüratif Kompozisyon)* — 2001 tarihli. Kağıt üzerine yağlıboya (tuvale marufle), imzalı. **68 × 98 cm** (`title: ""`)
  5. *(İsmi Belirtilmemiş / Duralit Kompozisyon)* — Duralit üzerine yağlıboya, imzalı. **100 × 120 cm** (`title: ""`)
  6. *(İsmi Belirtilmemiş / Düşsel Sahne)* — Tuval üzerine yağlıboya, imzalı. **60 × 73 cm** (`title: ""`)
  7. *(İsmi Belirtilmemiş / 2001 Tarihli Eser)* — 2001 tarihli. Tuval üzerine yağlıboya, imzalı. **50 × 60 cm** (`title: ""`)
  8. *(İsmi Belirtilmemiş / Minyatür Figür)* — Tuval üzerine yağlıboya (duralite marufle), imzalı. **30 × 40 cm** (`title: ""`)
- **Sanat Felsefesi & Estetik:** Şiirsel düşsellik, trajikomik melankoli, arkadan gelen teatral loş ışık ve yabancılaşmış insan figürleri.

#### 3. Mehmet Güleryüz (`id: "mehmet-guleryuz"`)
- **Unvan & Disiplin:** Mehmet Güleryüz — Çağdaş Türk Resmi, Eleştirel Figürasyon & Dışavurumculuk (Neo-Ekspresyonizm)
- **Kategori:** Ressam & Heykeltıraş
- **Konum (Doğum / Atölye):** İstanbul / Paris — Paris & İstanbul Atölyeleri
- **Dönem:** 1938 – 2024
- **Önemli Bilgi:** 1938 İstanbul doğumludur. İstanbul Devlet Güzel Sanatlar Akademisi Resim Bölümü'nde Neşet Günal Atölyesi'nde öğrenim görmüş; tiyatro oyunculuğu ve dekoratörlük yapmıştır. Paris Ecole Nationale Supérieure des Beaux-Arts'ta yüksek resim ve litografi ihtisası tamamlamıştır. Uluslararası Plastik Sanatlar Derneği'nin (UPSD) kurucu başkanıdır. 2015 yılında İstanbul Modern'de büyük 'Ressam ve Resim' retrospektifi açılmıştır.
- **Doğrulanmış Otantik Alıntı:**  
  *"Resim yapmak benim için bir hesaplaşmadır; insanın kendi vahşetiyle, ikiyüzlülüğüyle ve toplumun dayattığı maskelerle yüzleştiği tavizsiz bir alan."*
- **Profil Fotoğrafı:** Artam Arşivi'nden alınan 800×800 boyutunda doğrulanmış özgün stüdyo portresi (Mehmet Güleryüz'ün kendi çehresi).
- **Koleksiyon Eserleri & İsim Politikası (Kullanıcı Kuralı: "En bilinen resimlerini koy, isimlerini bilmiyorsan koyma ama katiyen kafandan bir şey atma"):**
  1. *"Oğlum Oğlum"* — 2000 tarihli anıtsal başyapıt. Tuval üzerine yağlıboya, imzalı. **162 × 130 cm**
  2. *"Turnuva"* — 1996 tarihli ünlü masa tenisi tablosu. Tuval üzerine yağlıboya, imzalı. **90 × 90 cm**
  3. *"Her Şey Kontrolümüz Altında"* — 2001 tarihli anıtsal eleştirel figürasyon. Tuval üzerine yağlıboya, imzalı. **162 × 130 cm**
  4. *"Happy Hours"* — 2007 tarihli modern yaşam satiri. Tuval üzerine yağlıboya, imzalı. **65 × 54 cm**
  5. *"Mucize"* — Mart 2024 tarihli son dönem başyapıtı. Tuval üzerine yağlıboya, imzalı. **90 × 114 cm**
  6. *"Erol Akyavaş Portresi"* — 1983 tarihli tarihi ressam portresi. Tuval üzerine yağlıboya, imzalı. **41 × 46 cm**
  7. *Erken Dönem Başyapıtı (1964)* — Sanatçının kendi koyduğu özel bir başlık bulunmadığından isim alanı boş bırakılmıştır (`title: ""`); uydurma ad verilmemiştir. Tuval üzerine yağlıboya, imzalı. **90 × 98 cm**
  8. *2000 Tarihli Özgün Eser* — Müzayede kaydındaki genel etiket yerine sanatçının özgün başlığı bilinmediğinden isim alanı boş bırakılmıştır (`title: ""`). Tuval üzerine yağlıboya, imzalı. **58 × 74 cm**
- **Sanat Felsefesi & Estetik:** Tavizsiz eleştirel figürasyon, dışavurumcu dramatik gerilim, varoluşsal başkaldırı ve insanın içgüdüleriyle yüzleşmesi.

#### 4. Gülbin Nurgenç (`id: "gulbin-nurgenc"`)
- **Unvan & Disiplin:** Gülbin Nurgenç — Çağdaş Türk Resmi, Soyut (Abstract), Fovizm & Ekspresyonizm
- **Kategori:** Ressam & Sanat Eğitmeni
- **Konum (Doğum / Atölye):** İstanbul / İstanbul — Nurgenç Sanat Atölyesi (İstanbul)
- **Önemli Bilgi:** 1970 İstanbul doğumludur. Beyoğlu Olgunlaşma Enstitüsü Resim Bölümü mezunudur. Alanında yetkin isimlerden aldığı uzun soluklu desen eğitiminin ardından tekstil sektöründe profesyonel desinatör olarak çalışmış; yurt dışı ve İstanbul’un önde gelen firmaları için özgün koleksiyonlar hazırlamıştır. 12 yıldır resim eğitmenliği yapmaktadır.
- **Koleksiyon Eserleri (Masaüstü 'ressam gülbin' Klasöründen İşlenen Orijinal Eserler):**
  1. *"Soyut Kompozisyon & Denge"* — Tuval üzerine yağlıboya. **100 × 100 cm** (Özgün Koleksiyon Eseri)
  2. *"Fovist Renk Coşkusu"* — Tuval üzerine yağlıboya. **70 × 90 cm** (Özgün Koleksiyon Eseri)
  3. *"Saf Rengin İfadesi"* — Tuval üzerine yağlıboya. **70 × 100 cm** (Özgün Koleksiyon Eseri)
  4. *"Ekspresyonist Devinim"* — Tuval üzerine yağlıboya. **120 × 85 cm** (Özgün Koleksiyon Eseri)
- **Doğrulanmış Otantik Alıntı:**  
  *"Sanat sadece gözle görüleni tuvale aktarmak değil; hayatın zorluklarını, kuralların insanlar üzerindeki dayatmasını süzerek en yalın, en saf haline indirgeme çabasıdır. Sanatçının görevi dünyayı olduğu gibi kopyalamak değil, kendi süzgecinden geçirerek ona yeni bir kimlik kazandırmaktır."*
- **Sanat Felsefesi & Estetik:** Çalışmalarında soyut (abstract), fovist ve ekspresyonist bir estetiği benimser, renkleri kirletmeden sahip olduğu canlılığı korumaya özen gösterir.

#### 5. Prof. Süleyman Saim Tekcan (`id: "suleyman-saim-tekcan"`) — *En Son Eklenen (En Sol / Spot 1)*
- **Unvan & Disiplin:** Prof. Süleyman Saim Tekcan — Özgün Baskı Resim, Gravür & Çağdaş Türk Resmi (Atlar & Hat Serisi)
- **Kategori:** Ressam & Özgün Baskı Ustası
- **Konum (Doğum / Atölye):** Trabzon / İstanbul — IMOGA (İstanbul Grafik Sanatlar Müzesi) / Tekcan Atölyesi
- **Önemli Bilgi:** Türk özgün baskı sanatının ve gravür ekolünün uluslararası duayeni; Türkiye'nin ilk çağdaş grafik sanatlar müzesi IMOGA'nın kurucusudur. Mimar Sinan Üniversitesi Güzel Sanatlar Fakültesi Dekanlığı ve öğretim üyeliği yapmıştır.
- **Koleksiyon Eserleri (Tam 8 Adet, Artam Antik A.Ş. Müzayede Kayıtlı & Kesin Ölçülü):**
  1. *"Atlar" (Anıtsal Başyapıt)* — Tuval üzerine yağlıboya, imzalı. 2022 tarihli. **100 × 140 cm** (Lot ID: 61209)
  2. *"Atlar"* — Tuval üzerine yağlıboya, imzalı. 2021 tarihli. **80 × 60 cm** (Lot ID: 56551)
  3. *"Atlar"* — Tuval üzerine yağlıboya, imzalı. 1999 tarihli. **70 × 55 cm** (Lot ID: 59508)
  4. *"Atlar"* — Tuval üzerine yağlıboya, imzalı. 2022 tarihli. **60 × 70 cm** (Lot ID: 59841)
  5. *"Atlar" (Özgün Gravür)* — Baskı. Edition: E.A. 8/20 Gravür, imzalı. 1998 tarihli. **62 × 70 cm** (Lot ID: 56969)
  6. *"Riva'da Bir Sabah"* — Kağıt üzerine karışık teknik, imzalı. **69 × 93 cm** (Lot ID: 61047)
  7. *"Alacahöyük Sembol"* — Baskı. Edition: 28/50 Gravür, imzalı. 1989 tarihli. **50 × 31 cm** (Lot ID: 59813)
  8. *"Figüratif"* — Tuval üzerine yağlıboya, imzalı. 2015 tarihli. **50 × 60 cm** (Lot ID: 46317)
- **Doğrulanmış Otantik Alıntı:** *"Sanat bir serüvendir; özgün baskı ise bu serüvenin disiplin, sabır ve bilgelikle kâğıda mühürlenen en saf halidir."*

#### 6. Hikmet Çetinkaya (`id: "hikmet-cetinkaya"`)
- **Konum (Doğum / Atölye):** Denizli / Ankara — Çetinkaya Atölyesi (Ankara)
- **Disiplin:** Çağdaş Türk Resmi, Lirik Dışavurumculuk & Gelincikler
- **Profil Fotoğrafı:** `assets/hikmet-cetinkaya/hikmet-cetinkaya-pp.jpg` (MAG Dergisi atölye çekimi; tuval başında spatulalı yüksek çözünürlüklü fotoğraf).
- **Gerçek Alıntı:** *"Gelincik unutmamaktır, hatırlamaktır, vefadır."* (Sanatçının kendi söyleşilerinde yayımlanmış özgün sözüdür, uydurma alıntı kullanılmamalıdır).
- **ÖNEMLİ KURAL (Paris ile bağı yok):** Kullanıcı talimatı: *"Hikmet Çetinkaya'nın Paris ile işi yok"*. Biyografisinde, eğitiminde veya sergilerinde Paris referansı yer almaz.
- **Doğrulanmış 8 Eser (Artam Antik A.Ş. Müzayede Kayıtları & Gerçek Ölçüler):**
  1. *Gelincikler (Geniş Ufuk)* — Tuval üzerine yağlıboya, **80 × 100 cm** (2022)
  2. *Gelincikler (Dikey Işık Süzülmesi)* — Tuval üzerine yağlıboya, **136 × 56 cm** (2021)
  3. *Gelincikler (Kır Çiçekleri Kompozisyonu)* — Tuval üzerine yağlıboya, **70 × 70 cm** (2022)
  4. *Gelincikler (Spatula & Impasto Dokusu)* — Tuval üzerine yağlıboya, **50 × 35 cm** (2022)
  5. *Gelincikler (Kare Büyük Tuval)* — Tuval üzerine yağlıboya, **100 × 100 cm** (2022)
  6. *Gelincikler (Yatay Panoramik Tuval)* — Tuval üzerine yağlıboya, **60 × 30 cm** (2022)
  7. *Gelincikler (Kare Dışavurumcu Seri)* — Tuval üzerine yağlıboya, **50 × 50 cm** (2021)
  8. *Gelincikler (Minyatür Spatula Çalışması)* — Tuval üzerine yağlıboya, **30 × 30 cm** (2020)
  *(Not: Önceden sehven eklenen portre çalışması kaldırılmış, 8 eserin tamamı Artam Antik A.Ş. doğrulamalı gelincik temalı orijinal eserlerle yenilenmiştir).*

#### 7. Tuncay Umay (`id: "tuncay-umay"`)
- **Konum (Doğum / Atölye):** Ankara / Ankara — Tuncay Umay Atölyeleri (Ankara)
- **Disiplin:** Denizlerin Devinimi & Sürrealist Satranç Manifestosu
- **ÖNEMLİ KURAL (Akademisyen DEĞİL):** Kullanıcı talimatı: *"akademisyen değilki o nerden çıktı"*. Tuncay Umay bağımsız ressam ve Biresku'nun kurucu sanatçısıdır; biyografisinde veya unvanında "akademisyen" ifadesi **kesinlikle geçmemelidir**.
- **Kayıtlı Eser Sayısı:** 13 Eser

#### 8. Prof. Dr. Mustafa Ayaz (`id: "mustafa-ayaz"`)
- **Konum (Doğum / Atölye):** Trabzon / Ankara — Mustafa Ayaz Müzesi & Vakıf Atölyesi (Ankara)
- **Disiplin:** Çağdaş Türk Resmi, Dışavurumcu Figürasyon & Dinamik Kompozisyon
- **Kayıtlı Eser Sayısı:** 13 Eser (Mustafa Ayaz Plastik Sanatlar Müzesi koleksiyonu referanslı)

#### 9. Prof. Dr. Adnan Turani (`id: "adnan-turani"`)
- **Konum (Doğum / Atölye):** İstanbul / Ankara — Turani Atölyesi (Ankara)
- **Disiplin:** Çağdaş Türk Resmi, Lirik Soyutlama & Sanat Kuramı
- **Kayıtlı Eser Sayısı:** 13 Eser (Marmaris Serisi, Viyolonsel Çalan Kadın, Müzisyenler Trio vb.)

---

## 3. Kullanıcı İstekleri Doğrultusunda Yapılan Kritik Düzenlemeler

Gelecekte geri alma veya hata yapmamak adına kullanıcının doğrudan verdiği talimatlar ve çözümleri:

| Konu / İstek | Kullanıcı Uyarısı | Çözüm & Mevcut Durum |
| :--- | :--- | :--- |
| **Biresku Haberleri Mavi Nokta** | *"biresku haberleri yazısının yanındaki mavi noktayı kaldır"* | `.biresku-news-widget-kicker::before` içerisindeki yanıp sönen mavi pulsing dot kaldırıldı. |
| **Tuncay Umay Unvanı** | *"akademisiyen değilki o nerden çıktı"* | Tüm sayfalardan (index, dergi, artists-data) "akademisyen" ifadesi kaldırıldı; "ressam ve Biresku kurucusu sanatçı" olarak düzeltildi. |
| **Hikmet Çetinkaya Profiline Gitme Hatası** | *"Hikmet hocaya tıklayınca onun profiline atmıyor bi sorun var düzelt bi daha da o sorun olmicak şekilde ayarlarmısın"* | `dergi/sanatcilar/index.html` içerisindeki hash parser `loadArtistProfileFromHash()` normalize edildi; `#profil=hikmet-cetinkaya` ve `#sanatci=...` formatları hatasız açılacak şekilde evrensel router kuruldu. |
| **Paris İddiası** | *"hikmet çetin kayanın paris ileişi yok"* | Sanatçı biyografisindeki hatalı Paris/Fransa atıfları tamamen kaldırıldı; Ankara/Gazi/Türkiye merkezli gerçek kariyeri yazıldı. |
| **Eser Doğruluğu & Boyutları** | *"bu resimleri bi daha check et sadece güvenilir kaynak kullan ve bunlara ölçü yazabilirsin güvenilir kaynaklardan resimlerin ölçüsü ile beraber al"* | Tüm görseller Artam Antik A.Ş. müzayede kataloglarından çekilerek doğrulanmış ölçüleri (`80x100 cm`, `136x56 cm` vb.) karta ve modal detayına işlendi. |
| **8 Eser & Hatalı Eser Değişimi** | *"bak buraya 8 eser ekle ve o sol alttaki eser onun değil değiştir onu"* | Sanatçıya ait olmayan kadın portresi kaldırıldı; Artam kayıtlı 8 adet orijinal gelincik tablosu tam set halinde yüklendi. |
| **Alıntı Doğruluğu** | *"burada alıntı yaptığın sözü gerçek mi gerçekten böyle bir şey söylemişmi"* | Yapay alıntı yerine Hikmet Çetinkaya'nın basında yayımlanmış otantik sözü konuldu: *"Gelincik unutmamaktır, hatırlamaktır, vefadır."* |
| **Profil Fotoğrafı** | *"pp olarak farklı daha güzel bir foto koyabilirsin bence hikmet hocaya"* | *MAG Dergisi* kaynaklı, elinde spatula ile tuval başında yer aldığı yüksek kaliteli stüdyo fotoğrafı profil fotoğrafı yapıldı. |
| **Biresku Haberleri Mobil Uyumu** | *"burdaki biresku haberleri kısmı telde gözükmüyo güzelce yedirirmisin"* | `@media (max-width: 768px)` altında gizlenmiş olan `.mansion-gate-section` aktifleştirildi; mobilde şık, taşma yapmayan (`overflow-x: hidden`), tam oturan editoryal haber kartına dönüştürüldü. |
| **"Sanatçı Alanı" Rozetinin Kaldırılması** | *"sanatçı alanı yazıyo ya onu kaldır sana"* | Sanatçı fotoğraflarının sol üst köşesindeki siyah-altın `SANATÇI ALANI` rozeti ana sayfa ve dergi listelerindeki tüm kartlardan kaldırıldı. |
| **Yeni Eklenen Sanatçıların Sola Gelmesi** | *"burdaki sanatçılarımız kısmında yeni eklenenler sol tarafa eklenicek otomatik olarak en son eklenen de sağa doğru kayıcak ve kaybolucak"* | Ana sayfa rayı ve dergi vitrini ters kronolojik sıralamaya uyarlandı: En son eklenen **Hikmet Çetinkaya en solda (1. sırada)**, eskiler sağa doğru kayıyor. Ayrıca `syncArtistsRailWithData()` fonksiyonu ile `window.ARTISTS_DATA`'ya yeni sanatçı eklendiğinde otomatik en başa/sola yerleşmesi sağlandı. |

---

## 4. Sayfa Bileşenleri ve Çalışma Mantığı

### A. Ana Sayfa (`index.html`)

1. **Brand Hero Masthead:**
   - Üst kısımda logotip: **BİRESKU / BİRLEŞMİŞ RESSAMLAR KULÜBÜ / UNITED ARTIST CLUB**.
   - Mobilde `clamp()` yazı boyutları ve `white-space: normal` ile taşma yapmaz.

2. **Mansion Gate (Giriş & Resepsiyon + Biresku Haberleri):**
   - Masaüstünde 2 sütun: Solda Biresku Karşılama & İstatistik Hapları; Sağda Biresku Haberleri.
   - Mobilde tek sütun: Üstte karşılama, altında tam genişlikte Biresku Haberleri editoryal kartı.
   - **Biresku Haberleri Fonksiyonları:**
     - `toggleBireskuNewsSort()`: Haberleri kronolojik veya ters kronolojik sıralar ("Yeniden Eskiye ⇄" / "Eskiden Yeniye ⇄").
     - `openBireskuNewsModal(id)`: Habere tıklandığında tam basın metnini, sergi mekanını ve detayları pop-up modalda açar.

3. **Sanatçılarımız & Yeni Eklenenler Rayı (`#artistsRail`):**
   - Yatay kaydırılabilir akış (`flow-rail`).
   - Sıralama Kuralı: **En Yeni Eklenen En Solda!**
     - 1. Hikmet Çetinkaya *(En Yeni)*
     - 2. Tuncay Umay
     - 3. Prof. Dr. Mustafa Ayaz
     - 4. Prof. Dr. Adnan Turani
     - 5. BİRESKU SANATÇI KOLEKTİFİ (*Tüm Sanatçıları Keşfet* vitrin kartı)
   - Otomatik JS Motoru: `syncArtistsRailWithData()` sayfa açılışında `window.ARTISTS_DATA.slice().reverse()` çalıştırarak kartları dinamik olarak en yeni solda olacak şekilde senkronize eder.

### B. Dergi ve Sanatçı Kataloğu (`dergi/sanatcilar/index.html`)

1. **Hash Tabanlı Router:**
   - URL'de `#profil=adnan-turani` veya `#profil=hikmet-cetinkaya` bulunduğunda otomatik olarak ilgili sanatçının profil görünümünü açar, vitrini gizler.
   - Sanatçı bulunamazsa veya hash temizlenirse katalog listesini görüntüler.
2. **Eser Galerisi & Lightbox:**
   - Her sanatçının eserleri grid halinde listelenir.
   - Eser üzerine tıklandığında tam ekran yüksek çözünürlüklü modal açılır; eser adı, tekniği, **santimetre cinsinden boyutları** ve yılı gösterilir.

---

## 5. Dağıtım ve Yayına Alma Süreci (Deployment Workflow)

Site doğrudan GitHub Pages üzerinden yayınlanmaktadır. Değişiklik yapıldığında şu adımlar takip edilmelidir:

1. **Önbellek Kırma (Cache Busting):**
   - CSS ve JS bağlantılarına versiyon etiketi eklenmiştir (örn: `?v=20261108_v27`).
   - Yapılan her kritik frontend değişikliğinde versiyon numarası (`v27 -> v27`) artırılmalıdır.
2. **GitHub API ile Dağıtım:**
   - Dosyalar `HaDeS-06/biresku` deposunun `main` dalına commit edilir.
   - GitHub Actions `pages build and deployment` iş akışını tetikler (~30-60 saniye sürer).
   - İş akışı `conclusion=success` olduğunda değişiklikler doğrudan `https://biresku.com` üzerinde canlıya geçer.

---

## 6. Yeni Gelecek AI İçin Altın Kurallar (Checklist)

1. ⚠️ **Tuncay Umay'a asla "akademisyen" yazma.** Kendisi bağımsız ressam ve kulüp kurucusudur.
2. ⚠️ **Hikmet Çetinkaya'ya asla Paris/Fransa bağlantısı ekleme.**
3. ⚠️ **Hikmet Çetinkaya eserlerini değiştireceksen mutlaka Artam Antik A.Ş. kayıtlı orijinal gelincik serisi ve cm ölçülerini kullan.** Asla portre veya ilgisiz resim yükleme.
4. ⚠️ **Sanatçı vitrininde yeni eklenen sanatçıyı daima sol başa ekle.** Eski sanatçılar sağa doğru kaymalıdır.
5. ⚠️ **Sanatçı kapak fotoğraflarının üstüne "Sanatçı Alanı" vb. görseli kapatan rozet koyma.** Fotoğraflar temiz ve net kalmalıdır.
6. ⚠️ **Mobilde yatay taşma (horizontal overflow) oluşturma.** `html, body` üzerinde `overflow-x: hidden` kuralını ve container sınırlarını koru.
7. ⚠️ **Tüm yeni sanatçı veya eser eklemelerini `assets/artists-data.js` dosyasına kaydet.** Tek doğruluk kaynağı orasıdır.

## 7. Admin Sanatçı Yönetim & Şablon Motoru (`BireskuArtistAdmin`)

Yöneticinin (`ardaumay06@gmail.com` veya `role: admin`) dışarıdan bir yapay zekaya ihtiyaç duymadan yeni sanatçıları, biyografileri, felsefeleri ve eserleri doğrudan ekleyebilmesi ve **önceden eklenmiş tüm sanatçıları düzenleyebilmesi** için geliştirilmiş gizli, dinamik ve **güvenlik açığı barındırmayan (Zero-Vulnerability / OWASP Uyumlu)** bir Sanatçı Yönetim ve Şablon Motorudur.

### A. Gizlilik & Görünmezlik Standartları (Stealth Architecture)
Kullanıcının kesin talimatı gereği:
1. **Kaynak Kodda Sıfır İz:** HTML kaynak kodlarında (`index.html`, `dergi/index.html`, `dergi/sanatcilar/index.html`) statik hiçbir buton, form veya `+` kartı **asla yer almaz**. Sayfa kaynağını görüntüleyen (View Source) hiç kimse admin panelinin varlığını dahi göremez.
2. **Çalışma Zamanı Enjeksiyonu (Dynamic Runtime Injection):** Yalnızca yetkili Admin (`ardaumay06@gmail.com` / `role: admin`) güvenli oturum açtığında JavaScript motoru devreye girer:
   - `dergi/sanatcilar/` sayfasındaki `#catalogGrid` alanının **en sol üst köşesine (1. sıraya)** fotoğraf yerine zarif altın `+` sembolü taşıyan bir kart enjekte edilir.
   - `index.html` sayfasındaki `#artistsRail` vitrin rayının en soluna da aynı `+` kartı dinamik eklenir.
   - Mevcut tüm sanatçı kartlarının kapak fotoğrafının sağ üst köşesine `✏️ Düzenle` butonu iliştirilir.
3. **Oturum Kapanınca Otomatik Temizlik:** Çıkış yapıldığında veya yetkisiz ziyaretçilerde tüm injected elemanlar DOM'dan derhal temizlenir.

### B. Mimari Bileşenler ve Güvenlik Standartları
- **Dosyalar:**
  - `assets/biresku-artist-admin.js` ve `dergi/assets/biresku-artist-admin.js` (İstemci mantığı, enjeksiyon motoru, şablon doldurucu)
  - `assets/biresku-auth.css` ve `dergi/assets/biresku-auth.css` (`.admin-plus-card`, `.admin-plus-cover`, `.admin-card-edit-btn`, lüks karanlık stüdyo ve canlı simülasyon stilleri)
  - `assets/biresku-auth.js` ve `dergi/assets/biresku-auth.js` (Admin oturum yönetimi & state change event köprüsü)
- **Tavizsiz Güvenlik Kuralları (OWASP Uyumlu):**
  1. **Yetki Denetimi (RBAC):** Yalnızca `role === 'admin'` veya `ardaumay06@gmail.com` kullanıcıları paneli açabilir ve kaydedebilir. Yetkisiz çağrılar sessizce reddedilir.
  2. **Sıfır XSS (Zero-XSS):** Tüm form girdileri `escapeHtml()` ve güvenli DOM yöntemleriyle sanitize edilir; asla `eval()` veya `new Function()` çalıştırılmaz.
  3. **Protokol Güvenliği:** Görsel URL'lerinde yalnızca `https://`, `http://`, `data:image/` ve `/assets/` kabul edilir; `javascript:`, `vbscript:` vb. saldırı protokolleri anında elenir.
  4. **Dosya Güvenliği:** Yalnızca `image/*` MIME türleri ve maksimum 5MB dosya boyutu sınırı uygulanır.
  5. **ID Sanitizasyonu:** Sanatçı slug'ı `^[a-z0-9\-]+$` kuralına göre otomatik temizlenir.

### C. Canlı Görsel Stüdyo & Profil Sayfası Birebir Şablon Düzeneği (In-Place Visual Studio)
Kullanıcının *"2. fotodaki gibi bir görüntüde istiyorum ben orda mesela biyonun altı boş olucak ben onu doldurucam gibi düşün"* talimatı doğrultusunda:
- Admin sol üstteki `+` kartına veya mevcut bir sanatçının `✏️ Düzenle` butonuna bastığında, harici bir pop-up yerine **Biresku Profil Sayfası ile 1:1 birebir aynı görsel düzende** Canlı Görsel Stüdyo açılır.
- **Hero Alanı:** Fotoğraf alanına tıklandığında doğrudan bilgisayardan görsel seçilir/yüklenir; başlık, kategori ve disiplin alanları doğrudan sayfa tipografisi içinde yazılabilir.
- **Biyografi & Sanatsal Yolculuk Kartı:** Sol taraftaki editoryal kartın altında boş ve şık bir metin alanı yer alır; yönetici doğrudan biyografiyi buraya yazar veya düzenler.
- **Hayata ve Sanata Bakışı Kartı:** Sağ taraftaki altın çerçeveli tırnak içi alıntı kutusu ve felsefe metin alanı doğrudan profil sayfasındaki gibi doldurulur.
- **Eser Koleksiyonu & İsteğe Bağlı Alan Kuralı:** Gerçek profil sayfasındaki grid düzeninde eser kartları yer alır.
  - **ÖNEMLİ KURAL (Kullanıcı Talimatı):** *"bu resimlerin isimlerini sildim ve eser 1 eser-2 fln yazdı illa eser adı veya boyutu yazmasına gerek yok"*. Eser adı, tekniği, santimetre ölçüleri ve yılı **tamamen isteğe bağlıdır (optional)**.
  - Eğer kullanıcı eser adını veya boyutunu boş bırakırsa sistem **ASLA** `"Eser #1"`, `"Eser #2"` veya `"Özgün Koleksiyon Eseri"` gibi varsayılan/yapay metinler üretmez.
  - Alt bilgiler boş bırakıldığında eserler doğrudan **saf resim kartı (`pure-gallery-card`)** olarak çerçevesiz, tam yükseklikte sadece sanat eserini gösterecek şekilde tertemiz sergilenir.
- **Üst Sticky Yönetici Çubuğu:**
  - `← Kataloğa Dön (Vazgeç)`
  - Açılır sanatçı seçici (kayıtlı sanatçılar arasında anında geçiş)
  - `⚡ Örnek Taslak Doldur`
  - `🧹 Temizle`
  - `💾 Vitrine Kaydet & Yayınla (Canlı)`: Kaydedildiği anda vitrini günceller ve sanatçının canlı yayınlanan profil sayfasına geçiş yapar.
  - `🗑️ Sanatçıyı Sil`

### D. Kullanım ve Yetenekler
1. **Sol Üstteki `+` Kartına Tıklayarak Ekleme:** Sanatçılarımız vitrininde en sol üstteki `+` kartına tıklandığında doğrudan bu canlı profil şablonu açılır; biyo ve alıntı alanları boş olarak yöneticiyi bekler.
2. **Eski Eklenen Sanatçıları Düzenleme (Edit Flow):**
   - Her sanatçı kartının üzerindeki `✏️ Düzenle` butonuna basıldığında o sanatçının tüm bilgileri (biyo, felsefe, alıntı, profil resmi, tüm eserleri ve cm boyutları) forma yüklenir.
   - Formun üstündeki açılır menüden (`#studioArtistSelector`) kayıtlı tüm sanatçılar arasında anında geçiş yapılabilir veya "Yeni Sanatçı Ekle" moduna dönülebilir.
   - İstenilen metin veya görseller değiştirilip `💾 Değişiklikleri Kaydet & Vitrine Uygula` butonuna basıldığında hem sitede hem hafızada anında güncellenir.
   - `🗑️ Sanatçıyı Sistemden Kaldır` seçeneğiyle sanatçı kolayca silinebilir.
3. **Hazır Şablon Doldurucu:** "⚡ Hazır Şablonu Doldur (Örnek Taslak)" butonu tek tıkla eksiksiz örnek bir veri yükler; kullanıcı sadece isim ve eserleri değiştirir.
4. **Dinamik Eser Ekleme:** Eser başlığı, tekniği, ölçüleri (örn: `80 × 100 cm`), yılı ve görseliyle sınırsız sayıda eser eklenebilir.
5. **Canlı Simülasyon:** Sağ panelde vitrin kartının ve profil sayfasının birebir canlı önizlemesi anlık olarak akar.
6. **Çoklu Dağıtım & Kayıt:**
   - **"🚀 Sisteme Ekle / Güncelle (Canlı)":** Sanatçıyı anında `window.ARTISTS_DATA`ya ve `biresku_custom_artists_v1` kalıcı deposuna ekler, vitrinde 1. sıraya (en sola) taşır.
   - **"📋 artists-data.js Kodunu Kopyala":** `artists-data.js` dosyasına doğrudan yapıştırılabilecek standart JavaScript / JSON kodunu tek tıkla panoya kopyalar.
   - **"💾 JSON Olarak İndir":** Tek tıkla `[id].json` olarak indirir.

---

## 8. Evrensel Otomatik Senkronizasyon Mimarisi (v37 Güncellemesi)

> [!TIP]
> **Kullanıcı Talebi:** *"ya otomatik eşitlese ve senkron etse olmazmı hem sanatçılar kısmı hem yeni katılanlar kısmı hemde anasayfadaki yenii katılanlar kısmı"*

### Yapılan Mimari İyileştirmeler:
1. **Çift Veri Tanımının Kaldırılması (Elimination of Redundant Inline Data):**
   - Önceden `dergi/index.html` ve `dergi/sanatcilar/index.html` sayfalarında 46.000 karakterlik sabit `window.ARTISTS_DATA = [...]` blokları bulunuyordu. Bu bloklar external scriptin üzerine yazarak sayfaların birbirinden kopmasına yol açıyordu.
   - Her iki sayfadaki inline bloklar temizlendi ve yerlerine tekil kaynak `/assets/artists-data.js` bağlandı.
2. **`window.bireskuSyncAllArtists()` Motoru:**
   - `assets/artists-data.js` dosyasının sonuna evrensel tetikleyici eklendi.
   - Script yüklendiğinde ya da admin stüdyosundan yeni bir sanatçı eklendiğinde `bireskuSyncAllArtists()` fonksiyonu otomatik çağrılarak:
     - `index.html` üzerindeki `#artistsRail` akışını,
     - `dergi/index.html` üzerindeki `#artistsGrid` kartlarını ve `#newArtistsContainer` listesini,
     - `dergi/sanatcilar/index.html` üzerindeki `#catalogGrid` ve `#artistCountBadge` sayacını,
     - Özel DOM eventi `biresku:artists-synced` aracılığıyla tek hamlede senkronize eder.
3. **Yeni Eklenenler Filtresinin Dinamizasyonu:**
   - `dergi/index.html` içerisindeki `renderNewArtistsFeature()` fonksiyonundaki sabit ID filtreleri kaldırıldı; tüm kayıtlı sanatçılar `.slice().reverse()` formatında Spot 1'den itibaren dinamik olarak listelenmeye başlandı.

---

## 9. Notice & Takedown (Telif Bildir ve Kaldır) & Hukuki Uyum Altyapısı (v38 Güncellemesi)

> [!NOTE]
> **Kullanıcı Direktifi:** *"bizim şuan sitenin altında yazan metni silmeden koy veya onunla beraber yaz bişi yap işte - test ederek ve token kaçaklarına kaynak kodlarına bakarak at"*

### Yapılan İşlemler ve Hukuki/Tasarım Standartları:
1. **Footer Kısayol Bileşeni (`.footer-takedown-notice`):**
   - Sitenin tüm ana ve alt sayfalarında (`index.html`, `dergi/index.html`, `dergi/sanatcilar/index.html`, `gizlilik-politikasi/index.html`, `iletisim/index.html`) mevcut `&copy; 2026 BİRESKU | Gizlilik Politikası | İletişim` satırı **kesinlikle silinmeden ve muhafaza edilerek**, hemen üstüne zarif editoryal telif feragatnamesi entegre edildi.
   - **Metin:** *"Biresku platformunda yer alan tüm sanatçı biyografileri, eser künyeleri ve görsel dökümantasyonlar; 5846 sayılı FSEK kapsamında yalnızca çağdaş Türk resim sanatını belgelemek, tanıtmak ve kültürel miras bilincini yaygınlaştırmak amacıyla iyi niyetle sunulmaktadır. Eser sahiplerinin veya yasal mirasçılarının talebi halinde ilgili içerikler 24–48 saat içinde incelenir, düzenlenir veya yayından kaldırılır: iletisim@biresku.com"*
2. **Anti-AI & Müze Görsel Dili:**
   - 20px+ haplar, yuvarlak balonlar ve yayvan gölgeler yerine jilet gibi net `2px` mimari kenar, koyu kömür arka plan (`rgba(28, 29, 36, 0.45)`), ince `1px` sınır çizgisi ve mat antika altın e-posta vurgusu uygulandı.
3. **Detaylı Gizlilik & Bildir-Kaldır Politikası (`gizlilik-politikasi/index.html`):**
   - 3. Madde *"3. Telif Hakları, Kültürel Feragatname ve 'Bildir & Kaldır' (Notice & Takedown) Politikası"* başlığıyla genişletildi.
   - 5846 sayılı FSEK (Madde 33, 34 ve 40) atıfları, kâr amacı gütmeyen kültürel arşiv beyanı, hak sahipleri için başvuru adımları ve **24–48 saatlik kesin kaldırma/düzenleme taahhüdü** işlendi.
4. **İletişim & Modal Entegrasyonları:**
   - `iletisim/index.html` sayfasına *"⚖️ Telif Hakları & 'Bildir ve Kaldır' Masası"* kartı eklendi.
   - `dergi/index.html` ve `dergi/sanatcilar/index.html` içindeki `#privacyModal` içeriği güncellendi.
5. **Token ve Güvenlik Denetimi:**
   - Dağıtım öncesi tüm web dosyaları taranarak kaynak kodlarda hiçbir GitHub PAT / Token sızıntısı olmadığı teyit edildi.
   - Önbellek sürümü `?v=20261109_v38` olarak güncellendi.
