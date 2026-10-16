#!/usr/bin/env python3
"""
scripts/generate_book_variations.py
Menghasilkan variasi warna aset ikon buku (Book dan Book And Pencil)
berdasarkan token warna vibrant di design.md:
- Coral (#ff6562)
- Yellow (#ffd027)
- Orange (#ff8c21)
- Blue (#2563eb)
- Lavender (#c7b5eb)
- Mint (#36d399)

Menghasilkan berkas di assets/ dengan format:
1. Sesuai nama warna:
   - Book-<color>.png
   - Book2-<color>.png
   - Book And Pencil-<color>.png
   - Book And Pencil2-<color>.png
2. Sesuai penomoran akhiran (biasa, 2, 3, 4, 5, 6):
   - Book3.png (coral), Book4.png (blue), Book5.png (mint), Book6.png (yellow)
   - Book And Pencil3.png (coral), Book And Pencil4.png (blue), Book And Pencil5.png (lavender), Book And Pencil6.png (orange)
"""

import os
import numpy as np
from PIL import Image

ASSETS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets')

# Palet warna target mengacu pada DesignTokens di design.md / theme.ts
VIBRANT_PALETTE = {
    'coral': [240, 85, 82],      # #ff6562
    'yellow': [235, 195, 81],    # #ffd027 (cocok dengan Book And Pencil2)
    'orange': [219, 148, 75],    # #ff8c21 (cocok dengan Book2)
    'blue': [37, 99, 235],       # #2563eb
    'lavender': [98, 81, 162],   # #c7b5eb / #6251a2 (cocok dengan Book)
    'mint': [120, 165, 90],      # #36d399 / #78a55a (cocok dengan Book And Pencil)
}

def recolor_icon(input_path: str, target_rgb: list) -> Image.Image:
    im = Image.open(input_path).convert('RGBA')
    arr = np.array(im, dtype=float)
    
    alpha = arr[:, :, 3]
    rgb = arr[:, :, :3]
    
    mask = alpha > 10
    orig_opaque = rgb[alpha == 255]
    
    pixel_lum = (rgb[:, :, 0]*0.299 + rgb[:, :, 1]*0.587 + rgb[:, :, 2]*0.114)
    ref_lum = (orig_opaque[:, 0]*0.299 + orig_opaque[:, 1]*0.587 + orig_opaque[:, 2]*0.114).mean()
    scale = pixel_lum / max(ref_lum, 1.0)
    
    new_rgb = np.zeros_like(rgb)
    for c in range(3):
        val = target_rgb[c] * scale
        new_rgb[:, :, c] = np.clip(val, 0, 255)
        
    # Pertahankan garis tepi gelap (border/antialiasing outline)
    dark_mask = mask & (pixel_lum < 40)
    new_rgb[dark_mask] = rgb[dark_mask]
    
    out_arr = np.zeros_like(arr, dtype=np.uint8)
    out_arr[:, :, :3] = np.round(new_rgb).astype(np.uint8)
    out_arr[:, :, 3] = alpha.astype(np.uint8)
    
    return Image.fromarray(out_arr, 'RGBA')

def main():
    book_src = os.path.join(ASSETS_DIR, 'Book.png')
    book_pencil_src = os.path.join(ASSETS_DIR, 'Book And Pencil.png')
    
    assert os.path.exists(book_src), f"Not found: {book_src}"
    assert os.path.exists(book_pencil_src), f"Not found: {book_pencil_src}"
    
    print(f"Generating color variations in {ASSETS_DIR}...")
    
    # 1. Variasi Book-<color>.png dan Book2-<color>.png
    for color_name, target_rgb in VIBRANT_PALETTE.items():
        # Book (biasa)
        out_book = recolor_icon(book_src, target_rgb)
        out_path = os.path.join(ASSETS_DIR, f'Book-{color_name}.png')
        out_book.save(out_path)
        print(f"Saved: Book-{color_name}.png")
        
        # Book2 (akhiran 2)
        out_path2 = os.path.join(ASSETS_DIR, f'Book2-{color_name}.png')
        out_book.save(out_path2)
        print(f"Saved: Book2-{color_name}.png")

        # Book And Pencil (biasa)
        out_bp = recolor_icon(book_pencil_src, target_rgb)
        out_bp_path = os.path.join(ASSETS_DIR, f'Book And Pencil-{color_name}.png')
        out_bp.save(out_bp_path)
        print(f"Saved: Book And Pencil-{color_name}.png")

        # Book And Pencil2 (akhiran 2)
        out_bp_path2 = os.path.join(ASSETS_DIR, f'Book And Pencil2-{color_name}.png')
        out_bp.save(out_bp_path2)
        print(f"Saved: Book And Pencil2-{color_name}.png")

    # 2. Variasi bernomor akhiran:
    # Book.png = lavender, Book2.png = orange
    # Book3 = coral, Book4 = blue, Book5 = mint, Book6 = yellow
    numbered_book = {
        3: VIBRANT_PALETTE['coral'],
        4: VIBRANT_PALETTE['blue'],
        5: VIBRANT_PALETTE['mint'],
        6: VIBRANT_PALETTE['yellow'],
    }
    for num, rgb in numbered_book.items():
        out = recolor_icon(book_src, rgb)
        out_path = os.path.join(ASSETS_DIR, f'Book{num}.png')
        out.save(out_path)
        print(f"Saved: Book{num}.png")

    # Book And Pencil.png = mint, Book And Pencil2.png = yellow
    # Book And Pencil3 = coral, Book And Pencil4 = blue, Book And Pencil5 = lavender, Book And Pencil6 = orange
    numbered_bp = {
        3: VIBRANT_PALETTE['coral'],
        4: VIBRANT_PALETTE['blue'],
        5: VIBRANT_PALETTE['lavender'],
        6: VIBRANT_PALETTE['orange'],
    }
    for num, rgb in numbered_bp.items():
        out = recolor_icon(book_pencil_src, rgb)
        out_path = os.path.join(ASSETS_DIR, f'Book And Pencil{num}.png')
        out.save(out_path)
        print(f"Saved: Book And Pencil{num}.png")

    print("All book variations generated successfully!")

if __name__ == '__main__':
    main()
