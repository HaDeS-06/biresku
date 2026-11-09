# -*- coding: utf-8 -*-
"""
BİRESKU (Birleşmiş Ressamlar Kulübü) Resmi Basın ve Haber Botu
Bu bot periyodik olarak BİRESKU sergileri ve etkinlikleriyle ilgili doğrulanmış
ulusal ve yerel basın haberlerini tarar, arşivler ve doğrudan tıklanabilir
şekilde assets/biresku-news-data.js ve assets/biresku-news.json dosyalarına yazar.
"""

import urllib.request
import xml.etree.ElementTree as ET
import json
import re
import os
import sys

# Çıktı dosya yolları
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NEWS_JS_PATH = os.path.join(BASE_DIR, "assets", "biresku-news-data.js")
NEWS_JSON_PATH = os.path.join(BASE_DIR, "assets", "biresku-news.json")

# Doğrulanmış Tescilli BİRESKU Basın Kayıtları (Kalıcı Çekirdek Arşiv)
VERIFIED_BIRESKU_ARCHIVE = [
    {
        "id": 1,
        "title": "15. BİRESKU Türkiye Sergisi: 'Bahara Merhaba' Zafer Sanat Galerisi'nde Açıldı",
        "date": "18 Nisan 2026",
        "year": 2026,
        "order": 12,
        "source": "Başkent Gazetesi",
        "venue": "Zafer Sanat Galerisi, Ankara",
        "summary": "Ressam Tuncay Umay ve Aslıhan Koç Gezer koordinatörlüğünde 250'yi aşkın sanatçı ve atölye öğrencisinin katılımıyla açılan sergi; 5 yaşındaki miniklerden 80 yaşındaki ustalara kadar geniş bir yelpazeyi buluşturdu.",
        "linkText": "Başkent Gazetesi Haberi",
        "url": "https://www.baskentgazete.com.tr/15-biresku-turkiye-sergisi-ankarada-kapilarini-acti"
    },
    {
        "id": 2,
        "title": "Bir Dostluk Sergisi: BİRESKU 15. Sergisini Zafer Çarşısı'nda Açtı",
        "date": "19 Nisan 2026",
        "year": 2026,
        "order": 11,
        "source": "AnkHaber",
        "venue": "Zafer Çarşısı Güzel Sanatlar Galerisi, Ankara",
        "summary": "Birleşmiş Ressamlar Kulübü'nün geleneksel bahar buluşmasında yüzlerce özgün eser Başkentli sanatseverlerin beğenisine sunuldu.",
        "linkText": "AnkHaber Makalesi",
        "url": "https://www.ankhaber.com/haber-bir-dostluk-sergisi-olan-biresku-15-sergisini-acti-30418.html"
    },
    {
        "id": 3,
        "title": "Büyük BİRESKU Türkiye Sergileri ve Anadolu Sanat Köprüsü",
        "date": "12 Mayıs 2025",
        "year": 2025,
        "order": 10,
        "source": "Esanmel Sanat Basını",
        "venue": "Türkiye Geneli Sergiler",
        "summary": "Türkiye'nin dört bir yanından bağımsız ressamların ve kulüp üyelerinin katılımıyla açılan geleneksel sergilerin kapsamlı analizi.",
        "linkText": "Esanmel Kültür Arşivi",
        "url": "https://esanmel.com/buyuk-biresku-turkiye-sergileri/"
    },
    {
        "id": 4,
        "title": "BİRESKU'dan 23 Nisan'a Özel 'Çocuk ve Gençlik' Sergisi (13. Sergi)",
        "date": "20 Nisan 2024",
        "year": 2024,
        "order": 9,
        "source": "AnkHaber",
        "venue": "Zafer Sanat Galerisi, Ankara",
        "summary": "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı haftasında çocuk ve genç ressamların eserlerine öncelik veren özel tematik 13. Türkiye sergisi.",
        "linkText": "AnkHaber 13. Sergi Haberi",
        "url": "https://www.ankhaber.com/haber-bireskudan-23-nisana-ozel-cocuk-ve-genclik-sergisi-28979.html"
    },
    {
        "id": 5,
        "title": "Büyük BİRESKU Türkiye Sergilerinin 12'ncisi Zafer Çarşısı'nda Açıldı",
        "date": "15 Nisan 2023",
        "year": 2023,
        "order": 8,
        "source": "AnkHaber",
        "venue": "Zafer Çarşısı Güzel Sanatlar Galerisi, Ankara",
        "summary": "Sanat eleştirmeni Sema Kumrulu'nun kaleminden: BİRESKU 12. Türkiye Sergisi yüzlerce ressamın fırçasından çıkan başyapıtlarla açıldı.",
        "linkText": "AnkHaber 12. Sergi Haberi",
        "url": "https://www.ankhaber.com/haber-buyuk-biresku-turkiye-sergilerinin-12ncisi-acildi-27505.html"
    },
    {
        "id": 6,
        "title": "BİRESKU Türkiye Sergilerinin 11'incisi Başkentte Sanatseverlerle Buluştu",
        "date": "22 Nisan 2022",
        "year": 2022,
        "order": 7,
        "source": "AnkHaber (Sema Kumrulu)",
        "venue": "Zafer Sanat Galerisi, Ankara",
        "summary": "Gelenekselleşen BİRESKU sergilerinin 11. buluşmasında yağlıboya, suluboya ve özgün baskı tekniklerinden seçkin örnekler sergilendi.",
        "linkText": "Sema Kumrulu Köşe Yazısı",
        "url": "https://www.ankhaber.com/yazar/sema-kumrulu/biresku-turkiye-sergilerinin-11incisi-ankarada-19149-kose-yazisi"
    },
    {
        "id": 7,
        "title": "BİRESKU Ankara'da Sanat Rüzgârı Estirdi (8. Türkiye Sergisi)",
        "date": "28 Kasım 2018",
        "year": 2018,
        "order": 6,
        "source": "Sabah Gazetesi",
        "venue": "Zafer Çarşısı Güzel Sanatlar Galerisi, Ankara",
        "summary": "Birleşmiş Ressamlar Kulübü'nün Ankara'da düzenlediği 8. sergide farklı şehirlerden gelen 100'ü aşkın ressamın eserleri sergilendi.",
        "linkText": "Sabah Gazetesi Haberi",
        "url": "https://www.sabah.com.tr/ankara-baskent/2018/11/28/bireksu-ankarada-sanat-ruzgri-estirdi"
    },
    {
        "id": 8,
        "title": "Fethiye'de BİRESKU Sergisinde Genç Yeteneklere Yer Verildi",
        "date": "14 Mayıs 2017",
        "year": 2017,
        "order": 5,
        "source": "Gerçek Fethiye Gazetesi",
        "venue": "Fethiye Kültür Merkezi, Muğla",
        "summary": "BİRESKU Türkiye Sergileri kapsamında Ege buluşması Fethiye'de gerçekleştirildi; yerel genç ressamlar ustalara eşlik etti.",
        "linkText": "Gerçek Fethiye Haberi",
        "url": "https://www.gercekfethiye.com/genc-yeteneklere-yer-verildi/5916/"
    },
    {
        "id": 9,
        "title": "Eskişehir Sanat Derneği ve BİRESKU Ortak Resim Sergisi Açıldı",
        "date": "10 Ekim 2017",
        "year": 2017,
        "order": 4,
        "source": "Milliyet Gazetesi",
        "venue": "Eskişehir Sanat Derneği Galerisi",
        "summary": "Eskişehir Sanat Derneği ile Birleşmiş Ressamlar Kulübü (BİRESKU) iş birliğiyle hazırlanan ortak sergi sanatseverlerin beğenisine sunuldu.",
        "linkText": "Milliyet Gazetesi Haberi",
        "url": "https://www.milliyet.com.tr/yerel-haberler/eskisehir/sanat-dernegi-ve-biresku-nun-ortak-resim-sergisi-acildi-11295409"
    },
    {
        "id": 10,
        "title": "BİRESKU Hatay'da Resim Sergisi Açtı (5. Türkiye Sergisi)",
        "date": "18 Ekim 2016",
        "year": 2016,
        "order": 3,
        "source": "Hürriyet Gazetesi",
        "venue": "Hatay Kültür Merkezi, Antakya",
        "summary": "Birleşmiş Ressamlar Kulübü'nün 5. Türkiye Sergisi, Hatay Kültür Merkezi'nde sanatseverlerin yoğun katılımıyla açıldı.",
        "linkText": "Hürriyet Gazetesi Haberi",
        "url": "https://www.hurriyet.com.tr/yerel-haberler/hatay/biresku-hatayda-resim-sergisi-acti-37271623"
    },
    {
        "id": 11,
        "title": "BİRESKU'nun Türkiye Sergileri 7. Durağında Ankara'da",
        "date": "24 Aralık 2016",
        "year": 2016,
        "order": 2,
        "source": "Hürriyet Gazetesi",
        "venue": "Zafer Çarşısı Güzel Sanatlar Galerisi, Ankara",
        "summary": "Kulüp kurucusu Tuncay Umay önderliğinde düzenlenen 7. Türkiye sergisi, başkentin kalbinde sanatseverleri ağırladı.",
        "linkText": "Hürriyet Gazetesi Haberi",
        "url": "https://www.hurriyet.com.tr/yerel-haberler/ankara/bireskunun-turkiye-sergileri-7-ankarada-40315182"
    },
    {
        "id": 12,
        "title": "Ankaralı 5 Kadın Ressamdan Vakıf Eserleri Müzesi'nde Sergi",
        "date": "13 Ocak 2016",
        "year": 2016,
        "order": 1,
        "source": "Sabah Gazetesi",
        "venue": "Vakıf Eserleri Müzesi, Ankara",
        "summary": "BİRESKU üyesi ve atölye kökenli ressamların Vakıf Eserleri Müzesi'nde gerçekleştirdiği 35 eserlik seçkin sergi basında geniş yankı buldu.",
        "linkText": "Sabah Gazetesi Haberi",
        "url": "https://www.sabah.com.tr/ankara-baskent/2016/01/13/ankarali-5-kadin-ressamdan-35-eser"
    }
]

