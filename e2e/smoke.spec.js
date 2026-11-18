// Smoke test end-to-end Thanksleuser di atas server statis (scripts/serve.mjs).
// Gambar eksternal (Unsplash/dll) TIDAK diuji di sini — yang diuji adalah
// logika & alur produk: render trip, filter tanggal/kategori, status kuota,
// modal detail + checklist localStorage, wizard booking -> WhatsApp,
// merch -> WhatsApp, modal size chart, tab destinasi, dan nol console error.
//
// Alur yang diuji:
//   1. Landing: judul, navbar + tautan GitHub, hero CTA, semua section.
//   2. Trip: 6 kartu awal, tombol eksplor -> 15 kartu, badge status & kuota.
//   3. Filter tanggal "Bulan Depan" benar-benar memfilter (bug lama: tidak).
//   4. Filter kategori pill "Ekstrem / Tektok" -> 5 trip.
//   5. Klik kartu trip tertutup -> modal detail (bukan form booking);
//      klik kartu trip terbuka -> detail, tombol Booking di detail -> wizard.
//   6. Wizard: validasi blokir langkah kosong; isi 3 langkah -> popup wa.me.
//   7. Checklist perlengkapan bertahan setelah reload (localStorage).
//   8. Tab destinasi berganti konten.
//   9. Merch: ganti warna -> gambar hero berubah; qty + -> 2;
//      "Beli Sekarang" -> popup wa.me berisi detail order.
//  10. Modal size chart terbuka; halaman tanpa console error/pageerror.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TRIPS = JSON.parse(readFileSync(join(ROOT, 'data/trips.json'), 'utf-8'));

// Teks pesan dari URL popup WhatsApp: wa.me memakai encodeURIComponent
// (%20 untuk spasi), tapi redirect ke api.whatsapp.com menulis spasi
// sebagai `+` — decodeURIComponent saja tidak mengubah `+` jadi spasi.
const waText = (url) => decodeURIComponent(url.replace(/\+/g, ' '));

test.beforeEach(async ({ page }) => {
  // Gambar eksternal (Unsplash, cdn.21st.dev) diblokir di tes: dekoratif,
  // dan lewat forwarder VM ini CONNECT-nya menggantung sehingga halaman
  // jadi lambat + popup wa.me ikut tertunda. Logika produk tidak bergantung
  // pada gambar (onerror fallback tetap jalan karena abort memicu error).
  await page.route('https://images.unsplash.com/**', (route) => route.abort());
  await page.route('https://cdn.21st.dev/**', (route) => route.abort());
  // Kumpulkan error JS halaman untuk diasert di afterEach.
  await page.addInitScript(() => {
    window.__testErrors = [];
    const origError = console.error.bind(console);
    console.error = (...args) => {
      window.__testErrors.push(args.map(String).join(' '));
      origError(...args);
    };
    window.addEventListener('error', (e) => window.__testErrors.push(String(e.message)));
    window.addEventListener('unhandledrejection', (e) => window.__testErrors.push('rejection: ' + String(e.reason)));
  });
  // domcontentloaded (bukan 'load'): gambar eksternal (Unsplash/dll) boleh
  // lambat/gagal tanpa menghambat tes — yang diuji adalah logika & alur.
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.tour-card').first()).toBeVisible({ timeout: 15_000 });
});

test.afterEach(async ({ page }) => {
  const errors = await page.evaluate(() => window.__testErrors || []);
  expect(errors, `console/page errors: ${errors.join(' | ')}`).toEqual([]);
});

test('landing: judul, navbar GitHub, hero, semua section', async ({ page }) => {
  await expect(page).toHaveTitle(/Thanksleuser/);
  const gh = page.getByRole('link', { name: 'GitHub Thanksleuser' });
  await expect(gh).toBeVisible();
  await expect(gh).toHaveAttribute('href', 'https://github.com/dezzorigin/thanksleuser');
  await expect(page.getByRole('link', { name: 'Cek Schedule Open Trip' })).toBeVisible();
  for (const id of ['hero', 'about', 'services', 'destinasi', 'trips', 'merchandise', 'dokumentasi', 'alur', 'footer']) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  await expect(page.getByText('Seru-Seruan Yuk!')).toBeVisible();
});

