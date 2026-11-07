// BIRESKU SANATCILAR VERISI
const ARTISTS_DATA = [
  {
    "id": "adnan-turani",
    "name": "Prof. Dr. Adnan Turani",
    "discipline": "Çağdaş Türk Resmi, Lirik Soyutlama & Sanat Kuramı",
    "category": "Ressam & Sanat Tarihçisi",
    "city": "Ankara / İstanbul",
    "studio": "Turani Atölyesi",
    "coverImage": "/assets/adnan-turani/adnan-turani-pp.jpg",
    "shortBio": "Türk çağdaş resim sanatının soyut ekoldeki öncülerinden; Türk sanat literatürünün temel başvuru kaynaklarını kaleme alan bilge sanat tarihçisi ve akademisyen.",
    "quote": "Sanat doğayı kopyalamak değil; doğadaki gizli tınıyı, ritmi ve insanın özgürlük arzusunu lekenin ve çizginin saf enerjisiyle yeniden var etmektir.",
    "biography": [
      "1925 yılında İstanbul Beşiktaş'ta doğan Prof. Dr. Adnan Turani, İstanbul Öğretmen Okulu'nun ardından 1945'te yetenek sınavlarını kazanarak Ankara Gazi Eğitim Enstitüsü Resim-İş Bölümü'ne girdi ve 1948 yılında mezun oldu. Bir süre resim öğretmenliği yaptıktan sonra kazandığı devlet bursuyla 1953'te Almanya'ya gitti. Münih Güzel Sanatlar Akademisi'nde Franz Nagel, Stuttgart Güzel Sanatlar Akademisi'nde Willi Baumeister ve Henninger, Hamburg Güzel Sanatlar Akademisi'nde ise Heinz Trökes atölyelerinde eğitim görerek Avrupa soyut sanatının ve Bauhaus ilkelerinin kuramsal temellerini özümsedi.",
      "1959'da Türkiye'ye dönen Turani; Gazi Eğitim Enstitüsü, Hacettepe Üniversitesi ve Bilkent Üniversitesi Güzel Sanatlar Fakültesi Resim Bölümü'nde kurucu öğretim üyeliği ve bölüm başkanlığı yaptı. 1973'te doktor, 1978'de doçent, 1986'da profesör unvanını aldı. 'Dünya Sanat Tarihi', 'Sanat Terimleri Sözlüğü', 'Batı Anlayışına Dönük Türk Resim Sanatı' ve 'Resimde Geometri' gibi Türkiye'de plastik sanatlar eğitiminin temel başvuru kaynakları haline gelen anıtsal kitapları kaleme aldı. Birleşmiş Ressamlar ve Heykeltıraşlar Derneği'nin (BRHD) kurucuları ve onur üyeleri arasında yer alarak Türk sanat ortamının kurumsallaşmasına ömrünü adadı."
    ],
    "philosophy": [
      "Adnan Turani'nin sanatsal ve düşünsel evreninin merkezinde 'özgürlük, mantıksal disiplin ve içtenlik' yer alır. Turani'ye göre soyutlama, keyfi bir karmaşa veya biçim bozuşumu değil; sanatçının zihnindeki geometrik mantık ile fırçanın kontrolsüz gibi görünen ama yüksek bir iç disipline dayanan lirik coşkusunun mükemmel dengesidir. Boyanın tuval üzerindeki yoğun dokusal varlığı (pentür lezzeti) ve çizginin kıvraklığı, tıpkı müzikteki polifonik sesler gibi kendi melodisini yaratmalıdır.",
      "Resimlerinde müzik, dans ve doğa en belirleyici tinsel esin kaynaklarıdır. Keman ve viyolonsel çalan müzisyenler ile dansçılar, somut bir anatomik temsil olmaktan sıyrılarak ışık, ritim ve renkten oluşan saf bir enerji alanına dönüşür. Turani; sanatın sadece atölyede tuval başında üretilen bir nesne değil, aynı zamanda felsefi derinliği olan, geçmişle gelecek arasında köprü kuran evrensel bir düşünce biçimi olduğuna inanmıştır."
    ],
    "artworks": [
      {
        "id": "turani-1",
        "title": "Marmaris Serisi",
        "year": "1998",
        "technique": "Tuval Üzerine Yağlıboya",
        "dimensions": "130 × 140 cm",
        "collection": "Özel Koleksiyon",
        "description": "Ege'nin ışığını, rüzgarını ve kıyıların dinamik ritmini lirik soyut leke düzeni ve zengin boya katmanlarıyla buluşturan ikonik çalışma.",
        "image": "/assets/adnan-turani/marmaris-serisi.jpg",
        "imageUrl": "/assets/adnan-turani/marmaris-serisi.jpg"
      },
      {
        "id": "turani-2",
        "title": "Viyolonsel Çalan Kadın",
        "year": "2004",
        "technique": "Tuval Üzerine Yağlıboya",
        "dimensions": "120 × 120 cm",
        "collection": "Sanatçı Aile Koleksiyonu",
        "description": "Müziğin tınısını ve çalgının akustik titreşimlerini ritmik fırça darbeleri ve derinlikli renk armonileriyle görselleştiren başyapıt.",
        "image": "/assets/adnan-turani/viyolonsel-calan-kadin.jpg",
        "imageUrl": "/assets/adnan-turani/viyolonsel-calan-kadin.jpg"
      },
      {
        "id": "turani-3",
        "title": "Âşıklar Serisi",
        "year": "2001",
        "technique": "Tuval Üzerine Yağlıboya",
        "dimensions": "140 × 140 cm",
        "collection": "Müze & Özel Koleksiyon",
        "description": "İnsan ruhunun yakınlaşmasını, tutkuyu ve kavuşma duygusunu figürün sınırlarını aşan soyut dışavurumcu bir enerjiyle tuvale yansıtan anıtsal kompozisyon.",
        "image": "/assets/adnan-turani/asiklar-serisi.jpg",
        "imageUrl": "/assets/adnan-turani/asiklar-serisi.jpg"
      },
      {
        "id": "turani-4",
        "title": "Müzisyenler - Trio",
        "year": "1995",
        "technique": "Tuval Üzerine Yağlıboya",
        "dimensions": "100 × 130 cm",
        "collection": "Kurumsal Sanat Koleksiyonu",
        "description": "Üç müzisyenin ortak tınısını polifonik renk lekeleri, kıvrak konturlar ve güçlü boya plastiğiyle sahneleyen ritmik çalışma.",
        "image": "/assets/adnan-turani/muzisyenler-trio.jpg",
        "imageUrl": "/assets/adnan-turani/muzisyenler-trio.jpg"
      },
      {
        "id": "turani-5",
        "title": "Dansçı (Dansöz Serisi)",
        "year": "2003",
        "technique": "Tuval Üzerine Yağlıboya",
        "dimensions": "115 × 170 cm",
        "collection": "Özel Koleksiyon",
        "description": "Bedenin hareket halindeki enerjisini, uçuşan kumaş kıvrımlarını ve ışık kırılmalarını coşkulu jestüel fırça vuruşlarıyla ölümsüzleştiren dinamik yapıt.",
        "image": "/assets/adnan-turani/dansci.jpg",
        "imageUrl": "/assets/adnan-turani/dansci.jpg"
      },
      {
        "id": "turani-6",
        "title": "Kemancı Kadın",
        "year": "2002",
        "technique": "Tuval Üzerine Yağlıboya",
        "dimensions": "120 × 120 cm",
        "collection": "Özel Koleksiyon",
        "description": "Keman yayının dinamik hareketini, müziğin ses dalgalarını ve sanatçının içsel ritmini yoğun pentür hamuruyla buluşturan lirik kompozisyon.",
        "image": "/assets/adnan-turani/kemanci.jpg",
        "imageUrl": "/assets/adnan-turani/kemanci.jpg"
      },
      {
        "id": "turani-7",
        "title": "Soyut Natürmort",
        "year": "1996",
        "technique": "Tuval Üzerine Yağlıboya",
        "dimensions": "110 × 140 cm",
        "collection": "Kurumsal Sanat Koleksiyonu",
        "description": "Geleneksel nesne formlarını kırarak onları ışık, renk lekeleri ve geometrik ritim dengesiyle modern bir dille yeniden inşa eden başyapıt.",
        "image": "/assets/adnan-turani/naturmort.jpg",
        "imageUrl": "/assets/adnan-turani/naturmort.jpg"
      },
      {
        "id": "turani-8",
        "title": "Sokak Çalgıcıları",
        "year": "1999",
        "technique": "Tuval Üzerine Yağlıboya",
        "dimensions": "100 × 100 cm",
        "collection": "Özel Koleksiyon",
        "description": "Kentin seslerini, halk ezgilerini ve sokak müzisyenlerinin coşkusunu soyut dışavurumcu leke paletiyle yansıtan dinamik yapıt.",
        "image": "/assets/adnan-turani/sokak-calgicilari.jpg",
        "imageUrl": "/assets/adnan-turani/sokak-calgicilari.jpg"
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
      },
      {
        "title": "Boşluğun Formu",
        "technique": "Bronz döküm ve patina",
        "dimensions": "65 x 40 x 30 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        "imageUrl": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
      },
      {
        "title": "Denge ve Sonsuzluk",
        "technique": "Marmara mermeri & siyah granit kaide",
        "dimensions": "110 x 50 x 45 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=800&q=80",
        "imageUrl": "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=800&q=80"
      },
      {
        "title": "Kanatlı Rüzgar",
        "technique": "Dövme bakır ve paslanmaz çelik",
        "dimensions": "95 x 60 x 35 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
        "imageUrl": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
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
      },
      {
        "title": "Gece Nöbeti",
        "technique": "Keten tuval üzerine yağlıboya",
        "dimensions": "130 x 100 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80",
        "imageUrl": "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80"
      },
      {
        "title": "Bellek Odası",
        "technique": "Karışık teknik ve yağlıboya",
        "dimensions": "110 x 110 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1582561141999-52e803a67d0f?auto=format&fit=crop&w=800&q=80",
        "imageUrl": "https://images.unsplash.com/photo-1582561141999-52e803a67d0f?auto=format&fit=crop&w=800&q=80"
      },
      {
        "title": "Arayış",
        "technique": "Ahşap panel üzerine yağlıboya",
        "dimensions": "140 x 95 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?auto=format&fit=crop&w=800&q=80",
        "imageUrl": "https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?auto=format&fit=crop&w=800&q=80"
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
      },
      {
        "title": "Güz Yankısı",
        "technique": "Saf pamuk kağıt üzerine suluboya",
        "dimensions": "76 x 56 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
        "imageUrl": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80"
      },
      {
        "title": "Mavi Düşler",
        "technique": "Arches kağıt üzerine suluboya ve mürekkep",
        "dimensions": "80 x 60 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
        "imageUrl": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
      },
      {
        "title": "Işığın Dansı",
        "technique": "Tuval üzerine akrilik ve suluboya",
        "dimensions": "100 x 120 cm",
        "year": "2026",
        "image": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
        "imageUrl": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80"
      }
    ]
  }
];
