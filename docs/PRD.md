# Thanksleuser Web MVP - PRD

> **Status dokumen:** PRD asli (dari `prd.md`, kini dilebur ke sini) + catatan
> implementasi v1.1.0 di §10. Versi ini menggantikan `PRD.md` template
> generik dan `prd.md` yang duplikatif — satu PRD saja, di root dan di
> `docs/` isinya sama.

## 1. Ringkasan Proyek

Thanksleuser adalah outdoor event organizer di Banda Aceh yang saat ini menjalankan semua operasional trip lewat Instagram dan WhatsApp manual. Tujuan proyek ini: bikin landing page dan booking engine sederhana yang menggantikan sebagian besar kerja manual admin, tanpa mengganti WhatsApp sebagai kanal konfirmasi akhir (karena itu yang sudah dipercaya peserta mereka).

Referensi visual dan token desain ada di `docs/specs/design.md`. Dokumen ini fokus ke requirement fungsional.

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

## 10. Catatan Implementasi v1.1.0 (per 19 Nov 2026)

Bagian ini mencatat apa yang benar-benar ada di kode — termasuk yang
menyimpang dari §5 — supaya PRD tidak berbohong.

### Yang diperbaiki dari kondisi sebelum proper

| # | Temuan | Perbaikan |
|---|---|---|
| 1 | Filter tanggal "Bulan Ini / Bulan Depan" disimpan ke state tapi tidak pernah dipakai `renderTrips()` — dropdown tidak berpengaruh sama sekali | `renderTrips()` kini memfilter berdasar `tanggalMulai` (bulan berjalan / bulan depan, dengan pergantian tahun yang benar). Diuji e2e. |
| 2 | Section Destinasi mati: `destinasiData` + `renderDestination()` + seluruh CSS `.destinasi-*` ada, tapi HTML `#destinasi-tabs` / `#destinasi-content-container` tidak pernah ditulis | Section `#destinasi` ditambahkan (4 tab: Savana Siron, Gle Bae, Seulawah Agam, Leuser) — memakai data + CSS yang sudah ada, tanpa data baru. |
| 3 | FR-3 (checklist perlengkapan) tidak ada wujudnya: CSS `.checklist-*` ada, HTML/JS tidak | Modal detail trip baru: klik kartu membuka detail (foto, tanggal, harga, kuota, fasilitas termasuk, checklist "Wajib Bawa Sendiri" yang dicentang dan tersimpan di `localStorage` per trip). Tombol "Booking Slot" di kartu tetap langsung ke form booking. |
| 4 | Kartu trip tidak menampilkan tanggal dan status kuota (FR-1 minta keduanya); hanya ada nama, lokasi, harga, tombol | Kartu kini menampilkan badge status (Tersedia / Hampir Penuh / Sold Out / Pendaftaran Ditutup), tanggal keberangkatan, dan progress bar kuota (`terisi/total` + sisa slot). |
| 5 | Klik kartu trip yang sudah ditutup tetap membuka form booking (tombolnya memang disabled, tapi klik kartu lolos) | Klik kartu trip tertutup kini membuka modal detail (tombol booking di detail nonaktif); form booking hanya terbuka untuk trip yang masih bisa dibooking. |
| 6 | Nama proyek salah ketik di tiga tempat: `thankslauser` (`package.json`, `wrangler.toml`, script `deploy`) | Semua jadi `thanksleuser`. |
| 7 | `.wrangler/` ter-commit (berisi ID akun Cloudflare) + `skills_output.txt` (dump skill 26 KB) + 3 gambar merch duplikat byte-identik | Dihapus dari tree; `.wrangler/` masuk `.gitignore`. ID akun bukan kredensial (tidak bisa dipakai untuk login), tapi tetap tidak pantas di repo. |
| 8 | `README.md` mengklaim `npm run dev` yang tidak ada; `CHANGELOG.md` mengklaim Next.js + Supabase yang tidak ada di repo ini | `package.json` kini punya `dev`/`preview`/`validate`/`test`/`screenshots`/`sweep`; CHANGELOG ditulis ulang sesuai kenyataan. |
| 9 | Pil warna merch "ABU" duplikat "Hijau Tua" (gambar sama persis) | Pil "ABU" dihapus; thumbnail galeri ditambah foto sablon belakang (`images/merch_back_print_*.png`) yang sebelumnya tidak terpakai. |

### Penyimpangan yang disengaja (didokumentasikan, bukan bug)

- **FR-5: "selector ukuran dan warna wajib dipilih sebelum tombol pre-order aktif".**
  Implementasi memakai default terpilih (warna Hitam, ukuran M) sehingga tombol
  selalu aktif — pilihan selalu ada, bukan "pilih dulu baru aktif". Alasan:
  default yang masuk akal lebih ramah di HP daripada tombol mati; admin tetap
  menerima warna + ukuran eksplisit di pesan WhatsApp. Kalau Nabil/admin mau
  perilaku ketat (tombol mati sampai pilih), itu perubahan satu baris di
  `script.js` (`selectedMerchColor`/`selectedMerchSize` mulai `null`).
- **FR-4: ukuran kaos di form adalah S/M/L/XL/XXL, tapi form juga punya XXXL.**
  Superset dari PRD; harga kaos tidak berubah per ukuran.
- **Data trip adalah jadwal nyata Okt 2026–Mei 2027.** Trip yang batas
  pendaftarannya sudah lewat tampil "Pendaftaran Ditutup" — itu perilaku yang
  benar per FR-1, bukan data basi. Admin menambah trip baru dengan menambah
  satu objek ke `data/trips.json` (lihat `docs/USER-GUIDE.md`).

### Yang belum ada (di luar scope v1.1.0)

- Pembayaran online, login peserta, dashboard admin, backend — sesuai §4
  (tetap di luar MVP; konfirmasi akhir tetap WhatsApp).
- Foto produk warna Putih masih memakai foto kaos putih generik dari Unsplash
  (tidak ada foto produk putih asli di repo).
