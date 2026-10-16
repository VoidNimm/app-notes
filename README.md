# plss.inget

Aplikasi mobile berbasis Expo dan React Native untuk mencatat tugas kuliah beserta deadline dan pengingat notifikasi lokal secara instan, tanpa server dan tanpa perlu login.

Dokumentasi lengkap proyek:
- [Product Requirement Document (PRD)](docs/PRD.md)
- [Design Specification & Tokens](docs/design.md)

---

## Fitur v1

- **Pencatatan Tugas Cepat**: Tambah tugas baru dengan judul, deadline (tanggal & jam), mata kuliah, dan deskripsi dalam hitungan detik.
- **Sistem Pengingat Lokal**: Notifikasi otomatis dijadwalkan pada waktu deadline dan H-1 jam sebelum deadline langsung di perangkat.
- **Tampilan Tugas Terstruktur**:
  - Ringkasan tugas mendesak hari ini (*Hero Summary*).
  - Pengelompokan tugas berdasarkan batas waktu (Hari Ini, Besok, Minggu Ini, Nanti).
  - Bagian tugas Selesai (*collapsible*) untuk menandai progres belajar.
- **Katalog Mata Kuliah**: Folder visual untuk 8 mata kuliah kelas 1KA03 lengkap dengan jadwal sesi, ruang, dan dosen.
- **100% Offline & Privat**: Seluruh data tersimpan lokal di perangkat menggunakan AsyncStorage, tanpa analitik atau pelacakan server.

---

## Cara Menjalankan

### 1. Prasyarat
- Node.js (versi 18 atau lebih baru)
- npm atau bun/yarn
- Aplikasi **Expo Go** terpasang di HP (Android atau iOS)

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan di Expo Go
1. Pastikan komputer dan HP terhubung ke jaringan Wi-Fi yang sama.
2. Jalankan server pengembangan Expo:
   ```bash
   npx expo start
   ```
3. Buka di perangkat:
   - **Android**: Buka aplikasi Expo Go, pilih *Scan QR Code*, lalu arahkan kamera ke QR code di terminal.
   - **iOS**: Buka kamera bawaan, arahkan ke QR code, lalu ketuk banner notifikasi untuk membuka di Expo Go.

---

## Build APK Lewat EAS (Expo Application Services)

Proyek ini telah dikonfigurasi untuk membuat file APK mandiri (*standalone APK*) tanpa memerlukan Android Studio lokal:

1. Pasang EAS CLI secara global (atau gunakan `npx`):
   ```bash
   npm install -g eas-cli
   ```
2. Masuk ke akun Expo Anda:
   ```bash
   eas login
   ```
3. Jalankan perintah build APK (profil `preview` di `eas.json`):
   ```bash
   eas build -p android --profile preview
   ```
4. Setelah proses build di cloud Expo selesai, unduh dan pasang berkas `.apk` yang dihasilkan langsung ke HP Android.

---

## Struktur Folder

```text
app-notes/
├── assets/             # Aset gambar, ikon adaptif aplikasi, dan ilustrasi 3D
├── docs/               # Dokumentasi resmi proyek
│   ├── PRD.md          # Dokumen kebutuhan produk (Product Requirement Document)
│   ├── design.md       # Spesifikasi desain, token warna, dan layout
│   └── slicing-skill.md# Panduan slicing desain dan kepatuhan UI
├── reference/          # Gambar referensi desain UI mockup
├── scripts/            # Skrip utilitas (pemotong ikon & pengujian design tokens)
├── src/
│   ├── app/            # Rute dan layar aplikasi (Expo Router)
│   │   ├── _layout.tsx # Root stack layout & modal presentation
│   │   ├── index.tsx   # Layar utama (daftar tugas & navigasi)
│   │   ├── notification-permission.tsx # Permintaan izin notifikasi
│   │   └── task/       # Formulir tambah tugas modal dan detail tugas
│   ├── components/     # Komponen UI modular (TaskCard, CourseFolderCard, dll.)
│   ├── constants/      # Token desain visual, daftar mata kuliah, dan aset ikon
│   ├── hooks/          # Custom hooks React (mis. useColorScheme)
│   ├── services/       # Layanan lokal (AsyncStorage, pengingat notifikasi)
│   ├── types/          # Definisi tipe data TypeScript
│   └── utils/          # Fungsi bantu dan formatter tanggal/waktu
├── app.json            # Konfigurasi aplikasi Expo & EAS
├── eas.json            # Konfigurasi build EAS (profil preview untuk APK)
├── package.json        # Dependensi dan skrip proyek
└── tsconfig.json       # Konfigurasi TypeScript
```
