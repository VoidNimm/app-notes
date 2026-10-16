# PRD: Aplikasi Pencatat Tugas Kuliah

Versi 0.1 · 14 Oktober 2026 · Status: draf untuk disetujui pemilik produk

## 1. Ringkasan

Aplikasi Android personal untuk mencatat tugas dari dosen beserta deskripsi dan deadline, lalu mengingatkan lewat notifikasi lokal agar tidak ada tugas yang terlupa. Aplikasi bekerja sepenuhnya di perangkat (tanpa akun dan tanpa server) dan dibangun dengan React Native (Expo).

## 2. Masalah

Tugas dari dosen mudah terlupa. Pemilik produk menginginkan satu tempat yang cepat untuk mencatatnya. Latar belakang ini berasal dari pernyataan pemilik produk; tidak ada data survei atau pengukuran sebelumnya.

## 3. Tujuan dan non-tujuan

**Tujuan versi 1**

- G1. Mencatat tugas baru secepat mungkin.
- G2. Mengingatkan sebelum deadline.
- G3. Melihat sekilas tugas apa yang harus dikerjakan berikutnya.

**Non-tujuan versi 1** (sengaja ditunda agar proyek tetap kecil)

- Akun atau login, sinkronisasi cloud, backup otomatis.
- Kolaborasi atau berbagi tugas.
- Tampilan kalender, widget layar utama, tugas berulang.
- Integrasi dengan VClass atau sistem kampus lain.
- Lampiran file, gamifikasi, statistik.
- Push notification (hanya notifikasi lokal).
- iOS.

## 4. Pengguna

Satu pengguna: mahasiswa pemilik produk, memakai HP Android. Tidak ada peran lain.

## 5. Metrik keberhasilan

Semua angka di bawah adalah target yang ditetapkan untuk proyek ini, bukan hasil pengukuran atau data pasar.

| ID | Metrik | Target | Cara ukur |
| --- | --- | --- | --- |
| M1 | Waktu dari membuka aplikasi sampai tugas tersimpan (hanya judul dan deadline diisi) | 10 detik atau kurang | Stopwatch, 5 percobaan |
| M2 | Pengingat muncul sesuai jadwal | Semua pengingat uji muncul, selisih maksimal 5 menit | Skenario di bagian 14 |
| M3 | Pemakaian nyata | 4 minggu tanpa deadline terlewat karena lupa | Catatan pribadi pemilik produk |

## 6. User stories

- US-1. Sebagai mahasiswa, saya ingin menambah tugas dengan cepat saat dosen memberikannya.
- US-2. Sebagai mahasiswa, saya ingin menulis deskripsi tugas agar detailnya tidak hilang.
- US-3. Sebagai mahasiswa, saya ingin melihat daftar tugas terurut berdasarkan deadline.
- US-4. Sebagai mahasiswa, saya ingin diingatkan sebelum deadline.
- US-5. Sebagai mahasiswa, saya ingin menandai tugas selesai agar pengingatnya berhenti.
- US-6. Sebagai mahasiswa, saya ingin mengubah atau menghapus tugas yang salah dicatat.

## 7. Kebutuhan fungsional

### FR-1. Tambah tugas

- Form berisi: judul (wajib), deadline tanggal dan jam (wajib), mata kuliah (opsional), deskripsi (opsional).
- Judul tidak boleh kosong; maksimal 120 karakter.
- Deadline default: besok pukul 23.59 waktu perangkat. Pemilik produk dapat mengubahnya.
- Setelah disimpan, pengguna kembali ke daftar dan tugas baru langsung terlihat.
- Kriteria penerimaan: dengan hanya mengisi judul dan menerima deadline default, tugas dapat disimpan dalam beberapa ketukan.

### FR-2. Daftar tugas

- Tugas belum selesai dikelompokkan dan diurutkan dari deadline terdekat: **Terlambat** (deadline sudah lewat), **Hari ini**, **Minggu ini** (1 sampai 7 hari ke depan), **Nanti** (lebih dari 7 hari).
- Tugas selesai ditampilkan terpisah dan tidak bercampur dengan yang aktif.
- Setiap item menampilkan judul, mata kuliah (jika ada), dan deadline.
- Jika belum ada tugas, tampilkan keadaan kosong dengan ajakan menambah tugas pertama.

### FR-3. Detail tugas

- Menampilkan semua field tugas, termasuk deskripsi lengkap.
- Tersedia aksi: tandai selesai atau batalkan selesai, edit, hapus.

### FR-4. Edit tugas

- Semua field dapat diubah.
- Jika deadline berubah, pengingat lama dibatalkan dan pengingat baru dijadwalkan ulang.

### FR-5. Tandai selesai

- Menandai selesai membatalkan semua pengingat tugas tersebut dan memindahkannya ke kelompok Selesai.
- Membatalkan status selesai menjadwalkan ulang pengingat yang masih ada di masa depan.

### FR-6. Hapus tugas

