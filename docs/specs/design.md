# Thanksleuser Web MVP - Design Spec v2 (Rombak Total)

Dokumen ini menggantikan seluruh isi design.md versi sebelumnya. Versi lama pakai dark theme dan pola-pola template generik (eyebrow label, badge pill di hero, filter mengambang di hero, semua card radius/shadow sama rata). Semua itu dibuang di versi ini.

## 0. Wajib Sebelum Mulai

Jalankan dulu sebelum menyentuh kode apapun:
```
npx skills add https://github.com/anthropics/skills --skill frontend-design
```
Baca skill ini sampai selesai dan ikuti proses "plan, review against the brief, build, critique" yang ada di dalamnya. Jangan lompat langsung ke coding.

Hindari pola berikut, ini ciri paling gampang dikenali sebagai hasil AI generic dan harus dihindari total di seluruh halaman:
- Label kecil huruf kapital di atas tiap heading (eyebrow label seperti "SPOT TERFAVORIT")
- Badge pill kecil dengan ikon di atas headline hero
- Semua card pakai radius dan shadow yang identik tanpa hierarki
- Numbered marker 01/02/03 dipakai di konten yang bukan urutan proses
- Filter atau elemen interaktif kompleks ditumpuk di atas hero, mengganggu foto/headline utama
- Kata penghubung " — " (em dash) di label atau microcopy manapun

## 1. Ground Truth Brand

- Logo asli: badge lingkaran hitam-putih, ilustrasi garis gunung dan pohon cemara dalam bentuk perisai, tipografi tebal bergaya patch/lencana ekspedisi, teks "EST. 17 AUG 2025"
- Ini bukan brand pastel lembut. Ini brand bergaya lencana ekspedisi, tegas, sedikit gagah, dibuat komunitas pendaki, bukan agensi travel korporat
- Base: Banda Aceh. Trip nyata: Savana Siron, Gle Bae, Seulawah Agam, Taman Nasional Leuser
- Tagline bio asli: "Seru-Seruan Yuk!"

## 2. Konsep Desain

Tema: light/putih, editorial outdoor, terinspirasi langsung dari dua referensi Dribbble (Bromo dan Borneo), bukan template SaaS generik.

Karena logo mereka hitam-putih bergaya lencana, latar putih justru membuat logo itu jadi elemen paling kuat di halaman, bukan tenggelam seperti waktu dipasang di dark background.

Alih-alih badge pill dan eyebrow label, hierarki visual dibangun dari ukuran foto, ukuran tipografi, dan white space. Konten yang butuh penekanan cukup dibesarkan atau diberi warna dari palet, bukan dibungkus label dekoratif.

## 3. Palet Warna

Warna diambil dari elemen nyata dunia Thanksleuser: kabut pagi dataran tinggi, hutan lumut, savana kering, dan lencana hitam-putih mereka sendiri. Bukan warna cream-terracotta generik yang biasa dipakai desain AI.

```css
:root {
  --bg-base: #F6F7F3;        /* putih kabut, sedikit hijau, bukan cream hangat */
  --bg-surface: #FFFFFF;     /* card dan panel */
  --ink: #12160F;            /* nyaris hitam, ditarik dari warna badge logo, bukan grey generik */
  --ink-muted: #5B6459;      /* teks sekunder */

  --moss: #33513B;           /* hijau hutan lumut, dipakai untuk elemen struktural: garis, ikon, border aktif */
  --clay: #C8721E;           /* oranye tanah/savana kering saat kemarau, dipakai untuk aksen dan CTA */
  --clay-hover: #A85D16;

  --line: rgba(18, 22, 15, 0.12); /* border tipis */
}
```

Aturan pakai:
- `--clay` hanya untuk elemen yang butuh aksi dari user (tombol, link aktif, indikator kuota kritis). Jangan dipakai dekoratif.
- `--moss` untuk elemen struktural: border kartu aktif, ikon, garis pemisah.
- Jangan tambah warna baru di luar lima ini. Kalau butuh state tambahan (misal warning kuota), turunkan dari `--clay` dengan opacity, bukan bikin hex baru.

## 4. Tipografi

Logo mereka pakai huruf tebal bergaya lencana/patch. Bawa karakter itu ke web lewat headline, jangan pakai font default SaaS.

- Headline/display: font grotesk kondensed tebal, contoh Bebas Neue atau Anton, dipakai untuk H1 dan angka besar (harga, elevasi). Ini yang membawa karakter "lencana ekspedisi" ke digital.
- Body dan UI: Inter atau General Sans, regular dan medium saja, jangan pakai banyak weight sekaligus.

