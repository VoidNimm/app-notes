---
name: design-aplikasi-catatan-tugas
description: Panduan desain Aplikasi Pencatat Tugas Kuliah (plss.inget). Baca file ini sebelum membuat atau mengubah UI apa pun untuk proyek ini; semua warna, tipografi, spasi, komponen, dan motion mengikuti dokumen ini.
version: 0.1.2
status: draft
mode: B
dibuat: 2026-10-14
---

# Design Guide: Aplikasi Pencatat Tugas Kuliah (plss.inget)

## 0. Cara memakai dokumen ini

- Dokumen ini adalah **sumber kebenaran tunggal** untuk seluruh tampilan dan interaksi UI aplikasi. Bila kode implementasi dan dokumen ini berbeda, perbarui salah satunya secara sadar, jangan biarkan terjadi perbedaan tampilan.
- Gunakan **objek tema terpusat** di `src/constants/theme.ts` (`DesignTokens.colors...`, `DesignTokens.spacing...`, `DesignTokens.radius...`), bukan nilai mentah atau nilai hardcoded (seperti `#161513` atau `16px`).
- Jika memerlukan nilai baru di luar token yang ada, tambahkan terlebih dahulu ke bagian 5, dokumentasikan alasannya di Changelog (bagian 18), baru gunakan di komponen.
- Tanda tingkat keyakinan analisis:
  - **T** = Tinggi (terukur/terverifikasi langsung dari referensi)
  - **S** = Sedang (diperkirakan berdasarkan ritme visual atau standar industri)
  - **R** = Rendah (dugaan/interpretasi mandiri yang memerlukan penyesuaian)
- Item berlabel `PERLU KONFIRMASI` adalah item yang belum diputuskan secara final oleh pemilik produk dan wajib ditinjau bersama.

---

## 1. Ringkasan dan provenance

| Item | Isi |
|---|---|
| Produk / halaman | plss.inget — Aplikasi Pencatat Tugas Kuliah (Aplikasi Android Personal) |
| Audiens dan tugas utama | Mahasiswa yang ingin mencatat tugas dari dosen secepat kilat (target < 10 detik), mengelompokkan deadline secara visual, dan menerima pengingat notifikasi lokal tepat waktu. |
| Mode slicing | **Mode B (Terinspirasi)** — mengambil pola struktur, kontras dual-tone, floating action pill, dan kartu berwarna dari referensi pihak ketiga, dengan copy, palet warna, tipografi, dan aset 100% orisinal disesuaikan dengan PRD. |
| Sumber referensi | Berkas tangkapan layar `reference/reference.jpg` (komposisi 3 layar mockup mobile: Today hero card, Saved category folder grid, Chats task-stream bubbles). Hak pakai referensi: gambar referensi inspirasi eksternal (tidak berlisensi langsung). |
| Cara sintesis (Mode B) | **Pola yang diambil dari referensi:** <br>1. Layar 1 (Today): Komposisi dual-tone — kartu atas berlatar gelap pekat (*dark charcoal*) berisi greeting hangat dan ringkasan kontekstual, dipadukan dengan kontainer bawah berlatar terang dengan radius sudut besar.<br>2. Layar 3 (Chats): Aliran tugas (*task stream*) berbentuk bubble kartu berkontur ramah dengan kode warna deadline yang khas.<br>3. Floating Action Pill: Tombol aksi tunggal mengambang di bawah layar yang ergonomis untuk jangkauan satu jempol.<br>**Yang dibuat orisinal:** Seluruh teks antarmuka dalam Bahasa Indonesia akademis-santai, palet warna semantik tugas (Terlambat, Hari ini, Minggu ini, Nanti, Selesai), modal form tambah tugas cepat via Expo Router, serta dialog konfirmasi hapus terstandarisasi. |
| Lebar acuan dan faktor skala | Lebar acuan viewport: `390px` (skala perangkat modern 1x), faktor skala referensi `~1.85x` (berdasarkan gambar mockup 736x552 px). Tingkat keyakinan: **S**. |

---

## 2. Karakter dan prinsip

- **Kepribadian antarmuka dalam 4 kata kunci:**
  *Fokus*, *Hangat*, *Ekspresif*, *Ringan*.
- **Prinsip desain:**
  1. **Kecepatan di atas segalanya (Speed First):** Form pencatatan tugas dirancang seringkas mungkin dengan nilai bawaan cerdas (deadline default besok 23.59) agar tugas tersimpan dalam < 10 detik tanpa hambatan visual.
  2. **Hierarki Berbasis Urgensi (Color with Meaning):** Warna cerah bukan sekadar dekorasi, melainkan indikator waktu deadline (Merah untuk Terlambat, Kuning-Amber untuk Hari Ini, Biru untuk Minggu Ini, Ungu untuk Nanti, dan Hijau untuk Selesai).
  3. **Dual-Tone yang Menenangkan (Cozy & Crisp):** Paduan kartu header gelap pekat (*dark charcoal*) dengan kanvas krem hangat (*warm cream canvas*) menciptakan kontras visual yang elegan tanpa menyilaukan mata mahasiswa saat belajar malam.
  4. **Ramah Satu Jempol (Thumb-Zone Ergonomics):** Tombol aksi utama tunggal mengambang (*Floating Action Pill*) diletakkan di bawah layar agar mudah dicapai satu tangan saat berada di kelas.
