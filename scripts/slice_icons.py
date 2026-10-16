#!/usr/bin/env python3
"""
scripts/slice_icons.py
Pecah (slice/crop) 12 ikon 3D dari berkas assets/icon-icon.jpg
menjadi 12 berkas aset gambar terpisah berformat .jpg di dalam folder assets/images/icons/.

Menggunakan Pillow, NumPy, SciPy (dan scikit-image) untuk:
1. Memisahkan objek 3D berwarna dari latar pola kotak-kotak (checkerboard) netral abu-putih (R≈G≈B).
2. Menghubungkan komponen piksel per-objek secara presisi agar ikon yang berdekatan tidak saling memotong.
3. Mengganti piksel latar di luar objek dengan warna latar kanvas aplikasi (#f8f5f0).
4. Menyimpan potongan dengan margin/padding proporsional pada kualitas tinggi (quality=95).
"""

import argparse
import os
import sys
import numpy as np
from PIL import Image
from scipy import ndimage
from skimage.morphology import remove_small_holes


# Daftar 12 ikon beserta urutan dan titik koordinat acuan (seed x, seed y)
ICON_SPECS = [
    # Baris 1
    {
        "filename": "icon-heart-pink.jpg",
        "name": "heartPink",
        "desc": "Hati kaca merah muda di kiri atas",
        "row": 1,
        "col": 1,
        "seed": (382, 356),
    },
    {
        "filename": "icon-flower-peach.jpg",
        "name": "flowerPeach",
        "desc": "Bunga/mawar peach di tengah atas",
        "row": 1,
        "col": 2,
        "seed": (960, 384),
    },
    {
        "filename": "icon-clover-lime.jpg",
        "name": "cloverLime",
        "desc": "Bunga 4 kelopak kuning-hijau di kanan atas",
        "row": 1,
        "col": 3,
        "seed": (1464, 378),
    },
    # Baris 2
    {
        "filename": "icon-plus-blue.jpg",
        "name": "plusBlue",
        "desc": "Tanda plus biru muda di kiri baris 2",
        "row": 2,
        "col": 1,
        "seed": (371, 939),
    },
    {
        "filename": "icon-star-purple.jpg",
        "name": "starPurple",
        "desc": "Bintang kaca ungu di tengah baris 2",
        "row": 2,
        "col": 2,
        "seed": (938, 950),
    },
    {
        "filename": "icon-square-gold.jpg",
        "name": "squareGold",
        "desc": "Kotak membulat kuning keemasan di kanan baris 2",
        "row": 2,
        "col": 3,
        "seed": (1464, 931),
    },
    # Baris 3
    {
        "filename": "icon-tube-left.jpg",
        "name": "tubeLeft",
        "desc": "Pipa kaca melengkung vertikal di kiri baris 3",
        "row": 3,
        "col": 1,
        "seed": (200, 1500),
    },
    {
        "filename": "icon-sphere-glass.jpg",
        "name": "sphereGlass",
        "desc": "Bola kaca kehijauan di tengah baris 3",
        "row": 3,
        "col": 2,
        "seed": (869, 1501),
    },
    {
        "filename": "icon-donut-orange.jpg",
        "name": "donutOrange",
        "desc": "Bulatan donat/target oranye di kanan baris 3",
        "row": 3,
        "col": 3,
        "seed": (1461, 1472),
    },
    # Baris 4
    {
        "filename": "icon-pill-pink.jpg",
        "name": "pillPink",
        "desc": "Kapsul/pil panjang merah muda di kiri bawah",
        "row": 4,
        "col": 1,
        "seed": (531, 2008),
    },
    {
        "filename": "icon-ring-pink.jpg",
        "name": "ringPink",
        "desc": "Cincin kaca merah muda kecil di tengah bawah",
        "row": 4,
        "col": 2,
        "seed": (950, 2070),
    },
    {
        "filename": "icon-tube-right.jpg",
        "name": "tubeRight",
        "desc": "Pipa kaca melengkung di kanan bawah",
        "row": 4,
        "col": 3,
        "seed": (1319, 1896),
    },
]


def parse_hex_color(hex_str: str) -> np.ndarray:
    """Konversi string hex (#rrggbb atau #rgb) ke array numpy RGB float32."""
    h = hex_str.strip().lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    r = int(h[0:2], 16)
    g = int(h[2:4], 16)
    b = int(h[4:6], 16)
    return np.array([r, g, b], dtype=np.float32)


