# MyKaggo — Frontend ↔ Backend Integration

Catatan arsitektur untuk integrasi Next.js 16 (App Router) dengan backend MyKaggo.
Skenario uji manual ada di [TESTING.md](./TESTING.md).

---

## 1. Tiga aplikasi dalam satu Next.js

| Area | Route | Backend | Identitas |
|---|---|---|---|
| Rider (PWA publik) | `/`, `/list-item`, `/send-item`, `/payment/*`, `/track` | `{API_BASE_URL}` | Header `x-user-id` dari `POST /users/identify` |
| Portal admin | `/dashboard/*`, `/onboarding/*` | `{API_BASE_URL}/admin` | JWT Bearer dari `POST /admin/auth/login` |
| Portal company | `/company/*` | `{API_BASE_URL}/company` | JWT Bearer dari `POST /company/auth/login` |

**Seluruh panggilan backend terjadi di server** (Server Component / Server
Action / Route Handler). `API_BASE_URL` sengaja bukan `NEXT_PUBLIC_*`, sehingga
token tidak pernah masuk bundle browser dan browser tidak pernah berbicara
langsung ke backend.

---

## 2. Struktur

```
proxy.ts                      Auth routing optimistik (Next 16: middleware → proxy)
next.config.ts                Security headers + CSP

lib/
  env.ts                      Env tervalidasi Zod (server-only)
  routes.ts                   Sumber tunggal path internal (dipakai proxy & sitemap)
  navigation.ts               safeInternalPath — penangkal open redirect
  format.ts                   Format mata uang / tanggal / durasi / koordinat
  header-config.ts            Tabel route → konfigurasi header

  api/
    http.ts                   Satu choke point fetch: timeout, envelope, error
    errors.ts                 ApiError + pemetaan kode + pesan aman untuk user
    types.ts                  Tipe hasil dari OpenAPI
    safe-load.ts              Ubah kegagalan fetch jadi nilai (bukan throw)
    guards.ts                 safeLoad + auto-logout saat 401
    mobile.ts / admin.ts / company.ts

  auth/
    cookie-names.ts           Nama cookie (plain — dipakai proxy)
    cookies.ts                Baca/tulis cookie + opsi ketat
    signing.ts                HMAC seal/unseal + baca exp JWT
    session.ts                DAL: requireRider / requireAdminToken / requireCompanyToken

  validation/
    phone.ts                  Normalisasi nomor Nigeria
    schemas/                  Schema Zod dipakai client DAN server

  geo/cities.ts               Koordinat kota (pengganti geocoder)
  dashboard/params.ts         Parsing query admin + filter pencarian

hooks/use-action-form.ts      Zod + react-hook-form + Server Action

components/
  shared/
    data-boundary.tsx         Error boundary level komponen (unstable_catchError)
    error-state.tsx           UI kegagalan bersama
    refresh-error.tsx         Retry via router.refresh()
    section-error.tsx         Render bagian gagal dari safeLoad
    form/                     TextField, SelectField, TextareaField, SubmitButton, FormAlert
  dashboard/                  Shell admin + daftar
  company/                    Placeholder endpoint yang belum ada
```

---

## 3. Autentikasi & otorisasi

### Berlapis, bukan satu titik

1. **`proxy.ts`** — hanya cek *keberadaan* cookie, lalu redirect. Tujuannya UX:
   pengunjung tidak melihat kerangka halaman terproteksi berkelebat. Ini **bukan**
   pemeriksaan otorisasi.
2. **DAL (`lib/auth/session.ts`)** — setiap halaman terproteksi memanggil
   `requireRider()` / `requireAdminToken()` / `requireCompanyToken()`, tepat di
   sebelah pengambilan datanya.
3. **Backend** — memvalidasi ulang token/identitas di setiap request.

Cookie palsu lolos lapis 1 dan berhenti di lapis 2 atau 3.

### Opsi cookie

| Cookie | HttpOnly | SameSite | Secure | Umur | Isi |
|---|---|---|---|---|---|
| `kaggo_rider` | ✓ | `Lax` | produksi | 90 hari | `{userId, phoneNumber}` + HMAC |
| `kaggo_admin` | ✓ | `Strict` | produksi | min(exp JWT, 8 jam) | `{token, role, email}` + HMAC |
| `kaggo_company` | ✓ | `Strict` | produksi | min(exp JWT, 8 jam) | JWT |

