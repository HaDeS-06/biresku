# BİRESKU — Birleşmiş Ressamlar Kulübü

Türk çağdaş sanatını, ressamlarımızın bağımsız üretimlerini ve koleksiyonerleri tek çatı altında toplayan ana sanat portalı ve dijital kültür merkezi.

- **Canlı Adres:** [biresku.com](https://biresku.com)
- **Barındırma:** GitHub Pages (Özel CNAME: `biresku.com`) + Cloudflare DNS
- **Teknoloji:** Modern Vanilla HTML5 / CSS3 / ES6+ JavaScript (Bağımsız, Sıfır Bağımlılık)

---

## 📌 Yapay Zekâ & Geliştirici Devir Dokümanı (Handover)

Geliştirici veya yapay zekâ geçişlerinde projenin mimarisi, veri modelleri, alınan kritik kararlar, kullanıcı kuralları ve son güncellemeler için lütfen detaylı devir dosyasını inceleyin:

👉 **[AI_HANDOVER.md](./AI_HANDOVER.md)**

---

## Proje Yapısı

- `index.html`: Ana portal (Brand Hero, Karşılama Resepsiyonu, Biresku Haberleri, Sanatçılar & Yeni Eklenenler vitrini).
- `dergi/`: Biresku Sanat & Edebiyat Dergisi (editoryal yazılar, sergiler, yeni eklenenler).
- `dergi/sanatcilar/`: Sanatçılar kataloğu ve dinamik tek sayfa profil alanları (`#profil=...`).
- `assets/artists-data.js`: Tek doğruluk kaynağı olan sanatçı, biyografi ve eser veritabanı.
- `assets/biresku-auth.js`: Kimlik doğrulama, üye girişi ve oturum yönetimi.
- `AI_HANDOVER.md`: Detaylı AI bağlamı, kullanıcı kuralları, sanatçı bilgileri ve son yapılan güncellemeler.
