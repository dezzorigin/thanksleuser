# Thanksleuser Web MVP - PRD

## 1. Ringkasan Proyek

Thanksleuser adalah outdoor event organizer di Banda Aceh yang saat ini menjalankan semua operasional trip lewat Instagram dan WhatsApp manual. Tujuan proyek ini: bikin landing page dan booking engine sederhana yang menggantikan sebagian besar kerja manual admin, tanpa mengganti WhatsApp sebagai kanal konfirmasi akhir (karena itu yang sudah dipercaya peserta mereka).

Referensi visual dan token desain ada di `design.md`. Dokumen ini fokus ke requirement fungsional.

## 2. Masalah yang Diselesaikan

- Admin dapat pertanyaan berulang soal sisa kuota trip lewat komentar dan DM
- Peserta pemula sering salah bawa perlengkapan karena tidak jelas apa yang disediakan panitia
- Data medis dan kontak darurat peserta tersebar di riwayat chat WhatsApp yang panjang, sulit dicari saat darurat
- Tidak ada tampilan terpusat untuk semua trip yang sedang buka pendaftaran

## 3. Target Pengguna

- Calon peserta trip: pendaki pemula sampai menengah di Aceh, usia muda, terbiasa pakai HP dan WhatsApp
- Admin Thanksleuser: menerima pendaftaran, perlu data peserta yang rapi dan lengkap sebelum keberangkatan

## 4. Scope MVP

Termasuk di MVP:
- Landing page statis dengan daftar trip aktif
- Kartu trip dengan indikator kuota
- Halaman/section destinasi
- Section merchandise pre-order
- Form pendaftaran dengan generator pesan WhatsApp
- Checklist perlengkapan interaktif (state lokal browser)
- Filter trip berdasarkan kategori dan tingkat kesulitan

Tidak termasuk di MVP:
- Sistem pembayaran online (transfer manual, dikonfirmasi via WhatsApp)
- Login/akun peserta
- Dashboard admin (update data trip masih manual lewat edit file/data)
- Database backend (data trip di-hardcode atau dari file JSON statis)

## 5. Functional Requirements

### FR-1 Daftar Trip Aktif
- Sistem menampilkan semua trip yang berstatus aktif dalam bentuk card
- Tiap card menampilkan nama trip, tanggal, harga, foto, dan status kuota
- Data trip minimal berisi: id, nama, tanggal mulai, tanggal selesai, harga, kuota total, kuota terisi, batas pendaftaran, kategori, tingkat kesulitan, fasilitas termasuk, list wajib bawa sendiri

Acceptance criteria:
- Kalau kuota terisi sama dengan kuota total, badge otomatis berubah jadi "Sold Out" dan tombol booking nonaktif
- Kalau sisa kuota di bawah 30 persen dari total, badge otomatis berubah jadi warna warning
- Kalau tanggal hari ini melewati batas pendaftaran, trip otomatis pindah ke status "Pendaftaran Ditutup"

### FR-2 Filter Trip
- User bisa filter trip berdasarkan kategori (Camping Savana, Puncak Hutan Lumut, Ekstrem/Tektok) dan tingkat kesulitan (Pemula, Menengah, Lanjutan)
- Filter bekerja tanpa reload halaman

Acceptance criteria:
- Kombinasi filter kategori dan tingkat kesulitan bisa dipakai bersamaan
- Kalau tidak ada trip yang cocok, tampilkan pesan "Belum ada trip untuk filter ini"

### FR-3 Checklist Perlengkapan
- Tiap trip punya dua daftar: Fasilitas Termasuk dan Wajib Bawa Sendiri
- User bisa mencentang item di daftar Wajib Bawa Sendiri sebagai pengingat pribadi
- State checklist disimpan di local storage browser, per trip

Acceptance criteria:
- Refresh halaman tidak menghapus centang yang sudah dibuat
- Checklist tidak terkirim ke server atau ke pesan WhatsApp, murni pengingat pribadi