- **Elemen yang sengaja dibuat paling menonjol:**
  Kartu Rangkuman Hari Ini (*Hero Summary Card*) di bagian atas berlatar gelap dengan ringkasan jumlah tugas mendesak, serta tombol tunggal mengambang `+ Tambah Tugas`.

---

## 3. Layout dan grid

- **Lebar maksimum konten:** `100%` pada mobile (maksimum `480px` jika dibuka pada tablet/layar lebar).
- **Margin samping (padding horizontal):** `16px` (mobile standar) hingga `20px`.
- **Ritme vertikal antar section:** Kelipatan `16px` (`--space-4`) atau `24px` (`--space-6`).
- **Penjajaran default:** Rata kiri (*left-aligned*) untuk judul, label, dan isi tugas; rata tengah (*center*) untuk tombol aksi dok dan status empty state.
- **Wireframe ASCII:**

```text
+------------------------------------------+
|  [Status Bar: Jam, Baterai, Wi-Fi]       |
+------------------------------------------+
|  plss.inget                  Rab, 14 Okt |  <- Header & Hero Card (Dark)
|  Halo, Mahasiswa!                        |
|  Hari ini ada 2 tugas kuliah             |
|  yang harus diselesaikan:                |
|  * Laporan Praktikum (Basis Data)        |
|  * Tugas 3 (Kalkulus)                    |
+------------------------------------------+
|  DAFTAR TUGAS                            |  <- Light Surface Container
|  +------------------------------------+  |
|  | [!] TERLAMBAT (1)                  |  |
|  | +--------------------------------+ |  |
|  | | (O) Resume Jurnal              | |  |  <- Urgent Card (Red Tint)
|  | |     Pancasila · Kemarin, 23.59 | |  |
|  | +--------------------------------+ |  |
|  |                                    |  |
|  | [*] HARI INI (2)                   |  |
|  | +--------------------------------+ |  |
|  | | (O) Laporan Praktikum          | |  |  <- Today Card (Amber Tint)
|  | |     Pemrog Web · Hari ini, 21.00| |  |
|  | +--------------------------------+ |  |
|  |                                    |  |
|  | [>] MINGGU INI (3)                 |  |
|  | +--------------------------------+ |  |
|  | | (O) Makalah AI                 | |  |  <- Week Card (Blue Tint)
|  | |     Kecerdasan Buatan · Jum 23.59| |
|  | +--------------------------------+ |  |
|  |                                    |  |
|  | [v] SELESAI (4)           [Buka v] |  |  <- Collapsible (Default Tertutup)
|  +------------------------------------+  |
|                                          |
|            ( + Tambah Tugas )            |  <- Single Floating Action Pill
+------------------------------------------+
```

---

## 4. Pola halaman (section)

| Section | Tujuan | Struktur | Komponen dipakai | Perilaku mobile |
|---|---|---|---|---|
| **S1. Header & Hero Summary** | Menampilkan nama aplikasi "plss.inget", salam personal, tanggal hari ini, dan ringkasan jumlah tugas mendesak. | Stack gelap kontras tinggi dengan badge status dan teks rangkuman. | `HeroSummaryCard`, `StatusDot` | Menggulung halus bersama layar; teks membungkus rapi. |
| **S1. Task Stream (Daftar Tugas)** | Menampilkan seluruh tugas aktif yang dikelompokkan berdasarkan batas waktu: Terlambat, Hari Ini, Minggu Ini, Nanti. | Daftar vertikal (*vertical stack*) dengan header grup yang jelas. | `TaskGroupHeader`, `TaskCard`, `CheckboxCircle` | Kartu memanfaatkan lebar penuh kanvas dikurangi margin horizontal 16px. |
| **S1. Kelompok Selesai (Collapsible)** | Menampung tugas yang telah ditandai selesai secara terlipat agar tidak mengotori daftar tugas aktif. | Header akordeon dengan jumlah `Selesai (N)` dan indikator panah lipat. Default tertutup. | `CollapsibleGroupHeader`, `TaskCard` | Saat diketuk, daftar tugas selesai membuka ke bawah dengan animasi halus. |
| **S2. Modal Form Tambah/Edit Tugas** | Antarmuka masukan cepat untuk merekam tugas baru atau mengubah tugas lama. | Rute modal Expo Router (`presentation: 'modal'`), bukan bottom sheet kustom. | `TextInputField`, `DateTimePickerField`, `PrimaryButton` | Meluncur sebagai modal native; input judul langsung fokus (*autofocus*). |
| **S3. Layar Detail Tugas** | Menampilkan detail tugas secara utuh, batas waktu, status pengingat, dan tombol aksi. | Halaman bersih dengan kartu detail dan tombol aksi di bawah. | `DetailHeader`, `ReminderScheduleList`, `PrimaryButton`, `DeleteConfirmationModal` | Tombol 'Tandai Selesai', 'Ubah', dan 'Hapus' mudah diakses. |
| **S4. Banner Izin Notifikasi** | Memberi tahu alasan dibutuhkannya izin pengingat lokal tanpa mengintimidasi pengguna. | Kartu banner lembut di bagian atas daftar saat izin belum aktif. | `NoticeBanner`, `GhostButton` | Tampil sekali di awal; bisa ditutup jika pengguna menolak tanpa memblokir aplikasi. |
| **Empty State (Keadaan Kosong)** | Memberikan panduan ramah ketika belum ada tugas yang dicatat atau semua tugas sudah tuntas. | Kartu terpusat dengan ikon ilustrasi buku/ceklist dan tombol pemicu tambah tugas. | `EmptyStateCard`, `SecondaryButton` | Mengisi area tengah layar dengan visual menenangkan. |

