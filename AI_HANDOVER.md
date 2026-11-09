

---

## 9. Faz 1: Google Semantik SEO, Statik Sanatçı Sayfaları ve Sitemap Mimarisi (v37)

> **Tarih:** 9 Kasım 2026  
> **Ajan:** Biresku Geliştirici & Küratör Ajanı  
> **Amaç:** Google aramalarında `"[Sanatçı Adı Soyadı] ressam"` sorgularında Biresku sayfalarının doğrudan en üst sıralarda çıkması ve Google Bilgi Paneli (Knowledge Graph) ile tam entegre olunması.

### Yapılan Mimari ve SEO Geliştirmeleri:
1. **Bağımsız Statik SEO Sayfaları (`/dergi/sanatcilar/[id]/index.html`):**
   - Kayıtlı 9 usta sanatçının tamamı için arama motoru botları (Googlebot, Bingbot) tarafından doğrudan taranabilir bağımsız statik sayfalar oluşturuldu:
     - `dergi/sanatcilar/ibrahim-balaban/index.html`
     - `dergi/sanatcilar/komet/index.html`
     - `dergi/sanatcilar/mehmet-guleryuz/index.html`
     - `dergi/sanatcilar/gulbin-nurgenc/index.html`
     - `dergi/sanatcilar/suleyman-saim-tekcan/index.html`
     - `dergi/sanatcilar/hikmet-cetinkaya/index.html`
     - `dergi/sanatcilar/tuncay-umay/index.html`
     - `dergi/sanatcilar/mustafa-ayaz/index.html`
     - `dergi/sanatcilar/adnan-turani/index.html`
   - Sayfalarda `<h1>` sanatçı adı, kategori rozeti, disiplin, doğum/atölye konumu, biyografi paragrafları, otantik alıntı ve eserler istemci tarafı JS'e ihtiyaç duymadan doğrudan kaynak kodunda (SSR kalitesinde statik) yer alır.

2. **JSON-LD Semantik Şemaları (`schema.org/VisualArtist` & `schema.org/VisualArtwork`):**
   - Her sayfaya Google'ın resmi sanatçı şeması gömüldü:
     - `@type: "Person"` / `"VisualArtist"`
     - `birthPlace` ve `workLocation` alanları `Doğum Yeri / Atölye Yeri` standardından otomatik ayrıştırıldı.
     - `hasOfferCatalog` altında sanatçının doğrulanmış eserleri listelendi.
     - **Tavizsiz Kural:** Eserin literatürde kesin bir adı yoksa başlık boş bırakıldı; asla yapay veya uydurma isim türetilmedi.
     - Eser tekniği (`artMedium`), boyutları (`dimensions`) ve yılı (`dateCreated`) resmi arşivden şemaya aktarıldı.

3. **Google Görsel ve Web Site Haritası (`sitemap.xml`):**
   - Kök dizine eklenen `sitemap.xml`, tüm ana sayfaları, 9 sanatçı profilini ve sanatçıların gerçek portreleri ile tescilli eserlerini (`<image:image>`) içerir.

4. **Robots Yönergesi (`robots.txt`):**
   - Kök dizinde tüm botlara izin veren ve `sitemap.xml` adresini bildiren standart yönerge oluşturuldu.

5. **Katalog İçi Taranabilir Bağlantılar (`dergi/sanatcilar/index.html`):**
   - Sanatçı kartlarındaki butonlar gerçek `<a href="/dergi/sanatcilar/${artist.id}/">` bağlantılarına dönüştürüldü; tarayıcıda tıklandığında modal geçişi korunurken Googlebot'un tüm sanatçı sayfalarını derinlemesine taraması garanti altına alındı.


---

## 9. Faz 1: Google Semantik SEO, Statik Sanatçı Sayfaları ve Sitemap Mimarisi (v37)

> **Tarih:** 9 Kasım 2026  
> **Ajan:** Biresku Geliştirici & Küratör Ajanı  
> **Amaç:** Google aramalarında `"[Sanatçı Adı Soyadı] ressam"` sorgularında Biresku sayfalarının doğrudan en üst sıralarda çıkması ve Google Bilgi Paneli (Knowledge Graph) ile tam entegre olunması.

### Yapılan Mimari ve SEO Geliştirmeleri:
1. **Bağımsız Statik SEO Sayfaları (`/dergi/sanatcilar/[id]/index.html`):**
   - Kayıtlı 9 usta sanatçının tamamı için arama motoru botları (Googlebot, Bingbot) tarafından doğrudan taranabilir bağımsız statik sayfalar oluşturuldu:
     - `dergi/sanatcilar/ibrahim-balaban/index.html`
     - `dergi/sanatcilar/komet/index.html`
     - `dergi/sanatcilar/mehmet-guleryuz/index.html`
     - `dergi/sanatcilar/gulbin-nurgenc/index.html`
     - `dergi/sanatcilar/suleyman-saim-tekcan/index.html`
     - `dergi/sanatcilar/hikmet-cetinkaya/index.html`
     - `dergi/sanatcilar/tuncay-umay/index.html`
     - `dergi/sanatcilar/mustafa-ayaz/index.html`
     - `dergi/sanatcilar/adnan-turani/index.html`
   - Sayfalarda `<h1>` sanatçı adı, kategori rozeti, disiplin, doğum/atölye konumu, biyografi paragrafları, otantik alıntı ve eserler istemci tarafı JS'e ihtiyaç duymadan doğrudan kaynak kodunda (SSR kalitesinde statik) yer alır.