test('trip: 6 kartu awal, eksplor -> 15, badge status & kuota tampil', async ({ page }) => {
  await expect(page.locator('.tour-card')).toHaveCount(6);
  await expect(page.getByRole('button', { name: /Eksplor Trip Lainnya/ })).toBeVisible();
  await page.getByRole('button', { name: /Eksplor Trip Lainnya/ }).click();
  await expect(page.locator('.tour-card')).toHaveCount(15);
  // Kartu menampilkan tanggal, harga, badge status, dan progress kuota (FR-1).
  const first = page.locator('.tour-card').first();
  await expect(first.locator('.tour-date')).toBeVisible();
  await expect(first.locator('.card-status-badge')).toBeVisible();
  await expect(first.locator('.progress-fill')).toBeVisible();
  await expect(first.locator('.quota-label')).toContainText(/peserta terisi/);
  // Trip yang pendaftarannya sudah lewat: tombol booking nonaktif.
  const closed = page.locator('.tour-card', { has: page.locator('.btn-card-book[disabled]') });
  await expect(closed.first()).toBeAttached();
});

test('filter tanggal "Bulan Depan" benar-benar memfilter trip', async ({ page }) => {
  const now = new Date();
  const nextMonth = (now.getMonth() + 1) % 12;
  const nextYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
  const expected = TRIPS.filter((t) => {
    const d = new Date(t.tanggalMulai);
    return d.getMonth() === nextMonth && d.getFullYear() === nextYear;
  }).length;
  expect(expected).toBeGreaterThan(0);

  await page.locator('#dropdown-trigger-date').click();
  await page.locator('#popover-date .custom-option[data-value="bulan-depan"]').click();
  await expect(page.locator('.tour-card')).toHaveCount(Math.min(6, expected));
});

test('filter kategori pill "Ekstrem / Tektok" -> 5 trip', async ({ page }) => {
  await page.getByRole('button', { name: 'Ekstrem / Tektok' }).click();
  await expect(page.locator('.tour-card')).toHaveCount(5);
  await expect(page.locator('.tour-card-title', { hasText: 'Seulawah Agam' }).first()).toBeVisible();
});

test('klik kartu tertutup -> detail (bukan booking); kartu terbuka -> detail -> wizard', async ({ page }) => {
  // Kartu pertama (Savana Siron) sudah lewat batas pendaftaran.
  await page.locator('.tour-card').first().click();
  await expect(page.locator('#trip-detail-modal')).toBeVisible();
  await expect(page.locator('#detail-trip-title')).toContainText('Savana Siron');
  await expect(page.locator('#booking-modal')).toBeHidden();
  await expect(page.locator('#detail-booking-btn')).toBeVisible();
  await expect(page.locator('#detail-booking-btn')).toBeDisabled();
  await page.locator('#detail-close-btn').click();
  await expect(page.locator('#trip-detail-modal')).toBeHidden();

  // Kartu terbuka (Kuta Malaka, urutan ke-5): detail -> tombol Booking -> wizard.
  await page.locator('.tour-card').nth(4).click();
  await expect(page.locator('#detail-trip-title')).toContainText('Kuta Malaka');
  await page.getByRole('button', { name: 'Booking Slot Trip Ini' }).click();
  await expect(page.locator('#booking-modal')).toBeVisible();
  await expect(page.locator('#modal-trip-title')).toContainText('Kuta Malaka');
});

