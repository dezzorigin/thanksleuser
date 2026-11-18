# Demo — Thanksleuser

## Video demo

[docs/demo/demo.mp4](demo/demo.mp4) — walkthrough ~40 detik: hero → destinasi
→ daftar trip + filter → detail trip + checklist → wizard booking →
merchandise → galeri → footer.

Video dibuat dari screenshot asli situs yang sedang berjalan (bukan mockup):
`npm run screenshots` mengambil 8 adegan lewat headless Chromium, lalu
`scripts/make-video.mjs` merangkainya dengan efek zoom-pan (ffmpeg).

## Screenshot

| # | Adegan | File |
|---|---|---|
| 1 | Hero + navbar (logo GitHub kanan) | [01-hero.png](screenshots/01-hero.png) |
| 2 | Section Destinasi (tab Gle Bae) | [02-destinasi.png](screenshots/02-destinasi.png) |
| 3 | Daftar trip + filter + kartu kuota | [03-trips.png](screenshots/03-trips.png) |
| 4 | Modal detail trip + checklist | [04-trip-detail.png](screenshots/04-trip-detail.png) |
| 5 | Wizard booking langkah 1 | [05-booking-wizard.png](screenshots/05-booking-wizard.png) |
| 6 | Merchandise (PDP Shopee-style) | [06-merchandise.png](screenshots/06-merchandise.png) |
| 7 | Galeri dokumentasi + testimoni | [07-gallery.png](screenshots/07-gallery.png) |
| 8 | CTA band + footer | [08-footer.png](screenshots/08-footer.png) |

## Cara merekam ulang

```bash
npm run screenshots   # butuh Chromium di cache + forwarder lokal (lihat
                      # scripts/screenshot.mjs); hasil ke docs/screenshots/
node scripts/make-video.mjs   # butuh ffmpeg; hasil ke docs/demo/demo.mp4
```

Catatan: gambar Unsplash/21st.dev tidak bisa dimuat lewat forwarder VM ini
(CONNECT ke host gambar menggantung), jadi `scripts/screenshot.mjs`
mengunduh gambar eksternal via curl lalu menyajikannya dari cache lokal
hanya selama perekaman — halaman yang direkam tetap sama persis.