---

## 5. Design tokens

### 5.1 Warna

| Token | Nilai | Peran | Keyakinan |
|---|---|---|---|
| `--color-bg` | `#f8f5f0` | latar kanvas utama halaman | T |
| `--color-surface` | `#ffffff` | permukaan kartu dan modal | T |
| `--color-surface-dark` | `#161513` | latar gelap kartu hero summary | T |
| `--color-surface-muted` | `#f1ede7` | latar elemen sekunder dan input | S |
| `--color-border` | `#e7e1d8` | garis batas pemisah halus | S |
| `--color-text` | `#161513` | teks utama pada latar terang | T |
| `--color-text-muted` | `#6b665f` | teks keterangan sekunder | S |
| `--color-text-on-dark` | `#ffffff` | teks utama di atas latar gelap | T |
| `--color-text-muted-dark` | `#a39e97` | teks sekunder di atas latar gelap | S |
| `--color-primary` | `#161513` | warna utama tombol dan aksen dominan | T |
| `--color-on-primary` | `#ffffff` | teks di atas tombol primary | T |
| `--color-bg-urgent` | `#fee2e2` | latar kartu tugas terlambat | S |
| `--color-text-urgent` | `#991b1b` | teks tugas terlambat | S |
| `--color-bg-today` | `#fef3c7` | latar kartu tugas hari ini | S |
| `--color-text-today` | `#78350f` | teks tugas hari ini | S |
| `--color-bg-week` | `#dbeafe` | latar kartu tugas minggu ini | S |
| `--color-text-week` | `#1e40af` | teks tugas minggu ini | S |
| `--color-bg-later` | `#f3e8ff` | latar kartu tugas nanti | S |
| `--color-text-later` | `#6b21a8` | teks tugas nanti | S |
| `--color-bg-done` | `#dcfce7` | latar tugas selesai | S |
| `--color-text-done` | `#166534` | teks tugas selesai | S |

**Pasangan kontras yang dipakai** (diperiksa otomatis dan lolos uji WCAG AA):

| Teks | Latar | Ukuran teks | Minimum |
|---|---|---|---|
| `--color-text` | `--color-bg` | normal | 4.5 |
| `--color-text` | `--color-surface` | normal | 4.5 |
| `--color-text-muted` | `--color-bg` | normal | 4.5 |
| `--color-text-muted` | `--color-surface` | normal | 4.5 |
| `--color-text-on-dark` | `--color-surface-dark` | normal | 4.5 |
| `--color-text-muted-dark` | `--color-surface-dark` | normal | 4.5 |
| `--color-on-primary` | `--color-primary` | normal | 4.5 |
| `--color-text-urgent` | `--color-bg-urgent` | normal | 4.5 |
| `--color-text-today` | `--color-bg-today` | normal | 4.5 |
| `--color-text-week` | `--color-bg-week` | normal | 4.5 |
| `--color-text-later` | `--color-bg-later` | normal | 4.5 |
| `--color-text-done` | `--color-bg-done` | normal | 4.5 |

### 5.2 Tipografi

| Token | Nilai | Dipakai untuk | Keyakinan |
|---|---|---|---|
| `--font-sans` | `system-ui, -apple-system, Roboto, sans-serif` | font utama aplikasi | R |
| `--text-xs` | `0.75rem` | label metadata, timestamp, badge | S |
| `--text-sm` | `0.875rem` | teks bantuan, nama mata kuliah | S |
| `--text-md` | `1rem` | isi paragraf, label form, judul tugas | T |
| `--text-lg` | `1.125rem` | subjudul section, judul kartu modal | S |
| `--text-xl` | `1.5rem` | judul utama header ("plss.inget") | T |
| `--text-2xl` | `1.875rem` | greeting hero summary | S |
| `--font-weight-regular` | `400` | bobot teks isi | S |
| `--font-weight-medium` | `500` | bobot teks label dan button | S |
| `--font-weight-bold` | `700` | bobot judul utama | T |
| `--line-height-tight` | `1.2` | line height judul | S |
| `--line-height-normal` | `1.5` | line height teks isi | S |

*Catatan Tipografi:*
- Batas maksimal panjang baris teks deskripsi: 75 karakter per baris untuk kenyamanan membaca di ponsel.
- Format tanggal di Indonesia: `Senin, 19 Okt 2026` atau jam: `23.59 WIB`.

### 5.3 Spasi

