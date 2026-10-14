#!/usr/bin/env python3
"""Lint design.md: struktur wajib, token terdefinisi, hex valid, kontras WCAG.
Pemakaian: python scripts/lint_design.py design.md
Exit code 1 bila ada error."""
import re, sys

REQUIRED = ["Cara memakai", "Ringkasan dan provenance", "Karakter dan prinsip",
            "Layout dan grid", "Design tokens", "Komponen", "Motion",
            "Aksesibilitas", "Diamati vs diasumsikan", "Changelog"]

def lum(h):
    h = h.lstrip("#")
    if len(h) == 3: h = "".join(c * 2 for c in h)
    ch = []
    for i in (0, 2, 4):
        v = int(h[i:i+2], 16) / 255
        ch.append(v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4)
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]

def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

def main(path):
    text = open(path, encoding="utf-8").read()
    errors, warns = [], []

    heads = re.findall(r"^#{1,4}\s+(.*)$", text, re.M)
    for req in REQUIRED:
        if not any(req.lower() in h.lower() for h in heads):
            errors.append(f"Bagian wajib tidak ditemukan: '{req}'")

    # token terdefinisi di tabel: | `--nama` | `nilai` |
    defined = {}
    for m in re.finditer(r"^\|\s*`(--[\w-]+)`\s*\|\s*`([^`]+)`", text, re.M):
        val = m.group(2).strip()
        if val.startswith("--"):      # baris pasangan kontras, bukan definisi token
            continue
        defined[m.group(1)] = val

    # hex valid
    for name, val in defined.items():
        if name.startswith("--color") and val.startswith("#"):
            if not re.fullmatch(r"#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})", val):
                errors.append(f"Hex tidak valid di {name}: {val}")

    # semua var(--x) dan `--x` yang dirujuk harus terdefinisi
    used = set(re.findall(r"var\((--[\w-]+)\)", text))
    for u in sorted(used - set(defined)):
        errors.append(f"Token dipakai tapi tidak didefinisikan di tabel: {u}")

    # pasangan kontras: | `--fg` | `--bg` | ukuran | min |
    pairs = re.findall(r"^\|\s*`(--[\w-]+)`\s*\|\s*`(--[\w-]+)`\s*\|\s*([^|]+)\|\s*([\d.]+)\s*\|", text, re.M)
    if not pairs:
        warns.append("Tidak ada tabel 'Pasangan kontras'.")
    for fg, bg, size, mn in pairs:
        if fg not in defined or bg not in defined:
            errors.append(f"Pasangan kontras merujuk token tak dikenal: {fg} / {bg}")
            continue
        try:
            r = ratio(defined[fg], defined[bg])
        except Exception:
            errors.append(f"Tidak bisa menghitung kontras: {fg} / {bg}")
            continue
        status = "OK " if r >= float(mn) else "GAGAL"
        print(f"[{status}] {fg} di atas {bg}: {r:.2f}:1 (min {mn})")
        if r < float(mn):
            errors.append(f"Kontras {fg}/{bg} = {r:.2f} < {mn}")

    # item yang belum final
    n = len(re.findall(r"PERLU KONFIRMASI", text))
    if n:
        print(f"Info: kata 'PERLU KONFIRMASI' muncul {n}x (termasuk teks panduan); pastikan semua terdata di bagian Pertanyaan terbuka.")

    for w in warns: print("PERINGATAN:", w)
    for e in errors: print("ERROR:", e)
    print(f"Token terdefinisi: {len(defined)} | error: {len(errors)} | peringatan: {len(warns)}")
    return 1 if errors else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
