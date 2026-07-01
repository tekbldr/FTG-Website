import os
from PIL import Image, ImageDraw, ImageFont

INK = (11, 11, 14); PAPER = (250, 250, 247); SPARK = (255, 94, 44)
MUTED = (140, 140, 142); GRID = (24, 24, 28)
AB = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
MN = "/System/Library/Fonts/Menlo.ttc"
MARK = Image.open("/Users/mike/FTG-Website/public/ftg-mark.png").convert("RGBA")
OUT = "/Users/mike/FTG-Website/public/insights"
os.makedirs(OUT, exist_ok=True)

TYPE_LABEL = {"news": "News", "article": "Article", "story": "Story", "podcast": "Podcast", "research": "Research"}


def wrap(d, text, font, maxw):
    words = text.split(); lines = []; cur = ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=font) <= maxw:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def spaced(d, text, font, x, y, fill, ls):
    for c in text:
        d.text((x, y), c, font=font, fill=fill, anchor="la")
        x += d.textlength(c, font=font) + ls


def make_cover(slug, title, vertical, typ, read=""):
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), INK); d = ImageDraw.Draw(img)
    for x in range(60, W, 60):
        d.line([(x, 0), (x, H)], fill=GRID)
    for y in range(60, H, 60):
        d.line([(0, y), (W, y)], fill=GRID)
    d.rectangle([0, 0, W, 4], fill=SPARK)

    wm = MARK.resize((560, round(560 * MARK.height / MARK.width)), Image.LANCZOS)
    wm.putalpha(wm.split()[3].point(lambda p: int(p * 0.05)))
    img.paste(wm, (W - 470, H - 300), wm)

    m = MARK.resize((146, round(146 * MARK.height / MARK.width)), Image.LANCZOS)
    img.paste(m, (64, 58), m)

    spaced(d, f"{vertical.upper()}   ·   {TYPE_LABEL.get(typ, typ).upper()}", ImageFont.truetype(MN, 20), 66, 196, SPARK, 3)

    # progressive shrink so long titles still fit in <=4 lines
    for size in (64, 57, 50, 44, 39):
        f_t = ImageFont.truetype(AB, size)
        lines = wrap(d, title, f_t, 1015)
        if len(lines) <= 4:
            break
    lines = lines[:4]
    lh = f_t.size + 11
    y = 250
    for ln in lines:
        d.text((66, y), ln, font=f_t, fill=PAPER, anchor="la"); y += lh

    f_f = ImageFont.truetype(MN, 18)
    spaced(d, "FTG · INSIGHTS", f_f, 66, 562, MUTED, 2)
    if read:
        rw = sum(d.textlength(c, font=f_f) for c in read)
        spaced(d, read, f_f, W - 66 - rw, 562, MUTED, 0)

    img.save(f"{OUT}/{slug}.png")


# slug, title, vertical, type, read  (mirrors scripts/seed-insights.mjs)
PIECES = [
    ("ftg-launch", "First Tech Group launches to build the digital economy's operating stack", "The Group", "news", "3 min read"),
    ("founding-thesis-money-machine-readable", "Our founding thesis: money is becoming machine-readable", "The Group", "article", "8 min read"),
    ("gulf-financial-infrastructure-head-start", "The Gulf's head start: why the next financial infrastructure is being built in the UAE and Saudi Arabia", "MENA", "research", "16 min read"),
    ("exchange-is-the-keystone", "Why the exchange is the keystone of the stack", "Markets", "article", "7 min read"),
    ("after-ftx-self-custody-default", "After FTX: making self-custody the default", "Money", "article", "7 min read"),
    ("arabic-first-not-translated", "Arabic-first, not Arabic-translated: the case for sovereign AI", "Applied AI", "article", "8 min read"),
    ("stablecoins-become-plumbing", "Stablecoins become plumbing: settlement, regulation, and the dirham", "Money", "research", "14 min read"),
    ("agents-will-need-wallets", "Agents will need wallets: the convergence of money and machine intelligence", "Applied AI", "article", "8 min read"),
    ("the-stack-ep-02-sovereign-ai", "The Stack — Ep. 02: Sovereign AI and the residency moment", "MENA", "podcast", "37 min listen"),
    ("ftg-ventures-rolling-open", "FTG Ventures opens rolling submissions", "The Group", "news", "3 min read"),
    ("why-we-build-and-operate", "Why we build and operate, not just fund", "The Group", "article", "6 min read"),
    ("prv-copilot-voice-native", "PRV Copilot: voice-native, wallet-integrated", "Applied AI", "story", "6 min read"),
    ("the-compounding-loop", "The compounding loop", "The Group", "article", "5 min read"),
    ("mena-digital-economy-outlook-2026", "MENA Digital-Economy Infrastructure — 2026 outlook", "MENA", "research", "22 min read"),
    ("the-stack-ep-01", "The Stack — Ep. 01: Owning markets, money, and intelligence", "The Group", "podcast", "41 min listen"),
    ("inside-diwan-os", "Inside Diwan OS: an Arabic-first lifecycle OS", "Applied AI", "story", "8 min read"),
    ("privacy-as-mathematics-prv-wallet", "Privacy as mathematics: the PRV Wallet thesis", "Money", "article", "6 min read"),
    ("building-exx1-from-the-metal-up", "Building Exx1 from the metal up", "Markets", "story", "9 min read"),
    ("markets-money-intelligence-one-stack", "Markets · Money · Intelligence: why we own the stack", "The Group", "article", "7 min read"),
    ("state-of-the-digital-asset-stack-2026", "State of the Digital-Asset Stack — 2026", "Markets", "research", "28 min read"),
]

for slug, title, vertical, typ, read in PIECES:
    make_cover(slug, title, vertical, typ, read)
# clean the sample
try:
    os.remove(f"{OUT}/_sample.png")
except OSError:
    pass
print(f"generated {len(PIECES)} covers in {OUT}")
