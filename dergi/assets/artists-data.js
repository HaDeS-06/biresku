// BIRESKU SANATCILAR VERISI
const ARTISTS_DATA = [
  {
    "id": "sanatci-1",
    "name": "Sanatçı 1",
    "discipline": "Çağdaş Yağlıboya & Soyutlama",
    "category": "Ressam",
    "city": "İstanbul",
    "studio": "Sanat Atölyesi",
    "coverImage": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80",
    "shortBio": "Ham pigmentler ve keten dokusu üzerinde zamanın ve belleğin soyut katmanlarını araştıran çağdaş ressam.",
    "biography": [
      "Güzel Sanatlar Fakültesi Resim Bölümü mezuniyetinin ardından çağdaş sanat alanında lisansüstü çalışmalarını tamamladı. 15 yılı aşkın süredir tuval üzerine yağlıboya, ham pigment ve keten bezi dokularıyla çalışan sanatçı; yurt içi ve yurt dışında çok sayıda kişisel ve karma sergide yer aldı.",
      "Sanatçının atölye pratiği; boyanın fiziksel dokusu ile tuvalin ışık geçirgenliği arasındaki dengeyi araştırmaya dayanır. Eserleri bugün çağdaş sanat koleksiyonlarında ve müzelerde sergilenmektedir."
    ],
    "quote": "Sanat, gözün gördüğü dünyayı tekrarlamak değil; ruhun ve belleğin görünmeyen yankılarını görünür kılmaktır.",
    "philosophy": [
      "Hayatı statik ve tekil bir gerçeklik değil, sürekli devinen, üst üste binen katmanlar ve ışık kırılmaları bütünü olarak görüyorum. Yaşamın hızı içerisinde insanın unuttuğu en kıymetli şey 'sessizlik'tir; bu yüzden tuvallerimde sessizliğin ve içsel boşluğun mekânını inşa etmeye çalışıyorum.",
      "Fırçanın tuvale değdiği an, zamanın askıya alındığı kutsal bir andır. Boyanın akışı rastlantısal değil; doğanın ve insanın iç dünyasının yüzeye yansıyan doğal bir sonucudur. Sanat bir süsleme değil, varoluşun hakikatine dokunma çabasıdır."
    ],
    "artworks": [
      {
        "title": "Sessizliğin Katmanları",
        "technique": "Tuval üzerine yağlıboya ve doğal pigment",
        "dimensions": "140 x 120 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "title": "Zamanın Yankısı",
        "technique": "Ham keten bezi üzerine yağlıboya",
        "dimensions": "160 x 130 cm",
        "year": "2025",
        "image": "https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "title": "Ufkun Ötesi",
        "technique": "Tuval üzerine akrilik ve yağlıboya",
        "dimensions": "110 x 95 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "title": "Gece ve Bellek",
        "technique": "Tuval üzerine katmanlı yağlıboya",
        "dimensions": "150 x 120 cm",
        "year": "2025",
        "image": "https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "title": "Işığın İlk Nefesi",
        "technique": "Büyük boy tuval üzerine karışık teknik",
        "dimensions": "180 x 140 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1000&q=80"
      }
    ]
  },
  {
    "id": "sanatci-2",
    "name": "Sanatçı 2",
    "discipline": "Heykel, Mermer & Bronz Döküm",
    "category": "Heykeltıraş",
    "city": "Ankara",
    "studio": "Heykel Stüdyosu",
    "coverImage": "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=1000&q=80",
    "shortBio": "Doğal taş ve bronzun mekanla kurduğu mimari diyaloğu kütle ve boşluk dengesiyle şekillendiren heykeltıraş.",
    "biography": [
      "Güzel Sanatlar Fakültesi Heykel Bölümü'nden dereceyle mezun oldu. Uluslararası taş yontu ve mekânsal form atölyelerinde araştırmalar yürüttü. Doğal taş, mermer, ham pirinç ve döküm bronz materyalleri bir arada kullanarak formun boşlukla ve mimari ışıkla kurduğu etkileşimi inceler.",
      "Sanatçı; kamusal alan heykelleri, mimari enstalasyonlar ve bienallerde sergilenen monolitik formlarıyla çağdaş heykel sanatında kendine özgü yalın bir dil geliştirmiştir."
    ],
    "quote": "Taşı yontarken ona yeni bir biçim vermiyorum; taşın kendi içinde milyonlarca yıldır sakladığı gizli formu özgür bırakıyorum.",
    "philosophy": [
      "Hayatın temel yasası, kütle ile boşluk arasındaki dengedir. İnsan varlığı da böyledir; var olduğumuz alan kadar, çevremizde bıraktığımız boşlukla tanımlanırız. Heykel yaparken fazlalıkları atmak, tıpkı yaşamda gereksiz yüklerden arınmak gibidir.",
      "Doğal taş milyonlarca yıllık jeolojik bir hafıza taşır. Bir heykeltıraş olarak rolüm, bu kadim hafızaya saygı duyarak insan aklının estetik arayışını doğanın sert kabuğunda görünür kılmaktır."
    ],
    "artworks": [
      {
        "title": "Mermerin Uyanışı",
        "technique": "Marmara mermeri ve pirinç kaide",
        "dimensions": "85 x 45 x 35 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "title": "Boşluğun Ritmi",
        "technique": "Döküm bronz ve patine",
        "dimensions": "70 x 50 x 45 cm",
        "year": "2025",
        "image": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "title": "Doğa ve Direnç",
        "technique": "Doğal bazalt ve çelik",
        "dimensions": "110 x 40 x 40 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "title": "Hafıza Parçaları",
        "technique": "Yontulmuş traverten taş",
        "dimensions": "60 x 60 x 30 cm",
        "year": "2025",
        "image": "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "title": "Yerçekimsiz Denge",
        "technique": "Pirinç ve monolitik mermer",
        "dimensions": "95 x 50 x 35 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1576769267415-9642010aa962?auto=format&fit=crop&w=1000&q=80"
      }
    ]
  },
  {
    "id": "sanatci-3",
    "name": "Sanatçı 3",
    "discipline": "Figüratif Resim & Karışık Teknik",
    "category": "Çağdaş",
    "city": "İzmir",
    "studio": "Sanat Atölyesi",
    "coverImage": "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1000&q=80",
    "shortBio": "İnsan psikolojisinin, yüzlerdeki sessiz fırtınaların ve modern yabancılaşmanın portrelerini çizen figüratif ressam.",
    "biography": [
      "Güzel Sanatlar Fakültesi Resim Bölümü'nden mezun oldu. İnsan psikolojisi, kimlik, yabancılaşma ve şehir hayatındaki bireyin iç çatışmalarını odağına alan sanatçı, ahşap paneller ve el yapımı kağıtlar üzerine yağlıboya, füzen ve mürekkep katmanları uygular.",
      "Uluslararası misafir sanatçı programlarına katılmış, figüratif çağdaş resim alanında yurt içi ve yurt dışında sergilere imza atmıştır."
    ],
    "quote": "Bir insan yüzü, yeryüzünün en derin ve en dürüst coğrafyasıdır. Fırçam o coğrafyadaki sessiz fırtınaları takip eder.",
    "philosophy": [
      "İnsan, modern dünyada sürekli bir rol oynamak ve maskeler takmak zorunda kalıyor. Benim resimlerimde aradığım şey ise o maskelerin düştüğü, insanın kendi çıplak hakikatiyle baş başa kaldığı kırılgan anlardır.",
      "Kusursuzluk estetiğine inanmıyorum; hayat da sanat da çatlaklarıyla, yarım kalmışlıklarıyla ve ham fırça darbeleriyle gerçektir. Tuvaldeki her iz, insanın dünyada var olma direnişinin bir kaydıdır."
    ],
    "artworks": [
      {
        "title": "Tanık Bakışlar",
        "technique": "Ahşap panel üzerine yağlıboya",
        "dimensions": "120 x 90 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "title": "Gölgenin Şiiri",
        "technique": "Tuval üzerine yağlıboya ve füzen",
        "dimensions": "100 x 80 cm",
        "year": "2025",
        "image": "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "title": "Şehir ve Yalnızlık",
        "technique": "Karışık teknik ve yağlıboya",
        "dimensions": "140 x 100 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "title": "İçsel Diyalog",
        "technique": "Keten üzerine yağlıboya",
        "dimensions": "90 x 70 cm",
        "year": "2025",
        "image": "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "title": "Zamanın Yüzü",
        "technique": "Ahşap üzerine yağlıboya ve altın varak",
        "dimensions": "110 x 85 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&w=1000&q=80"
      }
    ]
  },
  {
    "id": "sanatci-4",
    "name": "Sanatçı 4",
    "discipline": "Lirik Soyutlama & Suluboya",
    "category": "Ressam",
    "city": "Bursa",
    "studio": "Sanat Atölyesi",
    "coverImage": "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=1000&q=80",
    "shortBio": "Suyun ve pigmentin serbest akışında doğanın lirik ritmini ve varoluşun hafifliğini tuvale aktaran ressam.",
    "biography": [
      "Güzel Sanatlar Fakültesi'nde eğitim gördükten sonra geleneksel su sanatlarındaki akışkan boya prensiplerini modern soyutlama ile buluşturdu. 300 gram saf pamuklu Arches kağıtlar ve doğal bitkisel pigmentlerle ürettiği eserleriyle uluslararası sergilerde yer aldı.",
      "Sanatçının çalışmaları Doğu ve Batı estetiği arasındaki lirik köprü olarak değerlendirilmekte; suyun kontrol edilemez gücünü zihinsel disiplinle dengeleyen serileri galerilerde sergilenmektedir."
    ],
    "quote": "Su akar, pigment dağılır; sanatçı sadece doğanın kendi kendini çizmesine rehberlik eder.",
    "philosophy": [
      "Hayatı kontrol edilemeyen, öngörülemez ama büyüleyici bir nehir gibi görüyorum. İnsan hayatı zorla yönlendirmeye çalıştıkça yorulur; oysa su gibi akışa uyum sağlamak en büyük güçtür.",
      "Resim yaparken kontrolü tamamen elimde tutmam; suyun kağıt üzerinde nereye gitmek istediğini dinlerim. Bu, yaşamın karşımıza çıkardığı sürprizleri kabul etmenin sanatsal bir provasıdır. Sanat benim için evrenin uyumuna katılma biçimidir."
    ],
    "artworks": [
      {
        "title": "Suyun Rüyası",
        "technique": "Saf pamuk kağıt üzerine suluboya",
        "dimensions": "76 x 56 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "title": "Lirik Manzara",
        "technique": "Doğal pigment ve suluboya",
        "dimensions": "100 x 70 cm",
        "year": "2025",
        "image": "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "title": "Baharın İlk Titreşimi",
        "technique": "Akışkan suluboya tekniği",
        "dimensions": "80 x 60 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "title": "Rüzgarın İzi",
        "technique": "El yapımı kağıt üzerine lirik soyut",
        "dimensions": "90 x 65 cm",
        "year": "2025",
        "image": "https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=1000&q=80"
      },
      {
        "title": "Derin Mavi Melodi",
        "technique": "Ham kağıt üzerine suluboya ve çini mürekkebi",
        "dimensions": "110 x 75 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1000&q=80"
      }
    ]
  }
];