test('wizard booking: validasi blokir langkah kosong, 3 langkah -> popup wa.me', async ({ page }) => {
  await page.locator('.tour-card').nth(4).click();
  await page.getByRole('button', { name: 'Booking Slot Trip Ini' }).click();

  // Langkah 1 kosong: Next ditahan + pesan error tampil.
  await page.getByRole('button', { name: /Lanjut/i }).click();
  await expect(page.locator('#err-namaLengkap.visible')).toBeVisible();
  await expect(page.locator('#wizard-step-heading')).toContainText('Data Diri Peserta');

  // Isi langkah 1 -> langkah 2.
  await page.locator('#namaLengkap').fill('Tamu Uji');
  await page.locator('#namaPanggilan').fill('Tamu');
  await page.locator('#noWA').fill('081234567890');
  await page.locator('#akunIG').fill('@tamuuji');
  await page.getByRole('button', { name: /Lanjut/i }).click();
  await expect(page.locator('#wizard-step-heading')).toContainText('Data Safety');

  // Isi langkah 2 -> langkah 3.
  await page.locator('#kontakDaruratNama').fill('Orang Tua Uji');
  await page.locator('#kontakDaruratHubungan').fill('Ayah');
  await page.locator('#kontakDaruratTelp').fill('081298765432');
  await page.locator('#golonganDarah').selectOption('O');
  await page.getByRole('button', { name: /Lanjut/i }).click();
  await expect(page.locator('#wizard-step-heading')).toContainText('Tambahan');

  // Langkah 3 + submit -> popup wa.me ke nomor admin berisi data form.
  await page.locator('#ukuranKaos').selectOption('L');
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('button', { name: /Kirim via WhatsApp|Submit/i }).click();
  const popup = await popupPromise;
  // wa.me me-redirect ke api.whatsapp.com/send/?phone=... — terima keduanya.
  await expect(popup).toHaveURL(/(wa\.me\/6282284245086|api\.whatsapp\.com\/send\/\?phone=6282284245086)/);
  const popupUrl = popup.url();
  expect(waText(popupUrl)).toContain('Tamu Uji');
  expect(waText(popupUrl)).toContain('Kuta Malaka');
  await popup.close();
});

test('checklist perlengkapan bertahan setelah reload (localStorage)', async ({ page }) => {
  await page.locator('.tour-card').nth(4).click();
  const box = page.locator('#detail-gear-list input[type="checkbox"]').first();
  await expect(box).not.toBeChecked();
  await box.check();
  await expect(box).toBeChecked();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('.tour-card').first()).toBeVisible({ timeout: 15_000 });
  await page.locator('.tour-card').nth(4).click();
  await expect(page.locator('#detail-gear-list input[type="checkbox"]').first()).toBeChecked();
});

test('tab destinasi berganti konten', async ({ page }) => {
  await expect(page.locator('#detail-trip-title')).toBeHidden();
  await page.locator('#destinasi-tabs .tab-btn[data-dest="gle-bae"]').click();
  await expect(page.locator('#destinasi-content-container')).toContainText('Punggungan Gle Bae');
  await expect(page.locator('#destinasi-content-container')).toContainText('1.200 mdpl');
  await page.locator('#destinasi-tabs .tab-btn[data-dest="leuser"]').click();
  await expect(page.locator('#destinasi-content-container')).toContainText('Taman Nasional Leuser');
});

test('merch: ganti warna, qty, Beli Sekarang -> popup wa.me', async ({ page }) => {
  const hero = page.locator('#merch-img-preview');
  await expect(hero).toHaveAttribute('src', /merch-black\.png/);
  await page.locator('#merch-color-options .shopee-color-pill[data-color="Hijau Tua"]').click();
  await expect(hero).toHaveAttribute('src', /merch-olive\.png/);
  await page.locator('#merch-size-options .shopee-size-btn[data-size="XL"]').click();
  await page.locator('#btn-qty-plus').click();
  await expect(page.locator('#input-merch-qty')).toHaveValue('2');
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Beli Sekarang' }).click();
  const popup = await popupPromise;
  // wa.me me-redirect ke api.whatsapp.com/send/?phone=... — terima keduanya.
  await expect(popup).toHaveURL(/(wa\.me\/6282284245086|api\.whatsapp\.com\/send\/\?phone=6282284245086)/);
  const text = waText(popup.url());
  expect(text).toContain('Hijau Tua');
  expect(text).toContain('XL');
  expect(text).toContain('2 Pcs');
  await popup.close();
});

test('modal size chart terbuka dan bisa ditutup', async ({ page }) => {
  await page.getByRole('button', { name: /Tabel Ukuran/ }).click();
  await expect(page.locator('#size-chart-modal')).toBeVisible();
  await expect(page.locator('.size-chart-table')).toContainText('Panjang Baju');
  await page.locator('#size-chart-close-btn').click();
  await expect(page.locator('#size-chart-modal')).toBeHidden();
});