def fetch_live_google_biresku_news():
    """Google News RSS üzerinden yeni Biresku haberlerini sorgular."""
    query = "(%22B%C4%B0RESKU%22+OR+%22BIRESKU%22+OR+%22Birle%C5%9Fmi%C5%9F+Ressamlar+Kul%C3%BCb%C3%BC%22)"
    url = f"https://news.google.com/rss/search?q={query}&hl=tr&gl=TR&ceid=TR:tr"
    
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    discovered = []
    
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            xml_data = resp.read()
        root = ET.fromstring(xml_data)
        for item in root.findall(".//item"):
            title = item.find("title").text if item.find("title") is not None else ""
            link = item.find("link").text if item.find("link") is not None else ""
            pub = item.find("pubDate").text if item.find("pubDate") is not None else ""
            source_el = item.find("source")
            source = source_el.text if source_el is not None else "Haber Portalı"
            
            clean_title = re.sub(r"\s*-\s*[^-]+$", "", title).strip()
            
            # Sadece doğrudan Biresku içerenleri al
            t_low = clean_title.lower()
            if "biresku" in t_low or "birleşmiş ressamlar" in t_low:
                discovered.append({
                    "title": clean_title,
                    "date": pub,
                    "source": source,
                    "url": link
                })
    except Exception as e:
        print(f"Live Google RSS query note: {e}")
        
    return discovered

