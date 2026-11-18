# Design Specification: Thanksleuser Web MVP (Antigravity Agent Ready)

## 1. Project Context & Objectives
- **Client/Target**: Thanksleuser (@thanksleuser) - Outdoor Event Organizer & Community based in Banda Aceh.
- **Goal**: Membangun landing page & interactive booking engine dengan HTML & Vanilla CSS (+ lightweight Vanilla JS) yang menyelesaikan 100% masalah operasional open trip mereka.
- **Tech Stack**: HTML5, Vanilla CSS3 (Custom Properties / CSS Variables, Grid, Flexbox, Glassmorphism), Vanilla JavaScript (No external frameworks, fast, responsive).

---

## 2. Fitur Detail Khusus (Killer Features Khusus EO Outdoor Aceh)

Fitur-fitur ini sengaja dirancang spesifik untuk model bisnis Thanksleuser agar saat di-demo, mereka langsung merasa sistem ini "dibuat khusus untuk mereka":

### 2.1 Live Interactive Trip Seat Tracker (Visual Kuota Bar)
- **Problem**: Di poster mereka tertulis *"Kuota Hanya 20 Orang"*. Admin selalu ditanya *"Kak masih ada slot?"*.
- **Solusi di MVP**:
  - Tiap card open trip punya progress bar kuota visual dinamis: `[16/20 Terisi]` dengan status badge:
    * `Sisa 4 Slot!` (Warna Amber Alert)
    * `Hampir Penuh` atau `Sold Out` (jika kuota habis).
  - Terdapat hitung mundur (*Countdown Timer*) batas pendaftaran (contoh: *Pendaftaran ditutup 1 Oktober 2026*).

### 2.2 Gear & Personal Equipment Checklist (Checklist Interaktif Perlengkapan)
- **Problem**: Peserta pemula sering salah bawa barang atau nanya berulang-ulang: *"Bawa apa aja kak? Perlu bawa kompor ga? Tenda disediain?"*.
- **Solusi di MVP**:
  - Tab interaktif: **Fasilitas Termasuk (Include)** vs **Wajib Bawa Sendiri (Personal Gear)**.
  - Fitur checklist interaktif di web yang bisa dicentang peserta (Jaket gunung, matras, headlamp, obat pribadi, jas hujan).

### 2.3 Medical & Emergency WhatsApp Payload Generator (Form Safety Pendaki)
- **Problem**: Trip gunung Seulawah Agam / Leuser berisiko tinggi jika admin tidak tahu riwayat asma/jantung/alergi atau kontak darurat keluarga.
- **Solusi di MVP**:
  - Modal Form pendaftaran 1 halaman:
    - Data Diri: Nama Lengkap, Panggilan, No WA, Akun IG.
    - Safety Data: Kontak Darurat (Nama & Hubungan orang tua/wali + No Telp), Riwayat Alergi/Penyakit, Golongan Darah.
    - Trip Add-on: Ukuran Kaos Merch (S/M/L/XL/XXL), Pilihan Sewa Alat Tambahan (Carrier/Sleeping Bag).
  - **Output Generator**: Tombol *"Kirim Pendaftaran via WhatsApp"* langsung memformat teks terstruktur rapi ke WA Admin Thanksleuser (`082284245086`):
    ```text
    *FORM REGISTRASI OPEN TRIP THANKSLEUSER*
    ━━━━━━━━━━━━━━━━━━━━━━
    📍 Trip: Gle Bae Camping Trip (10-11 Okt 2026)
    👤 Nama: [Nama]
    📞 WA: [No WA]
    🚨 Kontak Darurat: [Ibu/Ayah - 0812xxxx]
    🩺 Riwayat Medis: [Tidak ada / Asma]
    👕 Ukuran Kaos: [L]
    ━━━━━━━━━━━━━━━━━━━━━━
    *Total Tagihan: Rp 300.000*
    Mohon instruksi transfer & konfirmasi slot.
    ```

### 2.4 Quick Filter Bar Destinasi Aceh (Smart Trip Finder)
- Filter instan berdasarkan:
  - **Kategori**: Semua Trip, Camping Savana (Siron), Puncak Hutan Lumut (Gle Bae), Ekstrem/Tektok (Seulawah Agam/Dara).
  - **Tingkat Kesulitan**: Pemula Friendly, Intermediate, Advance.

### 2.5 Merchandise "Pre-Order" Showcase Card
- Tampilan produk Kaos THNKSLSR (100K) dengan selector warna/ukuran interaktif dan status batch PO.

---

## 3. Design System & CSS Variables Reference

```css
:root {
  /* Color Palette */
  --bg-primary: #0A110E;         /* Ultra deep forest night */
  --bg-surface: #121E19;         /* Card background */
  --bg-surface-elevated: #1A2B24;/* Hover state / modal */
  --border-color: rgba(255, 255, 255, 0.08);
  --border-accent: rgba(217, 119, 6, 0.3);

  --accent-gold: #E58B24;        /* Sunset Orange / Amber */
  --accent-gold-hover: #F59E0B;
  --forest-moss: #22543D;        /* Moss Green badge */
  --forest-glow: #38A169;

  --text-primary: #F7FAFC;       /* Off-white crisp */
  --text-muted: #94A3B8;         /* Subtitles & captions */
  --text-dark: #0F172A;

  /* Typography */
  --font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  
  /* Radii & Shadows */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 22px;
  --shadow-card: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 25px rgba(229, 139, 36, 0.18);
}
```

---

## 4. Specification for Agent Antigravity Execution
- **File Structure**:
  - `index.html`: Semantic markup, modular sections, accessible forms, meta viewport ready.
  - `style.css`: Clean vanilla CSS, CSS grid layout, responsive breakpoints (mobile-first / desktop adapted), smooth transitions.
  - `script.js` (or embedded script): Tab switching, dynamic slot modal populator, checklist local state toggle, automated WhatsApp payload URL encoder (`https://wa.me/6282284245086?text=...`).