Kenapa rider `Lax` dan bukan `Strict`: Paystack mengembalikan browser ke
`/payment/callback` dari origin lain — `Strict` akan membuang sesi tepat di
navigasi itu. Portal staf tidak pernah melintasi origin, jadi tetap `Strict`.

Kenapa cookie rider **ditandatangani**: API rider mempercayai `x-user-id`
apa adanya. Tanpa signature, siapa pun bisa menyunting cookie jadi identitas
orang lain. HMAC-SHA256 dengan `SESSION_SECRET` menutup celah itu di lapisan
frontend (lihat `lib/auth/signing.ts`).

---

## 4. Penanganan error

### Tiga tingkat

| Tingkat | Berkas | Cakupan |
|---|---|---|
| Global | `app/global-error.tsx` | Root layout gagal |
| Route | `app/error.tsx`, `app/dashboard/error.tsx`, `app/company/error.tsx` | Satu segmen route |
| Komponen | `DataBoundary` + `safeLoad` | Satu bagian halaman |

### Kenapa dua mekanisme di tingkat komponen

`DataBoundary` (berbasis `unstable_catchError` Next 16) menangkap error apa pun
di subtree-nya dan menyediakan `unstable_retry()`. Tapi ketika anak sebuah
`Suspense` melempar error, React mengirim **fallback**-nya di HTML SSR dan baru
menukar ke UI error setelah hydration.

Karena itu setiap panel data juga membungkus fetch-nya dengan `safeLoad`, yang
mengubah kegagalan jadi nilai biasa sehingga kartu error **ikut ter-render di
HTML pertama**. `DataBoundary` tetap terpasang sebagai jaring pengaman.

Tombol retry hanya muncul untuk kegagalan yang memang bisa diulang (timeout,
jaringan, 5xx). Untuk 401 sesi dihapus dan user diarahkan ke login; untuk route
yang belum ada, pesannya menyebutkan itu apa adanya.

---

## 5. Form

Semua form memakai pola yang sama lewat `useActionForm`:

1. Schema Zod di `lib/validation/schemas/` — **satu berkas dipakai dua kali**.
2. Client: `react-hook-form` + `zodResolver` untuk umpan balik instan.
3. Server Action: `parseInput(schema, values)` mem-parse **ulang** — Server
   Action adalah endpoint HTTP publik, jadi tidak boleh percaya pemanggilnya.
4. Kegagalan dimodelkan sebagai nilai (`ActionResult`), bukan exception, lalu
   `fieldErrors` dari server dipasang kembali ke input yang tepat.
5. Sukses → `redirect()` di luar `runAction` (redirect adalah sinyal
   control-flow, bukan error; `unstable_rethrow` menjaganya tidak tertelan).

Komponen form yang dipakai adalah sistem `Field` dari shadcn (`FieldGroup`,
`Field`, `FieldLabel`, `FieldError`). Registry `form` berbasis Radix tidak
tersedia untuk style `base-nova`/`@base-ui/react` yang dipakai project ini.

---

## 6. Status endpoint

Referensi di `mobile-references.txt` dan `admin-references.txt` sudah **v1.1.0**.

### Perubahan v1.1 yang memutus kode lama

Empat hal ini membuat implementasi v1.0 rusak diam-diam, semuanya sudah
diperbaiki:

| Perubahan | Dampak sebelum diperbaiki |
|---|---|
| `GET /vehicles/lookup` kini butuh `x-user-id` | Lookup kendaraan **401** — form listing mustahil lanjut |
| `POST /shipments/{id}/verify-payment` tidak lagi menerima body | Verifikasi pembayaran ditolak |
| `POST /shipments/{id}/pay` balas `oneOf` per gateway | Kode lama baca `authorizationUrl` yang tidak ada di jalur Razorpay |
| `GET /shipments` jadi cursor-paginated | Respons berubah bentuk jadi `{ data, meta.pagination }` |

Selain itu: `pay`/`verify-payment` kini boleh dipanggil **sender atau
receiver** (dulu sender saja), dan `POST /shipments/{id}/mark-paid` dimatikan
total (404) saat `NODE_ENV=production`.

### Pembayaran multi-gateway

Gateway ditentukan backend dari negara pengirim, bukan dipilih klien:

- **Paystack** (Nigeria) — balas `authorizationUrl`, alur redirect penuh jalan.
- **Razorpay** (India) — balas `razorpayOrderId` + `razorpayKeyId`, **tanpa URL
  checkout**. Checkout-nya butuh SDK dari `checkout.razorpay.com`, yang
  diblokir CSP aplikasi ini. Halaman `/payment/[shipmentId]` mendeteksi
  `provider` dan menampilkan status jujur alih-alih redirect ke ketiadaan.
  Mengaktifkannya berarti membuka `script-src`/`frame-src`/`connect-src` ke
  domain Razorpay di `next.config.ts` — keputusan keamanan, jadi tidak
  dilakukan diam-diam.

