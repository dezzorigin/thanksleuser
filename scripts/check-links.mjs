#!/usr/bin/env node
/**
 * Pemeriksaan statis situs (tanpa browser) — dipakai `npm run validate`
 * dan job `static-checks` di CI:
 *   1. Semua referensi lokal di index.html (src/href relatif) ada di disk.
 *   2. Semua anchor `#id` yang ditaut punya elemen ber-id tersebut.
 *   3. data/trips.json valid: 15 trip, field wajib lengkap, id unik,
 *      tanggal valid, kuotaTerisi <= kuotaTotal, harga > 0, enum valid.
 *   4. Nama proyek konsisten (package.json == wrangler.toml).
 *   5. Sapu secret kasar di file web (bukan di docs/): pola kredensial
 *      umum + artefak wrangler yang tidak boleh ke-commit.
 * Keluar 1 bila ada satu saja temuan; semua temuan dicetak sekaligus.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const fail = (msg) => failures.push(msg);

// ── 1+2. Referensi lokal & anchor di index.html ──────────────────────────
const html = readFileSync(join(ROOT, "index.html"), "utf-8");
const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
const refs = new Set();
for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) refs.add(m[1]);
for (const ref of refs) {
  if (/^(https?:|mailto:|tel:|data:|#)/.test(ref)) {
    if (ref.startsWith("#") && ref.length > 1 && !ids.has(decodeURIComponent(ref.slice(1)))) {
      fail(`anchor mati: ${ref} (tidak ada elemen id="${ref.slice(1)}")`);
    }
    continue;
  }
  const clean = ref.split(/[?#]/)[0];
  if (!clean) continue;
  if (!existsSync(join(ROOT, decodeURIComponent(clean)))) fail(`file lokal hilang: ${ref}`);
}
// Referensi lokal di script.js (fetch data/trips.json + fallback gambar).
const js = readFileSync(join(ROOT, "script.js"), "utf-8");
for (const m of js.matchAll(/fetch\('([^']+)'\)/g)) {
  if (!existsSync(join(ROOT, m[1]))) fail(`fetch target hilang: ${m[1]}`);
}

// ── 3. Skema data/trips.json ─────────────────────────────────────────────
const trips = JSON.parse(readFileSync(join(ROOT, "data/trips.json"), "utf-8"));
const REQUIRED = ["id", "nama", "tanggalMulai", "tanggalSelesai", "harga", "kuotaTotal",
  "kuotaTerisi", "batasPendaftaran", "kategori", "tingkatKesulitan",
  "fasilitasTermasuk", "wajibBawaSendiri", "foto", "deskripsi"];
const KATEGORI = new Set(["camping-savana", "puncak-hutan-lumut", "ekstrem-tektok"]);
const LEVEL = new Set(["pemula", "menengah", "lanjutan"]);
if (!Array.isArray(trips) || trips.length === 0) fail("data/trips.json bukan array berisi trip");
const seen = new Set();
for (const [i, t] of trips.entries()) {
  const tag = `trips[${i}] (${t.id || "tanpa-id"})`;
  for (const f of REQUIRED) if (!(f in t)) fail(`${tag}: field wajib hilang: ${f}`);
  if (t.id) { if (seen.has(t.id)) fail(`id trip duplikat: ${t.id}`); seen.add(t.id); }
  for (const f of ["tanggalMulai", "tanggalSelesai", "batasPendaftaran"]) {
    if (t[f] && Number.isNaN(Date.parse(t[f]))) fail(`${tag}: ${f} bukan tanggal valid: ${t[f]}`);
  }
  if (t.tanggalMulai && t.tanggalSelesai && t.tanggalMulai > t.tanggalSelesai) {
    fail(`${tag}: tanggalMulai sesudah tanggalSelesai`);
  }
  if (typeof t.harga !== "number" || t.harga <= 0) fail(`${tag}: harga harus angka > 0`);
  if (typeof t.kuotaTerisi !== "number" || typeof t.kuotaTotal !== "number" ||
      t.kuotaTerisi < 0 || t.kuotaTerisi > t.kuotaTotal) {
    fail(`${tag}: kuota tidak konsisten (${t.kuotaTerisi}/${t.kuotaTotal})`);
  }
  if (t.kategori && !KATEGORI.has(t.kategori)) fail(`${tag}: kategori asing: ${t.kategori}`);
  if (t.tingkatKesulitan && !LEVEL.has(t.tingkatKesulitan)) fail(`${tag}: tingkatKesulitan asing: ${t.tingkatKesulitan}`);
  if (!Array.isArray(t.fasilitasTermasuk) || t.fasilitasTermasuk.length === 0) fail(`${tag}: fasilitasTermasuk kosong`);
  if (!Array.isArray(t.wajibBawaSendiri) || t.wajibBawaSendiri.length === 0) fail(`${tag}: wajibBawaSendiri kosong`);
  if (t.foto && !/^https?:\/\//.test(t.foto)) fail(`${tag}: foto bukan URL http(s): ${t.foto}`);
}
console.log(`trips.json: ${trips.length} trip OK`);

// ── 4. Nama proyek konsisten ─────────────────────────────────────────────
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf-8"));
const wrangler = readFileSync(join(ROOT, "wrangler.toml"), "utf-8");
const wname = (wrangler.match(/^name\s*=\s*"([^"]+)"/m) || [])[1];
if (pkg.name !== "thanksleuser") fail(`package.json name bukan thanksleuser: ${pkg.name}`);
if (wname !== "thanksleuser") fail(`wrangler.toml name bukan thanksleuser: ${wname}`);
if (!/--project-name=thanksleuser/.test(pkg.scripts?.deploy || "")) {
  fail("script deploy tidak memakai --project-name=thanksleuser");
}

// ── 5. Sapu secret kasar (file web saja) ──────────────────────────────────
const SECRET_PATTERNS = [
  [/\.wrangler\//, "referensi .wrangler (artefak lokal, jangan ke-commit)"],
  [/\bAKIA[0-9A-Z]{16}\b/, "AWS access key"],
  [/\bghp_[A-Za-z0-9]{20,}\b/, "GitHub personal access token"],
  [/\bgho_[A-Za-z0-9]{20,}\b/, "GitHub OAuth token"],
  [/\bsk-[A-Za-z0-9]{20,}\b/, "API key pola sk-"],
  [/-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/, "private key"],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}\b/, "Slack token"],
];
for (const rel of ["index.html", "script.js", "style.css", "data/trips.json", "package.json", "wrangler.toml"]) {
  const content = readFileSync(join(ROOT, rel), "utf-8");
  for (const [re, label] of SECRET_PATTERNS) {
    if (re.test(content)) fail(`${rel}: temuan secret (${label})`);
  }
}
if (existsSync(join(ROOT, ".wrangler"))) fail("direktori .wrangler ada di tree (harus dihapus + di-.gitignore)");

if (failures.length > 0) {
  console.error(`\ncheck-links: ${failures.length} temuan:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("check-links: OK (referensi lokal, anchor, skema trips, nama proyek, sapu secret)");
