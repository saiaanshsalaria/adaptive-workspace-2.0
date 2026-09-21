from reportlab.lib import colors
from reportlab.lib.pagesizes import A3
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from math import sin, cos, pi


OUT = "docs/adaptive-workspace-a3-poster.pdf"
W, H = A3

INK = HexColor("#17352A")
DEEP = HexColor("#0E241D")
MINT = HexColor("#C8E6C9")
SAGE = HexColor("#8FB89B")
CREAM = HexColor("#FAF9F5")
PEACH = HexColor("#F1C7A9")
GOLD = HexColor("#E8B86A")
MUTED = HexColor("#557064")
WHITE = colors.white


def rounded(c, x, y, w, h, r, fill, stroke=None, sw=1):
    c.setFillColor(fill)
    c.setStrokeColor(stroke or fill)
    c.setLineWidth(sw)
    c.roundRect(x, y, w, h, r, fill=1, stroke=1 if stroke else 0)


def text(c, value, x, y, size, color=INK, font="Helvetica", align="left"):
    c.setFillColor(color)
    c.setFont(font, size)
    if align == "center":
        c.drawCentredString(x, y, value)
    elif align == "right":
        c.drawRightString(x, y, value)
    else:
        c.drawString(x, y, value)


def wrapped(c, value, x, y, width, size, leading, color=MUTED, font="Helvetica"):
    words = value.split()
    line = ""
    lines = []
    for word in words:
        candidate = f"{line} {word}".strip()
        if stringWidth(candidate, font, size) <= width:
            line = candidate
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    for index, line in enumerate(lines):
        text(c, line, x, y - index * leading, size, color, font)
    return y - len(lines) * leading


def leaf(c, x, y, scale=1):
    c.saveState()
    c.setFillColor(MINT)
    c.setStrokeColor(INK)
    c.setLineWidth(1.4 * scale)
    c.translate(x, y)
    c.rotate(35)
    c.ellipse(-9 * scale, -3 * scale, 10 * scale, 8 * scale, fill=1, stroke=1)
    c.setStrokeColor(INK)
    c.line(-7 * scale, 0, 7 * scale, 3 * scale)
    c.restoreState()


def draw_icon(c, kind, x, y, color=INK):
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(2.4)
    if kind == "camera":
        c.roundRect(x - 17, y - 11, 34, 22, 5, fill=0, stroke=1)
        c.circle(x, y, 7, fill=0, stroke=1)
        c.line(x - 11, y + 11, x - 5, y + 16)
    elif kind == "brain":
        c.circle(x - 7, y + 1, 7, fill=0, stroke=1)
        c.circle(x + 6, y + 3, 7, fill=0, stroke=1)
        c.line(x - 8, y - 6, x + 7, y - 6)
        c.line(x - 1, y + 12, x - 1, y - 11)
    elif kind == "shield":
        p = c.beginPath()
        p.moveTo(x, y + 15)
        p.lineTo(x + 13, y + 9)
        p.lineTo(x + 10, y - 8)
        p.curveTo(x + 6, y - 15, x - 6, y - 15, x - 10, y - 8)
        p.lineTo(x - 13, y + 9)
        p.close()
        c.drawPath(p, fill=0, stroke=1)
        c.line(x - 6, y, x - 1, y - 5)
        c.line(x - 1, y - 5, x + 7, y + 6)
    elif kind == "pulse":
        p = c.beginPath()
        p.moveTo(x - 18, y)
        p.lineTo(x - 10, y)
        p.lineTo(x - 5, y + 10)
        p.lineTo(x + 2, y - 12)
        p.lineTo(x + 8, y)
        p.lineTo(x + 18, y)
        c.drawPath(p, fill=0, stroke=1)


def device(c, x, y, w, h, label, value, accent):
    rounded(c, x, y, w, h, 14, WHITE, HexColor("#D7E4D9"), 1)
    c.setFillColor(accent)
    c.circle(x + 25, y + h - 27, 8, fill=1, stroke=0)
    text(c, label, x + 44, y + h - 32, 14, MUTED, "Helvetica-Bold")
    text(c, value, x + 22, y + 22, 23, INK, "Helvetica-Bold")