### Terpakai penuh

Mobile: `POST /users/identify`, `GET /vehicles/lookup`, `POST /shipments`,
`GET /shipments`, `POST /shipments/{id}/pay`, `POST /shipments/{id}/verify-payment`,
`GET /shipments/{id}/payment-receipt`, `POST /shipments/{id}/received`,
`POST /batch-tracking/request`, `GET /batch-tracking/my-requests`.

Admin: `POST /auth/login`, `GET /overview`, `GET /users`, `GET /vehicles`,
`POST /vehicles`, `GET /shipments`, `GET /revenue`, `GET /revenue/transactions`,
`GET /settings/countries`, `PATCH /settings/countries/{code}`,
`GET /settings/company-locations`, `POST /settings/company-locations/csv`,
`GET /logistics-companies`, `POST /logistics-companies/{id}/approve`,
`POST /logistics-companies/{id}/reject`, `POST /logistics-companies/{id}/suspend`,
`POST /logistics-companies/{id}/reactivate`, `DELETE /logistics-companies/{id}`.

Company: `POST /auth/register`, `POST /auth/login`.

### Dua peran admin

v1.1 memisahkan **ADMIN** dan **SUPERADMIN**. Yang butuh SUPERADMIN:
suspend, reactivate, delete perusahaan, dan ubah harga per negara — sisanya
terbuka untuk admin mana pun.

Role disimpan di cookie admin yang **ditandatangani**, dipakai hanya untuk
menyembunyikan tombol. Backend tetap mengecek ulang dan membalas 401, jadi
role palsu tidak membeli apa pun.

### Bermasalah / belum ada

Company Portal API tetap **tidak punya dokumen OpenAPI** meski spec admin v1.1
merujuknya. Permukaannya masih hasil probe langsung:

| Endpoint | Status |
|---|---|
| `GET /company/auth/profile` | **Hang** — tidak pernah membalas |
| `GET /company/dashboard` | **Hang** |
| `GET /company/batches` | **Hang** |
| `POST /company/batches` | 404 |
| `POST /company/batches/{id}/assign-driver` | 404 |
| `GET /company/vehicles` | 404 |

### Belum dipakai

`POST /users/push-token` (butuh FCM di sisi klien),
`GET /shipments/{id}/company-address`,
`POST /shipments/{id}/mark-paid` (internal, mati di produksi),
`GET /admin/logistics-companies/{id}` (detail — daftar sudah cukup untuk layar
sekarang), `GET /admin/logistics-batches` (belum ada layarnya),
`PATCH /admin/vehicles/{id}`.

---

## 7. PWA

### Manifest ([app/manifest.ts](../app/manifest.ts))

`id` + `scope` + `display_override` + `shortcuts` lengkap. Ikon disediakan dalam
**dua purpose**:

- `any` — ikon brand full-bleed (`icon-192`, `icon-512`), dipakai apa adanya.
- `maskable` — mark yang sama dengan padding (`icon-maskable-*`), supaya mask
  adaptif Android (circle / squircle / teardrop) tidak memotong logo.

Memakai satu file untuk kedua purpose adalah cara paling umum ikon PWA berakhir
terpotong; karena itu file maskable digenerate terpisah dengan logo diskalakan ke
52% kanvas — diagonal bounding box-nya 346px, di dalam safe circle 410px untuk
ikon 512.

iOS memakai `app/apple-icon.png` (180×180) lewat konvensi file Next.js, yang
menghasilkan `<link rel="apple-touch-icon">` otomatis. Tanpa ini iOS memakai
screenshot halaman sebagai ikon home screen.

### Screenshots (richer install UI)

Chrome menampilkan dialog install bergaya app-store kalau manifest punya
screenshot. Ini **opsional** — tanpa screenshot app tetap installable, dialognya
saja yang polos. Chrome mensyaratkan minimal satu entri `form_factor: "wide"`
(desktop) dan satu non-`wide` (mobile); tiap gambar 320–3840px dengan sisi
panjang ≤ 2.3× sisi pendek, dan rasio konsisten dalam satu form factor.