def slice_icons(
    source_path: str,
    output_dir: str,
    bg_color_hex: str = "#f8f5f0",
    padding: int = 32,
    chroma_threshold: float = 7.0,
    jpeg_quality: int = 95,
):
    if not os.path.exists(source_path):
        raise FileNotFoundError(f"Berkas sumber tidak ditemukan: {source_path}")

    os.makedirs(output_dir, exist_ok=True)

    print(f"Membuka berkas gambar: {source_path}")
    orig_img = Image.open(source_path).convert("RGB")
    width, height = orig_img.size
    print(f"Resolusi gambar sumber: {width}x{height} piksel")

    img_arr = np.array(orig_img, dtype=np.float32)
    bg_rgb = parse_hex_color(bg_color_hex)
    print(f"Warna kanvas pengganti latar: {bg_color_hex} -> RGB {list(bg_rgb.astype(int))}")

    # 1. Hitung kromatisitas / saturasi per piksel: max(R,G,B) - min(R,G,B)
    # Latar kotak-kotak abu-putih memiliki R≈G≈B dengan selisih <= 5.
    chroma = np.max(img_arr, axis=-1) - np.min(img_arr, axis=-1)
    raw_mask = chroma >= chroma_threshold

    # 2. Morfologi penutupan (closing) ringan untuk menutup celah pantulan/highlight kaca kecil
    closed_mask = ndimage.binary_closing(raw_mask, structure=np.ones((7, 7)))

    # 3. Labeli komponen terhubung (connected components)
    labels, num_features = ndimage.label(closed_mask)
    print(f"Jumlah komponen fitur terdeteksi: {num_features}")

    results = []

    for spec in ICON_SPECS:
        sx, sy = spec["seed"]
        lbl = labels[sy, sx]
        if lbl == 0:
            raise ValueError(f"Titik acuan {spec['seed']} untuk {spec['filename']} menghasilkan latar (label 0)!")

        # Mask eksklusif HANYA untuk objek ini
        icon_mask = (labels == lbl)

        # Tutup lubang-lubang highlight specular kecil (< 200 px),
        # tetapi biarkan lubang besar terbuka (mis. lubang tengah icon-ring-pink yang berukuran ~3800 px)
        icon_mask = remove_small_holes(icon_mask, max_size=200)

        # Temukan batas koordinat (bounding box) objek
        ys, xs = np.where(icon_mask)
        min_y, max_y = int(ys.min()), int(ys.max())
        min_x, max_x = int(xs.min()), int(xs.max())
        obj_w = max_x - min_x + 1
        obj_h = max_y - min_y + 1

        # Terapkan margin/padding yang rapi tanpa keluar dari dimensi gambar
        cy0 = max(0, min_y - padding)
        cy1 = min(height, max_y + padding + 1)
        cx0 = max(0, min_x - padding)
        cx1 = min(width, max_x + padding + 1)

        # Potong area gambar dan mask
        crop_arr = img_arr[cy0:cy1, cx0:cx1].copy()
        crop_mask = icon_mask[cy0:cy1, cx0:cx1]

        # Buat antialiasing / feathering halus pada tepi objek (transisi 1.5 piksel)
        # Jarak dihitung dari dalam objek ke tepi
        dist_inside = ndimage.distance_transform_edt(crop_mask)
        alpha = np.clip(dist_inside / 1.5, 0.0, 1.0)[:, :, None]

        # Gabungkan objek dengan warna kanvas target
        # Piksel di luar objek ini (termasuk checkerboard dan objek lain yang kebetulan masuk kotak)
        # memiliki alpha=0 sehingga menjadi warna kanvas bersih (#f8f5f0).
        composited = alpha * crop_arr + (1.0 - alpha) * bg_rgb
        composited_uint8 = np.clip(composited, 0, 255).astype(np.uint8)

        # Simpan sebagai file JPEG kualitas tinggi
        out_path = os.path.join(output_dir, spec["filename"])
        out_img = Image.fromarray(composited_uint8)
        out_img.save(out_path, "JPEG", quality=jpeg_quality)

        final_w, final_h = out_img.size
        results.append({
            "filename": spec["filename"],
            "name": spec["name"],
            "desc": spec["desc"],
            "row": spec["row"],
            "col": spec["col"],
            "bbox_obj": (min_x, min_y, max_x, max_y),
            "size_obj": (obj_w, obj_h),
            "resolution": (final_w, final_h),
            "path": out_path,
        })
        print(f"  [OK] {spec['filename']:24s} -> {final_w}x{final_h} px (objek: {obj_w}x{obj_h} px)")

    return results


def main():
    parser = argparse.ArgumentParser(description="Slice 12 3D icons from icon-icon.jpg")
    parser.add_argument("--source", default="assets/icon-icon.jpg", help="Path ke berkas gambar sumber")
    parser.add_argument("--out-dir", default="assets/images/icons", help="Path direktori keluaran")
    parser.add_argument("--bg", default="#f8f5f0", help="Warna latar pengganti hex (default: #f8f5f0)")
    parser.add_argument("--pad", type=int, default=32, help="Padding proporsional dalam piksel (default: 32)")
    parser.add_argument("--chroma", type=float, default=7.0, help="Ambang batas kromatisitas (default: 7.0)")
    parser.add_argument("--quality", type=int, default=95, help="Kualitas output JPEG 1-100 (default: 95)")

    args = parser.parse_args()

    results = slice_icons(
        source_path=args.source,
        output_dir=args.out_dir,
        bg_color_hex=args.bg,
        padding=args.pad,
        chroma_threshold=args.chroma,
        jpeg_quality=args.quality,
    )

    print("\n" + "=" * 80)
    print("SELESAI MEMOTONG 12 IKON 3D:")
    print("=" * 80)
    for r in results:
        print(f"Baris {r['row']}, Kolom {r['col']} | {r['filename']:24s} | Resolusi: {r['resolution'][0]:3d}x{r['resolution'][1]:3d} px | {r['desc']}")


if __name__ == "__main__":
    main()