def main():
    c = canvas.Canvas(OUT, pagesize=A3)
    c.setTitle("Adaptive AI Workspace — Expo Poster")

    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Decorative background shapes
    c.setFillColor(MINT)
    c.circle(W - 40, H - 45, 135, fill=1, stroke=0)
    c.setFillColor(PEACH)
    c.circle(35, 75, 115, fill=1, stroke=0)
    c.setFillColor(HexColor("#E5F0E6"))
    c.circle(W * 0.52, H * 0.47, 235, fill=1, stroke=0)
    for i in range(8):
        c.setStrokeColor(HexColor("#D4E6D7"))
        c.setLineWidth(1)
        c.arc(W - 270 + i * 12, H - 230 + i * 8, W - 100 + i * 12, H - 60 + i * 8, 20, 110)

    # Header
    leaf(c, 79, H - 72, 1.35)
    text(c, "ADAPTIVE WORKSPACE", 112, H - 68, 16, MUTED, "Helvetica-Bold")
    text(c, "A quieter way to work.", 76, H - 145, 54, INK, "Helvetica-Bold")
    text(c, "An AI-powered workspace that understands your rhythm", 80, H - 180, 21, MUTED, "Helvetica")
    text(c, "and gently adapts your environment — not the other way around.", 80, H - 208, 21, MUTED, "Helvetica")
    rounded(c, W - 250, H - 92, 150, 42, 21, INK)
    text(c, "PRIVACY FIRST", W - 175, H - 77, 13, WHITE, "Helvetica-Bold", "center")

    # Main visual: camera to adaptive environment
    panel_x, panel_y, panel_w, panel_h = 75, H - 635, W - 150, 340
    rounded(c, panel_x, panel_y, panel_w, panel_h, 28, DEEP)
    text(c, "FROM SIGNALS", panel_x + 32, panel_y + panel_h - 43, 13, MINT, "Helvetica-Bold")
    text(c, "to a calmer workspace", panel_x + 32, panel_y + panel_h - 78, 30, WHITE, "Helvetica-Bold")

    # Camera illustration
    cx, cy = panel_x + 175, panel_y + 142
    c.setFillColor(HexColor("#244C3C"))
    c.circle(cx, cy, 93, fill=1, stroke=0)
    c.setStrokeColor(MINT)
    c.setLineWidth(2)
    c.circle(cx, cy, 73, fill=0, stroke=1)
    c.circle(cx, cy + 20, 22, fill=0, stroke=1)
    c.arc(cx - 34, cy - 35, cx + 34, cy + 18, 200, 340)
    c.line(cx - 44, cy - 7, cx - 18, cy - 15)
    c.line(cx + 18, cy - 15, cx + 44, cy - 7)
    draw_icon(c, "camera", cx, cy - 105, MINT)
    text(c, "camera stays in the browser", cx, cy - 132, 13, MINT, "Helvetica", "center")

    # Flow arrows and metric pills
    arrow_x = panel_x + 320
    for idx, (label, val, color) in enumerate([
        ("POSTURE", "aligned", SAGE),
        ("FATIGUE", "low", GOLD),
        ("LIGHT", "balanced", PEACH),
    ]):
        yy = panel_y + 225 - idx * 66
        c.setStrokeColor(color)
        c.setLineWidth(1.5)
        c.line(arrow_x - 28, yy, arrow_x + 6, yy)
        c.line(arrow_x + 6, yy, arrow_x - 2, yy + 6)
        c.line(arrow_x + 6, yy, arrow_x - 2, yy - 6)
        rounded(c, arrow_x + 25, yy - 20, 150, 40, 20, HexColor("#1D3E31"), color, 1)
        text(c, label, arrow_x + 42, yy + 3, 10, color, "Helvetica-Bold")
        text(c, val, arrow_x + 42, yy - 11, 13, WHITE, "Helvetica-Bold")

    # Simulated devices
    dx = panel_x + 555
    device(c, dx, panel_y + 171, 175, 70, "LIGHTING", "warm +12%", MINT)
    device(c, dx, panel_y + 82, 175, 70, "AMBIENCE", "steady", PEACH)
    device(c, dx, panel_y - 7, 175, 70, "BREAK PACE", "in 18 min", GOLD)
    text(c, "SIMULATED IOT RESPONSE", dx, panel_y - 35, 11, MINT, "Helvetica-Bold")

    # Features section
    y = H - 685
    text(c, "WHAT IT DOES", 80, y, 14, MUTED, "Helvetica-Bold")
    text(c, "One workspace. Many ways to feel better.", 80, y - 36, 29, INK, "Helvetica-Bold")
    wrapped(c, "Adaptive Workspace connects productivity, wellbeing and intelligent environment control in one calm interface.", 80, y - 61, W - 160, 14, 18, MUTED)
    cards = [
        ("camera", "Adaptive Vision", "Browser-only posture, fatigue and lighting analysis."),
        ("brain", "Grounded AI", "Chat with your tasks and uploaded documents."),
        ("pulse", "Focus Analytics", "See focus sessions, patterns and progress over time."),
        ("shield", "Private by design", "Secure accounts, HTTP-only cookies and no video uploads."),
    ]
    card_w, card_h, gap = (W - 160 - 45) / 4, 190, 15
    for i, (kind, title, desc) in enumerate(cards):
        x = 80 + i * (card_w + gap)
        card_y = y - 300
        rounded(c, x, card_y, card_w, card_h, 18, WHITE, HexColor("#D7E4D9"), 1)
        c.setFillColor(MINT if i % 2 == 0 else PEACH)
        c.circle(x + 32, card_y + card_h - 34, 24, fill=1, stroke=0)
        draw_icon(c, kind, x + 32, card_y + card_h - 34, INK)
        text(c, title, x + 20, card_y + card_h - 78, 16, INK, "Helvetica-Bold")
        wrapped(c, desc, x + 20, card_y + card_h - 105, card_w - 40, 12, 17, MUTED)
        detail = [
            "Live browser analysis\nfor posture, fatigue\nand lighting.",
            "Answers grounded in\nyour documents, tasks\nand projects.",
            "Session history reveals\npatterns and progress\nover time.",
            "No video uploads.\nSecure authentication.\nYou stay in control.",
        ][i]
        for j, line in enumerate(detail.split("\n")):
            text(c, line, x + 20, card_y + 42 - j * 15, 10, INK, "Helvetica-Bold")

    # How it works strip
    strip_y = 105
    rounded(c, 80, strip_y, W - 160, 102, 22, INK)
    text(c, "HOW IT WORKS", 110, strip_y + 70, 12, MINT, "Helvetica-Bold")
    steps = [("01", "Observe", "signals"), ("02", "Understand", "patterns"), ("03", "Adapt", "gently")]
    for i, (num, title, sub) in enumerate(steps):
        sx = 285 + i * 235
        text(c, num, sx, strip_y + 57, 13, GOLD, "Helvetica-Bold")
        text(c, title, sx + 34, strip_y + 57, 17, WHITE, "Helvetica-Bold")
        text(c, sub, sx + 34, strip_y + 36, 13, MINT, "Helvetica")
        if i < 2:
            c.setStrokeColor(HexColor("#416957"))
            c.line(sx + 150, strip_y + 50, sx + 205, strip_y + 50)
            c.line(sx + 205, strip_y + 50, sx + 197, strip_y + 56)
            c.line(sx + 205, strip_y + 50, sx + 197, strip_y + 44)

    # Footer
    text(c, "Adaptive AI Workspace", 80, 65, 17, INK, "Helvetica-Bold")
    text(c, "Productivity that adapts to people.", 80, 43, 14, MUTED, "Helvetica")
    text(c, "Built for the future of focused work", W - 80, 55, 13, MUTED, "Helvetica", "right")
    c.setStrokeColor(INK)
    c.setLineWidth(1)
    c.line(W - 195, 25, W - 80, 25)
    text(c, "EXPO 2026", W - 80, 10, 12, INK, "Helvetica-Bold", "right")

    c.showPage()
    c.save()


if __name__ == "__main__":
    main()