Empat screenshot digenerate dari halaman asli oleh
[scripts/screenshots.mjs](../scripts/screenshots.mjs) (`npm run shots`), memakai
Chrome yang sudah terpasang di mesin — tidak ada browser tambahan yang di-download.
Dua hal yang di-handle script itu: `--screenshot` Chrome selalu menulis PNG
(dikonversi ke JPEG, ~85KB dari ~430KB), dan Windows meng-clamp window headless
ke ~500px sehingga capture `narrow` diambil di 500px lalu kolom app 430px yang
ter-center di-crop.

**Regenerate setiap kali UI landing berubah**, dan samakan angka `sizes` di
[app/manifest.ts](../app/manifest.ts).

### Tiga app terpasang

Satu manifest hanya bisa punya satu `start_url`, jadi app terpasang selalu
membuka home rider — dan PWA tidak punya address bar, sehingga user company dan
admin tidak punya jalan masuk sama sekali. Chrome mengidentifikasi app terpasang
lewat `id` manifest, jadi tiga manifest di origin yang sama ter-install sebagai
tiga app terpisah.

| App | Manifest | `id` / `start_url` | `scope` |
|---|---|---|---|
| MyKaggo | `app/manifest.ts` | `/` | `/` |
| MyKaggo Business | `app/company/manifest.webmanifest/route.ts` | `/company` | `/company` |
| MyKaggo Admin | `app/dashboard/manifest.webmanifest/route.ts` | `/dashboard/shipments` | `/dashboard` |

Konvensi file `manifest.ts` Next hanya berlaku di root app, jadi dua manifest
lainnya adalah Route Handler. Masing-masing di-link dari layout portalnya
(`app/company/layout.tsx`, `app/dashboard/layout.tsx`) lewat `metadata.manifest`,
dan semuanya memakai builder bersama di `lib/pwa/manifest.ts` supaya daftar ikon
dan warna tidak terduplikasi.

Dua konsekuensi yang harus ditangani:

- **Manifest admin wajib bisa dibaca saat belum login.** Browser mengambilnya
  untuk menawarkan install, dan itu terjadi sebelum ada yang login. Kalau proxy
  memproteksinya, app admin tidak akan pernah bisa di-install. Karena itu ia
  masuk `ADMIN_PUBLIC_PATHS` — isinya tidak mengandung data apa pun.
- **Semua rute admin harus berada di dalam `scope`.** Form onboarding kendaraan
  tadinya di `/onboarding`, di luar `/dashboard`, sehingga "Add new vehicle"
  akan melempar staf keluar dari window standalone. Rutenya dipindah ke
  `/dashboard/vehicles/new`, dengan `/onboarding*` disisakan sebagai redirect.

Scope rider sengaja tetap `/` supaya link "For logistics companies" di footer
home tidak melompat keluar app. Link itu satu-satunya jalan masuk dari sisi
rider ke portal company; portal admin sengaja tidak punya link publik.

### Splash screen

Hanya **iOS** yang menerima gambar splash buatan sendiri, lewat
`<link rel="apple-touch-startup-image" media="...">`. Ada 16 gambar portrait
(iPhone SE sampai 16 Pro Max, plus keluarga iPad) yang digenerate oleh
`npm run splash` dari `public/images/logo-splashscreen.png`, dan daftarnya
ditulis ke `lib/splash-screens.ts` supaya `app/layout.tsx` selalu sinkron.

Artwork sumber datang di atas hijau `#008753`, sedikit berbeda dari token brand
`#008967`. Menempelkannya langsung menyisakan kotak yang terlihat, jadi tanda
putihnya diangkat dulu jadi mask alpha —
`alpha = (pixel - background) / (putih - background)` per kanal — lalu
dikomposit di atas kanvas hijau brand. Cara ini mempertahankan tepi
anti-aliased yang akan rusak kalau memakai threshold keras.

`appleWebApp.capable` di Next 16 hanya meng-emit `mobile-web-app-capable`.
iOS di bawah 16.4 tidak mengenal nama itu, jadi app tidak pernah masuk mode
standalone — dan **iOS mengabaikan `apple-touch-startup-image` sepenuhnya kalau
tidak standalone**. Karena itu `apple-mobile-web-app-capable` ditambahkan manual
lewat `metadata.other`; tanpa itu ke-16 launch image di atas tidak pernah
terpakai.

**Android tidak bisa diberi gambar splash.** Chrome selalu menyusunnya sendiri
dari `icons` + `name` + `background_color`. Karena itu `name` dibuat persis
`"MyKaggo"` (Chrome menaruhnya di bawah ikon) dan `background_color` disamakan
dengan hijau brand, sehingga ikon putih-di-atas-hijau melebur dengan latar dan
hasilnya menyerupai splash iOS.