Skala:
- H1: 56-72px desktop, 36px mobile, huruf besar tapi sentence case, bukan all caps kecuali memang judul pendek yang natural di all caps (contoh: nama trip di badge kecil boleh, headline utama jangan)
- H2: 32-40px
- Body: 16-17px, line-height 1.6, lebar maksimal kolom teks sekitar 65-75 karakter

Jangan pakai satu kata di-italic/warna beda di tengah headline sebagai penekanan. Kalau headline butuh penekanan, pakai ukuran font besar dan whitespace, bukan trik styling sebagian kata.

## 5. Hero (rombak total)

Masalah versi lama: badge pill kecil "Seru-Seruan Yuk!" dengan ikon di atas headline, lalu filter bar mengambang menutupi bagian bawah hero. Ini template AI klasik.

Versi baru:
- Satu foto full-bleed yang jadi elemen paling kuat di halaman: pilih satu momen paling khas, misalnya siluet pendaki menghadap savana saat golden hour, bukan foto gunung generik dari stok
- Headline langsung, besar, tanpa badge apapun di atasnya. Tagline "Seru-Seruan Yuk!" boleh muncul sebagai bagian kecil dari body text atau di navigasi, bukan sebagai pill terpisah
- Tidak ada filter, tidak ada dropdown, tidak ada elemen interaktif kompleks di dalam hero. Hero cuma foto, headline, subheadline, dan satu tombol CTA
- Filter kategori dan tingkat kesulitan dipindah, ditaruh sebagai bar sederhana tepat di atas grid trip card, bukan di hero

## 6. Card Trip

- Foto bleed penuh ke tepi atas card, tanpa padding
- Harga jadi badge mengambang di pojok foto dengan shadow tegas, kontras terhadap foto
- Radius foto lebih tajam (8px), bukan radius besar seperti bubble SaaS
- Info di bawah foto: kategori dan level sebagai teks kecil bergaris bawah tipis (bukan pill berwarna penuh untuk semua badge, cukup satu badge status kuota yang pakai warna)
- Progress bar kuota tipis, warna dari `--clay` kalau sisa kritis, `--moss` kalau masih longgar

## 7. Section Destinasi

Bento grid asimetris seperti referensi Bromo: beberapa foto ukuran beda ditumpuk rapat dalam satu blok, bukan satu foto split polos. Info destinasi (elevasi, jarak trek, level) ditulis sebagai teks biasa dengan ikon kecil, bukan pill badge berwarna penuh.

## 8. Galeri Dokumentasi

Grid staggered/offset dengan variasi ukuran foto dan sedikit rotasi ringan antar foto, seperti referensi Borneo. Hindari grid rata sama besar, itu yang bikin kelihatan generik.

## 9. CTA Band Sebelum Footer

Satu foto besar full-bleed (gunung/savana saat malam berbintang, sesuai insight "Tidur Beratapkan Bintang"), overlay gelap tipis untuk keterbacaan teks, satu atau dua foto kecil ditumpuk di atasnya sebagai inset. Bukan gradient polos tanpa foto.

## 10. Alur Pendaftaran (3 Langkah)

Ini konten yang memang sequential, jadi numbered marker 01/02/03 di sini valid dan tetap dipakai. Style: angka besar pakai font display, bukan di dalam lingkaran berwarna.

## 11. Merchandise

Foto produk apa adanya, tanpa filter dramatis berlebihan. Selector warna dan ukuran pakai style pill tapi dengan border tipis `--line`, bukan background penuh warna kecuali saat dipilih.

## 12. Placeholder Foto

Foto dummy saat ini asal dan tidak konsisten (ada wajah orang random, ada foto tidak relevan). Ganti dengan foto yang temanya benar-benar sesuai: hutan tropis Sumatera, savana kering, puncak gunung berkabut, tenda camping malam hari, potret orangutan/hutan untuk konteks Leuser. Kalau pakai sumber foto stok bebas royalti, pastikan mood-nya konsisten (warna dan pencahayaan senada) supaya tidak terlihat asal tempel.

## 13. Aturan Responsif

- Mobile-first, breakpoint 768px dan 1024px
- Hero di mobile: foto tetap full-bleed, headline turun ukurannya tapi tetap jadi elemen dominan, tanpa elemen tambahan yang bikin sesak
- Card grid turun 1 kolom di bawah 768px
- Navigasi jadi hamburger di bawah 768px