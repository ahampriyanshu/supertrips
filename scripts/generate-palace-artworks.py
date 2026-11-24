import urllib.request, urllib.parse, json, os, time
from PIL import Image, ImageFilter, ImageOps, ImageEnhance
import numpy as np
from scipy.ndimage import gaussian_filter

HEADERS = {"User-Agent": "SuperTripsArchitecturalBot/1.0 (ahampriyanshu@gmail.com)"}
OUT_DIR = "/home/ubuntu/projects/supertrips/public/magazine"
TMP_DIR = "/tmp/palace_raw"
os.makedirs(TMP_DIR, exist_ok=True)
os.makedirs(OUT_DIR, exist_ok=True)

PALACES = [
    ("deeg-palace", "Deeg Palace Rajasthan"),
    ("jal-mahal", "Jal Mahal Jaipur"),
    ("umaid-bhawan-palace", "Umaid Bhawan Palace Jodhpur"),
    ("city-palace-udaipur", "City Palace Udaipur Rajasthan"),
    ("taj-lake-palace", "Taj Lake Palace Udaipur"),
    ("jai-vilas-mahal", "Jai Vilas Palace Gwalior"),
    ("jahangir-mahal-orchha", "Jahangir Mahal Orchha"),
    ("jahaz-mahal", "Jahaz Mahal Mandu"),
    ("laxmi-vilas-palace", "Laxmi Vilas Palace Vadodara"),
    ("chowmahalla-palace", "Chowmahalla Palace Hyderabad"),
    ("falaknuma-palace", "Falaknuma Palace Hyderabad"),
    ("bangalore-palace", "Bangalore Palace exterior"),
    ("mysore-palace", "Mysore Palace facade"),
    ("thirumalai-nayakkar-mahal", "Thirumalai Nayakkar Mahal pillars"),
    ("thanjavur-maratha-palace", "Thanjavur Maratha Palace Bell Tower"),
    ("mattancherry-palace", "Mattancherry Palace Kochi exterior"),
    ("padmanabhapuram-palace", "Padmanabhapuram Palace exterior"),
    ("hazarduari-palace", "Hazarduari Palace Murshidabad"),
    ("ujjayanta-palace", "Ujjayanta Palace Agartala"),
]

def get_commons_image_url(query):
    url = (
        "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrsearch="
        + urllib.parse.quote(query)
        + "&gsrlimit=3&prop=imageinfo&iiprop=url&iiurlwidth=1920"
    )
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        pages = data.get("query", {}).get("pages", {})
        for pid, page in pages.items():
            ii = page.get("imageinfo", [{}])[0]
            thumb = ii.get("thumburl")
            orig = ii.get("url")
            if thumb:
                return thumb
            if orig:
                return orig
    return None

def to_watercolor(raw_path, out_path, target_size=(1376, 768)):
    im = Image.open(raw_path).convert("RGB")
    w, h = im.size
    target_w, target_h = target_size
    target_ratio = target_w / target_h
    current_ratio = w / h

    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        offset = (w - new_w) // 2
        im = im.crop((offset, 0, offset + new_w, h))
    else:
        new_h = int(w / target_ratio)
        offset = (h - new_h) // 2
        im = im.crop((0, offset, w, offset + new_h))

    im = im.resize(target_size, Image.Resampling.LANCZOS)
    arr = np.array(im, dtype=np.float32) / 255.0

    # Color wash: simulate wet-on-wet paint pooling using iterative smoothed blending
    smooth1 = gaussian_filter(arr, (2.2, 2.2, 0))
    smooth2 = gaussian_filter(arr, (5.5, 5.5, 0))
    wash = 0.65 * smooth1 + 0.35 * smooth2

    # Sharpen architectural contours with a delicate pencil/ink sketch line
    gray = np.dot(arr[..., :3], [0.2989, 0.5870, 0.1140])
    g1 = gaussian_filter(gray, 1.0)
    g2 = gaussian_filter(gray, 3.2)
    dog = g1 - g2
    edges = np.clip(1.0 - (dog * 8.5), 0.0, 1.0)
    edges = edges[..., np.newaxis]

    # Blend wash with ink lines
    painted = wash * (0.15 + 0.85 * edges)

    # Add subtle watercolor cold-press paper grain
    np.random.seed(int(time.time() * 1000) % 10000)
    noise = np.random.normal(0.0, 0.028, (target_h, target_w))
    paper_grain = gaussian_filter(noise, 0.7)
    painted = np.clip(painted + paper_grain[..., np.newaxis], 0.0, 1.0)

    # Warm wash color grading (slight sepia / amber warmth in highlights)
    painted[..., 0] = np.clip(painted[..., 0] * 1.03 + 0.012, 0.0, 1.0)
    painted[..., 2] = np.clip(painted[..., 2] * 0.97 - 0.008, 0.0, 1.0)

    res = Image.fromarray((painted * 255.0).astype(np.uint8))
    res = ImageEnhance.Color(res).enhance(1.22)
    res = ImageEnhance.Contrast(res).enhance(1.08)
    res.save(out_path, "JPEG", quality=92, dpi=(300, 300))

def main():
    for slug, query in PALACES:
        out_file = os.path.join(OUT_DIR, f"{slug}-watercolor.jpg")
        # Check if already generated authentically
        if os.path.exists(out_file) and os.path.getsize(out_file) > 500000:
            print(f"Skipping {slug}, high-res artwork already exists ({os.path.getsize(out_file)} bytes)")
            continue

        raw_file = os.path.join(TMP_DIR, f"{slug}.jpg")
        print(f"Fetching {slug} ({query})...")
        img_url = get_commons_image_url(query)
        if not img_url:
            print(f"  FAILED to find image URL for query '{query}'")
            continue

        try:
            req = urllib.request.Request(img_url, headers=HEADERS)
            with urllib.request.urlopen(req) as resp:
                with open(raw_file, "wb") as f:
                    f.write(resp.read())
            to_watercolor(raw_file, out_file)
            print(f"  -> SUCCESS: {out_file} ({os.path.getsize(out_file)} bytes)")
        except Exception as e:
            print(f"  ERROR for {slug}: {e}")
        time.sleep(0.4)

if __name__ == "__main__":
    main()