| Token | Nilai |
|---|---|
| `--space-1` | `0.25rem` |
| `--space-2` | `0.5rem` |
| `--space-3` | `0.75rem` |
| `--space-4` | `1rem` |
| `--space-5` | `1.25rem` |
| `--space-6` | `1.5rem` |
| `--space-8` | `2rem` |
| `--space-10` | `2.5rem` |

### 5.4 Bentuk: radius, border, bayangan

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `--radius-sm` | `8px` | badge kecil status |
| `--radius-md` | `16px` | input field, kartu anak |
| `--radius-lg` | `24px` | kartu tugas, kartu hero, modal sheet |
| `--radius-xl` | `32px` | kontainer utama kartu bawah |
| `--radius-full` | `9999px` | floating action pill, checkbox |
| `--shadow-sm` | `0 1px 3px rgba(0, 0, 0, 0.05)` | kartu tugas standar |
| `--shadow-md` | `0 4px 12px rgba(0, 0, 0, 0.08)` | kartu mengambang, dropdown |
| `--shadow-lg` | `0 8px 24px rgba(0, 0, 0, 0.12)` | floating action pill navigasi |

### 5.5 Motion

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `--dur-fast` | `150ms` | klik tombol, transisi status checkbox |
| `--dur-base` | `250ms` | buka/tutup modal sheet, lipat akordeon selesai |
| `--dur-slow` | `400ms` | transisi perpindahan layar |
| `--ease-out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | elemen masuk dan membesar |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | animasi buka-tutup akordeon |

### 5.6 Lapisan (z-index) dan ukuran kontrol

| Token | Nilai |
|---|---|
| `--control-h` | `48px` |
| `--control-sm-h` | `36px` |
| `--touch-target-min` | `44px` |
| `--z-card` | `1` |
| `--z-dock` | `50` |
| `--z-modal` | `100` |
| `--z-toast` | `200` |

### 5.7 Titik patah

| Nama | Min lebar | Perubahan utama |
|---|---|---|
| sm (telepon kecil) | `320px` | Pengurangan padding menjadi 12px, font judul scale 0.9x |
| md (telepon standar) | `375px` | Layout acuan standar (1 kolom kartu tugas) |
| lg (tablet / layar lebar) | `768px` | Konten dibatasi dalam kontainer tengah maksimal 480px |

---

## 6. Ikon dan gambar

> **PENTING — Kepatuhan Dependensi:**
> Set ikon dan paket pustaka apa pun di luar yang sudah terpasang di `package.json` **HARUS disetujui terlebih dahulu oleh pemilik produk sebelum dipasang**.

- **Verifikasi Paket Ikon Proyek Saat Ini:**
  - Berdasarkan pemeriksaan berkas `package.json`, paket `@expo/vector-icons` saat ini **BELUM TERPASANG**.
  - Paket yang saat ini tersedia dan terpasang adalah `expo-symbols` (`~57.0.3`) dan aset gambar bawaan di `assets/`.
  - Untuk ikon awal aplikasi, gunakan:
    1. Simbol bawaan `expo-symbols` untuk iOS/Android yang didukung.
    2. Aset SVG lokal sederhana atau simbol teks unicode standar (`+`, `✓`, `✕`, `▾`, `▸`).
  - Bila ke depan ingin memasang `@expo/vector-icons` atau `lucide-react-native`, wajib mengajukan konfirmasi kepada pemilik produk terlebih dahulu.

---

## 7. Komponen

### 7.1 TaskCard (Kartu Tugas)
- **Tujuan:** Menampilkan satu item tugas secara padat dan jelas, mencakup status centang, judul, mata kuliah, dan tanggal deadline.
- **Anatomi:**
  - Lingkaran centang (*CheckboxCircle*) di sebelah kiri.
  - Judul tugas (*Task Title*) di tengah atas.
  - Nama mata kuliah dan tanggal deadline di bawah judul (misal: "Basis Data · Besok, 23.59").
  - Area kartu dapat diketuk untuk membuka Layar Detail Tugas (S3).
- **Varian:**
  - `Urgent`: Berlatar `--color-bg-urgent` dengan teks `--color-text-urgent`.
  - `Today`: Berlatar `--color-bg-today` dengan teks `--color-text-today`.
  - `Week`: Berlatar `--color-bg-week` dengan teks `--color-text-week`.
  - `Later`: Berlatar `--color-bg-later` dengan teks `--color-text-later`.
  - `Done`: Berlatar `--color-bg-done` dengan teks tercoret `--color-text-done`.
- **Ukuran:** Tinggi fleksibel menyesuaikan panjang judul (minimal target sentuh 48px).
- **State:** Default, Pressed (`scale: 0.98`), Done.
- **Aksesibilitas:** Komponen tombol yang dapat diakses dengan label mencakup judul tugas, mata kuliah, dan batas waktu.

### 7.2 FloatingActionPill (Dok Aksi Tambah Tugas Tunggal)
- **Tujuan:** Menyediakan akses instan satu jempol untuk membuka form penambahan tugas dari layar utama.
- **Anatomi:**
  - Satu tombol berbentuk kapsul/pill penuh (`--radius-full`) berlatar gelap pekat (`--color-surface-dark`).
  - Teks: `+ Tambah Tugas` dengan warna putih (`--color-text-on-dark`).
  - Posisi: Mengambang di tengah bawah layar (*bottom centered*), berjarak 24px dari dasar layar.
- **Ukuran:** Tinggi `48px` (`--control-h`), padding horizontal `24px` (`--space-6`).
- **State:**
  - Default: Bayangan tegas (`--shadow-lg`).
  - Pressed: Sedikit mengecil (`scale: 0.96`) dengan durasi `--dur-fast`.
- **Aturan:** Selalu mengambang di atas konten; beri bantalan scroll bawah (*bottom inset*) pada daftar tugas minimal `80px` agar kartu paling bawah tidak tertutup.

### 7.3 HeroSummaryCard (Kartu Rangkuman Hari Ini)
- **Tujuan:** Memberikan fokus harian langsung di bagian atas layar: menyapa mahasiswa dan menampilkan rangkuman tugas paling mendesak.
- **Anatomi:**
  - Latar gelap pekat (`--color-surface-dark`) dengan sudut membulat lebar (`--radius-xl`).
  - Header: Nama aplikasi "plss.inget" di kiri, tanggal hari ini di kanan.
  - Teks sapaan personal ("Halo, Mahasiswa! Hari ini ada 2 tugas yang harus diselesaikan:").
  - Daftar ringkas 1-2 tugas hari ini.

### 7.4 CollapsibleGroup (Kelompok Selesai Terlipat)
- **Tujuan:** Menyimpan tugas yang sudah selesai agar tidak mengaburkan tugas aktif, tetapi tetap mudah diakses bila ingin diperiksa kembali.
- **Anatomi:**
  - Header kelompok bertuliskan `Selesai (N)` dengan penanda panah lipat (`▸` saat tertutup, `▾` saat terbuka).
  - Status default: **Tertutup (Collapsed)**.
  - Saat diketuk, daftar tugas selesai terbuka ke bawah dengan kartu bergaya `--color-bg-done`.

### 7.5 Form Modal Tambah/Edit Tugas
- **Tujuan:** Merekam atau mengubah tugas dengan kecepatan tinggi (< 10 detik).
- **Struktur:**
  - Dijalankan sebagai **rute modal Expo Router** (`presentation: 'modal'`), bukan bottom sheet kustom.
  - Header modal: Tombol 'Batal' di kiri, judul modal di tengah ("Tambah Tugas" / "Ubah Tugas"), tombol 'Simpan' di kanan.
  - Field:
    1. Judul Tugas (Wajib, teks biasa, maks 120 karakter, *autofocus*).
    2. Batas Waktu / Deadline (Wajib, pemilih tanggal & jam, default: besok 23.59).
    3. Mata Kuliah (Opsional, teks biasa, maks 80 karakter).
    4. Catatan / Deskripsi (Opsional, teks banyak baris / multiline).

### 7.6 DeleteConfirmationModal (Dialog Konfirmasi Hapus)
- **Tujuan:** Mencegah penghapusan tugas dan pembatalan notifikasi secara tidak sengaja.
- **Teks Dialog (Tunggal & Terstandarisasi):**
  > *"Hapus tugas '[Judul]'? Pengingat terjadwal ikut dibatalkan dan tindakan ini tidak dapat diurungkan."*
- **Aksi:** Tombol 'Batal' (sekunder) dan tombol 'Hapus' (merah / bahaya).

---

## 8. Pola interaksi dan alur

1. **Alur Tambah Tugas (Target < 10 Detik):**
   - Mahasiswa mengetuk tombol pill `+ Tambah Tugas` di bawah layar.
   - Layar modal native Expo Router muncul (`presentation: 'modal'`).
   - Input judul tugas langsung fokus dan keyboard virtual muncul otomatis.
   - Mahasiswa mengetik judul tugas, menerima batas waktu bawaan (besok 23.59) atau mengubahnya dengan beberapa ketukan.
   - Mengetuk "Simpan" menutup modal, tugas langsung muncul di kelompok yang sesuai, dan notifikasi lokal 24 jam serta 3 jam sebelum deadline otomatis dijadwalkan.
2. **Alur Penyelesaian Tugas:**
   - Mengetuk lingkaran centang di kartu tugas menandai tugas selesai.
   - Kartu tugas langsung berpindah ke dalam kelompok "Selesai (N)".
   - Semua jadwal pengingat untuk tugas tersebut otomatis dibatalkan.
3. **Alur Membuka Tugas Selesai:**
   - Mahasiswa menggulir ke bagian bawah daftar utama.
   - Mengetuk baris `Selesai (N)` membuka lipatan daftar tugas yang telah rampung. Mengetuk kembali akan melipatnya kembali.
4. **Alur Penghapusan:**
   - Mengetuk ikon hapus pada detail tugas memunculkan dialog konfirmasi standar. Mengetuk "Hapus" menghapus tugas permanen dan membatalkan jadwal pengingat.

---

## 9. Motion

| # | Elemen | Pemicu | Properti | Durasi | Easing | Keyakinan |
|---|---|---|---|---|---|---|
| 1 | Modal Form Tambah Tugas | Ketuk `+ Tambah Tugas` | Rute modal native OS via Expo Router | Bawaan OS | Bawaan OS | T |
| 2 | Kartu Tugas ditekan | Ketuk / Press | `transform: scale(0.98)` | `150ms` | `--ease-out` | S |
| 3 | Centang Selesai | Ketuk Checkbox | `scale`, `backgroundColor` | `200ms` | `--ease-out` | S |
| 4 | Lipatan Kelompok Selesai | Ketuk header `Selesai (N)` | `height`, `opacity` | `250ms` | `--ease-in-out` | S |
| 5 | Penghapusan Kartu | Konfirmasi Hapus disetujui | `opacity: 0`, `height: 0` | `250ms` | `--ease-out` | S |

- **Aturan Aksesibilitas Gerak:** Jika opsi sistem `prefers-reduced-motion` aktif, matikan animasi scale dan gunakan transisi instan demi kenyamanan pengguna.

---

## 10. Konten dan suara

- **Gaya Bahasa & Nada:** Bahasa Indonesia santai, suportif, ringkas, dan fokus.
- **Nama Aplikasi:** "plss.inget".
- **Contoh Salinan Antarmuka:**
  - Header Aplikasi: `plss.inget`
  - Sapaan Hero: `Halo, Mahasiswa! Hari ini ada 2 tugas yang harus diselesaikan:`
  - Dok Aksi: `+ Tambah Tugas`
  - Dialog Hapus: `Hapus tugas '[Judul]'? Pengingat terjadwal ikut dibatalkan dan tindakan ini tidak dapat diurungkan.`
  - Keadaan Kosong (Belum ada tugas): `Belum ada tugas tercatat. Santai sejenak, atau ketuk tombol (+) untuk mencatat tugas baru dari dosen!`
  - Banner Izin Notifikasi: `Aktifkan pengingat agar plss.inget bisa mengingatkanmu sebelum batas waktu tugas berakhir.`
- **Format Tanggal:**
  - Format hari dan jam: `Besok, 23.59` atau `Kamis, 15 Okt · 17.00`.

---

## 11. Aksesibilitas

- **Kontras Rasio Teks:**
  - Seluruh teks normal memiliki rasio kontras terhadap latarnya $\ge 4.5:1$ (memenuhi standar WCAG 2.1 AA).
  - Teks besar dan judul memiliki kontras $\ge 3.0:1$.
- **Ukuran Target Sentuh (Touch Target):**
  - Seluruh tombol, kotak centang, dan baris akordeon memiliki area sentuh minimum `44 x 44 px` atau `48 x 48 px`.
- **Dukungan Pembaca Layar (TalkBack):**
  - Tombol centang memiliki label aksesibilitas: *"Tandai tugas [Judul] selesai"*.
  - Header akordeon selesai mengumumkan status lipatan: *"Kelompok tugas selesai, N tugas, tertutup/terbuka"*.

---

## 12. Implementasi

### 12.1 `tokens.css` (Referensi Format Web Saja)

> **Catatan Implementasi:** Berkas CSS di bawah ini dicantumkan sebagai **referensi standar web/CSS saja**. Pada implementasi aktual aplikasi React Native/Expo, seluruh nilai diambil langsung dari objek tema TypeScript di `src/constants/theme.ts`.

```css
:root {
  /* Warna Kanvas & Teks */
  --color-bg: #f8f5f0;
  --color-surface: #ffffff;
  --color-surface-dark: #161513;
  --color-surface-muted: #f1ede7;
  --color-border: #e7e1d8;
  --color-text: #161513;
  --color-text-muted: #6b665f;
  --color-text-on-dark: #ffffff;
  --color-text-muted-dark: #a39e97;

  /* Warna Aksi & Brand */
  --color-primary: #161513;
  --color-on-primary: #ffffff;

  /* Warna Status Deadline */
  --color-bg-urgent: #fee2e2;
  --color-text-urgent: #991b1b;
  --color-bg-today: #fef3c7;
  --color-text-today: #78350f;
  --color-bg-week: #dbeafe;
  --color-text-week: #1e40af;
  --color-bg-later: #f3e8ff;
  --color-text-later: #6b21a8;
  --color-bg-done: #dcfce7;
  --color-text-done: #166534;

  /* Tipografi */
  --font-sans: system-ui, -apple-system, Roboto, sans-serif;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-md: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.5rem;
  --text-2xl: 1.875rem;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;

  /* Spasi & Ukuran */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --control-h: 48px;
  --control-sm-h: 36px;
  --touch-target-min: 44px;

  /* Radius & Bayangan */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;
  --radius-full: 9999px;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

  /* Motion & Z-Index */
  --dur-fast: 150ms;
  --dur-base: 250ms;
  --dur-slow: 400ms;
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --z-card: 1;
  --z-dock: 50;
  --z-modal: 100;
  --z-toast: 200;
}
```

### 12.2 Pemetaan Lengkap ke Objek Tema (`src/constants/theme.ts`)

Seluruh token di atas dipetakan secara lengkap ke dalam objek tema TypeScript `DesignTokens` pada `src/constants/theme.ts` sehingga pengembang tidak perlu menebak nilai properti:

```typescript
export const DesignTokens = {
  // 1. Warna (Warna kanvas, teks, aksi, dan status deadline)
  colors: {
    bg: '#f8f5f0',
    surface: '#ffffff',
    surfaceDark: '#161513',
    surfaceMuted: '#f1ede7',
    border: '#e7e1d8',
    text: '#161513',
    textMuted: '#6b665f',
    textOnDark: '#ffffff',
    textMutedDark: '#a39e97',
    primary: '#161513',
    onPrimary: '#ffffff',
    urgent: { bg: '#fee2e2', text: '#991b1b' },
    today: { bg: '#fef3c7', text: '#78350f' },
    week: { bg: '#dbeafe', text: '#1e40af' },
    later: { bg: '#f3e8ff', text: '#6b21a8' },
    done: { bg: '#dcfce7', text: '#166534' },
  },

  // 2. Spasi (Pixel)
  spacing: {
    space1: 4,
    space2: 8,
    space3: 12,
    space4: 16,
    space5: 20,
    space6: 24,
    space8: 32,
    space10: 40,
  },

  // 3. Radius Sudut (Pixel)
  radius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
  },

  // 4. Tipografi
  typography: {
    fontFamily: 'normal',
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 30,
    },
    weights: {
      regular: '400',
      medium: '500',
      bold: '700',
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
    },
  },

  // 5. Bayangan (Elevation Android & Shadow iOS)
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 8,
    },
  },

  // 6. Motion (Milidetik)
  motion: {
    durFast: 150,
    durBase: 250,
    durSlow: 400,
  },

  // 7. Ukuran Kontrol & Target Sentuh
  controls: {
    controlH: 48,
    controlSmH: 36,
    touchTargetMin: 44,
  },

  // 8. Z-Index
  zIndex: {
    card: 1,
    dock: 50,
    modal: 100,
    toast: 200,
  },
} as const;
```

### 12.3 Struktur Berkas Komponen UI

```text
src/
├── app/
│   ├── _layout.tsx           # Root navigation & modal stack config
│   ├── index.tsx             # S1: Layar Utama (Daftar Tugas & Hero Card)
│   ├── add.tsx               # S2: Modal Tambah Tugas (presentation: 'modal')
│   └── task/
│       └── [id].tsx          # S3: Layar Detail Tugas
├── components/
│   ├── TaskCard.tsx          # Kartu item tugas
│   ├── FloatingActionPill.tsx# Dok tombol aksi tambah tugas tunggal
│   ├── HeroSummaryCard.tsx   # Kartu sapaan & ringkasan atas
│   ├── CollapsibleGroup.tsx  # Akordeon kelompok tugas selesai
│   ├── EmptyState.tsx        # Tampilan saat tugas kosong
│   ├── PermissionBanner.tsx  # Banner izin notifikasi lokal
│   └── DeleteDialog.tsx      # Modal konfirmasi hapus tugas
└── constants/
    └── theme.ts              # Nilai token desain