### FR-4 Form Pendaftaran dan Generator WhatsApp
- Form satu halaman/modal berisi:
  - Data diri: nama lengkap, nama panggilan, nomor WhatsApp, akun Instagram
  - Data safety: nama kontak darurat, hubungan dengan peserta, nomor telepon kontak darurat, riwayat alergi/penyakit, golongan darah
  - Tambahan: ukuran kaos (S/M/L/XL/XXL), sewa alat tambahan (carrier/sleeping bag/tidak ada)
- Semua field wajib diisi kecuali riwayat alergi/penyakit dan sewa alat tambahan
- Setelah submit, sistem generate teks terformat dan membuka link WhatsApp ke nomor admin dengan teks tersebut sudah terisi otomatis

Format teks WhatsApp:
```
FORM REGISTRASI OPEN TRIP THANKSLEUSER
------------------------------
Trip: [Nama Trip] ([Tanggal])
Nama: [Nama Lengkap]
WA: [No WA]
Kontak Darurat: [Nama] ([Hubungan]) - [No Telp]
Riwayat Medis: [Isi atau "Tidak ada"]
Ukuran Kaos: [Ukuran]
Sewa Alat: [Isi atau "Tidak ada"]
------------------------------
Total Tagihan: [Harga Trip]
Mohon instruksi transfer dan konfirmasi slot.
```

Acceptance criteria:
- Nomor WhatsApp tujuan hardcode ke 6282284245086
- Link WhatsApp dibuka di tab baru
- Form tervalidasi di sisi client sebelum submit (nomor WA harus angka, field wajib tidak boleh kosong)

### FR-5 Merchandise Pre-Order
- Menampilkan produk kaos dengan galeri foto, selector warna, selector ukuran
- Tombol pre-order membuka pesan WhatsApp terformat serupa FR-4, khusus untuk merchandise

Acceptance criteria:
- Selector ukuran dan warna wajib dipilih sebelum tombol pre-order aktif

### FR-6 Section Destinasi
- Menampilkan info tiap destinasi: nama, elevasi, jarak trek, tingkat kesulitan, foto
- Data statis, tidak perlu interaktif kompleks selain tab switch

## 6. Non-Functional Requirements

- Mobile-first, mayoritas trafik dari IG jadi harus enak dibuka di HP
- Tidak pakai framework, murni HTML, CSS, JavaScript vanilla
- Tidak ada backend/server, semua data trip disimpan di file JSON statis yang gampang diedit admin
- Waktu load halaman awal di bawah 3 detik di koneksi 4G biasa
- Font dan aset gambar dioptimasi ukurannya, jangan taruh gambar mentah beresolusi besar

## 7. Data Model

### Trip
```json
{
  "id": "gle-bae-okt-2026",
  "nama": "Gle Bae Camping Trip",
  "tanggalMulai": "2026-10-10",
  "tanggalSelesai": "2026-10-11",
  "harga": 300000,
  "kuotaTotal": 20,
  "kuotaTerisi": 16,
  "batasPendaftaran": "2026-10-05",
  "kategori": "puncak-hutan-lumut",
  "tingkatKesulitan": "menengah",
  "fasilitasTermasuk": ["Guide", "Makan 3x", "Tenda", "Dokumentasi", "P3K"],
  "wajibBawaSendiri": ["Jaket gunung", "Matras", "Headlamp", "Obat pribadi", "Jas hujan"]
}
```

### Form Pendaftaran
```json
{
  "namaLengkap": "",
  "namaPanggilan": "",
  "noWA": "",
  "akunIG": "",
  "kontakDaruratNama": "",
  "kontakDaruratHubungan": "",
  "kontakDaruratTelp": "",
  "riwayatMedis": "",
  "golonganDarah": "",
  "ukuranKaos": "",
  "sewaAlat": ""
}
```

## 8. Tech Stack

- HTML5 semantik
- CSS3 vanilla (custom properties, grid, flexbox)
- JavaScript vanilla, tanpa build tool
- Data trip di file `data/trips.json`, di-fetch dan dirender oleh JavaScript

Struktur file:
```
index.html
style.css
script.js
data/trips.json
assets/
```

## 9. Success Metrics (untuk evaluasi setelah live)

- Berkurangnya pertanyaan "masih ada slot?" di kolom komentar dan DM
- Jumlah submit form pendaftaran per trip
- Waktu admin yang terpakai untuk rekap data peserta manual berkurang
