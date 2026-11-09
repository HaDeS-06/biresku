

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