```

---

## 13. Do dan Don't

| Do | Don't |
|---|---|
| Gunakan objek tema `DesignTokens` dari `src/constants/theme.ts` untuk seluruh penataan gaya | Menulis nilai warna atau angka ukuran mentah di file komponen |
| Gunakan rute modal Expo Router (`presentation: 'modal'`) untuk form penambahan tugas | Membuat komponen custom bottom sheet yang rumit dan berat |
| Pertahankan target sentuh minimal 44x44px pada setiap tombol dan checkbox | Membuat tombol kecil yang sulit diketuk mahasiswa saat terburu-buru |
| Biarkan kelompok tugas Selesai terlipat rapi secara default | Menumpuk tugas selesai bercampur dengan tugas aktif yang mendesak |
| Tampilkan deadline dalam format tanggal dan jam yang ramah ("Besok, 23.59") | Menampilkan format hitung mundur detik/jam dinamis yang mengalihkan perhatian |
| Gunakan teks dialog konfirmasi hapus yang seragam dan baku | Menghapus tugas tanpa dialog konfirmasi atau memakai kalimat membingungkan |

---

## 14. Hasil QA

| Pemeriksaan | Hasil | Tanggal |
|---|---|---|
| **Struktur Wajib Dokumen (Lint)** | Lolos 10/10 bagian wajib sesuai aturan `slicing-skill.md` | 2026-10-14 |
| **Kontras Teks (WCAG 2.1 AA)** | Seluruh 12 pasangan warna teks & latar lolos rasio $\ge 4.5:1$ | 2026-10-14 |
| **Target Sentuh Minimum** | Standar kontrol ditetapkan minimal 48px (`--control-h`), target sentuh 44px | 2026-10-14 |
| **Kesesuaian Fitur PRD** | Seluruh FR (FR-1 s.d FR-8), entitas Task, dan 4 layar (S1-S4) terakomodasi | 2026-10-14 |

---

## 15. Diamati vs diasumsikan

| Diamati dari referensi (`reference.jpg`) | Diasumsikan / diputuskan sendiri untuk PRD |
|---|---|
| Kartu atas berlatar gelap pekat dengan greeting personal dan visual playful | Diterapkan sebagai Hero Summary Card untuk merangkum tugas mendesak hari ini |
| Dok navigasi mengambang di bawah layar | Disederhanakan menjadi satu Floating Action Pill tunggal `+ Tambah Tugas` |
| Aliran kartu bubble berwarna cerah ceria (Kuning, Biru, Coral, Lavender) | Dipetakan menjadi warna semantik deadline (Terlambat, Hari Ini, Minggu Ini, Nanti) |
| Detail interaksi hover, fokus, dan transisi animasi spesifik tidak ada di foto statis | Mengikuti transisi modal bawaan OS Expo Router dan kurva `--ease-out` |

---

## 16. Ditunda ke versi berikutnya

Fitur dan elemen visual berikut dipindahkan dari ruang lingkup MVP (versi 1) ke fase rilis berikutnya agar proyek tetap kecil, cepat, dan fokus sesuai batasan PRD:

1. **Folder Mata Kuliah & Komponen `CourseFolderCard`**:
   - *Alasan penundaan:* Versi 1 berfokus penuh pada penyelesaian tugas berdasar urgensi waktu (G1, G2, G3). Pengelompokan visual berbasis kartu folder 2 kolom ditunda ke versi lanjutan.
2. **Selector Pill Mata Kuliah (`CourseSelectorPills`)**:
   - *Alasan penundaan:* Pada form penambahan tugas versi 1, field mata kuliah disediakan sebagai input teks biasa (*text input*) opsional (maksimal 80 karakter) tanpa perlu chip pemilih dinamis.
3. **Dropdown Filter Tugas**:
   - *Alasan penundaan:* Seluruh tugas aktif sudah otomatis terurut dan terkelompok berdasarkan batas waktu terdekat; filter interaktif tambahan belum dibutuhkan.
4. **Hitung Mundur Dinamis ("Sisa X jam")**:
   - *Alasan penundaan:* Tampilan waktu disederhanakan menjadi format tanggal dan jam statis yang jelas (misal: "Hari ini, 23.59" atau "Besok, 21.00") untuk menjaga kebersihan visual kartu dan menghemat konsumsi render baterai.
5. **Getaran Umpan Balik (*Haptic Feedback*)**:
   - *Alasan penundaan:* Menjaga paket dependensi aplikasi tetap minimal tanpa memerlukan pustaka native `expo-haptics` di tahap awal.
6. **Animasi Dok Menyembunyikan Diri Saat Scroll**:
   - *Alasan penundaan:* Tombol aksi `+ Tambah Tugas` tetap stabil mengambang di bawah layar tanpa perlu logika listener scroll yang berpotensi membebani performa daftar tugas.

---

## 17. Pertanyaan terbuka

- PERLU KONFIRMASI: Apakah nama paket/slug aplikasi saat ini (`app-notes`) perlu diselaraskan menjadi `plss-inget` pada `app.json` di langkah berikutnya?

---

## 18. Changelog

| Versi | Tanggal | Perubahan | Alasan |
|---|---|---|---|
| 0.1.2 | 2026-10-14 | Mengubah nama aplikasi resmi menjadi "plss.inget" di seluruh judul panduan desain, header, kartu sapaan, dan salinan antarmuka | Permintaan pemilik produk |
| 0.1.1 | 2026-10-14 | 1. Mengubah form tambah tugas menjadi rute modal Expo Router (`presentation: 'modal'`).<br>2. Menjadikan kelompok Selesai (N) terlipat di bawah daftar utama (*collapsible*, default tertutup).<br>3. Menyederhanakan dok navigasi menjadi tombol pill tunggal `+ Tambah Tugas` (menghapus tab Home/Folder).<br>4. Menambahkan bagian 'Ditunda ke versi berikutnya' dan memindahkan 6 item (Folder Mata Kuliah, CourseFolderCard, CourseSelectorPills, Dropdown Filter, hitung mundur jam, haptic feedback, animasi sembunyi dok) serta membersihkan rujukan di seluruh bagian dokumen.<br>5. Menetapkan nama aplikasi di header menjadi "TugasKu".<br>6. Menyeragamkan teks dialog hapus menjadi: *"Hapus tugas '[Judul]'? Pengingat terjadwal ikut dibatalkan dan tindakan ini tidak dapat diurungkan."*<br>7. Mengganti rujukan `var(--...)` di Bagian 0 menjadi objek tema `src/constants/theme.ts`, menandai `tokens.css` sebagai referensi saja, dan melengkapi Bagian 12.2 dengan pemetaan seluruh token.<br>8. Menambahkan catatan verifikasi paket ikon (`@expo/vector-icons` belum terpasang, hanya `expo-symbols`) dan aturan persetujuan paket baru.<br>9. Menambahkan entri changelog 0.1.1. | Penyesuaian instruksi revisi produk dari pemilik produk |
| 0.1.0 | 2026-10-14 | Versi awal panduan desain hasil slicing Mode B dari `reference/reference.jpg` | Menyelaraskan seluruh kebutuhan visual dengan kebutuhan fungsional `PRD.md` |
