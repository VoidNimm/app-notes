---
name: design-aplikasi-catatan-tugas
description: Panduan desain Aplikasi Pencatat Tugas Kuliah (plss.inget). Baca file ini sebelum membuat atau mengubah UI apa pun untuk proyek ini; semua warna, tipografi, spasi, komponen, dan motion mengikuti dokumen ini.
version: 0.2.3
status: active
mode: B
dibuat: 2026-10-14
diperbarui: 2026-10-15
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
| Mode slicing | **Mode B (Terinspirasi)** — mengambil pola struktur, kontras dual-tone, floating action pill dock, kartu folder 2 kolom, dan kartu gelembung percakapan berwarna dari referensi pihak ketiga, dengan copy, palet warna, tipografi, dan aset 100% orisinal disesuaikan dengan PRD dan jadwal kuliah kelas 1KA03. |
| Sumber referensi | Berkas tangkapan layar `reference/reference.jpg` (komposisi 3 layar mockup mobile: 1. Layar "Today" hero card, 2. Layar "Saved" category folder grid 2 kolom, 3. Layar "Chats" task-stream bubbles). Hak pakai referensi: gambar referensi inspirasi eksternal (tidak berlisensi langsung). |
| Cara sintesis (Mode B) | **Pola yang diambil dari referensi:** <br>1. Layar 1 (Today): Komposisi dual-tone — kartu atas berlatar gelap pekat (*dark charcoal*) berisi greeting personal kontekstual dan ringkasan tugas mendesak hari ini, dipadukan dengan kontainer bawah berlatar terang dengan radius sudut besar.<br>2. Layar 2 (Saved): Katalog folder kategori dalam grid 2 kolom dengan warna-warna vibrant (Kuning, Biru, Oranye, Lavender, Coral, Mint), menampilkan 8 mata kuliah utama kelas 1KA03 lengkap dengan jadwal dan dosen.<br>3. Layar 3 (Chats): Aliran tugas (*task stream*) berbentuk bubble kartu berkontur ramah/organik dengan kode warna semantik dan aksen ilustrasi/stiker.<br>4. Floating Pill Dock: Dok navigasi dan aksi mengambang berbentuk kapsul di bawah layar yang ergonomis untuk jangkauan satu jempol.<br>**Yang dibuat orisinal:** Seluruh teks antarmuka dalam Bahasa Indonesia akademis-santai, jadwal dan daftar 8 mata kuliah 1KA03, modal form tambah tugas cepat via Expo Router dengan selector pills, serta dialog konfirmasi hapus terstandarisasi. |
| Lebar acuan dan faktor skala | Lebar acuan viewport: `390px` (skala perangkat modern 1x), faktor skala referensi `~1.85x` (berdasarkan gambar mockup 736x552 px). Tingkat keyakinan: **S**. |

---

## 2. Karakter dan prinsip

- **Kepribadian antarmuka dalam 4 kata kunci:**
  *Fokus*, *Hangat*, *Ekspresif*, *Ringan*.
- **Prinsip desain:**
  1. **Kecepatan di atas segalanya (Speed First):** Form pencatatan tugas dirancang seringkas mungkin dengan pemilih pill mata kuliah instan (`CourseSelectorPills`) dan nilai bawaan cerdas (deadline default besok 23.59) agar tugas tersimpan dalam < 10 detik tanpa hambatan visual.
  2. **Hierarki Berbasis Urgensi & Mata Kuliah (Color with Meaning):** Warna cerah bukan sekadar dekorasi, melainkan pembeda visual folder mata kuliah 1KA03 dan indikator batas waktu tugas (Merah untuk Terlambat, Kuning-Amber untuk Hari Ini, Biru untuk Minggu Ini, Ungu untuk Nanti, dan Hijau untuk Selesai).
  3. **Dual-Tone yang Menenangkan (Cozy & Crisp):** Paduan kartu header gelap pekat (*dark charcoal*) dengan kanvas krem hangat (*warm cream canvas*) menciptakan kontras visual yang elegan tanpa menyilaukan mata mahasiswa saat belajar malam.
  4. **Ramah Satu Jempol (Thumb-Zone Ergonomics):** Dok navigasi dan tombol aksi utama mengambang (*Floating Pill Dock*) diletakkan di bawah layar agar mudah dicapai satu tangan saat berada di kelas.
- **Elemen yang sengaja dibuat paling menonjol:**
  Kartu Rangkuman Hari Ini (*Hero Summary Card*) di bagian atas berlatar gelap pada layar Today, folder mata kuliah berkartu warna cerah pada layar Saved, serta gelembung percakapan tugas pada layar Chats.

---

## 3. Layout dan grid

- **Lebar maksimum konten:** `100%` pada mobile (maksimum `480px` jika dibuka pada tablet/layar lebar).
- **Margin samping (padding horizontal):** `16px` (mobile standar) hingga `20px`.
- **Ritme vertikal antar section:** Kelipatan `16px` (`--space-4`) atau `24px` (`--space-6`).
- **Penjajaran default:** Rata kiri (*left-aligned*) untuk judul, label, dan isi tugas; rata tengah (*center*) untuk tombol aksi dok dan status empty state.
- **Wireframe ASCII (3 Layar & Floating Pill Dock):**

