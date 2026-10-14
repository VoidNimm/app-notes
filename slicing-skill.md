---
name: ui-slicing
description: Mengubah referensi UI/UX berupa gambar atau video (Pinterest, Mobbin, Dribbble, rekaman layar, dll.) menjadi satu berkas design.md lengkap (panduan desain yang bisa dipakai ulang: tokens, layout, komponen, motion, aksesibilitas) dan, bila diminta, kode front-end. Gunakan setiap kali pengguna menyebut slicing, slice desain, design.md, design system, panduan desain, clone UI, convert screenshot ke kode, replikasi tampilan dari video, atau melampirkan gambar/video UI untuk dianalisis atau dibuat jadi halaman web atau layar aplikasi.
---

# UI Slicing Skill: dari Gambar/Video Referensi ke Kode

Skill ini memandu AI agent (atau manusia) mengubah **gambar atau video referensi UI/UX** menjadi **satu berkas `design.md` yang lengkap**: panduan desain yang berdiri sendiri dan bisa dipakai ulang di proyek mana pun tanpa perlu membuka referensi aslinya lagi. Kode front-end bersifat opsional, dipakai sebagai bukti bahwa panduannya cukup lengkap. Alurnya bisa diulang, bisa diperiksa, dan jujur tentang apa yang pasti dan apa yang hanya perkiraan.

