# Panduan Pengguna — Thanksleuser

Panduan untuk dua peran: **calon peserta** (memakai situs) dan **admin**
(mengelola data trip).

## Untuk calon peserta

### 1. Cari trip

- Buka halaman, gulir ke **"A Selection Of Exceptional Open Trips"**.
- Filter lewat tiga dropdown di atas grid:
  - **Date** — Semua Tanggal / Bulan Ini / Bulan Depan (berdasar tanggal
    berangkat).
  - **Budget** — < Rp 200rb / Rp 200–350rb / > Rp 350rb.
  - **Guest** — Semua Level / Pemula / Menengah / Lanjutan.
- Atau pakai pill kategori: All / Camping Savana / Puncak Hutan Lumut /
  Ekstrem-Tektok.
- Tombol **"Eksplor Trip Lainnya (N)"** menampilkan semua trip yang cocok
  (awal hanya 6).

### 2. Baca detail trip

Klik kartu trip mana pun untuk membuka detail: foto, tanggal, harga, batas
pendaftaran, progress kuota, fasilitas yang termasuk, dan daftar **"Wajib
Bawa Sendiri"**.

Daftar "Wajib Bawa Sendiri" adalah **checklist pribadimu**: centang barang
yang sudah disiapkan; centang tersimpan di browser (localStorage) dan tetap
ada setelah halaman di-refresh. Checklist tidak terkirim ke admin atau ke
mana pun.

### 3. Booking lewat WhatsApp

1. Dari kartu, klik **Booking Slot** — atau dari modal detail, klik
   **Booking Slot Trip Ini**.
2. Isi 3 langkah wizard:
   - **Langkah 1 — Data Diri:** nama lengkap, nama panggilan, nomor WA,
     akun Instagram.
   - **Langkah 2 — Data Safety:** kontak darurat (nama, hubungan, nomor
     telepon), riwayat medis (boleh kosong), golongan darah.
   - **Langkah 3 — Tambahan:** ukuran kaos, sewa alat (boleh "Tidak ada").
3. Klik **Submit & Kirim via WhatsApp** — tab WhatsApp terbuka dengan pesan
   terformat berisi semua data + total tagihan, ditujukan ke admin
   (0822-8424-5086). Kirim pesannya, lalu tunggu instruksi transfer dan
   konfirmasi slot dari admin.

Trip yang berstatus **Pendaftaran Ditutup** atau **Sold Out** tidak bisa
dibooking — tombolnya nonaktif dan klik kartu hanya membuka detail.

### 4. Pre-order merchandise

Di section merchandise, pilih warna dan ukuran kaos, atur jumlah, lalu klik
**Beli Sekarang** (atau **Masukkan Keranjang** — keduanya membuka WhatsApp
dengan rincian order yang sama; tidak ada keranjang belanja sungguhan).
Klik **Tabel Ukuran >** untuk melihat size chart. Galeri thumbnail bisa
diklik untuk melihat foto produk lebih besar, termasuk foto sablon belakang.

### 5. Destinasi

Section **Destinasi Unggulan** menampilkan 4 medan utama (Savana Siron,
Gle Bae, Seulawah Agam, Taman Nasional Leuser) — pilih tab untuk melihat
elevasi, jarak trek, tingkat kesulitan, dan foto tiap destinasi.

## Untuk admin

### Menambah / mengubah trip

Edit `data/trips.json` — satu objek per trip:

```json
{
  "id": "nama-unik-trip",
  "nama": "Nama Trip",
  "tanggalMulai": "2027-06-05",
  "tanggalSelesai": "2027-06-06",
  "harga": 250000,
  "kuotaTotal": 15,
  "kuotaTerisi": 0,
  "batasPendaftaran": "2027-06-01",
  "kategori": "camping-savana",
  "tingkatKesulitan": "pemula",
  "fasilitasTermasuk": ["Guide & Leader", "Makan 3x", "Tenda & Matras"],
  "wajibBawaSendiri": ["Jaket gunung", "Headlamp", "Obat pribadi"],
  "foto": "https://images.unsplash.com/photo-...?auto=format&fit=crop&w=800&q=80",
  "deskripsi": "Satu-dua kalimat tentang trip ini."
}
```

Aturan:

- `id` harus unik, huruf kecil + strip (dipakai kunci checklist localStorage).
- `kategori` hanya: `camping-savana`, `puncak-hutan-lumut`,
  `ekstrem-tektok`.
- `tingkatKesulitan` hanya: `pemula`, `menengah`, `lanjutan`.
- `tanggalMulai` <= `tanggalSelesai`; `batasPendaftaran` sebelum
  `tanggalMulai`; `kuotaTerisi` <= `kuotaTotal`.
- `foto` harus URL `https://` (disarankan Unsplash `w=800&q=80`).
- Setelah edit, jalankan `node scripts/check-links.mjs` — skrip ini
  memvalidasi semua aturan di atas sebelum deploy.

Status trip (Tersedia / Hampir Penuh / Sold Out / Pendaftaran Ditutup)
dihitung otomatis dari tanggal hari ini dan kuota — tidak perlu diubah
manual.

### Mengubah nomor WhatsApp admin

Nomor ada di dua tempat di `script.js` (variabel `adminWANumber`, satu untuk
form booking, satu untuk order merch) dan di beberapa link `wa.me/...` di
`index.html` (hero, footer). Cari `6282284245086` dan ganti semuanya.

### Menjalankan lokal

```bash
npm install
npm run dev        # http://127.0.0.1:8329
```

### Tes sebelum deploy

```bash
npm run validate   # check-links + html-validate
npm test           # Playwright e2e (butuh Chromium; lihat playwright.config.js)
```