```text
======================= LAYAR 1: TODAY =======================
+------------------------------------------+
|  [Status Bar: Jam, Baterai, Wi-Fi]       |
+------------------------------------------+
|  Today                       Rab, 15 Okt |  <- Header & Hero Card (Dark)
|                                          |
|  Halo, Mahasiswa! Hari ini ada           |
|  2 tugas kuliah yang harus diselesaikan: |
|  * Laporan Praktikum (Fisika & Kimia)    |
|  * Tugas 1 (Konsep SI & TI)              |
|                                          |
|  Berdasarkan 8 mata kuliah 1KA03         |
+------------------------------------------+
|  Tugas Mendesak              3 tugas ▾   |  <- Light Surface Container
|  +------------------------------------+  |
|  | [!] TERLAMBAT (1)                  |  |
|  | (O) Resume Jurnal Pancasila        |  |  <- Urgent Task Card
|  +------------------------------------+  |
|  | [*] HARI INI (2)                   |  |
|  | (O) Laporan Praktikum Fisika       |  |  <- Today Task Card
|  +------------------------------------+  |
|                                          |
|       [ (Home)  (Folder)  (+)  (Chats) ] |  <- Floating Pill Dock
+------------------------------------------+

======================= LAYAR 2: SAVED =======================
+------------------------------------------+
|  Saved                        8 folders +|  <- Screen Header
+------------------------------------------+
|  +------------------+  +------------------+  |
|  | [Tab]            |  | [Tab]            |  |
|  | Fisika & Kimia   |  | Konsep SI & TI   |  |  <- Grid 2 Kolom
|  | 2 tugas          |  | 1 tugas          |  |  <- (Yellow & Blue)
|  | Senin 1/2 G343   |  | Senin 3/4 G343   |  |
|  +------------------+  +------------------+  |
|  +------------------+  +------------------+  |
|  | [Tab]            |  | [Tab]            |  |
|  | Algo & Pemrog 1  |  | Matematika Dsr 1 |  |  <- (Orange & Lavender)
|  | 3 tugas          |  | 0 tugas          |  |
|  | Senin 7/8 G114   |  | Senin 9/10 G347  |  |
|  +------------------+  +------------------+  |
|  +------------------+  +------------------+  |
|  | [Tab]            |  | [Tab]            |  |
|  | Digital Citizen. |  | ISBD             |  |  <- (Coral & Mint)
|  | 1 tugas          |  | 0 tugas          |  |
|  | Rabu 6/7 D655    |  | Kamis 3/4 G433   |  |
|  +------------------+  +------------------+  |
|  +------------------+  +------------------+  |
|  | [Tab]            |  | [Tab]            |  |
|  | Pend. Pancasila  |  | Bisnis & Ekon D. |  |  <- (Yellow & Blue)
|  | 0 tugas          |  | 1 tugas          |  |
|  | Kamis 9/10 G216  |  | Jum'at 1/2 E223  |  |
|  +------------------+  +------------------+  |
|                                          |
|       [ (Home)  (Folder)  (+)  (Chats) ] |  <- Floating Pill Dock
+------------------------------------------+

======================= LAYAR 3: CHATS =======================
+------------------------------------------+
|  Chats                         5 tugas ≡ |  <- Screen Header
+------------------------------------------+
|  (( ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ )) |
|  ( (O) Fisika & Kimia Dasar   13.45   ) |  <- Chat Bubble Card
|  (     Selesaikan resume Bab 3        ) |     (Coral / Wavy Edge)
|  (( ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ )) |
|                                          |
|  (( ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ )) |
|  ( (O) Konsep SI & TI         Besok   ) |  <- Chat Bubble Card
|  (     Tugas studi kasus sistem ERP   ) |     (Yellow)
|  (( ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ )) |
|                                          |
|  (( ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ )) |
|  ( (O) Algoritma & Pemrog 1   Jumat   ) |  <- Chat Bubble Card
|  (     Praktikum modul percabangan C  ) |     (Orange)
|  (( ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ )) |
|                                          |
|       [ (Home)  (Folder)  (+)  (Chats) ] |  <- Floating Pill Dock
+------------------------------------------+
```

---

## 4. Pola halaman (section)

| Section | Tujuan | Struktur | Komponen dipakai | Perilaku mobile |
|---|---|---|---|---|
| **S1. Homepage ("Today")** | Menampilkan rangkuman sapaan harian personal, tanggal, dan preview tugas mendesak hari ini. | Komposisi dual-tone: hero card gelap pekat di bagian atas, berpadu kontainer terang di bawah. | `HeroSummaryCard`, `StatusDot`, `TaskCard` | Menggulung halus bersama layar; teks membungkus rapi. |
| **S2. Layar "Saved" (Katalog Folder Mata Kuliah)** | Menampilkan katalog 8 mata kuliah utama kelas 1KA03 dalam bentuk folder 2 kolom yang informatif dan berwarna cerah. | Grid 2 kolom berisi kartu folder dengan tab khas, jumlah tugas, dan jadwal ruang & dosen. | `CourseFolderCard` | Grid responsif 2 kolom dengan margin seimbang dan ketukan untuk filter tugas matkul. |
| **S3. Layar "Chats" (Task Stream Gelembung)** | Menampilkan seluruh aliran tugas dalam format gelembung percakapan (*chat bubble*) organik yang ramah dan ekspresif. | Aliran kartu vertikal dengan lekukan sudut bubble dan warna tema yang kaya. | `TaskCard` (Chat Bubble mode), `CheckboxCircle` | Kartu memanfaatkan lebar penuh kanvas dikurangi margin horizontal 16px. |
| **S4. Modal Form Tambah/Edit Tugas** | Antarmuka masukan cepat untuk merekam tugas baru dengan selector pill mata kuliah 1KA03 instan. | Rute modal Expo Router (`presentation: 'modal'`), bukan bottom sheet kustom. | `CourseSelectorPills`, `TextInputField`, `DateTimePickerField`, `PrimaryButton` | Meluncur sebagai modal native; input judul langsung fokus (*autofocus*). |
| **S5. Layar Detail Tugas** | Menampilkan detail tugas secara utuh, batas waktu, mata kuliah, status pengingat, dan tombol aksi. | Halaman bersih dengan kartu detail dan tombol aksi di bawah. | `DetailHeader`, `ReminderScheduleList`, `PrimaryButton`, `DeleteConfirmationModal` | Tombol 'Tandai Selesai', 'Ubah', dan 'Hapus' mudah diakses. |
| **S6. Floating Pill Dock** | Navigasi mengambang dan tombol aksi cepat di bawah layar yang selalu mudah dijangkau satu jempol. | Kapsul melayang di tengah bawah layar memuat navigasi Today, Saved, Chats, dan tombol `+`. | `FloatingPillDock` | Posisi mengambang tetap (*fixed bottom floating*), terlindung padding bawah layar. |
| **S7. Kelompok Selesai (Collapsible)** | Menampung tugas yang telah ditandai selesai secara terlipat agar tidak mengotori daftar tugas aktif. | Header akordeon dengan jumlah `Selesai (N)` dan indikator panah lipat. Default tertutup. | `CollapsibleGroupHeader`, `TaskCard` | Saat diketuk, daftar tugas selesai membuka ke bawah dengan animasi halus. |
| **S8. Banner Izin Notifikasi & Empty State** | Memberi tahu alasan izin pengingat lokal dan panduan ramah saat belum ada tugas. | Kartu banner lembut dan kartu status terpusat dengan tombol aksi. | `PermissionBanner`, `EmptyStateCard` | Tampil kontekstual tanpa memblokir alur kerja mahasiswa. |

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
| `--color-bg-coral` | `#ff6562` | latar kartu bubble & folder coral | S |
| `--color-text-coral` | `#161513` | teks kartu bubble & folder coral | S |
| `--color-bg-yellow` | `#ffd027` | latar kartu bubble & folder kuning | S |
| `--color-text-yellow` | `#161513` | teks kartu bubble & folder kuning | S |
| `--color-bg-orange` | `#ff8c21` | latar kartu bubble & folder oranye | S |
| `--color-text-orange` | `#161513` | teks kartu bubble & folder oranye | S |
| `--color-bg-blue` | `#2563eb` | latar kartu bubble & folder biru | S |
| `--color-text-blue` | `#ffffff` | teks kartu bubble & folder biru | S |
| `--color-bg-lavender` | `#c7b5eb` | latar kartu bubble & folder lavender | S |
| `--color-text-lavender` | `#161513` | teks kartu bubble & folder lavender | S |
| `--color-bg-mint` | `#36d399` | latar kartu bubble & folder mint | S |
| `--color-text-mint` | `#161513` | teks kartu bubble & folder mint | S |

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
| `--color-text-coral` | `--color-bg-coral` | normal | 4.5 |
| `--color-text-yellow` | `--color-bg-yellow` | normal | 4.5 |
| `--color-text-orange` | `--color-bg-orange` | normal | 4.5 |
| `--color-text-blue` | `--color-bg-blue` | normal | 4.5 |
| `--color-text-lavender` | `--color-bg-lavender` | normal | 4.5 |
| `--color-text-mint` | `--color-bg-mint` | normal | 4.5 |

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

