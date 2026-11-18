# Arsitektur — Thanksleuser

Situs statis murni: HTML + CSS + JavaScript vanilla, tanpa framework, tanpa
build step, tanpa backend. Satu-satunya "server" yang dibutuhkan adalah server
file statis apa pun (Cloudflare Pages, `python3 -m http.server`,
`scripts/serve.mjs`).

## Kenapa statis

Keputusan ini dari PRD (§6, §8): admin mengedit trip dengan mengedit satu file
JSON; tidak ada login, tidak ada pembayaran online, konfirmasi akhir lewat
WhatsApp yang sudah dipercaya peserta. Backend akan menambah biaya dan titik
gagal tanpa menambah nilai untuk MVP ini.

## Peta file

```
index.html          Satu halaman: hero, about, services, destinasi, trips,
                    merchandise, dokumentasi, alur, footer + 4 modal
style.css           Seluruh styling (~3.700 baris): token desain v2, semua section
script.js           Seluruh logika (~1.100 baris): render trip, filter,
                    wizard booking, merch, destinasi, galeri, parallax
data/trips.json     15 trip (jadwal Okt 2026–Mei 2027) — satu-satunya data
images/             Foto produk merch (lokal)
public/             Ikon SVG (kolaborasi, Instagram, lokasi, WhatsApp)
icon.png            Logo/badge Thanksleuser (dipakai favicon + navbar + footer)
wrangler.toml       Konfigurasi Cloudflare Pages (nama proyek: thanksleuser)
scripts/            Tooling: serve.mjs, check-links.mjs, advisory-sweep.py,
                    screenshot.mjs
e2e/                Playwright smoke test (alur produk penuh)
.github/workflows/ CI: static-checks + advisory-sweep + playwright-e2e
docs/               PRD, arsitektur, panduan, deployment, demo, diagram
```

## Alur data

```
data/trips.json --fetch--> script.js loadTripsData()
                                  |
                                  v
                          renderTrips() --filter--> kartu trip (DOM)
                                  |  (kategori, level, tanggal, budget)
                                  v
              klik kartu -> modal detail (kuota, fasilitas, checklist)
              klik Booking -> wizard 3 langkah -> teks WhatsApp
                                  |
                                  v
                    window.open(wa.me/6282284245086?text=...)
```

Tidak ada data yang dikirim ke server mana pun. Satu-satunya penyimpanan
adalah `localStorage` browser untuk checklist perlengkapan
(`thanksleuser:checklist:<tripId>`).

## Status trip (satu-satunya logika "bisnis")

`getTripStatus(trip)` di `script.js`, dievaluasi terhadap tanggal hari ini:

| Kondisi | Status | Bisa booking |
|---|---|---|
| hari ini > `batasPendaftaran` | Pendaftaran Ditutup | tidak |
| `kuotaTerisi` >= `kuotaTotal` | Sold Out | tidak |
| sisa kuota < 30% total | Hampir Penuh (Sisa X Slot) | ya |
| lainnya | Tersedia (X Slot) | ya |

## Dependensi eksternal (runtime)

| Dependensi | Dipakai untuk | Kalau mati |
|---|---|---|
| Google Fonts (Bebas Neue + Inter) | Tipografi | Fallback font sistem, situs tetap jalan |
| GSAP + ScrollTrigger (cdnjs) | Parallax hero | Guard `typeof gsap !== 'undefined'` — hero tetap tampil statis |
| Lenis (unpkg) | Smooth scroll | Guard `typeof Lenis !== 'undefined'` — scroll native |
| Unsplash | Foto trip, galeri, destinasi | `onerror` fallback ke satu foto savana; kartu tetap tampil |
| cdn.21st.dev | 3 layer parallax hero | Hero tetap tampil (latar gelap + teks) |

Semua dependensi eksternal bersifat progresif: tidak ada satu pun yang
memblokir fungsi inti (lihat e2e — semua tes lolos tanpa menunggu gambar).

## Token desain (design.md v2)

Lima warna saja — jangan tambah warna baru:

| Token | Nilai | Pakai |
|---|---|---|
| `--bg-base` | `#F6F7F3` | latar halaman |
| `--bg-surface` | `#FFFFFF` | card/panel |
| `--ink` | `#12160F` | teks utama |
| `--ink-muted` | `#5B6459` | teks sekunder |
| `--moss` | `#33513B` | struktural (border aktif, ikon) |
| `--clay` | `#C8721E` | aksi (CTA, kuota kritis) |

Headline: Bebas Neue (kondensed tebal, karakter lencana ekspedisi).
Body/UI: Inter.

## Aturan html-validate

`.htmlvalidate.json` mematikan `no-inline-style` — situs ini memakai inline
`style=""` secara pervasif sejak awal (pola penulis aslinya). Semua aturan
lainnya aktif dan harus hijau; temuan nyata (raw `&`, tombol tanpa `type`,
`src=""`, `aria-hidden` di modal) sudah diperbaiki di v1.1.0 — modal kini
memakai atribut `inert` saat tertutup, bukan `aria-hidden`.

## Keamanan

- Tidak ada secret di repo. Satu-satunya "kredensial" adalah nomor WhatsApp
  admin (`6282284245086`) yang memang nomor publik di Instagram mereka, dan
  di-hardcode di `script.js` sesuai PRD FR-4.
- `.wrangler/` (yang sempat ter-commit berisi ID akun Cloudflare) sudah
  dihapus dari tree dan masuk `.gitignore`.
- `scripts/check-links.mjs` menyapu pola secret umum di file web pada tiap
  `npm run validate` dan di CI.
- Input form tidak pernah dirender sebagai HTML (semua lewat `textContent`
  atau `encodeURIComponent` ke URL WhatsApp) — tidak ada jalur XSS dari
  input pengguna ke DOM.