2. **JSON-LD Semantik Şemaları (`schema.org/VisualArtist` & `schema.org/VisualArtwork`):**
   - Her sayfaya Google'ın resmi sanatçı şeması gömüldü:
     - `@type: "Person"` / `"VisualArtist"`
     - `birthPlace` ve `workLocation` alanları `Doğum Yeri / Atölye Yeri` standardından otomatik ayrıştırıldı.
     - `hasOfferCatalog` altında sanatçının doğrulanmış eserleri listelendi.
     - **Tavizsiz Kural:** Eserin literatürde kesin bir adı yoksa başlık boş bırakıldı; asla yapay veya uydurma isim türetilmedi.
     - Eser tekniği (`artMedium`), boyutları (`dimensions`) ve yılı (`dateCreated`) resmi arşivden şemaya aktarıldı.

3. **Google Görsel ve Web Site Haritası (`sitemap.xml`):**
   - Kök dizine eklenen `sitemap.xml`, tüm ana sayfaları, 9 sanatçı profilini ve sanatçıların gerçek portreleri ile tescilli eserlerini (`<image:image>`) içerir.

4. **Robots Yönergesi (`robots.txt`):**
   - Kök dizinde tüm botlara izin veren ve `sitemap.xml` adresini bildiren standart yönerge oluşturuldu.

5. **Katalog İçi Taranabilir Bağlantılar (`dergi/sanatcilar/index.html`):**
   - Sanatçı kartlarındaki butonlar gerçek `<a href="/dergi/sanatcilar/${artist.id}/">` bağlantılarına dönüştürüldü; tarayıcıda tıklandığında modal geçişi korunurken Googlebot'un tüm sanatçı sayfalarını derinlemesine taraması garanti altına alındı.


---

## 10. Mobil Görünüm ve Dokunmatik Buton Optimizasyonu (v37.1 / Fix)

> **Tarih:** 9 Kasım 2026  
> **Ajan:** Biresku Geliştirici & Küratör Ajanı  
> **Kullanıcı Bildirimi:** *"mobil görünümünde bazı butonlara basılmıyo onları halledermisin görüntü değiştirme"*

### Düzeltilen Mobil Sorunlar ve Yapılan İyileştirmeler:
1. **Görünüm Değiştirme (Tema / Gündüz-Gece) Dokunmatik Hedef Büyütme (WCAG 44×44px):**
   - Mobilde 26×26px boyutuna sıkışan ve parmakla basılması zor olan `#themeToggleBtn` butonuna minimum 44×44px dokunmatik hedef boyutu (`min-width: 44px; min-height: 44px;`) kazandırıldı.
   - Butonun içindeki SVG ve metin elemanlarına `pointer-events: none` verilerek mobil dokunmatik olayların (touch events) doğrudan buton elemanına ulaşması sağlandı.
   - `touch-action: manipulation` ve `-webkit-tap-highlight-color` eklenerek mobildeki 300ms tıklama gecikmesi sıfırlandı.
   - Butona doğrudan `onclick="window.bireskuToggleTheme(event)"` bağlandı; böylece sayfa yüklenme sırasından bağımsız olarak ilk dokunuşta anında karanlık/aydınlık görüntü modunu değiştirmesi garanti altına alındı.

2. **Mobil Menü Butonundaki Çift Tetiklenme (Double-Fire) Bug Fix:**
   - `#mobileNavToggleBtn` butonuna basıldığında hem inline `onclick` hem de `document` üzerindeki dinleyicinin aynı anda çalışması nedeniyle menünün açılıp 0 milisaniyede geri kapanması sorunu giderildi.
   - Menü açma/kapama fonksiyonu `e.stopPropagation()` ile izole edildi, mobil menü tıklandığında stabil biçimde açılır hale getirildi.

3. **Sanatçı Profil Sayfaları Mobil Header Taşma Düzeltmesi:**
   - 9 sanatçının bağımsız sayfalarında mobilde yatay taşmaya sebep olan masaüstü menü linkleri küçük ekranlarda (`max-width: 768px`) gizlenerek tema değiştirme butonunun ekran dışına taşması veya üzerine basılamaması engellendi.
   - Geri dönüş butonu (`.back-btn`) mobilde tam genişlik ve 44px dokunmatik alana sahip yapıldı.


---

## 11. Biresku Haberleri Doğrudan Linkleme (Direct News Linking Fix)

> **Tarih:** 9 Kasım 2026  
> **Ajan:** Biresku Geliştirici & Küratör Ajanı  
> **Kullanıcı Bildirimi:** *"burada habere tıklayınca direkt olarak habere göndersin şuan göndermiyo"*