### 7.1 HeroSummaryCard & Homepage Bergaya "Today"
- **Tujuan:** Memberikan fokus harian langsung di bagian atas layar sesuai layar "Today" pada `reference/reference.jpg`: menyapa mahasiswa dengan sapaan hangat personal, menampilkan tanggal hari ini, stiker ilustrasi playful, serta ringkasan tugas mendesak hari ini.
- **Anatomi:**
  - Kartu atas berlatar gelap pekat (`--color-surface-dark`) dengan sudut membulat lebar (`--radius-xl`).
  - Baris Header: Nama brand "Today" atau "plss.inget" di kiri, tanggal hari ini di kanan (misal: "• Okt '26 Rabu").
  - Teks sapaan personal bergaya percakapan: *"Halo, Mahasiswa! Hari ini ada X tugas kuliah yang harus diselesaikan: ..."*
  - Rangkuman tugas mendesak hari ini dengan indikator mata kuliah kelas 1KA03 dan ikon/stiker visual yang ekspresif.
  - Kontainer bawah berlatar terang (`--color-surface`) dengan sudut melengkung besar yang menampung daftar preview tugas ("Tugas Mendesak").
- **State:** Default, Loading (skeleton placeholder).

### 7.2 TaskCard (Kartu Tugas Bergaya Chat Bubble "Chats")
- **Tujuan:** Menampilkan tugas kuliah dalam bentuk gelembung percakapan (*chat bubble*) dengan sudut melengkung ramah dan kontur organik mengacu langsung pada layar "Chats" di `reference/reference.jpg`.
- **Anatomi:**
  - Kontur gelembung chat (*organic chat bubble*) dengan radius melengkung ramah (`--radius-lg` / `--radius-xl`) dan sudut asimetris/ekspresif.
  - Lingkaran avatar atau inisial mata kuliah / dosen di sisi kiri (misal: "AR" untuk Ariyanto, "EL" untuk Elvina).
  - Header bubble: Nama mata kuliah tebal dan waktu batas deadline di sebelah kanan (misal: "Konsep SI & TI · Besok 23.59").
  - Isi pesan tugas: Judul tugas kuliah (misal: "Laporan Praktikum Percabangan C") dan deskripsi/catatan ringkas.
  - Lingkaran centang (*CheckboxCircle*) atau status bubble untuk menandai tugas selesai.
  - Stiker/ikon dekoratif kontekstual di pojok kanan bubble seperti pada referensi mockup.
- **Varian Warna:**
  - Varian Vibrant Folder & Chats: Coral (`--color-bg-coral`), Yellow (`--color-bg-yellow`), Orange (`--color-bg-orange`), Blue (`--color-bg-blue`), Lavender (`--color-bg-lavender`), Mint (`--color-bg-mint`).
  - Varian Semantik Deadline: `Urgent` (`--color-bg-urgent`), `Today` (`--color-bg-today`), `Week` (`--color-bg-week`), `Later` (`--color-bg-later`), `Done` (`--color-bg-done` dengan teks coret).
- **Ukuran:** Tinggi fleksibel mengikuti panjang teks judul (target sentuh minimal 48px).
- **State:** Default, Pressed (`scale: 0.98`), Done.

