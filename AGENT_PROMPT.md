# 🏛️ BIRESKU (Birleşmiş Ressamlar Kulübü) — AI Geliştirici & Ortak Çalışma Protokolü

> **Bu metin, Biresku projesinde görev yapacak tüm yapay zekâ ajanları (AI Agents) için resmi sistem ve görev promptudur.**  
> Projeye yeni başlayan veya devam eden her ajan, çalışmaya başlamadan önce bu yönergeyi harfiyen kabul etmek ve uygulamak zorundadır.

---

## 📌 1. PROJE KİMLİĞİ VE CANLI MİMARİ

- **Canlı Adres:** [biresku.com](https://biresku.com)
- **GitHub Deposu:** `HaDeS-06/biresku` (`main` dalı)
- **Barındırma:** GitHub Pages (Özel CNAME: `biresku.com`) + Cloudflare DNS
- **Teknoloji Yığını:** Saf, sıfır bağımlılıklı (Vanilla HTML5, Modern CSS3, Modern ES6+ JavaScript). Derleme (Webpack/Vite/Node build) yoktur; GitHub Pages dosyaları doğrudan statik olarak sunar.

---

## ⚡ 2. İKİ AJAN ARASINDA ÇAKIŞMAYI ÖNLEME PROTOKOLÜ (MUTLAKA İLK ADIM!)

> [!CRITICAL]
> **PROJEYE BAŞLARKEN VEYA BİR GÖREV ALDIĞINDA İLK İŞİN GITHUB'DAKİ EN SON DEĞİŞİKLİKLERİ KONTROL ETMEKTİR!**  
> Projede birden fazla ajan eşzamanlı veya sırayla çalışmaktadır. Diğer ajanın yaptığı işlerin üzerine yazmamak ("birbirinizin üstüne çıkmamak") için şu adımları izle:

1. **Her İşlemden Önce En Son Commit'i Çek:**
   - GitHub API üzerinden `GET /repos/HaDeS-06/biresku/git/ref/heads/main` çağrısı yaparak `latest_commit_sha` ve `base_tree_sha` bilgisini al.
   - Yerel dosyalarının GitHub `main` dalındaki en güncel sürümle birebir eşleştiğinden emin ol (veya git pull / fetch yap).
2. **Commit ve Ağaç (Tree) Bütünlüğü:**
   - Yeni bir değişiklik göndereceğin zaman ağacı (`tree`) mutlaka GitHub'daki en güncel `base_tree_sha` üzerine inşa et ve commit'in `parent` değerine en son commit SHA'sını ver.
   - Dosya blobları oluştururken dosya tabanlı değil, **içerik özeti (SHA-256 hash)** bazlı önbellekleme kullan; aynı isimli farklı dizinlerdeki dosyaların (`index.html` vs `dergi/index.html`) birbirinin üzerine yazılmasını engelle.
3. **AI_HANDOVER.md'yi Canlı Tut:**
   - Yaptığın her ekleme ve güncellemeyi `AI_HANDOVER.md` dosyasına tarih, sürüm ve gerekçesiyle işle ki diğer ajan kaldığı yeri net bilsin.

---

## 📂 3. GİTHUB DEPOSU VE DOSYA YAPISI (HANGİ DOSYA NEDİR?)

```text
biresku/
├── index.html                      # Ana vitrin sayfası (Hero, Akış Vitrini #artistsRail, Haberler, İletişim)
├── CNAME                           # biresku.com özel alan adı yönlendirmesi (Asla silinmemeli)
├── AI_HANDOVER.md                  # Projenin yaşayan hafızası, mimari kararlar ve sanatçı kayıt defteri
├── AGENT_PROMPT.md                 # Bu talimatname (Ajanlar için ortak çalışma kılavuzu)
│
├── assets/                         # KÖK DİZİN VARLIKLARI
│   ├── artists-data.js             # Ana sanatçılar veri tabanı (window.ARTISTS_DATA dizisi)
│   ├── biresku-auth.css            # Kimlik doğrulama, gizli admin paneli ve görsel stüdyo stilleri
│   ├── [sanatci-id]/               # Her sanatçı için açılan özel görsel klasörü (Örn: komet/, ibrahim-balaban/)
│   │   ├── [sanatci]-pp.jpg        # Sanatçının gerçek portre fotoğrafı
│   │   └── [eser-adi]-[olcu].jpg   # 8 adet yüksek çözünürlüklü doğrulanmış eser görseli
│
├── dergi/                          # BİRESKU DERGİ BÖLÜMÜ
│   ├── index.html                  # Dergi ana sayfası
│   ├── assets/                     # Dergi varlıkları (assets/ ile birebir senkronize tutulur)
│   │   ├── artists-data.js         # Dergi sanatçı verisi (assets/artists-data.js kopyası)
│   │   └── [sanatci-id]/           # Sanatçı görsel klasörlerinin eşlenik kopyası
│   │
│   └── sanatcilar/                 # SANATÇILAR KATALOĞU VE PROFİL SAYFALARI
│       └── index.html              # 9+ Sanatçı filtreli katalog (#catalogGrid) ve Tek Sayfa Profil Modalı
```

---

## 🎨 4. DEĞİŞMEZ VE KATİ ANA KURALLAR

### 1. KURAL: Vitrin Sıralaması (En Yeni Sanatçı En Solda / Spot 1)
- Sisteme yeni eklenen sanatçı, hem ana sayfadaki `#artistsRail` akışında hem de `dergi/sanatcilar/index.html` kataloğunda **EN SOLDA (1. Sırada)** yer alır.
- JavaScript tarafında `window.ARTISTS_DATA.slice().reverse()` kullanıldığı için, `window.ARTISTS_DATA` dizisinin **EN SONUNA** eklenen sanatçı otomatik olarak vitrinde **EN BAŞA** gelir.
- Statik HTML kartı eklerken de `#artistsRail` ve `#catalogGrid` konteynerlerinin içine en üste (pre-pend) eklenmelidir.

### 2. KURAL: Gerçek Profil Fotoğrafı (PP Kuralı)
- Sanatçının profil fotoğrafı **KENDİ GERÇEK YÜZÜNÜ** içeren yüksek çözünürlüklü, net bir stüdyo/portre fotoğrafı olmak zorundadır.
- Asla afiş, sergi duyurusu ("SaDe" vb.), kitap kapağı veya yaptığı bir resim profil fotoğrafı yapılamaz!

### 3. KURAL: 8 Doğrulanmış Eser ve "Uydurma İsim Yasağı"
- Her sanatçı için güvenilir arşivlerden (Artam Antik A.Ş. müzayede arşivi, müze envanterleri) **tam olarak 8 adet** eser seçilir.
- Beyaz çerçeve, paspartu veya tarama payları görselden kırpılır (`autocrop`).
- **ASLA KAFANDAN İSİM ATMA:** Eserin literatürde veya müzayedede tescilli özgün bir adı varsa yazılır (Örn: *"Kış"*, *"Gurbetçi"*, *"Deux Poids, Deux Mesures"*). Eğer eser müzayedede "Figüratif", "Untitled" veya "Kompozisyon" gibi genel bir etiketle geçmişse başlık **TAMAMEN BOŞ BIRAKILIR (`title: ""`)**. Asla *"Figüratif #1"*, *"Eser 1"* gibi sahte isimler türetilemez; eser yalın koleksiyon kartı olarak sergilenir.
- Eser ölçüsü santimetre (`cm`), teknik ve yıl kesin kaynaktan alınır.

### 4. KURAL: Doğum Yeri / Atölye Yeri Formatı
- Sanatçı kartlarındaki ve profillerindeki konum bilgisi harfiyen şu formatta yazılır:
  **`Doğum Yeri / Atölye Yeri`** (Örnek: `Bursa / İstanbul`, `Çorum / Paris`, `Trabzon / İstanbul`, `Denizli / Ankara`, `Ankara / Ankara`, `İstanbul / İstanbul`).
- Doğum yeri ile atölye yerinin yerini karıştırma (Örn: Süleyman Saim Tekcan Trabzon doğumludur, atölyesi İstanbul'dadır -> `Trabzon / İstanbul`).

### 5. KURAL: Tuncay Umay Kuralı
- Biresku kurucusu sanatçı Tuncay Umay bağımsız ressam ve sanat eğitimcisidir.
- Biyografisinde, unvanında veya kartlarında **"akademisyen"** kelimesi **KESİNLİKLE GEÇMEMELİDİR**.

### 6. KURAL: Çift Dizin Eşitleme (Dual Mirroring)
- Eklenen her görsel hem `assets/[sanatci-id]/` hem de `dergi/assets/[sanatci-id]/` dizinlerine kaydedilmelidir.
- `assets/artists-data.js` dosyasında yapılan her değişiklik eşzamanlı olarak `dergi/assets/artists-data.js` ve `dergi/sanatcilar/index.html` içerisindeki inline `window.ARTISTS_DATA` bloğuna da yansıtılmalıdır.

### 7. KURAL: Önbellek Kırma (Cache Busting)
- HTML ve JS dosyalarındaki script, stil ve görsel çağrılarında sürüm parametresi her dağıtımda 1 artırılır (Örn: `?v=20261109_v35` -> `_v36`).

---

## 🔒 5. GİZLİ ADMİN PANELİ & STÜDYO SİSTEMİ
- Sitede dışarıdan bakıldığında hiçbir admin butonu, giriş formu veya kaynak kodunda yönetici URL'si görünmez (`Stealth Architecture`).
- Admin arayüzü yalnızca `localStorage.getItem('biresku_admin_session')` doğrulamasıyla aktif olur.
- Yönetici giriş yaptığında `dergi/sanatcilar/` sayfasında katalog başlığında gizli bir `[+] Sanatçı Ekle` stüdyo butonu belirir ve yönetici canlı olarak şablonu doldurup yeni sanatçı ekleyebilir.

---

## 🚀 6. DAĞITIM KONTROL LİSTESİ (CHECKLIST)

Herhangi bir işi tamamlayıp kullanıcıya teslim etmeden önce:
1. [ ] `git/ref/heads/main` üzerinden en son commit kontrol edildi mi?
2. [ ] Yeni sanatçı en sol (Spot 1) pozisyonda mı?
3. [ ] Profil fotoğrafı gerçek yüz mü?
4. [ ] 8 eser Artam/resmi kaynaktan mı ve uydurma isim içermiyor mu?
5. [ ] Konum `Doğumyeri / Atölyeyeri` formatında mı?
6. [ ] `assets/` ve `dergi/assets/` çift dizini eşitlendi mi?
7. [ ] Cache sürümü artırıldı mı?
8. [ ] `AI_HANDOVER.md` güncellendi mi?
9. [ ] GitHub Actions derlemesi yeşil (success) tamamlandı mı?
10. [ ] Canlı siteden HTTP 200 ile doğrulandı mı?