- Meminta konfirmasi sebelum menghapus.
- Menghapus tugas juga membatalkan semua pengingatnya.

### FR-7. Pengingat

Lihat bagian 9.

### FR-8. Penyimpanan lokal

- Semua data tersimpan di perangkat dan tetap ada setelah aplikasi ditutup dan dibuka kembali.
- Aplikasi dapat dipakai penuh tanpa koneksi internet.

## 8. Model data

Satu entitas: **Task**.

| Field | Tipe | Wajib | Keterangan |
| --- | --- | --- | --- |
| id | string unik | ya | dibuat saat tugas dibuat |
| title | string | ya | maksimal 120 karakter |
| course | string | tidak | teks bebas, maksimal 80 karakter |
| description | string | tidak | teks bebas |
| dueAt | timestamp | ya | deadline |
| isDone | boolean | ya | default false |
| doneAt | timestamp | tidak | terisi saat ditandai selesai |
| createdAt, updatedAt | timestamp | ya | dikelola aplikasi |
| reminderIds | daftar string | ya | pengenal notifikasi terjadwal, dipakai untuk membatalkan atau menjadwalkan ulang |

## 9. Aturan pengingat

Rekomendasi awal (dapat diubah pemilik produk):

- Setiap tugas mendapat dua pengingat: **24 jam** dan **3 jam** sebelum deadline.
- Pengingat yang waktunya sudah lewat saat tugas dibuat atau diedit **tidak dijadwalkan**.
- Isi notifikasi: judul tugas, mata kuliah (jika ada), dan waktu deadline.
- Mengetuk notifikasi membuka detail tugas terkait.
- Pengingat dibatalkan saat tugas selesai, dihapus, atau deadline diubah (lalu dijadwalkan ulang).
- Pada pemakaian pertama, aplikasi meminta izin notifikasi dan menjelaskan alasannya. Jika izin ditolak, aplikasi tetap berfungsi dan menampilkan pemberitahuan bahwa pengingat tidak akan muncul.
- Pengaturan waktu pengingat oleh pengguna ditunda ke versi berikutnya.

## 10. Kebutuhan non-fungsional

- Bahasa antarmuka: Indonesia.
- Tidak ada pengumpulan data pribadi dan tidak ada permintaan jaringan.
- Pembukaan aplikasi dan penyimpanan tugas terasa instan pada HP pemilik produk (tidak ada angka target; dinilai langsung oleh pemilik produk).
- Teks mudah dibaca dan area ketuk cukup besar; aturan visual rinci mengikuti design.md.
- Versi Android minimum: belum ditetapkan (lihat pertanyaan terbuka).

## 11. Teknologi dan batasan

| Komponen | Pilihan | Status |
| --- | --- | --- |
| Kerangka | React Native dengan Expo | Diputuskan pemilik produk (React Native); Expo adalah rekomendasi |
| Notifikasi | expo-notifications (notifikasi lokal) | Rekomendasi |
| Penyimpanan lokal | AsyncStorage atau expo-sqlite | Belum diputuskan |
| Bahasa | TypeScript | Rekomendasi |

Fakta teknis yang bersumber dari dokumentasi (lihat daftar sumber):

- expo-notifications menyediakan API untuk menjadwalkan, menerima, dan merespons notifikasi \[1\].
- Notifikasi lokal tetap tersedia di Expo Go; push notification di Android tidak tersedia di Expo Go mulai SDK 53 \[2\]. Karena aplikasi ini hanya memakai notifikasi lokal, pengujian lewat Expo Go dimungkinkan menurut dokumentasi tersebut.
- scheduleNotificationAsync menjadwalkan notifikasi lokal, sedangkan push notification memerlukan permintaan ke server Expo \[3\].
- Mulai Android 12 (API level 31), notifikasi yang harus muncul tepat waktu memerlukan izin SCHEDULE\_EXACT\_ALARM di AndroidManifest \[4\]. Apakah izin ini dibutuhkan aplikasi ini belum dipastikan.

Nomor sumber merujuk ke daftar di akhir dokumen.

## 12. Desain

- Seluruh tampilan (warna, tipografi, jarak, gaya komponen, ikon) mengikuti **design.md** yang disusun pemilik produk dari referensi dan dibuat oleh AI agent. PRD ini tidak menetapkan keputusan visual.
- Bila PRD dan design.md berbeda: untuk **perilaku fungsional**, PRD yang berlaku; untuk **tampilan**, design.md yang berlaku.
- Elemen fungsional yang wajib ada di desain: tombol tambah tugas, kelompok daftar (Terlambat, Hari ini, Minggu ini, Nanti, Selesai), keadaan kosong, form tugas, layar detail, dialog konfirmasi hapus, penjelasan izin notifikasi.

## 13. Layar dan alur