### 7.3 CourseFolderCard (Grid 2 Kolom 8 Folder Mata Kuliah "Saved")
- **Tujuan:** Menampilkan 8 mata kuliah utama kelas 1KA03 dalam bentuk kartu folder visual 2 kolom yang informatif, menarik, dan terstruktur sesuai layar "Saved" pada `reference/reference.jpg`.
- **Anatomi:**
  - Kartu berbentuk folder dengan tab khas di bagian atas kiri (*folder tab header*).
  - Elemen tumpukan kartu/stiker di belakang tab folder yang mencerminkan materi kuliah.
  - Latar kartu berwarna vibrant sesuai `colorKey` mata kuliah (Coral, Yellow, Orange, Blue, Lavender, Mint) dengan kontras teks yang lolos WCAG AA (>= 4.5:1).
  - Nama mata kuliah: Judul singkat (`shortName`, bold) dan judul lengkap (`fullName`, reguler).
  - Informasi kontekstual: Jumlah tugas aktif ("X tugas") dan ringkasan jadwal ruang/dosen (misal: "Senin 1/2 G343 · ARIYANTO").
  - Avatar mini dosen atau badge subjek di bagian pojok bawah folder.
- **Daftar 8 Folder Mata Kuliah 1KA03:**
  1. *Fisika & Kimia Dasar* (`yellow`) — Sesi: Senin 1/2 G343 (ARIYANTO) & Rabu 8/9 D655 (ERMAWATI).
  2. *Konsep Sist. & Tek. Sist. Inf.* (`blue`) — Sesi: Senin 3/4 G343 (IDA ASTUTI), Kamis 5/6 G433 (SARI NOORLIMA YANTI), Jum'at 3/4 E223 (MASIMBANGAN SABARINA H/RIZKI ARIYANI).
  3. *Algoritma & Pemrograman 1* (`orange`) — Sesi: Senin 7/8 G114 (ELVINA), Rabu 1/2 D623 (PURWANTI), Rabu 3/4 D623 (RINA REFIANTI MUTIARA).
  4. *Matematika Dasar 1* (`lavender`) — Sesi: Senin 9/10 G347 (HERIK SUGERU), Kamis 1/2 G218 (NOLA MARINA).
  5. *Digital Citizenship* (`coral`) — Sesi: Rabu 6/7 D655 (IRNA FITRIYAH).
  6. *Ilmu Sosial & Budaya Dasar* (`mint`) — Sesi: Kamis 3/4 G433 (ADELIA RIANA DEWI).
  7. *Pendidikan Pancasila* (`yellow`) — Sesi: Kamis 9/10 G216 (METI NURHAYATI).
  8. *Peng. Bisnis dan Ekonomi Digital* (`blue`) — Sesi: Jum'at 1/2 E223 (KARTIKA SARI).
- **Interaksi:** Mengetuk folder akan menyaring (*filter*) daftar tugas untuk hanya menampilkan tugas mata kuliah tersebut.

### 7.4 CourseSelectorPills (Pill Selector 8 Mata Kuliah di Form Modal)
- **Tujuan:** Mempercepat pengisian mata kuliah pada form tambah/ubah tugas menjadi 1 ketukan instan (< 1 detik), tanpa mahasiswa perlu mengetik nama mata kuliah secara manual.
- **Anatomi:**
  - Deretan kapsul horizontal (*horizontal scrolling pill list*) berisi 8 mata kuliah kelas 1KA03 ditambah opsi "Umum / Tanpa Matkul".
  - Tiap pill memuat nama singkat mata kuliah (`shortName`) dan dot aksen warna sesuai `colorKey`.
  - State Unselected: Latar `--color-surface-muted`, border `--color-border`, teks `--color-text-muted`.
  - State Selected: Latar warna vibrant sesuai mata kuliah (atau `--color-primary`), teks kontras tinggi, border tegas.
- **Ukuran:** Tinggi `36px` (`--control-sm-h`), padding horizontal `14px`, target sentuh memadai.

### 7.5 FloatingPillDock (Dok Navigasi & Aksi Mengambang di Bawah Layar)
- **Tujuan:** Menyediakan dok navigasi terpadu dan tombol aksi tambah tugas instan yang mengambang di bawah layar, terinspirasi langsung dari ketiga layar `reference/reference.jpg`.
- **Anatomi:**
  - Kapsul melayang tunggal dengan radius penuh (`--radius-full`), latar putih/terang (`--color-surface`), bayangan melayang tegas (`--shadow-lg`), dan batas halus (`--color-border`).
  - Posisi: Mengambang di tengah bawah layar (*bottom centered*), berjarak 20–24px dari tepi bawah layar, `z-index: 50` (`--z-dock`).
  - Item Dok:
    1. Tombol Layar "Today" (Tampilan ringkasan harian dan tugas mendesak).
    2. Tombol Layar "Saved" (Tampilan 8 folder mata kuliah 1KA03).
    3. Tombol Layar "Chats" (Tampilan aliran tugas bubble).
    4. Tombol Aksi Tambah `+` (Tombol pill hitam berlatar gelap `--color-surface-dark` untuk tambah tugas cepat).
- **Ukuran:** Tinggi `56px`, target sentuh minimum 44px (`--touch-target-min`).
- **State:** Active tab berlatar `--color-surface-muted` dengan teks bold, inactive berteks `--color-text-muted`. Tombol `+` memiliki animasi tekan (`scale: 0.94`).

### 7.6 CollapsibleGroup (Kelompok Selesai Terlipat)
- **Tujuan:** Menyimpan tugas yang sudah selesai agar tidak mengaburkan tugas aktif, tetapi tetap mudah diakses bila ingin diperiksa kembali.
- **Anatomi:**
  - Header kelompok bertuliskan `Selesai (N)` dengan penanda panah lipat (`▸` saat tertutup, `▾` saat terbuka).
  - Status default: **Tertutup (Collapsed)**.
  - Saat diketuk, daftar tugas selesai terbuka ke bawah dengan kartu bergaya `--color-bg-done`.

