# Aplikasi Pencatat Tugas Kuliah

Aplikasi mobile berbasis Expo dan React Native untuk mencatat tugas kuliah beserta deadline dan pengingat notifikasi lokal tanpa server.

## Cara Install

Pastikan Node.js (versi 18 atau lebih baru) sudah terpasang di sistem.

1. Buka terminal di direktori proyek.
2. Pasang semua dependensi proyek:
   ```bash
   npm install
   ```

## Cara Menjalankan di HP

1. Pasang aplikasi Expo Go di HP melalui Google Play Store (Android) atau App Store (iOS).
2. Pastikan HP dan komputer terhubung ke jaringan Wi-Fi yang sama.
3. Jalankan server pengembangan Expo di terminal:
   ```bash
   npx expo start
   ```
4. Buka aplikasi di HP:
   - Android: Buka aplikasi Expo Go, pilih opsi Scan QR Code, lalu arahkan kamera ke QR code yang tampil di terminal.
   - iOS: Buka aplikasi Kamera bawaan HP, arahkan ke QR code, lalu ketuk banner untuk membuka di Expo Go.

## Struktur Folder

```text
app-notes/
├── assets/             # Aset gambar, ikon aplikasi, dan font
├── docs/               # Dokumentasi pendukung proyek
├── reference/          # Bahan referensi proyek
├── scripts/            # Skrip bantu dan utilitas
├── src/
│   ├── app/            # Halaman dan rute navigasi (Expo Router)
│   │   ├── _layout.tsx # Root layout navigasi aplikasi
│   │   ├── index.tsx   # Halaman utama daftar tugas
│   │   ├── notification-permission.tsx # Permintaan izin notifikasi
│   │   └── task/       # Formulir tambah/edit dan detail tugas
│   ├── components/     # Komponen UI yang dapat digunakan kembali
│   │   └── ui/         # Komponen tampilan UI dasar
│   ├── constants/      # Konstanta tema, warna, dan styling
│   ├── hooks/          # Custom hooks React
│   ├── services/       # Modul layanan lokal (penyimpanan AsyncStorage & notifikasi)
│   └── types/          # Definisi tipe data TypeScript
├── app.json            # Konfigurasi aplikasi Expo
├── package.json        # Dependensi dan script npm
├── PRD.md              # Product Requirement Document
├── README.md           # Panduan instalasi dan penggunaan
└── tsconfig.json       # Konfigurasi TypeScript
```
