# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-11-19

Rilis "proper" (program P1 repo #29): situs yang sebelumnya sudah cukup
lengkap diperbaiki bug-nya, dilengkapi fitur PRD yang hilang, dan diberi CI +
docs + deploy live. Tidak ada perubahan model bisnis — booking dan pre-order
tetap berakhir di WhatsApp admin.

### Added
- Section Destinasi (`#destinasi`): 4 tab — Savana Siron, Gle Bae, Seulawah
  Agam, Taman Nasional Leuser — memakai `destinasiData` + CSS yang sudah ada
  tapi belum pernah ditampilkan.
- Modal detail trip: klik kartu membuka detail (foto, tanggal, harga, batas
  pendaftaran, progress kuota, fasilitas termasuk) + checklist interaktif
  "Wajib Bawa Sendiri" yang tersimpan di `localStorage` per trip (FR-3).
- Kartu trip kini menampilkan tanggal keberangkatan, badge status
  (Tersedia / Hampir Penuh / Sold Out / Pendaftaran Ditutup), dan progress
  bar kuota (FR-1).
- Tautan GitHub di navbar kanan (logo → repo) dan di footer.
- CI (`.github/workflows/ci.yml`): `static-checks` (check-links +
  html-validate + smoke server), `advisory-sweep` (OSV batch, tanpa auth),
  `playwright-e2e` (10 tes alur produk penuh).
- Tooling: `scripts/serve.mjs` (server statis + `npm run dev`),
  `scripts/check-links.mjs` (referensi lokal, skema `trips.json`, sapu
  secret), `scripts/advisory-sweep.py`, `scripts/screenshot.mjs`,
  `scripts/make-video.mjs`.
- Docs: `docs/PRD.md` (PRD asli + catatan implementasi), `docs/ARCHITECTURE.md`,
  `docs/USER-GUIDE.md`, `docs/DEPLOYMENT.md`, `docs/DEMO.md`,
  `docs/DIAGRAMS.html` (HTML+SVG), 8 screenshot + video demo 40 detik.
- Deploy live di Cloudflare Pages: https://thanksleuser.pages.dev

### Fixed
- Filter tanggal "Bulan Ini / Bulan Depan" tidak berpengaruh sama sekali
  (nilai disimpan ke state tapi tidak pernah dipakai `renderTrips()`).
- Klik kartu trip yang sudah ditutup tetap membuka form booking.
- Nama proyek salah ketik `thankslauser` di `package.json`, `wrangler.toml`,
  dan script `deploy`.
- Modal memakai `aria-hidden` pada elemen berisi tombol fokus (temuan a11y) —
  kini memakai atribut `inert` saat tertutup.
- html-validate: 90 error → 0 (raw `&` di-encode, tombol tanpa `type`,
  `src=""`, `<img/>` self-closing, trailing whitespace; `no-inline-style`
  dimatikan dengan sengaja — lihat `.htmlvalidate.json`).
- Pil warna merch "ABU" duplikat "Hijau Tua" (gambar sama persis) dihapus;
  thumbnail galeri ditambah foto sablon belakang yang sebelumnya tak terpakai.
- Badge status kartu nyaris tak terbaca di foto terang — kini chip putih pekat.
- `README.md` mengklaim `npm run dev` yang tidak ada.
- CI: `html-validate` 11.21.1 crash di Node 20 (`fs.globSync` tidak ada —
  butuh Node ≥ 22) — CI kini memakai Node 24, `package.json` mengunci
  `engines.node >= 22`.

### Removed
- `.wrangler/` ter-commit (berisi ID akun Cloudflare) — dihapus dari tree,
  masuk `.gitignore`.
- `skills_output.txt` (dump skill 26 KB, bukan bagian produk).
- 2 gambar merch duplikat byte-identik (`merch_black_tshirt_*`,
  `merch_olive_tshirt_*`).
- `prd.md` duplikat — dilebur ke `PRD.md` / `docs/PRD.md` (satu PRD saja).
- `design.md` dan `thanksleuser-spec-01/02.md` pindah ke `docs/specs/`.

### Security
- Sapu secret di `npm run validate` + CI: tidak ada kredensial di repo.
  Satu-satunya nomor yang di-hardcode adalah nomor WhatsApp admin (nomor
  publik, sesuai PRD FR-4).

## [1.0.0] - 2026-11-05 (perkiraan)

Versi awal sebagaimana di-push massal 5 Nov 2026: landing page lengkap
(hero parallax, about, services, daftar trip 15 trip, merchandise ala Shopee,
galeri, testimoni, alur 3 langkah, footer) + wizard booking WhatsApp +
`wrangler.toml` (nama proyek saat itu masih salah ketik `thankslauser`).
README/PRD template generik; tanpa CI, tanpa docs/, tanpa screenshot/video,
tanpa deploy live yang terverifikasi.