### 7.7 Form Modal Tambah/Edit Tugas
- **Tujuan:** Merekam atau mengubah tugas dengan kecepatan tinggi (< 10 detik).
- **Struktur:**
  - Dijalankan sebagai **rute modal Expo Router** (`presentation: 'modal'`), bukan bottom sheet kustom.
  - Header modal: Tombol 'Batal' di kiri, judul modal di tengah ("Tambah Tugas" / "Ubah Tugas"), tombol 'Simpan' di kanan.
  - Field:
    1. Judul Tugas (Wajib, teks biasa, maks 120 karakter, *autofocus*).
    2. Mata Kuliah via `CourseSelectorPills` (Pilihan 1 ketukan dari 8 mata kuliah 1KA03 atau input teks kustom).
    3. Batas Waktu / Deadline (Wajib, pemilih tanggal & jam, default: besok 23.59).
    4. Catatan / Deskripsi (Opsional, teks banyak baris / multiline).

### 7.8 DeleteConfirmationModal (Dialog Konfirmasi Hapus)
- **Tujuan:** Mencegah penghapusan tugas dan pembatalan notifikasi secara tidak sengaja.
- **Teks Dialog (Tunggal & Terstandarisasi):**
  > *"Hapus tugas '[Judul]'? Pengingat terjadwal ikut dibatalkan dan tindakan ini tidak dapat diurungkan."*
- **Aksi:** Tombol 'Batal' (sekunder) dan tombol 'Hapus' (merah / bahaya).

### 7.9 EmptyStateCard & Keadaan Kosong Mata Kuliah
- **Tujuan:** Memberikan panduan ramah dan tombol aksi terpusat untuk langsung mencatat tugas saat daftar tugas utama atau daftar tugas per mata kuliah masih kosong.
- **Anatomi:**
  - Kartu berlatar putih (`--color-surface`) dengan batas halus (`--color-border`), sudut melengkung ramah (`--radius-lg` / `--radius-xl`), dan bayangan halus (`--shadow-sm`).
  - Ikon 3D visual tanpa latar belakang (`icons-no-bg`) berukuran 48–54px yang dipilih secara acak (deterministik berbasis matkul/status) dari `src/constants/iconAssets.ts` untuk memberikan kesan playful dan ramah sesuai karakter Mode B.
  - Judul keadaan kosong: Tebal (`--font-weight-bold`), ukuran 16px (`--text-md`), warna teks utama (`--color-text`), rata tengah (*center*).
  - Teks deskripsi: Ukuran 13–14px (`--text-sm`), warna teks sekunder (`--color-text-muted`), rata tengah.
  - Tombol Aksi Utama Besar (*Primary Big Button*): Tombol lebar penuh atau terpusat berlatar gelap pekat (`--color-surface-dark`), teks putih kontras tinggi (`--color-text-on-dark`), tinggi minimum 48px (`--control-h`), radius penuh (`--radius-full`), bayangan halus (`--shadow-sm`), dan respon tekan lembut (`transform: scale(0.96)`).
- **Interaksi:** Mengetuk tombol pada keadaan kosong per-matkul langsung membuka form tambah tugas dengan mata kuliah tersebut otomatis terisi (*prefilled*).

### 7.10 BackButton (Tombol Kembali Terstandarisasi)
- **Tujuan:** Menyeragamkan interaksi kembali di seluruh aplikasi dengan layout konsisten, target sentuh ergonomis, dan ikon panah (`Icon name="kembali"`) yang presisi di tengah vertikal (*vertical centered*).
- **Anatomi:**
  - Bentuk kapsul/pill memanjang (`--radius-full`, 9999px) berlatar putih (`--color-surface`) dengan bingkai halus (`--color-border`) dan bayangan lembut (`--shadow-sm`).
  - Tata letak baris horizontal (`flexDirection: 'row'`, `alignItems: 'center'`) dengan jarak antar-elemen (`gap: 6px`).
  - Tinggi tombol: Minimal 36px (`minHeight: 36px`) dengan area sentuh minimum 44px (`hitSlop={8}`).
  - Ikon panah kembali: Ukuran 14px (`iconSize: 14`), menggunakan komponen `Icon` (`name="kembali"`), dengan rendering simetris sub-pixel yang terpusat secara optik dan vertikal.
  - Teks label: Ukuran 13px (`typography.sizes.xs + 1`), tebal (`font-weight: 700`), warna teks utama (`--color-text`), tinggi baris `18px`, `includeFontPadding: false`, dan `textAlignVertical: 'center'`.
  - Respon sentuh: Reduksi skala lembut (`transform: scale(0.98)`) dan opasitas 75%.
- **Daftar Lokasi Tombol Kembali di Seluruh Aplikasi:**
  1. **Layar Filter Mata Kuliah (`src/app/index.tsx`)**:
     - *Posisi:* Di atas banner detail mata kuliah pada tab Matkul (Saved).
     - *Label:* `"Semua Matkul"`.
     - *Aksi:* Mengembalikan tampilan ke katalog grid 8 folder mata kuliah (`setSelectedCourseFilter(null)`).
  2. **Layar Modal Form Tambah/Ubah Tugas (`src/app/task/form.tsx`)**:
     - *Posisi:* Di atas judul halaman form ("Tambah Tugas" / "Ubah Tugas") serta pada tampilan penanganan error muat tugas.
     - *Label:* `"Kembali"`.
     - *Aksi:* Menutup modal/kembali ke layar sebelumnya via `router.back()`.
  3. **Layar Detail Tugas (`src/app/task/[id].tsx`)**:
     - *Posisi:* Di atas kartu informasi detail tugas.
     - *Label:* `"Kembali"`.
     - *Aksi:* Kembali ke layar sebelumnya (`router.back()`) atau fallback ke beranda (`router.replace('/')`).
  4. **Layar Tugas Tidak Ditemukan / Error State (`src/app/task/[id].tsx`)**:
     - *Posisi:* Di bawah pesan "Tugas Tidak Ditemukan".
     - *Label:* `"Kembali ke Daftar"`.
     - *Aksi:* Mengarahkan pengguna kembali ke daftar utama via fallback `router.replace('/')`.

---

## 8. Pola interaksi dan alur