> **Keluaran utama skill ini: `design.md`.** Fase 0-9 mengumpulkan bahan; [Fase 10](#fase-10-kompilasi-designmd-keluaran-utama) meleburnya jadi satu dokumen dan memeriksanya dengan lint. Template lengkapnya ada di [17.0](#170-designmd-keluaran-utama).

> Untuk dipakai sebagai skill agent, ganti nama file ini menjadi `SKILL.md`. Bagian di atas (`name` dan `description`) adalah metadata pemicunya.

---

## Daftar Isi

1. [Cara membaca label keandalan](#1-cara-membaca-label-keandalan)
2. [Gerbang legal dan etika (baca sebelum mulai)](#2-gerbang-legal-dan-etika-baca-sebelum-mulai)
3. [Prinsip utama](#3-prinsip-utama)
4. [Alur kerja 10 fase](#4-alur-kerja-10-fase)
5. [Fase 0: Intake](#fase-0-intake)
6. [Fase 1: Audit sumber](#fase-1-audit-sumber)
7. [Fase 2: Ekstraksi frame dari video](#fase-2-ekstraksi-frame-dari-video)
8. [Fase 3: Dekonstruksi visual](#fase-3-dekonstruksi-visual)
9. [Fase 4: Ekstraksi design tokens](#fase-4-ekstraksi-design-tokens)
10. [Fase 5: Inventaris komponen dan state](#fase-5-inventaris-komponen-dan-state)
11. [Fase 6: Aset (ikon, gambar, ilustrasi)](#fase-6-aset-ikon-gambar-ilustrasi)
12. [Fase 7: Implementasi kode](#fase-7-implementasi-kode-opsional-berfungsi-sebagai-bukti)
13. [Fase 8: Motion dan interaksi dari video](#fase-8-motion-dan-interaksi-dari-video)
14. [Fase 9: QA (visual diff, aksesibilitas, responsif)](#fase-9-qa-visual-diff-aksesibilitas-responsif)
    - [**Fase 10: Kompilasi design.md (keluaran utama)**](#fase-10-kompilasi-designmd-keluaran-utama)
15. [Kasus khusus per jenis sumber](#15-kasus-khusus-per-jenis-sumber)
16. [Aturan perilaku untuk AI agent](#16-aturan-perilaku-untuk-ai-agent)
17. [Template siap pakai (termasuk template design.md)](#17-template-siap-pakai)
18. [Troubleshooting](#18-troubleshooting)
19. [Referensi dan catatan verifikasi](#19-referensi-dan-catatan-verifikasi)

---

## 1. Cara membaca label keandalan

Dokumen ini membedakan tiga jenis klaim supaya Anda tahu seberapa jauh bisa mempercayainya:

| Label | Arti |
|---|---|
| **[R#]** | Isinya saya baca dari sumber yang tercantum di [bagian 19](#19-referensi-dan-catatan-verifikasi) saat menyusun dokumen ini. |
| **[T]** | Perintah atau skrip sudah saya jalankan di sandbox saat menyusun dokumen ini (ffmpeg 6.1.1, Python dengan Pillow 12.1.1 dan OpenCV 4.13.0) dan berhasil. |
| **[K]** | Konvensi atau praktik umum di industri. Tidak saya verifikasi ke satu sumber spesifik, jadi perlakukan sebagai default yang masuk akal, bukan aturan baku. |

Hal yang tidak diberi label dan tidak bisa saya pastikan akan ditulis eksplisit sebagai **"tidak bisa saya konfirmasi"**.

---

## 2. Gerbang legal dan etika (baca sebelum mulai)

Saya bukan pengacara, dan bagian ini bukan nasihat hukum. Tujuannya agar agent tidak langsung menjiplak lalu baru ketahuan bermasalah belakangan.

### 2.1 Apa yang saya temukan

**Mobbin** (nama resminya "Mobbin", bukan "Mobbins"; situs `mobbin.com`). Saya membaca salinan arsip Terms of Service-nya (berlaku 16 Mei 2026, ditangkap TOS Tracker pada 10 Juli 2026) **[R1]**. Ringkasan dengan kata-kata saya sendiri:

- Pengguna berjanji tidak memodifikasi, menyalin, atau membuat karya turunan dari materi di platform.
- Pengguna berjanji tidak men-*mirror*, men-*cache*, mengarsipkan, atau meng-*host* ulang konten dari platform ke tempat lain tanpa izin tertulis, termasuk lewat scraper atau bot.
- Pengguna berjanji tidak memakai AI atau machine learning untuk membuat karya turunan dari konten platform, atau untuk melatih, menguji, mengindeks, atau meningkatkan model AI, kecuali ada izin dalam ketentuan itu atau izin tertulis dari Mobbin.
- Materi di platform (screenshot dan video antarmuka produk pihak ketiga) bisa dilindungi hak cipta dan merek milik pemilik aslinya. Kutipan, gambar, atau parafrase hanya boleh dipublikasikan di tempat lain secara terbatas dan dengan memberi kredit kepada pemilik.
- Materi disebut sebagai referensi saja ("solely for reference only").
- Ada klausul yang menyatakan karya turunan yang dihasilkan dengan memakai layanan menjadi milik Mobbin. Maksud dan cakupan pastinya **tidak bisa saya konfirmasi**; tanyakan ke Mobbin atau penasihat hukum bila proyek Anda komersial.
- Ketentuan fair use merujuk pada hukum Singapura, dan tanggung jawab pemakaian di luar platform ada pada pengguna.

Karena salinan yang saya baca adalah arsip pihak ketiga, **buka langsung `mobbin.com/terms` untuk versi terbaru** sebelum bergantung pada ringkasan ini.

**Pinterest.** Saya **tidak membuka Terms of Service Pinterest secara langsung**, jadi isi ketentuannya saat ini tidak bisa saya konfirmasi. Yang saya baca hanya artikel firma hukum tahun 2012 yang menyebut Pinterest pernah dikritik karena pengguna mem-pin gambar berhak cipta tanpa izin, dan kebijakan pemakaiannya melarang mem-pin konten yang melanggar hak kekayaan intelektual pihak lain **[R4]**. Artikel itu sudah lama, jadi anggap sebagai gambaran umum, bukan kondisi sekarang. Praktisnya: pin di Pinterest umumnya adalah karya pihak lain, dan mengunggahnya ke Pinterest tidak otomatis memberi Anda hak untuk memakainya.

### 2.2 Konsekuensi untuk skill ini: dua mode kerja

Agent harus menentukan mode di Fase 0 dan mencatatnya di spec sheet.

| Mode | Kapan | Boleh dilakukan |
|---|---|---|
| **A. Replikasi setia** | Sumber adalah desain milik Anda sendiri, desain klien yang memberi izin, file Figma Anda, atau aset berlisensi yang mengizinkan turunan. | Tiru layout, token, dan komponen seakurat mungkin. |
| **B. Terinspirasi** | Sumber adalah karya pihak ketiga (Pinterest, Mobbin, Dribbble, screenshot aplikasi orang lain) dan lisensi pemakaian tidak jelas. | Ekstrak **pola dan prinsip** (struktur section, hierarki, ritme spasi, pola interaksi), lalu buat desain orisinal: palet sendiri, tipografi sendiri, ikon dan ilustrasi sendiri, copy sendiri. |

Aturan di Mode B:

1. Jangan menyalin logo, merek, ilustrasi, foto, atau teks dari referensi.
2. Jangan mengganti hanya satu atau dua properti lalu menyebutnya orisinal. Kalau hasil akhirnya bisa ditumpuk di atas referensi dan hampir persis, itu replikasi, bukan inspirasi.
3. Gabungkan **minimal 2-3 referensi berbeda** untuk satu halaman supaya hasilnya sintesis, bukan salinan satu sumber.
4. Jangan unggah konten Mobbin ke alat AI bila ketentuan yang berlaku melarangnya (lihat 2.1). Kalau pengguna memang punya izin tertulis atau langganan yang mengizinkan, minta pengguna menyatakannya dan catat di spec sheet.

Agent menyampaikan peringatan ini **sekali, singkat, di awal**, lalu melanjutkan kerja di mode yang aman. Jangan menceramahi dan jangan mengulang di setiap pesan.

---

## 3. Prinsip utama

1. **Gambar adalah data yang hilang sebagian.** Dari screenshot Anda tidak bisa tahu font pasti, nilai spasi pasti, atau hex pasti (kompresi, color profile, dan scaling mengubahnya). Semua nilai hasil pengamatan adalah **estimasi bertingkat keyakinan**, bukan fakta. **[K]**
2. **Struktur dulu, piksel belakangan.** Urutan benar: struktur halaman, lalu token, lalu komponen, lalu detail. Mulai dari piksel menghasilkan kode rapuh. **[K]**
3. **Token sebelum komponen.** Semua warna, ukuran font, spasi, radius, dan bayangan masuk ke CSS variables lebih dulu. Komponen hanya memakai token. **[K]**
4. **Snap ke skala.** Nilai hasil ukur seperti 13px, 17px, 22px dibulatkan ke skala konsisten (misalnya kelipatan 4 untuk spasi). **[K]**
5. **Semantik sebelum tampilan.** Tombol adalah `<button>`, navigasi adalah `<nav>`. Tampilan yang sama tidak membenarkan markup yang salah.
6. **Jujur soal ketidakpastian.** Setiap token punya level keyakinan (Tinggi, Sedang, Rendah). Yang tidak bisa ditentukan ditandai `PERLU KONFIRMASI`, bukan ditebak diam-diam.
7. **Verifikasi dengan bukti.** "Sudah mirip" tidak cukup; bandingkan screenshot hasil dengan referensi (Fase 9).
8. **Kualitas dasar bukan bonus.** Responsif, fokus keyboard terlihat, kontras cukup, dan `prefers-reduced-motion` dihormati sejak awal.

---

## 4. Alur kerja 10 fase

```
Fase 0  Intake            -> mode (A/B), stack, target device, breakpoint
Fase 1  Audit sumber      -> kualitas, resolusi, apa yang tidak bisa diketahui
Fase 2  Ekstraksi video   -> frame kunci + contact sheet (hanya jika sumber video)
Fase 3  Dekonstruksi      -> peta layout, hierarki, inventaris section
Fase 4  Design tokens     -> warna, tipografi, spasi, radius, bayangan (+ keyakinan)
Fase 5  Komponen & state  -> daftar komponen, varian, state interaktif
Fase 6  Aset              -> ikon, gambar, ilustrasi (sumber legal, bukan crop referensi)
Fase 7  Implementasi      -> (opsional) halaman referensi kecil sebagai bukti
Fase 8  Motion            -> timeline, easing, trigger (hanya jika ada animasi)
Fase 9  QA                -> visual diff, a11y, responsif
Fase 10 Kompilasi         -> design.md lengkap + lint   <== KELUARAN UTAMA
```

Setiap fase punya **keluaran yang harus ada** sebelum lanjut. Jangan lompat ke Fase 7 atau Fase 10 tanpa keluaran Fase 3-5. Fase 3-9 menghasilkan **bahan**; hasil akhirnya satu berkas `design.md` (Fase 10). Bila pengguna hanya meminta panduan desain, Fase 7-8 boleh dipersingkat menjadi satu halaman uji kecil atau dilewati, asalkan spesifikasi komponen dan motion tetap tertulis di `design.md`.

---

## Fase 0: Intake

Jawab pertanyaan ini. Kalau pengguna belum menyebut, **pakai default dan nyatakan asumsinya**; tanyakan hanya yang benar-benar menghambat, dan maksimal satu pertanyaan per giliran.

| Pertanyaan | Default bila tidak dijawab |
|---|---|
| Mode A (replikasi) atau B (terinspirasi)? | B, sampai pengguna menyatakan punya hak atas sumber. |
| Stack target? | HTML + CSS + sedikit JS vanilla. Bila proyek sudah memakai framework, ikuti proyek itu. |
| Target device? | Mobile-first, dengan penyesuaian tablet dan desktop. |
| Lebar desain asli? | Deteksi dari dimensi gambar (lihat Fase 1). |
| Ada brand, font, atau palet wajib? | Tidak ada. Pilih sendiri dan catat. |
| Konten asli tersedia? | Tidak. Tulis copy placeholder yang masuk akal untuk domainnya, bukan lorem ipsum. |
| Perlu dark mode? | Hanya jika referensi menunjukkannya. |
| Perlu animasi? | Hanya jika sumber berupa video atau jelas beranimasi. |
| Keluaran yang diminta? | `design.md` lengkap. Halaman kode hanya sebagai bukti kecil; jangan membangun seluruh situs kecuali diminta. |
| Nama proyek dan lokasi file? | `design.md` di akar proyek (atau folder yang disebut pengguna). |

**Keluaran Fase 0:** blok "Konteks" di spec sheet ([template 17.1](#171-spec-sheet-draf-kerja-isinya-dilebur-ke-designmd-di-fase-10)).

---

## Fase 1: Audit sumber

Sebelum menganalisis, periksa apa yang sebenarnya Anda pegang.

### 1.1 Cek teknis

Untuk gambar, baca dimensinya. Untuk video, gunakan `ffprobe` **[T]**:

```bash
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,r_frame_rate,duration \
  -of default=nw=1 input.mp4
```

Interpretasi dimensi (gunakan sebagai petunjuk, **[K]**):

| Dimensi gambar | Kemungkinan |
|---|---|
| Lebar sekitar 375-430 px, atau kelipatan 2x/3x-nya | Layar ponsel. Anggap @2x atau @3x dan bagi untuk dapat ukuran CSS. |
| Lebar sekitar 768-1024 px | Tablet. |
| Lebar sekitar 1280-1920 px | Desktop. |
| Ada bingkai perangkat, bar status, atau notch | Mockup. Buang bingkai saat mengukur. |

Skala ini hanya tebakan. Bila lebar CSS tidak pasti, tulis `PERLU KONFIRMASI` dan pilih lebar acuan yang masuk akal.

### 1.2 Daftar hal yang TIDAK bisa diketahui dari gambar

Tulis ini di spec sheet agar tidak ada yang menganggapnya fakta:

- Nama font pasti (hanya bisa mendekati secara visual).
- Nilai hex pasti (kompresi dan color profile menggeser warna).
- Nilai spasi, radius, dan bayangan pasti (bisa diukur kira-kira, bukan diketahui).
- State yang tidak tampil: hover, fokus, disabled, error, loading.
- Perilaku di lebar layar lain.
- Konten di balik scroll atau tab yang tidak ter-screenshot.
- Easing dan durasi animasi pasti, kecuali dihitung dari frame video (Fase 8).

### 1.3 Jenis sumber dan implikasinya

| Sumber | Kelebihan | Kelemahan |
|---|---|---|
| Satu screenshot | Cepat dianalisis. | State, responsif, dan animasi tidak ada. |
| Banyak screenshot satu alur (mis. kumpulan flow di Mobbin) | Menunjukkan alur, state, dan konsistensi. | Perlu dipetakan jadi user flow. |
| Moodboard (mis. Pinterest) | Kaya inspirasi. | Gaya campur, kualitas bervariasi, hak cipta tersebar. Cocok untuk Mode B. |
| Rekaman layar atau video | Menunjukkan transisi, scroll, hover. | Kompresi, dan butuh ekstraksi frame. |
| File desain asli (Figma, dsb.) | Nilai pasti. | Bukan gambar; ambil nilai langsung dari file. |

**Keluaran Fase 1:** tabel "Audit sumber" di spec sheet.

---

## Fase 2: Ekstraksi frame dari video

Lewati fase ini bila sumber hanya gambar. Semua perintah di bagian ini sudah saya uji **[T]** pada ffmpeg 6.1.1.

### 2.1 Ambil frame secara berkala

```bash
mkdir -p frames
ffmpeg -i input.mp4 -vf "fps=2" frames/frame_%04d.png
```

`fps=2` berarti 2 frame per detik. Naikkan untuk video yang cepat berubah.

### 2.2 Ambil hanya saat tampilan berubah (deteksi scene)

```bash
mkdir -p scenes
ffmpeg -i input.mp4 -vf "select='gt(scene,0.3)'" -fps_mode vfr scenes/scene_%04d.png
```

Ambang `0.3` adalah titik awal; turunkan bila perubahan halus terlewat, naikkan bila terlalu banyak frame. Pada ffmpeg versi lama, `-fps_mode vfr` diganti `-vsync vfr`. Pada video uji saya, yang terpilih hanya frame di titik pergantian layar, bukan frame pertama; ambil frame awal secara manual bila perlu (2.4).

### 2.3 Ambil keyframe saja

```bash
ffmpeg -skip_frame nokey -i input.mp4 -vsync vfr keyframes/key_%04d.png
```

Jumlah keyframe tergantung cara video dienkode, jadi hasilnya bisa sedikit sekali pada video dengan interval keyframe panjang.

### 2.4 Ambil satu frame pada waktu tertentu

```bash
ffmpeg -ss 00:00:01.5 -i input.mp4 -frames:v 1 satu_frame.png
```

### 2.5 Ambil segmen dengan presisi tinggi (untuk menganalisis animasi)

```bash
# 1 detik mulai detik ke-0.5, 30 frame per detik, nomor dimulai dari 0
ffmpeg -ss 0.5 -t 1 -i input.mp4 -vf "fps=30" -start_number 0 seg_%03d.png
```

### 2.6 Buat contact sheet (ringkasan visual satu gambar)

```bash
ffmpeg -i input.mp4 -vf "fps=2,scale=195:-1,tile=4x2" -frames:v 1 sheet.png
```

Gunakan sheet ini untuk memilih frame mana yang layak dianalisis detail.

### 2.7 Buang frame duplikat

Skrip berikut membandingkan hash sederhana antar frame berurutan **[T]**. Jarak kecil berarti hampir sama; lonjakan menandai perubahan.

```python
from PIL import Image
import glob

def ahash(path):
    im = Image.open(path).convert("L").resize((8, 8))
    px = list(im.tobytes())
    avg = sum(px) / 64
    return "".join("1" if v > avg else "0" for v in px)

files = sorted(glob.glob("frames/*.png"))
hs = [ahash(p) for p in files]
jarak = [sum(x != y for x, y in zip(hs[i], hs[i + 1])) for i in range(len(hs) - 1)]
print(jarak)  # mis. [3, 2, 1, 1, 1, 32, 0, ...] -> lonjakan 32 = perubahan layar
```

Pada video uji saya, lonjakan angka tepat berada di titik pergantian layar; untuk video nyata, ambang "kecil" dan "besar" perlu Anda sesuaikan.

### 2.8 Kompres video untuk dibagikan atau dipakai di web

```bash
# H.264, tanpa audio, siap streaming
ffmpeg -i in.mp4 -c:v libx264 -crf 28 -preset slow -movflags +faststart -an out.mp4
# VP9 WebM
ffmpeg -i in.mp4 -c:v libvpx-vp9 -crf 35 -b:v 0 -an out.webm
```

Kedua perintah berhasil dijalankan **[T]**. Nilai `-crf` (kualitas) hanya titik awal; sesuaikan dengan tolok ukur ukuran file dan kualitas yang Anda mau.

**Keluaran Fase 2:** folder frame terpilih + contact sheet + daftar timestamp penting (mis. `0:00 hero`, `0:04 menu terbuka`, `0:09 modal`).

---

## Fase 3: Dekonstruksi visual

Bedah gambar dari yang besar ke yang kecil. Jangan menulis kode di fase ini.

### 3.1 Peta layout

Gambar wireframe ASCII untuk setiap layar, lengkap dengan arah penjajaran. Contoh:

```
+--------------------------------------------+
| [logo]            nav  nav  nav   [CTA]    |  header, sticky?
+--------------------------------------------+
|  Judul besar (kiri)         |  Gambar      |  hero, 2 kolom (6/6)
|  Subjudul                   |              |
|  [CTA utama] [CTA sekunder] |              |
+--------------------------------------------+
|  Kartu | Kartu | Kartu                     |  grid 3 kolom
+--------------------------------------------+
```

### 3.2 Inventaris section

Untuk tiap section catat: tujuan, isi, tata letak (flex, grid, atau stack), jumlah kolom, penjajaran, dan perilaku di layar kecil (**dugaan** bila tidak terlihat).

### 3.3 Hierarki visual

Urutkan elemen dari yang paling menonjol ke yang paling tenang, dan catat alat yang dipakai untuk menciptakan hierarki itu: ukuran, bobot, warna, kontras, atau spasi. Ini yang paling sering hilang saat orang hanya menyalin ukuran.

### 3.4 Grid dan ritme

- Berapa kolom? Lebar maksimum konten? Margin samping?
- Apakah jarak antar section konsisten (ritme vertikal)?
- Apakah elemen sejajar ke garis yang sama (tepi kiri, baseline)?

### 3.5 Cara mengukur dari gambar

1. Cari satu elemen yang ukurannya bisa Anda tebak dengan yakin (mis. tombol tinggi 48, ikon 24, tinggi bar navigasi). Jadikan **penggaris**.
2. Hitung faktor skala: `ukuran_css = ukuran_piksel_gambar / faktor`.
3. Ukur elemen lain relatif terhadap penggaris, lalu bulatkan ke skala (Fase 4).

Contoh: bila di gambar tombol setinggi 144 px dan Anda menduga tinggi aslinya 48 px, faktornya 3, sehingga teks yang terukur 54 px di gambar sekitar 18 px CSS.

Untuk menemukan kandidat kotak komponen secara otomatis, OpenCV bisa membantu **[T]**:

```python
import cv2
img = cv2.imread("layar.png")
g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
edges = cv2.Canny(g, 80, 160)
cnts, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
boxes = [cv2.boundingRect(c) for c in cnts]
boxes = [b for b in boxes if b[2] > 24 and b[3] > 24]   # (x, y, lebar, tinggi)
print(len(boxes), boxes[:5])
```

Hasilnya hanya **kandidat**, bukan kebenaran. Selalu cocokkan dengan mata. Pada layar uji saya skrip ini menemukan belasan kotak, termasuk yang bukan komponen sebenarnya.

**Keluaran Fase 3:** wireframe + inventaris section + catatan hierarki + catatan grid.

---

## Fase 4: Ekstraksi design tokens

Semua nilai di sini adalah **estimasi**. Beri setiap token keyakinan: **T** (tinggi), **S** (sedang), **R** (rendah).

### 4.1 Warna

Ambil palet dominan dari screenshot. Skrip ini menghitung warna dominan dan rasio kontras WCAG **[T]**:

```python
import sys
from PIL import Image

def rel_lum(rgb):
    def c(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (c(x) for x in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast(a, b):
    la, lb = rel_lum(a), rel_lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

def palette(path, n=6):
    img = Image.open(path).convert("RGB")
    img.thumbnail((200, 200))
    q = img.quantize(colors=n, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()[: n * 3]
    counts = sorted(q.getcolors(), reverse=True)
    total = sum(c for c, _ in counts)
    out = []
    for cnt, idx in counts:
        rgb = tuple(pal[idx * 3: idx * 3 + 3])
        out.append(("#%02x%02x%02x" % rgb, round(100 * cnt / total, 1), rgb))
    return out

if __name__ == "__main__":
    for hexv, pct, _ in palette(sys.argv[1]):
        print(hexv, f"{pct}%")
    print("putih vs hitam:", round(contrast((255, 255, 255), (0, 0, 0)), 2))   # 21.0
    print("#777 vs putih:", round(contrast((119, 119, 119), (255, 255, 255)), 2))  # 4.48
```

Rumus luminans dan rasio kontras di atas mengikuti definisi WCAG; hasil uji saya: putih vs hitam = 21.0, dan abu `#777777` di atas putih = 4.48, yaitu **sedikit di bawah** 4.5 sehingga gagal untuk teks normal. Contoh kedua ini penting: warna yang "kelihatan cukup" bisa gagal tipis.

Catatan praktik:

- Palet otomatis berguna sebagai titik awal. **Pilih warna secara manual** dari area datar (latar tombol, latar halaman), bukan dari tepi gambar atau gradasi.
- Warna dari area teks atau antialiasing tidak mewakili warna aslinya.
- Beri nama peran, bukan nama warna: `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-primary`, `--color-border`, `--color-danger`, bukan `--blue-500` saja. **[K]**
- Bila referensi punya mode gelap, catat kedua set token terpisah.

### 4.2 Tipografi

Yang bisa Anda tentukan dari gambar:

| Properti | Cara |
|---|---|
| Klasifikasi | Serif, sans, mono, display, atau handwriting. |
| Skala ukuran | Ukur tinggi huruf kapital atau tinggi baris, konversi lewat faktor skala, bulatkan ke skala. |
| Bobot | Perkirakan: regular (400), medium (500), semibold (600), bold (700). |
| Line-height | Jarak antar baris dibagi ukuran font. |
| Letter-spacing | Rapat, normal, atau renggang. |
| Lebar baris | Karakter per baris pada paragraf. |

**Nama font pasti biasanya tidak bisa dipastikan.** Cara kerja yang jujur:

1. Tulis klasifikasi dan karakter visualnya (mis. "sans geometris, huruf `a` bertingkat dua, ujung bulat").
2. Pilih font open-source dengan karakter mirip dan lisensi jelas, lalu catat bahwa itu **pengganti**, bukan font aslinya.
3. Bila pengguna mengenali font aslinya atau punya lisensinya, ganti di token tipografi.

Skala tipografi contoh (hanya contoh bentuk, bukan nilai wajib):

```css
:root {
  --font-sans: "Nama Font Pilihan", system-ui, sans-serif;
  --text-xs: 0.75rem;   /* 12px */
  --text-sm: 0.875rem;  /* 14px */
  --text-md: 1rem;      /* 16px */
  --text-lg: 1.25rem;   /* 20px */
  --text-xl: 1.75rem;   /* 28px */
  --text-2xl: 2.5rem;   /* 40px */
  --leading-tight: 1.2;
  --leading-body: 1.5;
}
```

Untuk judul besar di hero, pertimbangkan ukuran fluid dengan `clamp()` agar tidak terlalu besar di ponsel dan tidak terlalu kecil di desktop. **[K]**

### 4.3 Spasi

Bulatkan ke skala konsisten. Kelipatan 4 px (4, 8, 12, 16, 24, 32, 48, 64, 96) adalah konvensi umum yang mudah dijaga **[K]**; skala lain boleh asal konsisten.

```css
:root {
  --space-1: 0.25rem;  /* 4  */
  --space-2: 0.5rem;   /* 8  */
  --space-3: 0.75rem;  /* 12 */
  --space-4: 1rem;     /* 16 */
  --space-6: 1.5rem;   /* 24 */
  --space-8: 2rem;     /* 32 */
  --space-12: 3rem;    /* 48 */
  --space-16: 4rem;    /* 64 */
}
```

Catat juga: padding dalam kartu dan tombol, `gap` antar item, jarak vertikal antar section.

### 4.4 Radius, border, bayangan

- **Radius:** kelompokkan jadi 3-4 nilai (kecil, sedang, besar, pil). Referensi yang baik biasanya tidak memakai satu radius untuk semuanya.
- **Border:** tebal (biasanya 1px), warna, dan apakah dipakai sebagai pemisah atau pembungkus.
- **Bayangan:** perkirakan offset, blur, dan opasitas. Bayangan halus hampir tidak bisa diukur akurat dari gambar; tulis keyakinan **R** dan sesuaikan lewat perbandingan visual di Fase 9.

### 4.5 Ikon dan ukuran kontrol

Catat ukuran ikon (mis. 16, 20, 24), ketebalan garis (stroke), gaya (outline atau solid), dan tinggi kontrol (tombol, input, tab).

### 4.6 Format keluaran token

Tabel dengan kolom **nilai, keyakinan, cara didapat**:

| Token | Nilai | Keyakinan | Cara didapat |
|---|---|---|---|
| `--color-primary` | `#3a13dc` | S | Dipilih dari area datar tombol |
| `--radius-md` | `12px` | S | Diukur relatif ke tinggi tombol |
| `--font-sans` | pengganti open-source | R | Font asli tidak bisa dipastikan |

**Keluaran Fase 4:** tabel token + `tokens.css` awal.

---

## Fase 5: Inventaris komponen dan state

### 5.1 Daftar komponen

Kelompokkan dari kecil ke besar:

- **Atoms:** tombol, input, label, ikon, badge, avatar, divider.
- **Molecules:** field form (label + input + bantuan), kartu, item daftar, tab, search bar.
- **Organisms/section:** header, hero, grid kartu, footer, modal.

Untuk tiap komponen catat: **varian** (primary, secondary, ghost), **ukuran** (kecil, sedang, besar), dan **di mana dipakai**.

### 5.2 State yang wajib dipikirkan

Gambar biasanya hanya menunjukkan state default. Lengkapi dengan state berikut dan **tandai mana yang dilihat langsung dan mana yang diturunkan**:

| State | Dari gambar? | Panduan bila tidak terlihat |
|---|---|---|
| Default | Ya | |
| Hover | Jarang | Perubahan halus pada latar atau bayangan; hanya untuk perangkat dengan pointer. |
| Focus (keyboard) | Hampir tidak pernah | **Wajib ada** dan terlihat jelas. |
| Active/pressed | Jarang | Sedikit lebih gelap atau bergeser. |
| Disabled | Kadang | Opasitas turun, kursor tidak aktif. |
| Loading | Kadang | Spinner atau skeleton. |
| Error | Kadang | Warna, ikon, dan pesan teks (jangan hanya warna). |
| Empty | Kadang | Pesan dan ajakan bertindak. |

### 5.3 Peta alur (untuk sumber multi-layar)

Bila sumber adalah rangkaian layar satu alur, gambar diagram alur: layar, pemicu perpindahan, dan hasilnya. Ini mengubah kumpulan gambar menjadi perilaku aplikasi.

**Keluaran Fase 5:** daftar komponen + tabel state + (bila ada) diagram alur.

---

## Fase 6: Aset (ikon, gambar, ilustrasi)

**Jangan meng-crop aset dari gambar referensi untuk dipakai di produk akhir.** Selain berisiko hak cipta (bagian 2), hasil crop biasanya beresolusi rendah dan buram.

| Jenis aset | Cara yang disarankan |
|---|---|
| Ikon | Pakai set ikon open-source dengan lisensi yang Anda cek sendiri, atau gambar SVG sendiri. Samakan ukuran dan ketebalan garis dengan token. |
| Foto | Pakai foto berlisensi yang jelas atau foto sendiri. Selama prototipe, placeholder dengan rasio aspek yang tepat sudah cukup. |
| Ilustrasi | Buat sendiri, pesan, atau pakai yang berlisensi. Jangan salin ilustrasi referensi. |
| Logo | Hanya milik Anda atau yang diizinkan. Jangan memakai logo merek lain sebagai bagian desain Anda. |
| Pola dan tekstur | Buat dengan CSS (gradient) atau SVG bila sederhana. |

Optimasi **[K]**: SVG untuk ikon dan bentuk sederhana; gambar foto dalam format modern dengan dimensi sesuai kebutuhan (jangan 4000 px untuk kotak 400 px); atribut `width`/`height` atau `aspect-ratio` supaya layout tidak melompat saat gambar dimuat; `loading="lazy"` untuk gambar di bawah lipatan.

**Keluaran Fase 6:** daftar aset, sumber/lisensi masing-masing, dan placeholder yang dipakai sementara.

---

## Fase 7: Implementasi kode (opsional, berfungsi sebagai bukti)

> Fase ini menguji apakah bahan Fase 3-6 cukup untuk membangun UI. Bangun halaman referensi kecil (satu atau dua section, beberapa komponen). **Setiap kali Anda harus menebak sesuatu yang tidak ada di bahan, itu tanda dokumen kurang lengkap**: catat, lalu lengkapi di `design.md`. Bila pengguna meminta kode penuh, lanjutkan seluruh fase ini.

### 7.1 Struktur proyek (default vanilla)

```
proyek/
├── index.html
├── css/
│   ├── tokens.css        <- semua variabel (Fase 4)
│   ├── base.css          <- reset ringan, tipografi dasar, fokus
│   ├── components.css    <- tombol, kartu, input, dst.
│   └── sections.css      <- header, hero, grid, footer
├── js/
│   └── main.js           <- hanya interaksi yang perlu
└── assets/
    ├── icons/
    └── img/
```

Bila proyek memakai framework atau Tailwind, petakan token ke konfigurasi framework itu (mis. warna dan spasi di konfigurasi tema) alih-alih membuat CSS paralel.

### 7.2 Urutan membangun

1. **tokens.css** dari Fase 4.
2. **base.css:** reset ringan, `box-sizing`, tipografi dasar, gaya fokus.
3. **Atoms** (tombol, input) lengkap dengan state dari Fase 5.
4. **Molecules** (kartu, field form).
5. **Section** satu per satu dari atas ke bawah.
6. **Halaman penuh**, lalu responsif.
7. Interaksi dan motion (Fase 8).

Setelah tiap langkah, bandingkan dengan referensi sebelum melangkah.

### 7.3 Dasar `base.css`

```css
*, *::before, *::after { box-sizing: border-box; }
body {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--text-md);
  line-height: var(--leading-body);
  color: var(--color-text);
  background: var(--color-bg);
}
img, svg, video { max-width: 100%; display: block; }
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

Gaya fokus ini hanya contoh. Pastikan warnanya cukup kontras terhadap latar di sekitarnya.

### 7.4 Semantik HTML

- Landmark: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- Satu `<h1>` per halaman; tingkat heading berurutan.
- Kontrol: `<button>` untuk aksi, `<a>` untuk navigasi.
- Form: setiap input punya `<label>` terhubung.
- Gambar bermakna punya `alt` deskriptif; gambar dekoratif memakai `alt=""`.

### 7.5 Layout: flex atau grid

| Situasi | Pilih |
|---|---|
| Satu dimensi (baris atau kolom item, bar navigasi) | Flexbox |
| Dua dimensi (grid kartu, layout halaman) | CSS Grid |
| Kartu responsif tanpa media query | `grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))` |

Contoh kontainer konten:

```css
.container {
  width: min(100% - 2 * var(--space-4), 72rem);
  margin-inline: auto;
}
```

Angka `72rem` adalah contoh; ambil dari hasil analisis grid di Fase 3.

### 7.6 Responsif

- **Mobile-first:** tulis gaya dasar untuk ponsel, lalu perluas dengan `@media (min-width: ...)`. **[K]**
- Titik patah: tentukan dari **isi** yang mulai terasa sesak, bukan dari daftar perangkat. Mulai dengan satu atau dua titik patah saja.
- Jika referensi hanya menampilkan satu ukuran layar, ukuran lain adalah **keputusan Anda**. Catat di laporan bahwa itu bukan hasil pengamatan.
- Hindari lebar tetap dalam piksel untuk kontainer; gunakan persentase, `min()`, `max()`, `clamp()`.
- Uji di lebar sempit (sekitar 320 px) dan zoom teks; tidak boleh ada scroll horizontal tak sengaja.

### 7.7 Hal yang sering salah saat slicing

| Kesalahan | Akibat | Perbaikan |
|---|---|---|
| `position: absolute` untuk semua | Rusak di ukuran lain | Pakai flex atau grid, absolute hanya untuk overlay |
| Angka ajaib (`margin-top: 37px`) | Tidak konsisten | Snap ke token spasi |
| Tinggi tetap pada kotak teks | Teks terpotong | Pakai `min-height` dan padding |
| Teks di dalam gambar | Tidak bisa dipilih atau dibaca pembaca layar | Teks asli di HTML |
| Menyalin ukuran @2x/@3x mentah | Elemen terlalu besar | Bagi dengan faktor skala |
| `div` untuk semuanya | Tidak aksesibel | Elemen semantik |

**Keluaran Fase 7:** kode yang berjalan, dengan token terpusat.

---

## Fase 8: Motion dan interaksi dari video

Lewati bila sumber tidak beranimasi.

### 8.1 Katalog animasi

Dari video, catat setiap animasi di tabel (ukur dari frame di Fase 2.5):

| # | Elemen | Pemicu | Properti berubah | Durasi (perkiraan) | Easing (perkiraan) | Delay/stagger | Keyakinan |
|---|---|---|---|---|---|---|---|
| 1 | Hero judul | Muat halaman | opacity, translateY | ... | ... | ... | S |
| 2 | Menu | Klik ikon | tinggi, opacity | ... | ... | ... | R |

Cara menghitung durasi: banyaknya frame dari awal perubahan sampai selesai, dibagi frame rate video. Contoh: 18 frame pada 30 fps = 0,6 detik. Ini perkiraan; video yang dikompres atau dipotong bisa meleset.

### 8.2 Menebak easing

Plot perkiraan posisi elemen per frame:

- Gerak yang **cepat lalu melambat** menandakan *ease-out*.
- Gerak yang **lambat lalu cepat** menandakan *ease-in*.
- Gerak yang lambat di kedua ujung menandakan *ease-in-out*.
- Kecepatan konstan menandakan *linear*.

Mulai dengan `ease-out` untuk elemen yang masuk dan `ease-in` untuk yang keluar sebagai tebakan awal **[K]**, lalu cocokkan dengan melihat hasilnya berdampingan dengan video.

### 8.3 Aturan motion

- **Pisahkan motion dekoratif dan bermakna.** Motion bermakna (menu terbuka, konfirmasi) menunjukkan apa yang berubah; dekoratif harus hemat.
- Hindari memberi efek masuk pada setiap section dan efek hover pada setiap kartu hanya karena mudah; satu momen yang terarah lebih berdampak.
- Hormati preferensi pengguna. `prefers-reduced-motion` adalah media feature CSS yang mendeteksi apakah pengguna meminta gerak non-esensial diminimalkan; fitur ini ditandai Baseline Widely Available **[R5]**:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Untuk animasi berbasis JavaScript, periksa `window.matchMedia('(prefers-reduced-motion: reduce)')` dan nonaktifkan atau sederhanakan geraknya. Video latar yang autoplay sebaiknya hanya diputar bila pengguna tidak meminta gerak berkurang, atau diganti gambar diam **[R6]**.

- Jika ada gerak yang berjalan lebih dari 5 detik, sediakan cara menjeda, menghentikan, atau menyembunyikannya (merujuk WCAG 2.2.2 menurut ringkasan di **[R6]**; periksa teks resmi WCAG bila butuh kepastian).

### 8.4 Contoh dasar transisi

```css
.card {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}
@media (hover: hover) {
  .card:hover { transform: translateY(-2px); }
}
```

Angka 200ms dan 2px hanyalah contoh bentuk; ganti dengan hasil analisis katalog 8.1.

### 8.5 Animasi terkait scroll

Bila video menunjukkan elemen bereaksi pada scroll (parallax, reveal, video yang diputar mengikuti scroll), catat titik pemicunya (posisi scroll, atau elemen masuk viewport) dan implementasikan dengan `IntersectionObserver` atau pustaka animasi pilihan proyek. **Dukungan browser untuk fitur CSS scroll-driven animation berubah-ubah; cek caniuse atau MDN sebelum memakainya, saya tidak memverifikasinya di sini.**

**Keluaran Fase 8:** katalog animasi + implementasi + penanganan `prefers-reduced-motion`.

---

## Fase 9: QA (visual diff, aksesibilitas, responsif)

### 9.1 Ambil screenshot hasil

Dengan Playwright CLI. Opsi `--viewport-size` dan `--full-page` tercantum di bantuan CLI (`npx playwright screenshot --help`) **[T]** untuk sintaksnya; saya **tidak menjalankan pengambilan screenshot sungguhan** di sandbox karena browser belum terpasang di sana:

```bash
npx playwright screenshot --viewport-size=390,844 --full-page \
  http://localhost:8000 hasil.png
```

Sesuaikan ukuran viewport dengan lebar referensi (Fase 1).

### 9.2 Bandingkan dengan referensi

Samakan ukuran kedua gambar, lalu hitung selisih. Skrip dasar dengan Pillow **[T]**:

```python
from PIL import Image, ImageChops

ref = Image.open("referensi.png").convert("RGB")
hasil = Image.open("hasil.png").convert("RGB").resize(ref.size)
diff = ImageChops.difference(ref, hasil)

print("area beda:", diff.getbbox())
px = diff.convert("L").tobytes()
print("rata-rata selisih:", round(sum(px) / len(px), 2))

diff.save("diff.png")   # buka manual: area terang = beda besar
```

Di Mode B (terinspirasi) selisih besar itu **normal dan diharapkan** karena palet, font, dan konten berbeda; yang dinilai adalah kesesuaian struktur dan ritme. Di Mode A (replikasi setia), gunakan `diff.png` untuk menemukan bagian yang melenceng.

Kebanyakan selisih piksel kecil berasal dari font pengganti dan antialiasing, bukan kesalahan layout. Jangan mengejar nol.

### 9.3 Daftar periksa visual

- [ ] Hierarki sama: elemen yang menonjol di referensi juga menonjol di hasil.
- [ ] Ritme spasi konsisten dan memakai token.
- [ ] Penjajaran: tepi kiri, baseline, dan tengah sejajar seperti referensi.
- [ ] Radius, border, dan bayangan konsisten per jenis komponen.
- [ ] Gambar tidak melar (cek `object-fit` dan rasio aspek).
- [ ] Teks tidak terpotong, termasuk saat teks lebih panjang dari contoh.
- [ ] Tidak ada scroll horizontal yang tidak disengaja.

### 9.4 Daftar periksa aksesibilitas

Angka-angka berikut dibaca dari dokumen WCAG:

- [ ] **Kontras teks:** minimal 4.5:1 untuk teks normal, dan 3:1 untuk teks besar (setidaknya 18 pt, atau 14 pt tebal) **[R2]**. Kriteria ini juga berlaku untuk placeholder dan teks yang muncul saat hover atau fokus **[R2]**. Komponen non-teks (ikon bermakna, batas input, grafik) diatur oleh kriteria 1.4.11 yang disebut pada halaman yang sama **[R2]**; angka untuk kriteria itu tidak saya baca di sesi ini, jadi **tidak bisa saya konfirmasi** dari sini.
- [ ] **Ukuran target sentuh/klik:** WCAG 2.2 SC 2.5.8 (level AA) meminta target minimal 24 x 24 piksel CSS, atau target yang lebih kecil punya jarak cukup (lingkaran berdiameter 24 px di tengah target tidak boleh bersinggungan dengan target lain), dengan pengecualian seperti tautan di dalam kalimat dan kontrol bawaan browser **[R3]**. Banyak panduan platform menganjurkan target lebih besar; angka spesifik panduan Apple dan Material **tidak saya verifikasi** di sesi ini.
- [ ] Fokus keyboard terlihat di semua kontrol; urutan tab logis.
- [ ] Semua fungsi bisa dipakai tanpa mouse.
- [ ] Gambar bermakna punya `alt`; ikon tombol punya nama aksesibel (`aria-label` atau teks tersembunyi).
- [ ] Error form dijelaskan dengan teks, bukan hanya warna.
- [ ] `prefers-reduced-motion` ditangani.

### 9.5 Uji responsif

Periksa minimal pada: sekitar 320 px, lebar ponsel umum, tablet, dan desktop lebar. Periksa juga dengan teks diperbesar. Catat hal yang dibuat sendiri karena referensi tidak menunjukkannya.

### 9.6 Laporan akhir

Gunakan [template 17.3](#173-laporan-akhir). Laporan wajib memisahkan **yang diamati** dari **yang diasumsikan**.

---

## Fase 10: Kompilasi design.md (keluaran utama)

Tujuan: melebur semua bahan Fase 0-9 menjadi **satu berkas `design.md`** yang dapat dibaca agent maupun manusia di proyek berikutnya, tanpa perlu melihat gambar atau video referensi lagi.

### 10.1 Pemetaan bahan ke bagian design.md

| Bahan dari | Masuk ke bagian design.md |
|---|---|
| Fase 0 (intake), Fase 1 (audit) | 1 Ringkasan dan provenance; front matter |
| Fase 3 (dekonstruksi) | 3 Layout dan grid; 4 Pola halaman |
| Fase 4 (tokens) | 5 Design tokens; 12.1 `tokens.css` |
| Fase 5 (komponen dan state) | 7 Komponen; 8 Pola interaksi |
| Fase 6 (aset) | 6 Ikon dan gambar |
| Fase 7 (kode uji) | 7 (contoh markup); 12 Implementasi |
| Fase 8 (motion) | 9 Motion |
| Fase 9 (QA) | 11 Aksesibilitas; 14 Hasil QA; 15 Diamati vs diasumsikan |
| Semua `PERLU KONFIRMASI` | 16 Pertanyaan terbuka |
| Karakter yang terasa dari referensi | 2 Karakter dan prinsip; 10 Konten dan suara; 13 Do dan Don't |

### 10.2 Langkah kompilasi

1. Salin [template 17.0](#170-designmd-keluaran-utama) ke `design.md`.
2. Isi dari atas ke bawah. Hapus semua petunjuk dan sisa placeholder (`...`, `[nama]`). Dokumen yang masih berisi placeholder belum selesai.
3. Satu komponen, satu blok (salin blok "Nama Komponen"). Tulis hanya komponen yang benar-benar ada atau akan dipakai.
4. Tulis **alasan**, bukan hanya nilai: kenapa radius ini, kapan tombol sekunder dipakai. Agent berikutnya butuh aturan untuk kasus yang tidak ada di dokumen.
5. Salin tabel token ke `tokens.css` (12.1) persis sama.
6. Jalankan lint (10.3) dan perbaiki semua error.
7. Jika Fase 7 dijalankan, bangun satu halaman uji hanya dari `design.md`. Bagian yang memaksa Anda menebak berarti dokumen perlu dilengkapi.
8. Setel `status: disetujui` hanya setelah pengguna menyetujui. Sebelum itu tetap `draft`.

### 10.3 Lint: `lint_design.py`

Simpan sebagai `lint_design.py`, jalankan `python3 lint_design.py design.md`. Skrip ini memeriksa **struktur dan konsistensi**, bukan kualitas desain:

- bagian wajib ada (Cara memakai, Ringkasan, Karakter, Layout, Tokens, Komponen, Motion, Aksesibilitas, Diamati vs diasumsikan, Changelog);
- nilai hex warna valid;
- setiap `var(--token)` yang dirujuk didefinisikan di tabel token;
- rasio kontras setiap baris di tabel "Pasangan kontras" memenuhi minimum yang Anda tulis (rumus luminans WCAG).

Skrip hanya membaca format tabel pada template 17.0 (kolom pertama token dalam backtick, kolom kedua nilai dalam backtick). Bila Anda mengubah format tabel, sesuaikan skripnya.

```python
#!/usr/bin/env python3
"""Lint design.md: struktur wajib, token terdefinisi, hex valid, kontras WCAG.
Pemakaian: python3 lint_design.py design.md
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
```

Uji saya **[T]**: pada template, lint lolos (kontras 18.20:1 dan 9.10:1 pada contoh warna di template). Pada salinan yang sengaja dirusak (warna primary diganti kuning terang, bagian Aksesibilitas diganti nama, token yang tidak didefinisikan disisipkan), lint melaporkan ketiga masalah itu dan keluar dengan kode 1.

### 10.4 Kriteria design.md yang bisa dipakai ulang

- [ ] **Mandiri:** dapat dipakai tanpa gambar referensi.
- [ ] **Berbasis token:** komponen merujuk token, bukan nilai mentah.
- [ ] **Menjelaskan alasan:** ada prinsip, aturan "kapan dipakai / tidak", dan Do/Don't.
- [ ] **Jujur:** keyakinan (T/S/R) pada token, bagian "Diamati vs diasumsikan", dan "Pertanyaan terbuka" terisi.
- [ ] **Bebas salinan:** di Mode B tidak ada aset, logo, atau teks salinan dari referensi pihak ketiga; hanya pola yang dideskripsikan dengan kata sendiri dan nilai token milik sendiri.
- [ ] **Bisa dieksekusi:** `tokens.css` ada dan sama dengan tabel; contoh markup komponen ada.
- [ ] **Aksesibel:** pasangan kontras terdata dan lolos lint; aturan fokus, target, dan motion tertulis.
- [ ] **Berversi:** front matter `version` dan Changelog diperbarui tiap perubahan.
- [ ] **Muat dibaca sekali oleh agent [K]:** bila dokumen sangat panjang, pecah detail komponen ke berkas terpisah (mis. `design/components/*.md`) dan tautkan dari `design.md`. Batas panjang yang pasti tergantung model dan alat yang Anda pakai; saya tidak bisa memastikan angkanya.

### 10.5 Memakai ulang di proyek lain

- Taruh `design.md` di akar proyek, lalu tambahkan satu baris di file instruksi proyek untuk agent Anda: "Baca `design.md` sebelum membuat atau mengubah UI apa pun; ikuti token dan komponen di dalamnya."
- Contoh prompt:

```
Baca design.md. Buat halaman [nama halaman] hanya dengan token dan komponen di
dokumen itu. Jika ada kebutuhan yang tidak tercakup, jangan menebak diam-diam:
usulkan penambahan ke design.md dulu, tunggu persetujuan, baru pakai.
```

- Perubahan token: ubah tabel di bagian 5 **dan** `tokens.css` di 12.1 bersamaan, naikkan `version`, catat di Changelog beserta alasan.
- Varian (mis. mode gelap, merek lain): tambah bagian baru atau salin dokumen sebagai `design.[varian].md`; jangan menimpa versi yang masih dipakai.

---

## 15. Kasus khusus per jenis sumber

### 15.1 Pinterest atau moodboard (banyak gambar, gaya campur)

- Jangan pilih satu pin lalu menirunya. Kelompokkan pin menurut kesamaan (palet, tipografi, tata letak), tulis **pola yang berulang**, lalu sintesis.
- Ekstrak: palet yang konsisten, rasa tipografi (serif editorial, sans geometris, dst.), kepadatan (lapang atau rapat), bentuk (sudut tajam atau bulat), jenis ilustrasi atau fotografi.
- Catat sumber tiap pin yang jadi acuan agar bisa ditelusuri.
- Hampir selalu **Mode B**.

### 15.2 Mobbin (kumpulan screenshot aplikasi dan alur nyata)

- Kekuatan sumber ini adalah **pola interaksi dan alur** (onboarding, checkout, pengaturan), bukan visual tertentu. Ekstrak pola: urutan layar, hierarki informasi, penempatan aksi utama, penanganan error dan empty state.
- Ingat ketentuan di bagian 2: berdasarkan salinan ToS yang saya baca, ada larangan memakai AI untuk membuat turunan dari konten platform **[R1]**. Periksa langsung ketentuan terbaru dan paket langganan Anda sebelum mengunggah konten ke alat AI.
- Alternatif yang lebih berhati-hati (bukan jaminan hukum, saya tidak bisa memastikan cakupan ketentuannya): Anda sendiri mencatat pola dengan kata-kata sendiri, lalu agent merancang berdasarkan catatan itu, bukan berdasarkan screenshot.

### 15.3 Rekaman layar (video)

- Prioritaskan Fase 2 dan Fase 8.
- Perhatikan kecepatan rekaman; rekaman ponsel sering 60 fps, rekaman layar kadang variabel.
- Cursor atau sentuhan di rekaman bukan bagian UI; abaikan.

### 15.4 Dashboard atau UI padat data

- Fokus pada sistem: tabel, grafik, filter, dan kepadatan informasi.
- Data contoh harus realistis (nama, angka, tanggal wajar), bukan "Lorem ipsum" atau "Data 1".
- Pastikan tabel punya perilaku di layar kecil (scroll dalam kontainer sendiri).

### 15.5 Landing page dengan efek visual berat (video latar, 3D, scroll-scrubbing)

- Pisahkan **struktur halaman** (yang bisa di-slice dari frame) dari **efek khusus** (yang perlu aset video/3D tersendiri dan kode animasi).
- Siapkan versi cadangan tanpa gerak: gambar diam sebagai poster, dan jalur `prefers-reduced-motion`.
- Aset berat (video, model 3D) perlu dioptimalkan; ukuran file mempengaruhi performa. **[K]**

### 15.6 Mode gelap

- Jangan hanya membalik warna. Definisikan set token gelap terpisah, lalu periksa kontras ulang (9.4).

---

## 16. Aturan perilaku untuk AI agent

**Lakukan:**

1. Tentukan Mode A/B di awal dan catat di spec sheet.
2. Mulai dari Fase 3 dan 4 sebelum menulis kode.
3. Beri tingkat keyakinan pada setiap token dan tandai `PERLU KONFIRMASI` untuk yang tidak bisa ditentukan.
4. Nyatakan asumsi dalam satu kalimat, lalu lanjut bekerja; jangan menahan pekerjaan dengan pertanyaan beruntun.
5. Bangun dari token ke komponen ke halaman, dan bandingkan hasil di tiap tahap.
6. Laporkan apa yang diamati dan apa yang diasumsikan secara terpisah.
7. Bila perintah atau angka teknis tidak yakin, katakan "tidak bisa saya konfirmasi" dan sarankan cara memeriksanya.
8. Menjadikan `design.md` sebagai keluaran utama, memakai template 17.0, dan menjalankan lint sebelum menyatakan selesai.
9. Menulis alasan dan aturan penggunaan di `design.md`, bukan hanya daftar nilai.
10. Menjaga `tokens.css` dan tabel token tetap identik; bila satu berubah, ubah yang lain.

**Jangan:**

1. Mengarang nilai (mis. mengaku tahu nama font atau hex pasti dari JPEG terkompresi).
2. Mengaku "pixel perfect" tanpa bukti visual diff.
3. Menyalin aset, logo, ilustrasi, atau teks dari referensi pihak ketiga ke hasil akhir.
4. Menulis ulang seluruh file untuk perubahan kecil; ubah bagian yang perlu saja.
5. Menambah fitur, section, atau animasi yang tidak ada di referensi atau permintaan.
6. Mengulang peringatan legal di setiap pesan.
7. Menyatakan `design.md` selesai selagi masih ada placeholder (`...`) atau lint masih melaporkan error.
8. Memasukkan aset, logo, atau teks salinan dari referensi pihak ketiga ke `design.md` (Mode B).

### Contoh prompt untuk memicu skill

```
Gunakan skill ui-slicing. Mode B (terinspirasi). Referensi: 3 screenshot di folder
refs/ (halaman beranda, detail produk, checkout). Keluaran akhir: design.md lengkap
sesuai template 17.0. Tunjukkan dulu token dan inventaris komponen untuk saya cek,
lalu kompilasi design.md dan jalankan lint. Tandai semua nilai yang kamu perkirakan.
```

```
Gunakan skill ui-slicing. Mode A (ini desain saya sendiri). Sumber: rekaman layar
prototype.mp4. Ekstrak frame kunci, buat katalog animasi, lalu masukkan ke bagian
Motion di design.md beserta komponen menu dan transisi halaman. Sertakan
prefers-reduced-motion dan jalankan lint.
```

---

## 17. Template siap pakai

### 17.0 design.md (keluaran utama)

Salin seluruh blok di bawah menjadi `design.md`. Nilai warna, font, dan angka di dalamnya hanyalah **contoh bentuk** agar lint bisa berjalan; ganti semuanya dengan hasil analisis Anda.

````markdown
---
name: design-[nama-proyek]
description: Panduan desain [nama proyek]. Baca file ini sebelum membuat atau mengubah UI apa pun untuk proyek ini; semua warna, tipografi, spasi, komponen, dan motion mengikuti dokumen ini.
version: 0.1.0
status: draft            # draft | disetujui
mode: B                  # A = replikasi setia | B = terinspirasi
dibuat: YYYY-MM-DD
---

# Design Guide: [Nama Proyek]

## 0. Cara memakai dokumen ini

- Dokumen ini adalah **sumber kebenaran tunggal** untuk tampilan. Bila kode dan dokumen berbeda, perbarui salah satunya, jangan biarkan berbeda.
- Pakai **token** (`var(--...)`), jangan nilai mentah (`#3a13dc`, `13px`).
- Butuh nilai baru? Tambahkan dulu ke bagian 5, beri alasan di Changelog (bagian 17), baru dipakai.
- Tanda keyakinan: **T** tinggi, **S** sedang, **R** rendah. Item `PERLU KONFIRMASI` belum final, jangan dianggap fakta.

## 1. Ringkasan dan provenance

| Item | Isi |
|---|---|
| Produk / halaman | ... |
| Audiens dan tugas utama | ... |
| Mode | A / B |
| Sumber referensi | daftar berkas/tautan + hak pakai (milik sendiri / berlisensi / tidak jelas) |
| Cara sintesis (Mode B) | pola apa diambil dari referensi mana, apa yang sengaja dibuat sendiri |
| Lebar acuan dan faktor skala | ... px, faktor ... (keyakinan) |

## 2. Karakter dan prinsip

- Kepribadian dalam 3-5 kata kunci: ...
- Prinsip desain (maks. 5), masing-masing satu kalimat dan satu contoh penerapan:
  1. ...
- Satu elemen yang sengaja dibuat paling menonjol: ...

## 3. Layout dan grid

- Lebar maksimum konten: ... | Margin samping: ... | Kolom: ...
- Titik patah: tabel di bagian 5.7
- Ritme vertikal antar section: ...
- Penjajaran default: kiri / tengah (jelaskan kapan berbeda)
- Wireframe ASCII per halaman:

```
[wireframe]
```

## 4. Pola halaman (section)

| Section | Tujuan | Struktur | Komponen dipakai | Perilaku mobile |
|---|---|---|---|---|

## 5. Design tokens

### 5.1 Warna

| Token | Nilai | Peran | Keyakinan |
|---|---|---|---|
| `--color-bg` | `#ffffff` | latar halaman | S |
| `--color-text` | `#15151a` | teks utama | S |
| `--color-primary` | `#3a13dc` | aksi utama | S |
| `--color-on-primary` | `#ffffff` | teks di atas primary | S |

**Pasangan kontras yang dipakai** (diperiksa otomatis oleh lint):

| Teks | Latar | Ukuran teks | Minimum |
|---|---|---|---|
| `--color-text` | `--color-bg` | normal | 4.5 |
| `--color-on-primary` | `--color-primary` | normal | 4.5 |

Mode gelap: set token terpisah di 5.1b bila ada.

### 5.2 Tipografi

| Token | Nilai | Dipakai untuk | Keyakinan |
|---|---|---|---|
| `--font-sans` | `system-ui, sans-serif` | semua teks | R |
| `--text-md` | `1rem` | isi | S |

Catatan font: karakter visual referensi, font pengganti, lisensi.
Aturan: panjang baris < 80 karakter untuk paragraf; hierarki judul h1-h4 dan ukurannya.

### 5.3 Spasi

| Token | Nilai |
|---|---|
| `--space-2` | `0.5rem` |
| `--space-4` | `1rem` |

### 5.4 Bentuk: radius, border, bayangan

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `--radius-md` | `12px` | kartu, input |
| `--shadow-sm` | `0 1px 2px rgb(0 0 0 / 0.08)` | kartu |

### 5.5 Motion

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `--dur-base` | `250ms` | transisi umum |
| `--ease-out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | elemen masuk |

### 5.6 Lapisan (z-index) dan ukuran kontrol

| Token | Nilai |
|---|---|
| `--control-h` | `44px` |
| `--z-modal` | `100` |

### 5.7 Titik patah

| Nama | Min lebar | Perubahan utama |
|---|---|---|
| md | 768px | ... |

## 6. Ikon dan gambar

- Set ikon: nama, lisensi, ukuran (16/20/24), ketebalan garis, gaya.
- Fotografi/ilustrasi: arah visual, rasio aspek standar, perlakuan (sudut, filter).
- Aset belum final (placeholder): daftar.

## 7. Komponen

Untuk setiap komponen salin blok ini:

### Nama Komponen
- **Tujuan:** ...
- **Anatomi:** bagian-bagian (ikon, label, ...)
- **Varian:** ...
- **Ukuran:** ...
- **State:** default, hover, fokus, aktif, disabled, loading, error, kosong (tandai: diamati / diturunkan)
- **Token dipakai:** `--...`
- **Aturan:** kapan dipakai, kapan tidak
- **Aksesibilitas:** elemen HTML, peran ARIA, interaksi keyboard
- **Contoh markup:**

```html
<button class="btn btn--primary">Simpan perubahan</button>
```

## 8. Pola interaksi dan alur

Diagram alur layar (jika ada), pemicu perpindahan, penanganan error dan state kosong.

## 9. Motion

| # | Elemen | Pemicu | Properti | Durasi | Easing | Keyakinan |
|---|---|---|---|---|---|---|

Aturan: motion bermakna vs dekoratif; `prefers-reduced-motion` wajib ditangani (bagian 11).

## 10. Konten dan suara

- Nada: ...
- Aturan label tombol (kata kerja spesifik), kapitalisasi (sentence case), format tanggal/angka.
- Pola pesan error: apa yang salah + cara memperbaiki.
- Pola state kosong: pesan + ajakan bertindak.

## 11. Aksesibilitas

- Kontras: teks normal >= 4.5:1, teks besar >= 3:1 (WCAG 1.4.3).
- Target: >= 24x24 px CSS atau spasi cukup (WCAG 2.5.8).
- Fokus keyboard terlihat; semua fungsi bisa tanpa mouse.
- `prefers-reduced-motion`: semua animasi non-esensial dimatikan atau disederhanakan.
- Gambar bermakna punya `alt`; ikon tombol punya nama aksesibel.

## 12. Implementasi

### 12.1 `tokens.css` (salinan dari bagian 5)

```css
:root {
  --color-bg: #ffffff;
  --color-text: #15151a;
  --color-primary: #3a13dc;
  --color-on-primary: #ffffff;
  --font-sans: system-ui, sans-serif;
  --text-md: 1rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --radius-md: 12px;
  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.08);
  --dur-base: 250ms;
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --control-h: 44px;
  --z-modal: 100;
}
```

### 12.2 Pemetaan ke framework

Tailwind/CSS-in-JS/dll.: cara token dipetakan (opsional).

### 12.3 Struktur berkas

```
css/tokens.css  css/base.css  css/components.css  css/sections.css
```

## 13. Do dan Don't

| Do | Don't |
|---|---|
| Pakai token | Nilai mentah di komponen |
| ... | ... |

## 14. Hasil QA

| Pemeriksaan | Hasil | Tanggal |
|---|---|---|
| Visual diff vs referensi | ... | |
| Kontras (lint) | ... | |
| Target sentuh | ... | |
| Responsif (320 px dst.) | ... | |

## 15. Diamati vs diasumsikan

| Diamati dari referensi | Diasumsikan / diputuskan sendiri |
|---|---|
| ... | ... |

## 16. Pertanyaan terbuka

- PERLU KONFIRMASI: ...

## 17. Changelog

| Versi | Tanggal | Perubahan | Alasan |
|---|---|---|---|
| 0.1.0 | YYYY-MM-DD | Versi awal | |
````

### 17.1 Spec sheet (draf kerja; isinya dilebur ke design.md di Fase 10)

```markdown
# Spec Sheet: [nama proyek / halaman]

## Konteks
- Mode: A (replikasi setia) / B (terinspirasi)
- Sumber: [daftar file atau tautan] | Hak pakai: [milik sendiri / berlisensi / tidak jelas]
- Stack: [...] | Target device: [...] | Lebar acuan: [... px] (keyakinan: T/S/R)
- Asumsi: [...]

## Audit sumber
| Berkas | Dimensi | Perkiraan faktor skala | Catatan |
|---|---|---|---|

## Peta layout
[wireframe ASCII per layar]

## Inventaris section
| Section | Tujuan | Layout | Kolom | Perilaku mobile (observasi/dugaan) |
|---|---|---|---|---|

## Hierarki visual
1. ...

## Design tokens
| Token | Nilai | Keyakinan | Cara didapat |
|---|---|---|---|

## Komponen dan state
| Komponen | Varian | State terlihat | State diturunkan |
|---|---|---|---|

## Aset
| Aset | Sumber | Lisensi | Status (final / placeholder) |
|---|---|---|---|

## Animasi (jika ada)
[tabel katalog dari Fase 8]

## Perlu konfirmasi
- [...]
```

### 17.2 `tokens.css` awal

```css
:root {
  /* Warna (peran, bukan nama) */
  --color-bg: #ffffff;
  --color-surface: #f6f6f8;
  --color-text: #15151a;
  --color-text-muted: #5a5a66;
  --color-primary: #3a13dc;
  --color-on-primary: #ffffff;
  --color-border: #dcdce3;
  --color-danger: #c2262e;

  /* Tipografi */
  --font-sans: system-ui, sans-serif;
  --text-sm: 0.875rem;
  --text-md: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.75rem;
  --leading-tight: 1.2;
  --leading-body: 1.5;

  /* Spasi */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;

  /* Bentuk */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-pill: 999px;
  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.08);

  /* Motion */
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --dur-fast: 150ms;
  --dur-base: 250ms;
}
```

Semua nilai di atas hanyalah **placeholder bentuk**. Ganti dengan hasil Fase 4; jangan dipakai apa adanya. Setiap pasangan teks dan latar harus Anda periksa kontrasnya (9.4).

### 17.3 Laporan akhir

```markdown
# Laporan Slicing

## Yang dibuat
[daftar file dan halaman]

## Yang DIAMATI dari referensi
- Struktur section, hierarki, grid
- Token yang terukur (keyakinan T/S)

## Yang DIASUMSIKAN / diputuskan sendiri
- Font pengganti, titik patah responsif, state hover/fokus, copy, aset
- Token berkeyakinan rendah (R)

## Hasil QA
- Visual diff: [catatan area beda dan penjelasannya]
- Kontras: [daftar pasangan yang diperiksa + rasio]
- Target sentuh: [hasil periksa]
- Responsif: [lebar yang diuji]
- Motion: [prefers-reduced-motion ditangani? ya/tidak]

## Perlu konfirmasi pengguna
- [...]

## Catatan hak pakai
- Mode: A/B | Aset: [sumber dan lisensi]
```

---

## 18. Troubleshooting

| Gejala | Kemungkinan penyebab | Tindakan |
|---|---|---|
| Elemen terlalu besar di ponsel | Ukuran diambil dari gambar @2x/@3x | Bagi dengan faktor skala (Fase 3.5) |
| Warna terlihat pudar dibanding referensi | Warna diambil dari area antialiasing atau gradasi | Ambil dari area datar; cek ulang secara manual |
| Teks terpotong | Tinggi tetap | Ganti dengan `min-height` dan padding |
| Layout lompat saat gambar dimuat | Rasio aspek tidak ditentukan | Beri `width`/`height` atau `aspect-ratio` |
| Hasil mirip tapi "terasa beda" | Hierarki atau ritme spasi tidak cocok | Periksa ulang Fase 3.3-3.4, bukan sekadar ukuran |
| Banyak frame hampir sama dari video | `fps` terlalu tinggi | Pakai deteksi scene (2.2) atau dedupe (2.7) |
| Perubahan halus tidak tertangkap deteksi scene | Ambang terlalu tinggi | Turunkan ambang dari `0.3` |
| Diff piksel besar di seluruh teks | Font pengganti dan antialiasing | Wajar; nilai dari struktur dan ritme |
| Animasi terasa kaku | Easing atau durasi meleset | Hitung ulang dari frame (8.1-8.2) |
| Kontras gagal tipis | Abu terlalu terang | Gelapkan sedikit; ukur ulang dengan skrip 4.1 |

---

## 19. Referensi dan catatan verifikasi

### Sumber yang saya baca saat menyusun dokumen ini

- **[R1]** Mobbin, Terms of Service (efektif 16 Mei 2026), via arsip TOS Tracker (tangkapan 10 Juli 2026): https://tostracker.app/document/mobbincom-tos. Sumber asli yang dirujuk arsip itu: https://mobbin.com/terms (**tidak saya buka langsung**).
- **[R2]** W3C, *Understanding SC 1.4.3 Contrast (Minimum)*: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum (isi serupa pada https://w3c.github.io/wcag/understanding/contrast-minimum).
- **[R3]** W3C, *Understanding SC 2.5.8 Target Size (Minimum)*: https://w3c.github.io/wcag/understanding/target-size-minimum
- **[R4]** Mintz, "Pinterest Announces Changes to Its Terms of Service" (2012): https://www.mintz.com/2012/03/26/pinterest-announces-changes-to-its-terms-of-service/ (artikel lama; **bukan** ToS Pinterest saat ini).
- **[R5]** Web Platform DX, entri fitur `prefers-reduced-motion` (status Baseline Widely Available): https://web-platform-dx.github.io/web-features-explorer/features/prefers-reduced-motion/ ; dokumentasi MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- **[R6]** specification.website, ringkasan panduan *reduced motion* (sumber sekunder; merujuk WCAG 2.3.3 dan 2.2.2): https://specification.website/spec/accessibility/reduced-motion/

### Yang saya uji sendiri **[T]**

Di sandbox dengan ffmpeg 6.1.1, Python 3, Pillow 12.1.1, OpenCV 4.13.0, pada video sintetis 390x844 yang saya buat sendiri: `ffprobe`, ekstraksi `fps`, deteksi scene dengan `-fps_mode vfr`, keyframe, satu frame berdasar timestamp, segmen 30 fps, contact sheet `tile`, crop, kompresi H.264 dan VP9, skrip palet dan kontras, deteksi kotak OpenCV, hash perbedaan antar frame, dan selisih gambar Pillow. Sintaks `npx playwright screenshot` dan opsi `--viewport-size`, `--full-page` saya konfirmasi dari keluaran `--help`. Skrip `lint_design.py` (Fase 10) saya uji pada template yang lolos dan pada salinan yang sengaja dirusak (kontras gagal, bagian hilang, token tidak terdefinisi); ketiga masalah terdeteksi dan kode keluar sesuai.

**Batas pengujian:** video uji bersifat sintetis, jadi ambang (mis. `scene > 0.3`, jarak hash) belum dikalibrasi pada rekaman aplikasi nyata. Pengambilan screenshot Playwright sungguhan tidak saya jalankan. Lint hanya mengenali format tabel pada template 17.0, dan hanya menilai konsistensi serta kontras, bukan kualitas desain.

### Yang tidak bisa saya konfirmasi

- Isi Terms of Service Pinterest saat ini.
- Versi terbaru `mobbin.com/terms` di luar salinan arsip yang saya baca, dan maksud pasti klausul kepemilikan karya turunan di dalamnya.
- Ukuran target minimum menurut panduan platform Apple dan Material.
- Angka kriteria WCAG 1.4.11 (kontras non-teks).
- Status dukungan browser untuk scroll-driven animation CSS.

### Label **[K]**

Bagian bertanda **[K]** (skala spasi kelipatan 4, mobile-first, penamaan token berdasarkan peran, tebakan easing, dan sejenisnya) adalah konvensi praktik, bukan standar yang saya verifikasi. Ubah sesuai kebutuhan proyek Anda.

---

*Dokumen ini adalah panduan kerja, bukan nasihat hukum. Untuk proyek komersial dengan referensi pihak ketiga, pastikan hak pakai Anda jelas sebelum rilis.*
