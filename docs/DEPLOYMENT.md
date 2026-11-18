# Deployment — Thanksleuser

## Ringkasan

| Item | Nilai |
|---|---|
| Platform | Cloudflare Pages (situs statis) |
| Nama proyek | `thanksleuser` |
| URL live | https://thanksleuser.pages.dev |
| Repo | https://github.com/dezzorigin/thanksleuser |
| Build | tidak ada (tanpa bundler; output = root repo) |
| Deploy | direct-upload via API (`cf_pages.py`, pola repo P1 #24–#28) atau `npm run deploy` (wrangler) |

## Kenapa direct-upload, bukan `wrangler pages deploy` dari CI

`npm run deploy` (`wrangler pages deploy . --project-name=thanksleuser`)
tetap didukung dan memakai `wrangler.toml` yang sama, tapi deploy rilis
v1.1.0 dilakukan lewat `~/workspace/github-actions/cf_pages.py` — skrip
direct-upload yang sudah terbukti di repo P1 #24–#28 (JWT upload-token,
cek-missing, upload aset, create deployment). Alasannya: wrangler mengunggah
seluruh direktori kerja termasuk `docs/`, `.github/`, `e2e/`, dan
`node_modules/` bila tidak hati-hati; staging deploy di bawah hanya berisi
file yang memang disajikan.

## Isi staging deploy (`.pages-dist/`, di-.gitignore)

```
index.html  style.css  script.js  favicon.ico  icon.png
data/trips.json
images/merch-black.png  images/merch-detail.png  images/merch-olive.png
images/merch_back_print_1789167421182.png
public/icons/*.svg
```

Yang TIDAK ikut deploy: `docs/`, `.github/`, `e2e/`, `scripts/`,
`node_modules/`, `package.json`, `wrangler.toml`, `PRD.md`, `README.md`,
`CHANGELOG.md`, `LICENSE`, `CODE_OF_CONDUCT.md`.

## Cara deploy ulang

```bash
# 1. Staging: salin hanya file sajian
rm -rf .pages-dist && mkdir -p .pages-dist/data .pages-dist/images .pages-dist/public
cp index.html style.css script.js favicon.ico icon.png .pages-dist/
cp data/trips.json .pages-dist/data/
cp images/merch-black.png images/merch-detail.png images/merch-olive.png \
   images/merch_back_print_1789167421182.png .pages-dist/images/
cp -r public/* .pages-dist/public/

# 2. Deploy (butuh kredensial Cloudflare via surrogate — lihat
#    ~/workspace/custom-connectors/custom.cloudflare/CONNECTOR.md)
python3 ~/workspace/github-actions/cf_pages.py deploy thanksleuser .pages-dist

# 3. Verifikasi
curl -s -o /dev/null -w "%{http_code}\n" https://thanksleuser.pages.dev/
curl -s https://thanksleuser.pages.dev/data/trips.json | python3 -c \
  "import json,sys; print(len(json.load(sys.stdin)), 'trip')"
```

Atau lewat wrangler (mengunggah root repo — pastikan `.wrangler/` dan
`node_modules/` tidak ikut; wrangler mengabaikan `node_modules` otomatis):

```bash
npm run deploy
```

## Nama proyek

`thanksleuser` didapat bersih (namespace global Pages; ketersediaan baru
ketahuan saat create — GET project 404 tidak membuktikan apa-apa).
Fallback yang disiapkan bila nama ini sudah diambil orang lain:
`thanks-leuser` → `terimakasih`. Tidak dipakai — nama pertama berhasil.

## Setelah deploy

1. Hard-refresh / incognito saat memeriksa (cache browser sering menampilkan
   landing lama).
2. Pasang URL live di About repo (GitHub → Settings → About → Website,
   atau `PATCH /repos/dezzorigin/thanksleuser` dengan `homepage`).
3. Perbarui link ini di README bila URL berubah.
