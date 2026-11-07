import urllib.request
import xml.etree.ElementTree as ET
import json
import re
import os

ART_IMAGES = [
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80"
]

def fetch_google_art_news():
    url = "https://news.google.com/rss/search?q=sanat+OR+sergi+OR+ressam+OR+galeri&hl=tr&gl=TR&ceid=TR:tr"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    
    with urllib.request.urlopen(req, timeout=15) as response:
        xml_data = response.read()
        
    root = ET.fromstring(xml_data)
    items = []
    
    for idx, item in enumerate(root.findall(".//item")[:16]):
        title = item.find("title").text if item.find("title") is not None else ""
        link = item.find("link").text if item.find("link") is not None else "#"
        pub_date = item.find("pubDate").text if item.find("pubDate") is not None else ""
        source_elem = item.find("source")
        source = source_elem.text if source_elem is not None else "Google Haberler"
        
        # Clean title
        clean_title = re.sub(r"\s*-\s*[^-]+$", "", title).strip()
        
        # Category estimation
        cat = "Sanat Haberi"
        t_lower = clean_title.lower()
        if "sergi" in t_lower:
            cat = "Sergi"
        elif "galeri" in t_lower or "müze" in t_lower:
            cat = "Galeri"
        elif "ressam" in t_lower or "heykel" in t_lower:
            cat = "Sanatçı"
        elif "ödül" in t_lower or "bienal" in t_lower:
            cat = "Etkinlik"
            
        items.append({
            "id": idx + 1,
            "title": clean_title,
            "link": link,
            "source": source,
            "date": pub_date[:16] if pub_date else "Bugün",
            "category": cat,
            "image": ART_IMAGES[idx % len(ART_IMAGES)]
        })
        
    return items

if __name__ == "__main__":
    try:
        news = fetch_google_art_news()
        
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        out_path = os.path.join(base_dir, "dergi", "news.json")
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(news, f, ensure_ascii=False, indent=2)
            
        print(f"Successfully fetched {len(news)} Google Art news items -> {out_path}")
    except Exception as e:
        print(f"Error fetching news: {e}")