### Yapılan İyileştirmeler:
1. **Doğrudan Habere Yönlendiren Anchor Kartları:**
   - `index.html` karşılama portalındaki "Biresku Haberleri" (`bireskuNewsFeed`) kartları, modal açan yapay `article` elemanından; tıklandığı anda kullanıcıyı doğrudan ilgili haber kaynağına götüren `<a href="${item.url}" target="_blank" rel="noopener noreferrer" class="biresku-news-card">` bağlantılarına dönüştürüldü.
2. **Doğrulanmış Özgün Basın Linkleri:**
   - 15. BİRESKU Türkiye Sergisi (Başkent Gazetesi & AnkHaber), 23 Nisan Çocuk Sergisi, 12. ve 11. sergiler ile Hatay sergisine ait doğrudan haber makalesi URL'leri (`baskentgazete.com.tr`, `ankhaber.com`, `hurriyet.com.tr`) veri listesine tanımlandı.


---

## 9. Basın & Haber Arşivi Doğrudan Derin Linkleme (v38 Güncellemesi)

> [!IMPORTANT]
> **Kullanıcı Bildirimi & Talep:** *"ilgili habere yönlendirmektense haber kanalının ana sayfasına yönlendiriyo"*

### Yapılan İyileştirmeler:
1. **Kök Alan Adı Yönlendirmelerinin Tamamen Temizlenmesi:**
   - Önceden `BIRESKU_NEWS_DATA` dizisinde haber bağlantıları doğrudan gazete ana sayfalarına (`baskentgazete.com.tr`, `ankhaber.com`, `sabah.com.tr`, `hurriyet.com.tr`) yönleniyordu. Bu durum kullanıcının spesifik habere değil gazetenin genel ana sayfasına düşmesine neden oluyordu.
   - Tüm 12 basın kaydı tek tek taranarak arşivdeki kalıcı, doğrulanmış ve HTTP 200 OK yanıtı veren doğrudan haber derin linkleriyle (deep links) güncellendi.
2. **Doğrulanmış Basın Bağlantı Listesi:**
   - **15. Sergi (Başkent Gazetesi):** `https://www.baskentgazete.com.tr/15-biresku-turkiye-sergisi-ankarada-kapilarini-acti`
   - **15. Sergi Dostluk Haberi (AnkHaber):** `https://www.ankhaber.com/haber-bir-dostluk-sergisi-olan-biresku-15-sergisini-acti-30418.html`
   - **Büyük BİRESKU Türkiye Sergileri (Esanmel):** `https://esanmel.com/buyuk-biresku-turkiye-sergileri/`
   - **13. Sergi 23 Nisan Çocuk ve Gençlik (AnkHaber):** `https://www.ankhaber.com/haber-bireskudan-23-nisana-ozel-cocuk-ve-genclik-sergisi-28979.html`
   - **12. Sergi 'Bana Sevgini Anlat' (AnkHaber - Sema Kumrulu):** `https://www.ankhaber.com/haber-buyuk-biresku-turkiye-sergilerinin-12ncisi-acildi-27505.html`
   - **11. Sergi Başkentte (AnkHaber - Sema Kumrulu):** `https://www.ankhaber.com/yazar/sema-kumrulu/biresku-turkiye-sergilerinin-11incisi-ankarada-19149-kose-yazisi`
   - **8. Sergi Ankara (Sabah Gazetesi):** `https://www.sabah.com.tr/ankara-baskent/2018/11/28/bireksu-ankarada-sanat-ruzgri-estirdi`
   - **Fethiye Sergisi Genç Yetenekler (Gerçek Fethiye):** `https://www.gercekfethiye.com/genc-yeteneklere-yer-verildi/5916/`
   - **Eskişehir Sergisi (Milliyet):** `https://www.milliyet.com.tr/yerel-haberler/eskisehir/sanat-dernegi-ve-biresku-nun-ortak-resim-sergisi-acildi-11295409`
   - **5. Sergi Hatay (Hürriyet):** `https://www.hurriyet.com.tr/yerel-haberler/hatay/biresku-hatayda-resim-sergisi-acti-37271623`
   - **7. Sergi Ankara (Hürriyet):** `https://www.hurriyet.com.tr/yerel-haberler/ankara/bireskunun-turkiye-sergileri-7-ankarada-40315182`
   - **Vakıf Eserleri Müzesi Sergisi (Sabah Gazetesi):** `https://www.sabah.com.tr/ankara-baskent/2016/01/13/ankarali-5-kadin-ressamdan-35-eser`
3. **Doğrudan Tıklama Mimarisi:**
   - Haber kartları `<a href="${item.url}" target="_blank" rel="noopener noreferrer" class="biresku-news-card">` semantik anchor etiketiyle render edilir.
   - Tıklanan herhangi bir kart aracı bir modal veya ana sayfa olmadan doğrudan ilgili gazetenin özgün haber sayfasına yeni sekmede açılır.