1. **Alur Tambah Tugas Cepat (Target < 10 Detik):**
   - Mahasiswa mengetuk tombol `+` pada `FloatingPillDock` di bawah layar.
   - Layar modal native Expo Router muncul (`presentation: 'modal'`).
   - Input judul tugas langsung fokus dan keyboard virtual muncul otomatis.
   - Mahasiswa mengetik judul tugas, memilih mata kuliah via `CourseSelectorPills` dengan 1 ketukan, menerima batas waktu bawaan (besok 23.59) atau mengubahnya dengan beberapa ketukan.
   - Mengetuk "Simpan" menutup modal, tugas langsung muncul di kelompok yang sesuai, dan notifikasi lokal 24 jam serta 3 jam sebelum deadline otomatis dijadwalkan.
2. **Alur Berpindah Layar (Navigasi Dok):**
   - Mahasiswa mengetuk ikon "Today" untuk melihat ringkasan hero harian dan preview tugas mendesak.
   - Mahasiswa mengetuk ikon "Saved" untuk membuka grid 2 kolom 8 folder mata kuliah 1KA03.
   - Mahasiswa mengetuk ikon "Chats" untuk melihat aliran tugas lengkap dalam gelembung percakapan warna-warni.
3. **Alur Eksplorasi Folder Mata Kuliah:**
   - Di layar "Saved", mahasiswa mengetuk salah satu kartu folder (misal: *Algoritma & Pemrograman 1*).
   - Tampilan menyaring tugas yang terhubung dengan mata kuliah tersebut serta menampilkan informasi dosen, sesi ruang, dan jadwal kelas.
4. **Alur Penyelesaian Tugas:**
   - Mengetuk lingkaran centang di kartu tugas (baik di layar Today maupun Chats) menandai tugas selesai.
   - Kartu tugas langsung berpindah ke dalam kelompok "Selesai (N)".
   - Semua jadwal pengingat untuk tugas tersebut otomatis dibatalkan.
5. **Alur Membuka Tugas Selesai:**
   - Mahasiswa menggulir ke bagian bawah daftar utama.
   - Mengetuk baris `Selesai (N)` membuka lipatan daftar tugas yang telah rampung. Mengetuk kembali akan melipatnya kembali.
6. **Alur Penghapusan:**
   - Mengetuk ikon hapus pada detail tugas memunculkan dialog konfirmasi standar. Mengetuk "Hapus" menghapus tugas permanen dan membatalkan jadwal pengingat.

---

## 9. Motion

| # | Elemen | Pemicu | Properti | Durasi | Easing | Keyakinan |
|---|---|---|---|---|---|---|
| 1 | Modal Form Tambah Tugas | Ketuk `+` pada dock | Rute modal native OS via Expo Router | Bawaan OS | Bawaan OS | T |
| 2 | Kartu Tugas (Chat Bubble) ditekan | Ketuk / Press | `transform: scale(0.98)` | `150ms` | `--ease-out` | S |
| 3 | Folder Mata Kuliah ditekan | Ketuk / Press | `transform: scale(0.97)` | `150ms` | `--ease-out` | S |
| 4 | Tombol Dock ditekan | Ketuk / Press | `transform: scale(0.92)` | `150ms` | `--ease-out` | S |
| 5 | CourseSelectorPill dipilih | Ketuk Pill | `backgroundColor`, `scale` | `150ms` | `--ease-out` | S |
| 6 | Centang Selesai | Ketuk Checkbox | `scale`, `backgroundColor` | `200ms` | `--ease-out` | S |
| 7 | Lipatan Kelompok Selesai | Ketuk header `Selesai (N)` | `height`, `opacity` | `250ms` | `--ease-in-out` | S |
| 8 | Penghapusan Kartu | Konfirmasi Hapus disetujui | `opacity: 0`, `height: 0` | `250ms` | `--ease-out` | S |

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

  /* Warna Vibrant Bubble Card & Folder (Saved & Chats) */
  --color-bg-coral: #ff6562;
  --color-text-coral: #161513;
  --color-bg-yellow: #ffd027;
  --color-text-yellow: #161513;
  --color-bg-orange: #ff8c21;
  --color-text-orange: #161513;
  --color-bg-blue: #2563eb;
  --color-text-blue: #ffffff;
  --color-bg-lavender: #c7b5eb;
  --color-text-lavender: #161513;
  --color-bg-mint: #36d399;
  --color-text-mint: #161513;

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
export type VibrantColorKey = 'coral' | 'yellow' | 'orange' | 'blue' | 'lavender' | 'mint';

export interface ColorPair {
  bg: string;
  text: string;
}

export const VibrantColors: Record<VibrantColorKey, ColorPair> = {
  coral: { bg: '#ff6562', text: '#161513' },
  yellow: { bg: '#ffd027', text: '#161513' },
  orange: { bg: '#ff8c21', text: '#161513' },
  blue: { bg: '#2563eb', text: '#ffffff' },
  lavender: { bg: '#c7b5eb', text: '#161513' },
  mint: { bg: '#36d399', text: '#161513' },
} as const;

