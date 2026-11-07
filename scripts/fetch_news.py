import urllib.request
import xml.etree.ElementTree as ET
import json
import re
import os

ART_IMAGES = [
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=300&q=80"
]

MONTHS_TR = {
    "Jan": "Ocak", "Feb": "Şubat", "Mar": "Mart", "Apr": "Nisan",
    "May": "Mayıs", "Jun": "Haziran", "Jul": "Temmuz", "Aug": "Ağustos",
    "Sep": "Eylül", "Oct": "Ekim", "Nov": "Kasım", "Dec": "Aralık"
}

# Politikacı, kamu yöneticisi, parti ve siyasi bürokrasi terimleri filtresi
BLOCKED_POLITICAL_KEYWORDS = [
    "erdoğan", "erdogan", "kılıçdaroğlu", "kilicdaroglu", "imamoğlu", "imamoglu",
    "yavaş", "yavas", "özel", "ozel", "bahçeli", "bahceli", "akşener", "aksener",
    "cumhurbaşkanı", "cumhurbaskani", "başbakan", "basbakan", "bakanı", "bakani",
    "bakanlığı", "bakanligi", "bakan ", "milletvekili", "vali ", "kaymakam",
    "belediye", "belediyesi", "büyükşehir", "buyuksehir", "başkan ", "baskan ",
    "başkan", "baskan",
    "akp", "ak parti", "chp", "mhp", "iyi parti", "dem parti", "hdp", "zafer partisi",
    "tbmm", "meclis", "hükümet", "hukumet", "muhalefet", "koalisyon", "siyaset", "siyasi",
    "politika", "politik", "seçim", "secim", "oy pusulası", "propaganda", "ihale", "ödenek",
    "odenek", "bütçe", "butce", "kayyum", "tutuklama", "soruşturma", "sorusturma",
    "kamu davası", "adliye", "mahkeme", "iddianame", "gözaltı",
    "ortaokulu", "ilkokulu", "lisesi", "milli eğitim", "milli egitim", "meb",
    "müdürlüğü", "mudurlugu", "vietnam", "ministerstvo", "büyükelçilik", "konsolosluk"
]

def format_turkish_date(pub_date_str):
    if not pub_date_str:
        return "Bugün"
    match = re.search(r"(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})", pub_date_str)
    if match:
        day, mon, year = match.groups()
        mon_tr = MONTHS_TR.get(mon, mon)
        return f"{day.zfill(2)} {mon_tr} {year}"
    return "Bugün"

def is_political_or_administrative(text):
    t = text.lower()
    return any(kw in t for kw in BLOCKED_POLITICAL_KEYWORDS)

def fetch_google_art_news():
    queries = [
        '(%22sanat+sergisi%22+OR+%22%C3%A7a%C4%9Fda%C5%9F+sanat%22+OR+ressam+OR+%22heykel+sergisi%22+OR+%22sanat+galerisi%22+OR+%22m%C3%BCze+sergisi%22+OR+bienal)',
        '(%22resim+sergisi%22+OR+%22plastik+sanatlar%22+OR+%22art+fair%22+OR+%22contemporary+istanbul%22+OR+%22sanat%C3%A7%C4%B1%22)'
    ]
    
    items = []
    seen_signatures = []
    
    for q in queries:
        url = (
            f"https://news.google.com/rss/search?q={q}"
            "+-siyaset+-politika+-parti+-se%C3%A7im+-ihale+-belediye+-meb+-okul"
            "&hl=tr&gl=TR&ceid=TR:tr"
        )
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        try:
            with urllib.request.urlopen(req, timeout=15) as response:
                xml_data = response.read()
            root = ET.fromstring(xml_data)
        except Exception:
            continue
            
        for item in root.findall(".//item"):
            title = item.find("title").text if item.find("title") is not None else ""
            link = item.find("link").text if item.find("link") is not None else "#"
            pub_date = item.find("pubDate").text if item.find("pubDate") is not None else ""
            source_elem = item.find("source")
            source = source_elem.text if source_elem is not None else "Sanat Basını"
            
            clean_title = re.sub(r"\s*-\s*[^-]+$", "", title).strip()
            
            # Politik ve bürokratik filtreleme
            if is_political_or_administrative(f"{clean_title} {source}"):
                continue
                
            # Tekilleştirme
            words = set(re.findall(r"\w{4,}", clean_title.lower())[:3])
            if words and any(len(words.intersection(existing)) >= 2 for existing in seen_signatures):
                continue
            seen_signatures.append(words)
            
            # Kategori belirleme
            t_lower = clean_title.lower()
            cat = "Sanat Haberi"
            if "resim" in t_lower or "tablo" in t_lower or "fırça" in t_lower:
                cat = "Resim"
            elif "sergi" in t_lower:
                cat = "Sergi"
            elif "galeri" in t_lower or "müze" in t_lower:
                cat = "Galeri"
            elif "ressam" in t_lower or "heykel" in t_lower:
                cat = "Sanatçı"
            elif "bienal" in t_lower or "fuar" in t_lower or "contemporary" in t_lower:
                cat = "Etkinlik"
                
            items.append({
                "id": len(items) + 1,
                "title": clean_title,
                "link": link,
                "source": source,
                "date": format_turkish_date(pub_date),
                "category": cat,
                "image": ART_IMAGES[len(items) % len(ART_IMAGES)]
            })
            
            if len(items) >= 16:
                break
                
        if len(items) >= 16:
            break
            
    return items

if __name__ == "__main__":
    try:
        news = fetch_google_art_news()
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        out_path = os.path.join(base_dir, "dergi", "news.json")
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(news, f, ensure_ascii=False, indent=2)
            
        print(f"OK: Fetched {len(news)} curated fine art news items -> {out_path}")
    except Exception as e:
        print(f"Error fetching news: {e}")