`statusBarStyle` sengaja tetap `"default"`: `"black-translucent"` membuat konten
menyelinap di bawah status bar dan memaksa teks status jadi putih di seluruh
app — tidak terbaca di atas header terang aplikasi.

Perubahan manifest (`name`, `background_color`, ikon) baru terlihat setelah PWA
**di-install ulang** — app yang sudah terpasang menyimpan salinan manifest-nya.

### Service worker ([public/sw.js](../public/sw.js))

Aturan utamanya: **tidak pernah meng-cache HTML atau payload RSC.**

| Jenis request | Perlakuan |
|---|---|
| `POST` (Server Action) | Dilewatkan, tidak diintersep |
| Navigasi (HTML) | Network-first, **respons tidak pernah disimpan**; kalau gagal → halaman `/offline` yang sudah di-precache |
| Payload RSC (`RSC:` header / `?_rsc=`) | Dilewatkan |
| Lintas-origin (Paystack) | Dilewatkan |
| `/icons/`, `/images/`, `/_next/static/` | Cache-first, disimpan |

Dukungan offline datang dari satu halaman fallback statis tanpa data sesi, bukan
dari meng-cache halaman asli. `navigationPreload` diaktifkan agar worker tidak
memperlambat navigasi.

`sw.js` disajikan dengan `Cache-Control: public, max-age=0, must-revalidate`
(diatur di [next.config.ts](../next.config.ts)) supaya perubahan aturan cache
langsung menyebar ke device yang sudah meng-install PWA.

Jalankan `npm run sw:check` setelah mengubah `public/sw.js` — script itu
menjalankan worker di dalam mock `ServiceWorkerGlobalScope` dan menegakkan tabel
di atas sebagai 13 assertion.

### Kekuatan password

`lib/validation/password.ts` menilai password tanpa dependensi eksternal.
Panjang diberi bobot lebih besar daripada variasi karakter — passphrase panjang
mengalahkan password pendek yang tinggal disubstitusi. Password yang termasuk
paling sering ditebak, punya karakter berulang, atau berurutan di keyboard
diturunkan paksa ke **weak**.

Skor 0–4 dipetakan jadi weak / medium / strong; **weak ditolak**. Meter di
`PasswordField` hanyalah UI — gerbang sebenarnya ada di skema Zod, yang
dijalankan ulang di dalam Server Action, jadi memintas browser tidak membantu.
Ambangnya dikunci oleh `npm run password:check`.

### Tombol home sadar-role

`lib/home.ts` memetakan pathname ke home portal yang benar, sehingga staf
company yang kena error tidak dilempar ke landing page rider. `HomeButton`
menyembunyikan dirinya kalau pengunjung sudah berada di home-nya.

URL yang tidak cocok membuat Next me-render segmen `/_not-found`, jadi
`usePathname()` melaporkan itu alih-alih URL yang diminta. Proxy menstempel
header `x-kaggo-pathname` (pakai `set`, bukan `append`, jadi tidak bisa
dipalsukan klien) dan `not-found.tsx` membacanya lewat `headers()`.

### SEO

- `metadataBase` dari `NEXT_PUBLIC_SITE_URL`; judul memakai template `%s · MyKaggo`.
- **Canonical tidak diset di root layout** — metadata diwariskan, jadi canonical
  global akan membuat setiap halaman mengaku duplikat `/`. Hanya tiga halaman
  yang boleh diindeks (`/`, `/company`, `/company/register`) yang punya canonical
  sendiri; sisanya `noindex, nofollow` tanpa canonical.
- JSON-LD (Organization + WebSite + Service) di landing page.
- `robots.txt` dan `sitemap.xml` digenerate dari [lib/routes.ts](../lib/routes.ts).

---

## 8. Yang wajib diubah sebelum deploy

1. **`NEXT_PUBLIC_SITE_URL`** → domain produksi. Menentukan `callbackUrl`
   Paystack, `sitemap.xml`, `robots.txt`, dan URL Open Graph.
2. **`SESSION_SECRET`** → nilai acak baru khusus produksi, jangan dibagikan.
3. **Webhook Paystack** → daftarkan
   `{API_BASE_URL}/payments/paystack/webhook` di dashboard Paystack.
4. **`NEXT_PUBLIC_SUPPORT_EMAIL`** → alamat support asli.
5. Pastikan situs dilayani lewat **HTTPS** — semua cookie sesi memakai flag
   `Secure` di produksi.