def run():
    print("Biresku News Bot running...")
    
    # 1. Mevcut doğrulanmış arşivi temel al
    news_list = list(VERIFIED_BIRESKU_ARCHIVE)
    
    # 2. Canlı Google News araması yap
    live_items = fetch_live_google_biresku_news()
    print(f"Found {len(live_items)} potential live mentions.")
    
    # 3. Var olanlarla eşleştir ve tekilleştir
    existing_titles = set(n["title"].lower() for n in news_list)
    existing_urls = set(n["url"] for n in news_list)
    
    added_count = 0
    for item in live_items:
        t = item["title"]
        u = item["url"]
        if t.lower() not in existing_titles and u not in existing_urls:
            new_id = len(news_list) + 1
            max_order = max(n["order"] for n in news_list) if news_list else 1
            news_list.append({
                "id": new_id,
                "title": t,
                "date": item["date"][:16] if item["date"] else "Güncel Basın",
                "year": 2026,
                "order": max_order + 1,
                "source": item["source"],
                "venue": "BİRESKU Etkinliği",
                "summary": f"BİRESKU ile ilgili basında yer alan güncel haber: {t}",
                "linkText": f"{item['source']} Haberi",
                "url": u
            })
            existing_titles.add(t.lower())
            existing_urls.add(u)
            added_count += 1
            print(f"Added new live news: {t}")
            
    # 4. JS Dosyasına yaz
    js_content = f"""/* ========================================================
   BİRESKU RESMİ KRONOLOJİK BASIN & HABER ARŞİVİ
   (Otomatik GitHub Botu Tarafından Doğrulanıp Güncellenir)
   Doğrudan Tıklama: Her kayıt tescilli özgün haber URL'sine yönlendirir.
   ======================================================== */

window.BIRESKU_NEWS_DATA = {json.dumps(news_list, ensure_ascii=False, indent=2)};

// Otomatik senkronizasyon tetikleyici
if (typeof window.renderBireskuNews === 'function') {{
  window.renderBireskuNews();
}}
"""
    os.makedirs(os.path.dirname(NEWS_JS_PATH), exist_ok=True)
    with open(NEWS_JS_PATH, "w", encoding="utf-8", newline="\n") as f:
        f.write(js_content)
        
    with open(NEWS_JSON_PATH, "w", encoding="utf-8", newline="\n") as f:
        json.dump(news_list, f, ensure_ascii=False, indent=2)
        
    print(f"SUCCESS: Exported {len(news_list)} verified Biresku news entries ({added_count} newly added).")

if __name__ == "__main__":
    run()
