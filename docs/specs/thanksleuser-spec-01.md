# Design Specification: Thanksleuser Official Web MVP

## 1. Overview & Positioning
- **Brand Name**: Thanksleuser (Outdoor Event Organizer & Community)
- **Base**: Banda Aceh, Aceh
- **Tagline**: *"Seru-Seruan Yuk!"* / *"Tidur Beratapkan Bintang"*
- **Target Audience**: Pendaki pemula hingga antusias alam terbuka di Aceh & sekitarnya, komunitas anak muda, pencari healing outdoor.
- **Tone & Mood**: Adventurous, earthy, trustworthy, youthful, modern outdoor editorial (terinspirasi dari layout modern Bromo & Borneo adventure trip).

---

## 2. Design System & Style Guide

### 2.1 Color Palette
- **Primary / Forest Night**: `#0F1A15` (Deep dark forest green, premium outdoor atmosphere)
- **Secondary Dark**: `#16231E` (Card background & surface layers)
- **Warm Sand / Earth Accent**: `#D97706` / `#E58B24` (Call to action, badges, sunset accent)
- **Soft Moss / Forest Glow**: `#2D5A43` (Hover states, borders, highlight badges)
- **Off-White / Text Primary**: `#F4F6F4` (Crisp readable text on dark surfaces)
- **Muted Sage / Text Secondary**: `#9CB1A7` (Sub-headers, metadata, labels)
- **Light Contrast Background** (optional light sections): `#F8FAF8` with `#1E2923` text

### 2.2 Typography
- **Headings**: Modern geometric sans with character (Inter, Plus Jakarta Sans, or Outfit)
  - Display H1: 44px - 56px, Bold (800)
  - H2: 30px - 36px, Semi-bold (700)
  - H3: 20px - 24px, Medium (600)
- **Body**: Clean legible sans, 15px - 16px, line-height 1.6
- **Accents/Badges**: Monospace or uppercase tracked sans for stats, elevation, and pricing tags (e.g. `1.810 MDPL`, `ONLY 200K`)

### 2.3 Visual Assets & Elements
- Full-bleed hero banner with atmospheric mountain fog and typography overlay.
- Editorial card grid for upcoming open trips with live quota indicators ("Sisa 4 Slot", "Batas Pendaftaran: 1 Okt").
- Interactive tabs / selector for destination highlights (Gle Bae, Savana Siron, Mt. Seulawah, Mt. Leuser).
- Official Merchandise showcase (Kaos limited batch / open PO).
- Interactive booking modal / Quick WhatsApp direct reservation flow.

---

## 3. Information Architecture & Section Breakdown

1. **Header / Navigation**:
   - Logo Thanksleuser + Location Tag (Banda Aceh)
   - Nav Links: *Jadwal Trip, Destinasi, Merchandise, Dokumentasi, Testimoni*
   - CTA Button: *"Cek Slot Trip"*

2. **Hero Section** (Ref: Magic of Bromo / Wild Borneo):
   - Big atmospheric headline: *"Jelajahi Puncak & Belantara Aceh Bersama Thanksleuser"*
   - Subhead: Organizer pendakian & camping seru, aman, dan berkesan di Aceh.
   - Quick Filter Bar: Destinasi (Gunung / Savana / Air Terjun), Jadwal Bulan, Tingkat Kesulitan.
   - Key Trust Badges: Guide Berpengalaman, Safety First, Logistik & Tenda Tim Ready, Dokumentasi Lengkap.

3. **Active Open Trips (Card Grid / Booking Matrix)**:
   - Trip cards based on actual posters:
     * **Gle Bae Camping Trip** - Rp 300.000 (Fasilitas: Guide, Makan 3x, Tenda, Dokumentasi, P3K) - *Status: Kuota Terbatas*
     * **Savana Siron Milky Way Trip** - Rp 200.000 ("Tidur Beratapkan Bintang")
     * **Tektok Mt. Seulawah Agam (1.810 MDPL)** - Rp 250.000
   - Feature: Badge sisa slot, tanggal berangkat, dan tombol *"Booking Seat"* langsung bawa form data pendaki.

4. **Destination Highlights (Interactive Map / Spot Explorer)**:
   - Visual spotlights: Mt. Leuser 3.145 MDPL, Kuta Malaka Waterfall, Savana Siron, Gle Bae, Mt. Seulawah Dara.
   - Altitude, trek length, difficulty level (Pemula / Sedang / Ahli).

5. **Official Merchandise (Open PO Section)**:
   - Featured: THNKSLSR Official Adventure T-Shirt (Cotton Combed Heavyweight, Outdoor Series).
   - Price tag: Rp 100.000.
   - Direct size selector & pre-order button.

6. **Gallery & Community Vibes (Vlog & Reel Moments)**:
   - Grid documentation showcase (Foto hangat api unggun, potret puncak, kebersamaan peserta).
   - Real reviews / quotes from previous trip participants.

7. **Safety & Registration Flow**:
   - 3-step simple booking:
     1. Pilih Trip & Kuota
     2. Isi Form Riwayat Kesehatan & Kontak Darurat
     3. Konfirmasi Instan via WhatsApp Admin
   - Benefit: Tidak ada data tercecer, admin terima rekapan rapi.

8. **Footer**:
   - About Thanksleuser, Instagram `@thanksleuser`, Official WhatsApp contact (082284245086), Copyright Banda Aceh.

---

## 4. Business Pitch Conversion Hooks (Why they can't refuse)
- **Eliminates Manual Inquiries**: 80% pertanyaan rutin terjawab otomatis di web (itinerary, packing list, fasilitas).
- **Prevents Overbooking**: Indikator kuota real-time menghindari bentrok peserta.
- **Organized Participant Medical/Emergency Data**: Tidak perlu scroll chat WA panjang untuk cari nama, golongan darah, atau kontak darurat.
- **Higher Ticket Closing**: Tampilan profesional menaikkan kepercayaan orang tua dan pendaki luar Aceh.