| ID | Layar | Isi |
| --- | --- | --- |
| S1 | Daftar tugas | Kelompok tugas, tombol tambah, keadaan kosong |
| S2 | Form tambah/edit | Field tugas dan tombol simpan |
| S3 | Detail tugas | Semua field dan aksi selesai, edit, hapus |
| S4 | Penjelasan izin notifikasi | Muncul saat pemakaian pertama |

**Alur utama:** S1, ketuk tambah, S2, isi dan simpan, kembali ke S1 dengan tugas baru terlihat dan pengingat terjadwal.

**Alur dari notifikasi:** ketuk notifikasi, S3 tugas terkait. Kelayakan teknis alur ini perlu diverifikasi saat implementasi.

## 14. Rencana pengujian

Pengujian dilakukan di HP Android pemilik produk.

| ID | Skenario | Hasil yang diharapkan |
| --- | --- | --- |
| T1 | Buat tugas dengan deadline 3 menit ke depan lalu kunci layar | Pengingat yang relevan muncul sesuai aturan bagian 9 |
| T2 | Buat tugas dengan deadline 25 jam ke depan | Pengingat 24 jam dan 3 jam terjadwal |
| T3 | Buat tugas dengan deadline 2 jam ke depan | Tidak ada pengingat yang sudah lewat dijadwalkan |
| T4 | Edit deadline tugas | Pengingat lama tidak muncul, pengingat baru sesuai deadline baru |
| T5 | Tandai selesai atau hapus tugas | Tidak ada pengingat yang muncul setelahnya |
| T6 | Tutup paksa aplikasi lalu buka lagi | Semua tugas masih ada |
| T7 | Mode hemat baterai aktif, aplikasi ditutup | Catat apakah pengingat tetap muncul tepat waktu |
| T8 | Restart HP | Catat apakah pengingat terjadwal tetap muncul |
| T9 | Tolak izin notifikasi | Aplikasi tetap berfungsi dan menampilkan pemberitahuan |

T7 dan T8 adalah pengujian eksplorasi. Hasilnya belum bisa diprediksi dan menentukan apakah perlu penyesuaian.

## 15. Risiko

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Pengingat tertunda atau tidak muncul karena pengaturan baterai HP | Tujuan G2 gagal | Lakukan T7 lebih awal; dokumentasikan pengaturan HP yang perlu diubah |
| Pengingat hilang setelah HP restart (belum diverifikasi) | Tugas terlewat | Lakukan T8; bila gagal, jadwalkan ulang semua pengingat saat aplikasi dibuka |
| Izin notifikasi ditolak | Tidak ada pengingat | Penjelasan izin yang jelas dan pemberitahuan bila ditolak |
| Input tugas terasa lambat | Aplikasi tidak dipakai | Ukur M1; pertahankan field wajib seminimal mungkin |
| Cakupan melebar | Proyek tidak selesai | Patuhi daftar non-tujuan |

## 16. Tahapan

1. **M0.** Proyek Expo berjalan di HP lewat Expo Go.
2. **M1.** Tambah, lihat, edit, hapus tugas dengan penyimpanan lokal (FR-1 sampai FR-6, FR-8).
3. **M2.** Pengingat (FR-7) dan pengujian T1 sampai T9.
4. **M3.** Menerapkan tampilan dari design.md.
5. **M4.** Pemakaian nyata selama 4 minggu (metrik M3), perbaikan kecil.

Tidak ada tenggat tanggal karena belum ada dasar estimasi.

## 17. Pertanyaan terbuka

- Q1. Penyimpanan lokal: AsyncStorage atau expo-sqlite? Syarat minimal: data bertahan setelah aplikasi ditutup. Belum diverifikasi.
- Q2. Versi Android minimum yang didukung.
- Q3. Apakah izin SCHEDULE\_EXACT\_ALARM diperlukan (tergantung hasil T1 dan T7)?
- Q4. Cara meminta izin notifikasi saat jalan (runtime) pada versi Android terbaru dengan Expo: belum diverifikasi, periksa dokumentasi saat implementasi.
- Q5. Apakah pengenal notifikasi hasil penjadwalan dapat dipakai langsung untuk membatalkan pengingat? Belum terlihat di sumber yang saya baca; verifikasi saat implementasi.
- Q6. Nama aplikasi.

## Sumber

1. Expo Notifications, dokumentasi: https://docs.expo.dev/versions/latest/sdk/notifications
2. Expo Notifications, versi referensi (catatan Expo Go dan SDK 53): https://docs.expo.dev/versions/unversioned/sdk/notifications/
3. Forum Expo, penjelasan scheduleNotificationAsync sebagai notifikasi lokal: https://forums.expo.dev/t/how-do-we-specify-that-were-sending-a-local-notification/53845
4. Expo Notifications, versi referensi (catatan SCHEDULE\_EXACT\_ALARM, Android 12): https://docs.expo.dev/versions/v58.0.0/sdk/notifications/

Catatan: bagian desain data, aturan pengingat, metrik, dan tahapan adalah rekomendasi penyusun, bukan fakta bersumber.