export const DesignTokens = {
  // 1. Warna (Warna kanvas, teks, aksi, status deadline, dan palet vibrant)
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
    vibrant: VibrantColors,
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
│   ├── _layout.tsx              # Root navigation & modal stack config
│   ├── index.tsx                # S1: Layar Utama (Today / Chats / Saved)
│   ├── notification-permission.tsx # S8: Layar izin notifikasi
│   └── task/
│       ├── form.tsx             # S4: Modal Tambah/Ubah Tugas (dengan CourseSelectorPills)
│       └── [id].tsx             # S5: Layar Detail Tugas
├── components/
│   ├── TaskCard.tsx             # S3: Kartu item tugas bergaya Chat Bubble ("Chats")
│   ├── CourseFolderCard.tsx     # S2: Kartu folder 2 kolom 8 mata kuliah 1KA03 ("Saved")
│   ├── CourseSelectorPills.tsx  # S4: Pills selector 8 mata kuliah 1KA03 di form modal
│   ├── FloatingPillDock.tsx     # S6: Dok navigasi & aksi mengambang di bawah layar
│   ├── HeroSummaryCard.tsx      # S1: Kartu sapaan & ringkasan atas bergaya "Today"
│   ├── CollapsibleGroup.tsx     # S7: Akordeon kelompok tugas selesai
│   ├── PermissionBanner.tsx     # S8: Banner izin notifikasi lokal
│   ├── DeleteDialog.tsx         # S5: Modal konfirmasi hapus tugas terstandarisasi
│   ├── BackButton.tsx           # Tombol kembali terstandarisasi (pill, chevron centered vertikal)
│   └── Icon.tsx                 # Ikon representatif UI
└── constants/
    ├── theme.ts                 # Token desain & palet warna vibrant (WCAG AA >= 4.5:1)
    └── courses.ts               # Data 8 mata kuliah utama kelas 1KA03 (jadwal, ruang, dosen)
```

---

## 13. Do dan Don't

| Do | Don't |
|---|---|
| Gunakan objek tema `DesignTokens` dari `src/constants/theme.ts` untuk seluruh penataan gaya | Menulis nilai warna atau angka ukuran mentah di file komponen |
| Gunakan rute modal Expo Router (`presentation: 'modal'`) untuk form penambahan tugas | Membuat komponen custom bottom sheet yang rumit dan berat |
| Manfaatkan `CourseSelectorPills` untuk mempercepat pemilihan 8 mata kuliah 1KA03 dalam 1 ketukan | Memaksa mahasiswa mengetik nama mata kuliah berulang-ulang secara manual |
| Pertahankan target sentuh minimal 44x44px pada setiap tombol dan checkbox | Membuat tombol kecil yang sulit diketuk mahasiswa saat terburu-buru |
| Biarkan kelompok tugas Selesai terlipat rapi secara default | Menumpuk tugas selesai bercampur dengan tugas aktif yang mendesak |
| Tampilkan deadline dalam format tanggal dan jam yang ramah ("Besok, 23.59") | Menampilkan format hitung mundur detik/jam dinamis yang mengalihkan perhatian |
| Gunakan teks dialog konfirmasi hapus yang seragam dan baku | Menghapus tugas tanpa dialog konfirmasi atau memakai kalimat membingungkan |

---

## 14. Hasil QA

| Pemeriksaan | Hasil | Tanggal |
|---|---|---|
| **Struktur Wajib Dokumen (Lint)** | Lolos 10/10 bagian wajib sesuai aturan `slicing-skill.md` | 2026-10-15 |
| **Kontras Teks (WCAG 2.1 AA)** | Seluruh 18 pasangan warna teks & latar lolos rasio $\ge 4.5:1$ (termasuk 6 warna vibrant) | 2026-10-15 |
| **Target Sentuh Minimum** | Standar kontrol ditetapkan minimal 48px (`--control-h`), target sentuh 44px | 2026-10-15 |
| **Kesesuaian Fitur PRD & Mockup** | 3 layar mockup (`reference.jpg`), 8 mata kuliah 1KA03, dan seluruh komponen terakomodasi | 2026-10-15 |

---

## 15. Diamati vs diasumsikan

| Diamati dari referensi (`reference.jpg`) | Diasumsikan / diputuskan sendiri untuk PRD & 1KA03 |
|---|---|
| Layar 1 ("Today"): Kartu atas berlatar gelap pekat dengan greeting personal kontekstual dan elemen stiker playful | Diterapkan sebagai `HeroSummaryCard` dan Homepage "Today" yang merangkum tugas mendesak dari mata kuliah aktif hari ini |
| Layar 2 ("Saved"): Katalog folder kategori 2 kolom dengan warna vibrant (Yellow, Blue, Orange, Lavender, Coral, Mint) | Dipetakan langsung sebagai `CourseFolderCard` untuk 8 mata kuliah utama kelas 1KA03 lengkap dengan jadwal sesi, ruang, dan dosen |
| Layar 3 ("Chats"): Aliran kartu tugas gelembung percakapan (*chat bubble*) dengan sudut melengkung ramah/organik | Diterapkan sebagai `TaskCard` bergaya Chat Bubble dengan warna vibrant per mata kuliah atau urgensi waktu |
| Floating Pill Dock: Dok mengambang di bawah layar pada ketiga layar mockup | Diimplementasikan sebagai `FloatingPillDock` tunggal yang melayang stabil di bawah layar untuk navigasi Today/Saved/Chats dan aksi `+` |
| Detail interaksi hover, fokus, dan transisi animasi spesifik tidak ada di foto statis | Mengikuti transisi modal bawaan OS Expo Router, animasi skala lembut saat ditekan, dan kurva `--ease-out` |

---

## 16. Ditunda ke versi berikutnya

Fitur dan elemen visual sekunder berikut ditunda ke fase pengembangan lanjutan agar performa aplikasi tetap ringan dan fokus:

> **Catatan Pembaruan v0.2.0:** Komponen inti visual dari referensi mockup yaitu `CourseFolderCard` (grid 2 kolom 8 folder mata kuliah 1KA03), `CourseSelectorPills` di form modal, `TaskCard` bergaya Chat Bubble, Homepage "Today", dan `FloatingPillDock` **telah diaktifkan kembali secara resmi pada versi 0.2.0**.

Item yang masih ditunda untuk fase berikutnya:
1. **Dropdown Filter Multi-Kriteria Lanjutan**:
   - *Alasan penundaan:* Pengelompokan tugas otomatis berdasarkan batas waktu dan saringan folder mata kuliah di layar Saved sudah mencukupi kebutuhan pengguna tanpa menambah beban kognitif filter kompleks.
2. **Hitung Mundur Detik Dinamis ("Sisa X jam Y menit")**:
   - *Alasan penundaan:* Tampilan waktu disederhanakan menjadi format tanggal dan jam statis yang jelas (misal: "Hari ini, 23.59" atau "Besok, 21.00") untuk menjaga kebersihan visual kartu dan menghemat konsumsi render baterai.
3. **Getaran Umpan Balik (*Haptic Feedback*)**:
   - *Alasan penundaan:* Menjaga paket dependensi aplikasi tetap minimal tanpa memerlukan pustaka native `expo-haptics` di tahap awal.
4. **Animasi Dok Menyembunyikan Diri Saat Scroll**:
   - *Alasan penundaan:* Dok navigasi `FloatingPillDock` tetap stabil mengambang di bawah layar tanpa perlu listener scroll yang berpotensi membebani performa daftar tugas.

---

## 17. Pertanyaan terbuka

- PERLU KONFIRMASI: Apakah nama paket/slug aplikasi saat ini (`app-notes`) perlu diselaraskan menjadi `plss-inget` pada `app.json` di langkah berikutnya?

---

## 18. Changelog

| Versi | Tanggal | Perubahan | Alasan |
|---|---|---|---|
| 0.2.4 | 2026-10-15 | Menstandarisasikan seluruh tombol kembali menjadi komponen terpusat `BackButton.tsx` dengan layout pill (`--radius-full`), ikon panah kembali (`Icon name="kembali"`) presisi di tengah vertikal, dan mendokumentasikan sebaran 4 lokasi tombol kembali di seluruh layar pada `design.md`. | Umpan balik desain untuk konsistensi antarmuka |
| 0.2.3 | 2026-10-15 | Mengganti ikon buku statis pada seluruh kartu keadaan kosong (`EmptyStateCard` dan Keadaan Kosong Mata Kuliah) dengan ikon 3D transparan dari `icons-no-bg` secara acak/berbasis seed mata kuliah (ukuran 48–54px). | Umpan balik desain untuk memperkuat kesan playful, ekspresif, dan konsisten dengan karakter visual Mode B |
| 0.2.2 | 2026-10-15 | Menghapus elemen lingkaran avatar profil ("M") pada dok navigasi mengambang (`FloatingPillDock`), menyederhanakan dok agar hanya berfokus pada tab navigasi (Today, Matkul, Tugas) dan tombol aksi `+ Tambah`. | Umpan balik desain karena aplikasi tidak memerlukan profil pengguna/login |
| 0.2.1 | 2026-10-15 | Menambahkan spesifikasi komponen EmptyStateCard & tombol aksi utama besar (*primary big button*) pada kartu keadaan kosong di layar utama (Today/Chats) dan filter folder mata kuliah (Saved) sesuai token `--control-h`, `--radius-full`, dan `--color-surface-dark`. | Umpan balik desain untuk mempermudah pencatatan tugas baru saat daftar kosong |
| 0.2.0 | 2026-10-15 | 1. Mengaktifkan kembali CourseFolderCard (grid 2 kolom berisi 8 folder mata kuliah 1KA03) sesuai layar "Saved" di reference.jpg.<br>2. Mengaktifkan kembali CourseSelectorPills pada form tambah tugas untuk pemilihan cepat 8 mata kuliah 1KA03 dalam 1 ketukan.<br>3. Memperbarui spesifikasi TaskCard bergaya Chat Bubble ("Chats") dengan kontur ramah dan palet warna vibrant.<br>4. Menyempurnakan Homepage bergaya "Today" dengan komposisi dual-tone (hero card gelap + container terang).<br>5. Menambahkan Floating Pill Dock di bawah layar untuk navigasi 3 layar (Today, Saved, Chats) dan aksi tambah tugas.<br>6. Menambahkan token warna vibrant (Coral, Yellow, Orange, Blue, Lavender, Mint) dengan kontras teks yang lolos uji WCAG AA (>= 4.5:1).<br>7. Mengintegrasikan data 8 mata kuliah utama kelas 1KA03 (Fisika & Kimia Dasar, Konsep SI/TI, Algoritma & Pemrograman 1, Matematika Dasar 1, Digital Citizenship, ISBD, Pendidikan Pancasila, Peng. Bisnis & Ekonomi Digital) lengkap dengan jadwal, ruang, dan dosen di `src/constants/courses.ts`. | Penyelarasan menyeluruh dengan 3 layar mockup reference/reference.jpg dan kurikulum kelas 1KA03 |
| 0.1.2 | 2026-10-14 | Mengubah nama aplikasi resmi menjadi "plss.inget" di seluruh judul panduan desain, header, kartu sapaan, dan salinan antarmuka | Permintaan pemilik produk |
| 0.1.1 | 2026-10-14 | 1. Mengubah form tambah tugas menjadi rute modal Expo Router (`presentation: 'modal'`).<br>2. Menjadikan kelompok Selesai (N) terlipat di bawah daftar utama (*collapsible*, default tertutup).<br>3. Menyederhanakan dok navigasi menjadi tombol pill tunggal `+ Tambah Tugas` (menghapus tab Home/Folder).<br>4. Menambahkan bagian 'Ditunda ke versi berikutnya' dan memindahkan 6 item (Folder Mata Kuliah, CourseFolderCard, CourseSelectorPills, Dropdown Filter, hitung mundur jam, haptic feedback, animasi sembunyi dok) serta membersihkan rujukan di seluruh bagian dokumen.<br>5. Menetapkan nama aplikasi di header menjadi "TugasKu".<br>6. Menyeragamkan teks dialog hapus menjadi: *"Hapus tugas '[Judul]'? Pengingat terjadwal ikut dibatalkan dan tindakan ini tidak dapat diurungkan."*<br>7. Mengganti rujukan `var(--...)` di Bagian 0 menjadi objek tema `src/constants/theme.ts`, menandai `tokens.css` sebagai referensi saja, dan melengkapi Bagian 12.2 dengan pemetaan seluruh token.<br>8. Menambahkan catatan verifikasi paket ikon (`@expo/vector-icons` belum terpasang, hanya `expo-symbols`) dan aturan persetujuan paket baru.<br>9. Menambahkan entri changelog 0.1.1. | Penyesuaian instruksi revisi produk dari pemilik produk |
| 0.1.0 | 2026-10-14 | Versi awal panduan desain hasil slicing Mode B dari `reference/reference.jpg` | Menyelaraskan seluruh kebutuhan visual dengan kebutuhan fungsional `PRD.md` |
