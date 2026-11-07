# Biresku Portal

Biresku Dergisi resmi yönlendirme ve karşılama sayfası.

- **Alan Adı:** [biresku.com](https://biresku.com)
- **Hedef:** `biresku.com/dergi`
- **Barındırma:** GitHub Pages + Cloudflare DNS

## Dosya Yapısı

- `index.html`: Karşılama ve otomatik yönlendirme (sayaç & buton) sayfası.
- `CNAME`: GitHub Pages özel alan adı (`biresku.com`) tanımı.
- `.nojekyll`: Statik dosyaların doğrudan sunulmasını sağlar.
- `404.html`: Hatalı linklerde otomatik olarak `/dergi` adresine yönlendiren yedek sayfa.
