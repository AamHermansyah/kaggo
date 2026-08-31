# MyKaggo — Manual Test Scenarios

Panduan uji manual untuk seluruh website setelah integrasi frontend ↔ backend.
Jalankan dari atas ke bawah; setiap bagian berdiri sendiri kecuali disebutkan.

---

## 0. Persiapan

### 0.1 Environment

Salin `.env.example` → `.env.local` (kalau belum ada) dan isi:

```bash
API_BASE_URL=https://backend-production-6e6bd.up.railway.app
NEXT_PUBLIC_SITE_URL=http://localhost:3000
API_TIMEOUT_MS=15000
SESSION_SECRET=<48+ byte acak>
NEXT_PUBLIC_SUPPORT_EMAIL=support@mykaggo.com
```

`SESSION_SECRET` wajib ≥32 karakter. Generate dengan:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

> **Penting saat deploy:** ganti `NEXT_PUBLIC_SITE_URL` ke domain asli. Nilai ini
> dipakai untuk `callbackUrl` Paystack, `sitemap.xml`, `robots.txt`, dan semua
> URL Open Graph. Sengaja **tidak** memakai header `Host` karena header itu bisa
> dipalsukan penyerang, sementara nilai ini menentukan ke mana user kembali
> setelah membayar.

### 0.2 Jalankan

```bash
npm run dev          # http://localhost:3000
# atau uji versi produksi:
npm run build && npm start
```

### 0.3 Akun uji

| Portal  | Kredensial |
|---|---|
| Admin   | `solvebyrovasoft@gmail.com` / `admin1234` (SUPERADMIN) |
| Company | Daftar sendiri lewat `/company/register`, lalu tunggu approval |
| Rider   | Tanpa password — cukup nomor HP Nigeria, mis. `08034567890` |

### 0.4 Alat bantu

- **Menu navigasi dev** (tombol ☰ kanan-bawah) hanya muncul di `npm run dev`.
  Di build produksi komponennya di-*dead-code-eliminate* — ini disengaja, karena
  versi lama membocorkan peta seluruh route admin ke semua pengunjung.
- Untuk menghapus sesi manual: buka `/logout` (rider), `/dashboard/logout`
  (admin), `/company/logout` (company).

---

## 1. Halaman publik & SEO

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 1.1 | Buka `/` | Hero tampil, judul "Track it with MyKaggo", daftar kota diambil dari `lib/geo/cities.ts` |
| 1.2 | Klik "Track it with your phone number" | Diarahkan ke `/list-item?next=%2Ftrack` (karena belum ada identitas) |
| 1.3 | Klik "Contact Support" | Membuka `mailto:` ke `NEXT_PUBLIC_SUPPORT_EMAIL` |
| 1.4 | View source `/` | Ada `<meta name="description">`, `og:*`, `twitter:*`, `<link rel="canonical">`, dan blok `application/ld+json` berisi Organization + WebSite + Service |
| 1.5 | Buka `/robots.txt` | `Allow` berisi 6 halaman publik (termasuk `/about`, `/privacy`, `/terms`); semua area bersesi `Disallow`; baris `Sitemap:` menunjuk ke `NEXT_PUBLIC_SITE_URL` |
| 1.6 | Buka `/sitemap.xml` | Berisi 6 URL publik, persis sama dengan daftar `Allow` di robots.txt |
| 1.7 | Buka `/company` | Landing perusahaan, tombol "Get Started" → `/company/register` |
| 1.8 | Cek response header `/` | Ada `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`; **tidak ada** `X-Powered-By` |

---

## 2. Halaman 404 & 5xx

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 2.1 | Buka `/halaman-yang-tidak-ada` | Halaman 404 kustom: "Error 404 — We can't find that page", tombol "Back to home" + "Track a package". Header/shell app tetap ada |
| 2.2 | Matikan internet lalu buka `/track` (sudah login rider) | Kartu error lokal dengan tombol **Try again**, bukan halaman putih |
| 2.3 | Paksa error render (mis. hentikan backend, buka `/dashboard/settings`) | Section error muncul per-panel; `app/dashboard/error.tsx` menangkap error yang lolos |
| 2.4 | — | `app/global-error.tsx` hanya aktif kalau root layout sendiri gagal; sulit dipicu manual, cukup pastikan file ada |

---

## 3. Rider — identitas (`/list-item`)

Backend tidak punya signup/OTP. `POST /users/identify` mengikat nomor HP ke
device (IP). Nomor yang sama dari device berbeda → `409`.

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 3.1 | Buka `/list-item`, kosongkan input, klik Continue | Pesan "Phone number is required" di bawah input (validasi Zod di client) |
| 3.2 | Isi `123`, Continue | "Enter a valid Nigerian phone number, e.g. 08034567890" |
| 3.3 | Isi `+2348034567890`, Continue | Diterima — dinormalisasi jadi `08034567890` sebelum dikirim |
| 3.4 | Isi nomor valid baru, Continue | Redirect ke `/send-item`; cookie `kaggo_rider` terpasang |
| 3.5 | DevTools → Application → Cookies | `kaggo_rider` **HttpOnly ✓**, `SameSite=Lax`, `Secure` (produksi), nilainya `<base64>.<signature>` |
| 3.6 | Ubah manual isi cookie `kaggo_rider` lalu buka `/track` | Redirect ke `/list-item` — signature HMAC tidak cocok, cookie ditolak |
| 3.7 | Klik "Set up MyKaggo on a new device" | Field kedua "last sender/receiver's number" muncul |
| 3.8 | Buka `/list-item/new-device` | Redirect ke `/list-item?device=new` dengan field kedua sudah terbuka |
| 3.9 | Pakai nomor yang sudah terdaftar di device lain | Muncul pesan device verification, field kedua otomatis terbuka |
| 3.10 | Sudah punya cookie, buka `/list-item` lagi | Langsung redirect ke `/send-item` (tidak perlu identify ulang) |

> **Catatan desain:** dua halaman terpisah (`/list-item` dan
> `/list-item/new-device`) digabung jadi satu, karena backend memperlakukannya
> sebagai satu panggilan — field kedua hanya dibutuhkan setelah `409`.

---

## 4. Rider — listing paket (`/send-item`)

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 4.1 | Buka `/send-item` tanpa cookie rider | Redirect ke `/list-item?next=%2Fsend-item` |
| 4.2 | Submit form kosong | Error per-field muncul di setiap input |
| 4.3 | Pilih From = To (kota sama) | "Pick-up and destination must be different" di field To |
| 4.4 | Toggle role Sender ↔ Receiver | Placeholder nomor lawan bicara ikut berubah |
| 4.5 | Isi nomor plat/HP driver, klik tombol 🔍 | Kartu kendaraan muncul: plat, merk/model/warna, baterai, nama perusahaan |
| 4.6 | Isi plat yang tidak ada, klik 🔍 | "No vehicle matches that phone number or plate..." — form tetap utuh |
| 4.7 | Kendaraan ditemukan tapi GPS offline | Kartu menampilkan ikon baterai warning + catatan bahwa listing tetap bisa lanjut |
| 4.8 | Sebelum lookup berhasil | Tombol "Proceed to payment" **disabled** |
| 4.9 | Lengkapi semua field lalu submit | Shipment dibuat (`PENDING_PAYMENT`), redirect ke `/payment/<shipmentId>` |

> **Perubahan dari desain:**
> - **From/To jadi dropdown kota.** `POST /shipments` mewajibkan
>   `fromLat/fromLng/toLat/toLng`, dan backend eksplisit menyatakan tidak punya
>   geocoder. Koordinat diambil dari daftar kota di `lib/geo/cities.ts`.
> - **Mode "logistics company" kembali** sejak backend v1.1 menambahkan
>   `/batch-tracking/*`. Pemilih batch tetap tidak ada — server mencocokkan
>   sendiri berdasarkan jendela drop-off. Skenarionya di §11A.2.
> - **Lookup kendaraan diulang di server** saat submit — browser hanya mengirim
>   teks yang diketik user, jadi tidak bisa menempelkan paket ke driver
>   sembarangan.

---

## 5. Rider — pembayaran (Paystack)

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 5.1 | Setelah 4.9 | Muncul spinner "Taking you to secure payment…" lalu redirect ke checkout Paystack |
| 5.2 | Refresh `/payment/<id>` sebelum bayar | Tidak membuat transaksi baru — endpoint idempoten, mengembalikan URL attempt yang sama |
| 5.3 | Buka `/payment/<id>` untuk shipment milik orang lain | "Only the sender or receiver of this parcel can pay for it." (v1.1 memperluas ke penerima) |
| 5.4 | Buka `/payment/<id>` untuk shipment yang sudah dibayar | Redirect ke `/track` |
| 5.5 | Selesaikan pembayaran di Paystack | Kembali ke `/payment/callback?shipment=<id>&reference=...` → verifikasi → redirect ke `/send-item/success?shipment=<id>` |
| 5.6 | Batalkan pembayaran di Paystack | Halaman "Payment not completed" + tombol "Try payment again" dan "View my parcels" |
| 5.7 | Buka `/payment/callback` tanpa query | "We could not read that payment link" |
| 5.8 | Di `/send-item/success` | Kartu resi: item, rute, carrier, jumlah, reference, waktu bayar |
| 5.9 | Buka success page tepat setelah bayar (webhook belum masuk) | Kartu "Your receipt is still being confirmed with the bank" — bukan error |

> Cookie rider sengaja `SameSite=Lax` (bukan `Strict`) supaya sesi selamat saat
> Paystack mengembalikan browser dari origin lain. Cookie admin & company tetap
> `Strict` karena tidak pernah melintasi origin.

---

## 6. Rider — tracking (`/track`)

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 6.1 | Buka `/track` tanpa cookie | Redirect ke `/list-item?next=%2Ftrack` |
| 6.2 | Rider baru tanpa paket | Empty state "Nothing to track yet" + tombol "List an item" |
| 6.3 | Rider dengan paket | Baris atas: `ID: <nomor>` + hitungan hijau (dikirim) / merah (diterima) |
| 6.4 | Kartu paket | Nama item, rute, status, jam, ETA, plat, model, perusahaan |
| 6.5 | Status kendaraan sedang jalan | "Last seen at 6.524, 3.379" — koordinat mentah, karena backend tidak punya reverse-geocoding |
| 6.6 | Klik "Call driver" | Membuka `tel:+234...` |
| 6.7 | Login sebagai **penerima** paket `ACTIVE` | Tombol "Mark as received" muncul |
| 6.8 | Login sebagai **pengirim** | Tombol "Mark as received" **tidak** muncul (dan backend menolak dengan 403) |
| 6.9 | Klik "Mark as received" | Toast sukses, daftar auto-refresh |
| 6.10 | Backend down saat buka `/track` | Kartu error lokal + tombol **Try again**; baris identitas & "Contact Support" tetap tampil |

---

## 7. Portal Admin (`/dashboard`)

### 7.1 Autentikasi

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 7.1.1 | Buka `/dashboard/shipments` tanpa login | Redirect ke `/dashboard/login?next=%2Fdashboard%2Fshipments` |
| 7.1.2 | Login dengan password salah | "Invalid email or password." (pesan sama untuk email tidak dikenal — anti enumerasi) |
| 7.1.3 | Coba login >10× per menit | "Too many sign-in attempts..." (rate limit backend) |
| 7.1.4 | Login benar | Redirect ke `next` tadi, bukan ke halaman default |
| 7.1.5 | Cek cookie `kaggo_admin` | **HttpOnly ✓**, `SameSite=Strict`, `Secure` (produksi), umur dibatasi klaim `exp` JWT |
| 7.1.6 | Sudah login, buka `/dashboard/login` | Redirect ke `/dashboard/shipments` |
| 7.1.7 | Klik ikon logout di header | Cookie dihapus, kembali ke halaman login |
| 7.1.8 | Rusak isi cookie `kaggo_admin` lalu reload | Backend menolak → auto-logout → `/dashboard/login?expired=1` dengan banner "Your session expired" |

### 7.2 Daftar & filter

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 7.2.1 | `/dashboard` | Redirect ke `/dashboard/shipments` |
| 7.2.2 | Baris statistik | 4 tile: Shipments, Users, Vehicles, **Revenue** — angka dari `GET /overview` |
| 7.2.3 | Klik Today / This Week / This Month / All | URL berubah (`?range=`), angka overview ikut berubah, bisa di-back |
| 7.2.4 | Ketik di kotak Search | URL `?q=` (debounce 350 ms), baris terfilter, cursor pagination di-reset |
| 7.2.5 | Klik "Next page" | URL `?cursor=...`, halaman berikutnya tampil, muncul tombol "First page" |
| 7.2.6 | `/dashboard/users` | Titik hijau = totalSent, merah = totalReceived, nomor HP diformat |
| 7.2.7 | `/dashboard/vehicles` | Driver, HP, model, perusahaan, device ID, badge status+baterai, plat |
| 7.2.8 | `/dashboard/shipments` | Pengirim/penerima, status badge, harga, plat, rute, posisi, waktu; baris soft-deleted tampil redup + badge "Deleted" |
| 7.2.9 | `/dashboard/revenue` | Total revenue + daftar transaksi Paystack |
| 7.2.10 | Endpoint `/overview` gagal, daftar sehat | **Hanya** baris statistik jadi kartu error + retry; daftar di bawah tetap jalan |

### 7.3 Settings (`/dashboard/settings`)

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 7.3.1 | Klik ikon ⚙ di header | Buka halaman Settings |
| 7.3.2 | Ubah harga negara jadi `0` | "Price must be greater than zero" |
| 7.3.3 | Ubah harga jadi angka valid, Save | Toast sukses, nilai "Current" ter-update |
| 7.3.4 | Upload CSV tanpa header benar | "The first row must be: companyName,locationLabel,address" |
| 7.3.5 | Upload CSV hanya header | "Add at least one data row below the header" |
| 7.3.6 | Upload CSV valid | Laporan "Upserted N locations" + daftar baris yang dilewati beserta nomor barisnya |
| 7.3.7 | Upload CSV yang sama dua kali | Idempoten — alamat di-update, tidak menduplikasi baris |

### 7.4 Onboarding kendaraan (`/onboarding`)

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 7.4.1 | Buka `/onboarding` tanpa sesi admin | Redirect ke `/dashboard/login?next=%2Fonboarding` |
| 7.4.2 | Buka `/onboarding/info` | Redirect ke `/onboarding` (dua halaman digabung) |
| 7.4.3 | Isi IMEI `abc` | "IMEI must be 10-20 digits" |
| 7.4.4 | Isi terminal number 13 digit | "Terminal number must be 1-12 digits" |
| 7.4.5 | Submit dengan plat yang sudah terdaftar | "That plate number, IMEI or terminal number is already registered..." |
| 7.4.6 | Submit valid | Redirect ke `/onboarding/success?plate=...`, plat ditampilkan |
| 7.4.7 | Cek `/dashboard/vehicles` | Kendaraan baru muncul di daftar |

> **Perubahan dari desain:** alur "Onboarding Agent" (2 halaman: nomor HP agent →
> form) digabung jadi satu form ber-sesi admin, karena `POST /admin/vehicles`
> adalah satu-satunya endpoint yang membuat kendaraan + GPS device, dan backend
> tidak punya konsep identitas "agent". Field "Vehicle make & Model" dipecah jadi
> make + model, dan "Device ID" dipecah jadi IMEI + terminal number, karena API
> memintanya terpisah.

---

## 8. Portal Company (`/company`)

### 8.1 Registrasi & login

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 8.1.1 | `/company/register`, password < 8 karakter | "Use at least 8 characters" |
| 8.1.2 | Confirm password beda | "Passwords do not match" di field confirm |
| 8.1.3 | Email sudah terpakai | "An account already exists for that email or phone number." |
| 8.1.4 | Submit valid | Redirect ke `/company/submitted` — "Application Submitted", menunggu approval |
| 8.1.5 | `/company/login` dengan kredensial salah | "Invalid email or password." |
| 8.1.6 | Login akun yang belum di-approve | "This account is not approved yet..." |
| 8.1.7 | Login sukses | Redirect ke `/company/dashboard`; cookie `kaggo_company` HttpOnly + `SameSite=Strict` |
| 8.1.8 | Sudah login, buka `/company/login` atau `/company/register` | Redirect ke `/company/dashboard` |
| 8.1.9 | Klik "Sign out" di dashboard | Cookie dihapus, kembali ke login |

### 8.2 Dashboard & batch

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 8.2.1 | Buka `/company/dashboard` tanpa login | Redirect ke `/company/login?next=...` |
| 8.2.2 | Buka `/company/dashboard` | **Saat ini:** setelah ±8 detik muncul kartu error + tombol **Try again** (lihat §9). Quick Actions dan Sign out tetap tampil dan bisa diklik |
| 8.2.3 | Buka `/company/batches` | Sama — error lokal + retry, tombol "Create New Batch" tetap berfungsi |
| 8.2.4 | `/company/batches/create`, jam tutup < jam buka | "Closing time must be after the starting time" |
| 8.2.5 | Submit form create batch | "This feature is not available on the server yet." — pesan jujur, bukan error generik |
| 8.2.6 | `/company/batches/assign-driver`, klik 🔍 | Lookup kendaraan **berfungsi** (pakai endpoint publik `/vehicles/lookup`), kartu kendaraan asli muncul |
| 8.2.7 | Submit assign driver | "This feature is not available on the server yet." |
| 8.2.8 | `/company/batches/<id>/packages` | Halaman menjelaskan endpoint belum tersedia + tombol kembali |
| 8.2.9 | `/company/vehicles` | Penjelasan bahwa onboarding kendaraan saat ini lewat portal admin |
| 8.2.10 | `/company/vehicles/onboarding` | Redirect ke `/company/vehicles` |

---

## 9. Temuan backend yang perlu ditindaklanjuti

Ditemukan saat memetakan Company API (tidak ada file OpenAPI-nya, jadi endpoint
diprobe langsung ke deployment):

| Endpoint | Status | Dampak |
|---|---|---|
| `POST /company/auth/register` | ✅ jalan | — |
| `POST /company/auth/login` | ✅ jalan | — |
| `GET /company/auth/profile` | ⚠️ **hang** — tidak pernah membalas, dengan atau tanpa `Authorization` | Nama & kode perusahaan tidak bisa ditampilkan |
| `GET /company/dashboard` | ⚠️ **hang** | Statistik dashboard company kosong |
| `GET /company/batches` | ⚠️ **hang** | Daftar batch kosong |
| `POST /company/batches` | ❌ 404 | Create batch tidak bisa |
| `POST /company/batches/{id}/assign-driver` | ❌ 404 | Assign driver tidak bisa |
| `GET /company/vehicles` | ❌ 404 | Fleet management tidak bisa |
| Company API (companies) di Admin API | ❌ tidak ada | Tab "Companies" di desain admin diganti **Revenue** |

Frontend sudah ditulis melawan bentuk REST yang wajar untuk semua endpoint di
atas, jadi begitu backend menambahkannya, halamannya langsung hidup tanpa ubah
kode. Sementara ini:

- Endpoint yang **hang** dibatasi timeout 8 detik → berubah jadi kartu error
  lokal ber-tombol retry, bukan halaman yang menggantung.
- Endpoint yang **404** dikenali sebagai "route belum ada" dan menampilkan
  pesan jujur, bukan kegagalan generik.

**Cara verifikasi ulang temuan hang:**

```bash
B=https://backend-production-6e6bd.up.railway.app
curl -s -m 8 -o /dev/null -w '%{http_code}\n' "$B/company/dashboard"   # 000 = timeout
curl -s -m 8 -o /dev/null -w '%{http_code}\n' "$B/company/zzz-nonexistent"  # 404 = pembanding
```

---

## 10. Keamanan — yang perlu dicek

| # | Cek | Hasil yang diharapkan |
|---|---|---|
| 10.1 | `document.cookie` di DevTools console | **Kosong** dari cookie sesi — semuanya HttpOnly |
| 10.2 | Network tab saat memakai app | **Tidak ada** request langsung dari browser ke `backend-production-*.railway.app`. Semua panggilan API terjadi di server |
| 10.3 | Cari token JWT di HTML/JS bundle | Tidak ditemukan — token tidak pernah masuk client bundle |
| 10.4 | Buka `/dashboard/shipments?next=https://evil.com` lalu login | Redirect tetap ke path internal; URL absolut ditolak oleh `safeInternalPath` |
| 10.5 | Ubah 1 karakter di cookie `kaggo_rider` | Ditolak (signature HMAC) → balik ke `/list-item` |
| 10.6 | Sebagai pengirim, panggil "mark as received" | Ditolak backend dengan 403 (tombolnya juga tidak dirender) |
| 10.7 | Kirim payload aneh langsung ke Server Action | Ditolak — setiap action mem-parse ulang schema Zod di server, tidak mempercayai client |
| 10.8 | DevTools → Application → Cache Storage | Hanya berisi `/icons/`, `/images/`, `/_next/static/`. **Tidak ada** halaman HTML |

> **Perbaikan penting pada service worker:** versi sebelumnya meng-cache *setiap*
> navigasi ke Cache Storage. Artinya halaman `/track` (paket milik user) dan
> `/dashboard/*` (daftar user + revenue) tersimpan di device dan bisa disajikan
> ke siapa pun yang membuka app berikutnya, login atau tidak. Sekarang service
> worker hanya meng-cache aset statis; HTML dan payload RSC tidak pernah
> disentuh. Cache lama otomatis dihapus saat `kaggo-v4` aktif.

---

## 11. PWA

### 11.1 Manifest & instalasi

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 11.1.1 | Buka `/manifest.webmanifest` | `Content-Type: application/manifest+json`; berisi `id`, `scope`, `display_override`, `lang`, `categories`, `shortcuts` |
| 11.1.2 | DevTools → Application → Manifest | Tidak ada error/warning, "Installability" hijau |
| 11.1.3 | Lihat daftar ikon di panel Manifest | 4 ikon: 192 & 512 `purpose: any`, plus 192 & 512 `purpose: maskable` |
| 11.1.4 | Aktifkan preview mask di DevTools | Logo tidak terpotong pada bentuk circle, squircle, maupun rounded-square |
| 11.1.5 | Chrome desktop → ikon install di address bar | Muncul; setelah install, app terbuka di window sendiri tanpa address bar |
| 11.1.6 | Android → "Add to Home screen" | Ikon launcher memakai versi maskable (bukan kotak putih), nama "MyKaggo" |
| 11.1.7 | Long-press ikon app di Android | Muncul 2 shortcut: **Track** dan **List** |
| 11.1.8 | iOS Safari → Share → Add to Home Screen | Ikon MyKaggo tampil (dari `apple-touch-icon` 180×180), judul "MyKaggo" |
| 11.1.9 | Buka app hasil install | Mendarat di `/`; status bar Android berwarna hijau `#008967` |
| 11.1.10 | DevTools → Manifest → "Errors and Warnings" | Kosong. Warning "Richer PWA Install UI won't be available" hilang setelah 4 screenshot ditambahkan (2 `narrow` + 2 `wide`) |
| 11.1.11 | Klik install | Dialog install menampilkan preview screenshot (richer install UI), bukan dialog polos |

Screenshot di-generate dari halaman asli dengan `npm run shots` (butuh server
jalan — `npm start` di terminal lain). **Regenerate setiap kali UI landing
berubah**, lalu samakan angka `sizes` di [app/manifest.ts](../app/manifest.ts).

### 11.1b Splash screen & branding

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 11.1b.1 | iOS: install ke home screen, lalu buka app | Splash hijau brand dengan logo + tulisan **MyKaggo** di bawahnya, tanpa kotak/garis batas warna |
| 11.1b.2 | Android: buka app hasil install | Chrome menyusun splash sendiri: ikon di atas `background_color` hijau `#008967` dengan teks **MyKaggo** di bawahnya |
| 11.1b.3 | View source `/`, cari `apple-touch-startup-image` | Ada **16 tag**, masing-masing dengan `media` khusus (device-width/height + pixel-ratio + portrait) |
| 11.1b.3b | View source `/`, cari `web-app-capable` | Ada **dua** tag: `apple-mobile-web-app-capable` **dan** `mobile-web-app-capable` |
| 11.1b.4 | Jalankan `npm run splash` | Regenerate 16 gambar + tulis ulang `lib/splash-screens.ts` |
| 11.1b.5 | Cek judul tab browser & DevTools → Manifest | Semua tertulis **MyKaggo** — tidak ada lagi "MyKaggo" polos |
| 11.1b.6 | Cari string `MyKaggo` (tanpa `My`) di halaman publik | 0 hasil |

> **Wajib install ulang.** PWA yang sudah ter-install menyimpan salinan
> manifest-nya. Mengubah `name`, `background_color`, atau ikon **tidak** terlihat
> sampai app dihapus dari home screen lalu ditambahkan lagi. Kalau splash masih
> menampilkan nama atau warna lama, ini penyebabnya — bukan kodenya.

> **Kenapa sempat tidak muncul sama sekali di iOS.** `appleWebApp.capable` di
> Next 16 hanya meng-emit `mobile-web-app-capable` yang terstandardisasi. iOS di
> bawah 16.4 tidak mengenalinya, jadi app tidak pernah masuk mode standalone —
> dan iOS mengabaikan `apple-touch-startup-image` sepenuhnya kalau tidak
> standalone. Tag ber-prefix `apple-` sekarang ditambahkan lewat `metadata.other`.

> **Batas platform:** hanya iOS yang menerima gambar splash buatan sendiri
> (`apple-touch-startup-image`). Android **selalu** menyusun splash-nya dari
> `icons` + `name` + `background_color` di manifest — tidak ada cara memasang
> file gambar. Karena itu `name` dibuat persis `"MyKaggo"` dan
> `background_color` disamakan dengan hijau brand, sehingga hasil Android
> menyerupai gambar splash iOS.

### 11.1c Tiga app terpasang (rider / company / admin)

Satu manifest berarti app terpasang **selalu** membuka home rider — dan PWA
tidak punya address bar, jadi user company & admin tidak punya jalan masuk sama
sekali. Sekarang tiap portal punya manifest sendiri, jadi terpasang sebagai tiga
app terpisah.

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 11.1c.1 | Buka `/manifest.webmanifest` | `id=/`, `start_url=/`, `scope=/`, `name="MyKaggo"` |
| 11.1c.2 | Buka `/company/manifest.webmanifest` | `id=/company`, `start_url=/company`, `scope=/company`, `name="MyKaggo Business"` |
| 11.1c.3 | Buka `/dashboard/manifest.webmanifest` **tanpa login** | **200** — bukan redirect ke login. Browser mengambil manifest sebelum siapa pun login; kalau diproteksi, app admin tidak akan pernah bisa di-install |
| 11.1c.4 | View source `/`, `/list-item` | `<link rel="manifest" href="/manifest.webmanifest">` |
| 11.1c.5 | View source `/company`, `/company/login` | `href="/company/manifest.webmanifest"` |
| 11.1c.6 | View source `/dashboard/login` | `href="/dashboard/manifest.webmanifest"` |
| 11.1c.7 | Install dari `/company` di Android | Ikon baru berlabel **MyKaggo Biz**, terpisah dari app rider; buka → mendarat di `/company` |
| 11.1c.8 | Install dari `/dashboard/login` | Ikon **MyKaggo Admin**, buka → mendarat di `/dashboard/shipments` |
| 11.1c.9 | Long-press ikon MyKaggo Biz | Shortcut **Dashboard** dan **Batches** |
| 11.1c.10 | Long-press ikon MyKaggo Admin | Shortcut **Shipments** dan **Vehicles** |
| 11.1c.11 | Dari app rider, footer home | Ada link **"For logistics companies"** → `/company` (satu-satunya jalan masuk dari sisi rider) |
| 11.1c.12 | Di app admin, buka `/dashboard/vehicles` → "Add new vehicle" | Tetap di dalam window standalone, **tidak** melompat ke tab browser |
| 11.1c.13 | Buka `/onboarding` atau `/onboarding/info` (sudah login admin) | Redirect ke `/dashboard/vehicles/new` |

> **Kenapa onboarding dipindah.** `scope` app admin adalah `/dashboard`. Selama
> form onboarding berada di `/onboarding` — di luar scope — menekan "Add new
> vehicle" akan melempar staf keluar dari app ke tab browser. Rutenya dipindah
> ke `/dashboard/vehicles/new`; `/onboarding*` tetap ada sebagai redirect.

> **Admin sengaja tanpa link publik.** Tidak ada tautan ke `/dashboard` di UI
> rider maupun company. Staf mengetik URL-nya sekali di browser, meng-install
> dari sana, lalu seterusnya cukup lewat ikon.

### 11.2 Service worker & offline

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 11.2.1 | DevTools → Application → Service Workers | `sw.js` **activated and running**, cache `kaggo-v5` |
| 11.2.2 | DevTools → Application → Cache Storage → `kaggo-v5` | Isinya hanya `/offline`, `/icons/*`, `/images/*`, `/_next/static/*`. **Tidak ada** HTML halaman lain |
| 11.2.3 | Login rider → buka `/track` → cek Cache Storage lagi | Tetap tidak ada entri `/track` — halaman bersesi tidak pernah di-cache |
| 11.2.4 | Network → Offline → buka `/track` | Halaman "You are offline" dengan tombol **Try again** dan **Go to home** |
| 11.2.5 | Masih offline, klik "Try again" | Reload URL asli (`/track`, bukan `/offline`) |
| 11.2.6 | Nyalakan network → klik "Try again" | Halaman `/track` asli terbuka normal |
| 11.2.7 | Offline lalu submit form apa pun | Request POST tidak diintersep SW — gagal wajar dengan pesan error di form, bukan "berhasil" palsu dari cache |
| 11.2.8 | Cek response header `/sw.js` | `Cache-Control: public, max-age=0, must-revalidate` |
| 11.2.9 | Jalankan `npm run sw:check` | `13/13 passed` |

`npm run sw:check` menjalankan `public/sw.js` di dalam mock
`ServiceWorkerGlobalScope` dan memverifikasi: POST tidak diintersep, navigasi
tidak pernah ditulis ke cache, payload RSC tidak disentuh, request lintas-origin
(Paystack) dilewatkan, dan hanya aset statis yang masuk cache. **Jalankan ulang
setiap kali `public/sw.js` diubah.**

### 11.3 PWA + backend

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 11.3.1 | Dari app terinstal, jalankan listing sampai bayar | Checkout Paystack terbuka di browser (di luar `scope`), bukan di dalam window PWA — pembayar tetap bisa melihat URL & padlock asli |
| 11.3.2 | Selesaikan pembayaran | Balik ke `/payment/callback` **di dalam** PWA, sesi rider utuh (cookie `SameSite=Lax`) |
| 11.3.3 | Buka shortcut "Track" saat belum identify | Diarahkan ke `/list-item?next=%2Ftrack`, bukan error |
| 11.3.4 | DevTools → Network selama memakai app | Semua request ke origin sendiri; tidak ada panggilan langsung ke Railway dari browser |

---

---

## 11.5 Password & tombol home

### Kekuatan password (`/company/register`)

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| p.1 | Ketik `abc` di "Create Password" | Meter merah **Weak**, hint "Use at least 8 characters" |
| p.2 | Ketik `password` | **Weak** — "This is one of the most guessed passwords" |
| p.3 | Ketik `Password1` | Tetap **Weak** — terlihat bervariasi tapi termasuk paling sering ditebak |
| p.4 | Ketik `abcdefgh` atau `aaaaaaaa` | **Weak** — "Avoid repeated characters and keyboard runs" |
| p.5 | Ketik `Tr0ubador` | Meter kuning **Medium** — boleh submit |
| p.6 | Ketik `Lagos-Abuja-2026!` | Meter hijau **Strong**, tanpa hint |
| p.7 | Submit dengan password Weak | Ditolak, pesan error di field — form tidak terkirim |
| p.8 | Klik ikon mata di kanan input | Password tampil/tersembunyi, `aria-pressed` ikut berubah |
| p.9 | Isi confirm password berbeda | "Passwords do not match" |
| p.10 | Jalankan `npm run password:check` | 16/16 passed |

> Meter hanyalah UI. Gerbang sebenarnya ada di skema Zod, yang dijalankan ulang
> di dalam Server Action — melewati browser tidak membuat password lemah lolos.

### Tombol home sadar-role

| # | Halaman | Tombol yang muncul |
|---|---|---|
| h.1 | `/nope` (404 area rider) | "Back to home" + "Track a package" |
| h.2 | `/company/nope` | "Back to company home" — tombol "Track a package" **tidak** muncul |
| h.3 | `/dashboard/nope` (login admin) | "Back to dashboard" |
| h.4 | `/onboarding/nope` (login admin) | "Back to dashboard" |
| h.5 | `/offline` | "Back to home" |
| h.6 | Error saat sudah di `/` | Tombol home **hilang** |
| h.7 | Error saat sudah di `/company` | Tombol home **hilang** |
| h.8 | Error saat sudah di `/dashboard/shipments` | Tombol home **hilang** |

> URL yang tidak cocok membuat Next me-render segmen `/_not-found`, jadi
> `usePathname()` melaporkan itu — bukan URL yang diminta. Proxy menstempel
> header `x-kaggo-pathname` supaya halaman 404 tahu portal mana yang sedang
> dipakai. Header di-`set` (bukan `append`), jadi tidak bisa dipalsukan klien.

## 11A. Backend v1.1 — yang baru

### 11A.1 Approval perusahaan (`/dashboard/companies`)

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 11A.1.1 | Login admin → buka `/dashboard/companies` | Daftar perusahaan dengan badge status (Pending / Approved / Rejected / Suspended) |
| 11A.1.2 | Lihat ubin dashboard | Kini **5 ubin**: Shipments, Users, Vehicles, **Companies**, Revenue |
| 11A.1.3 | Daftar perusahaan baru lewat `/company/register`, refresh halaman ini | Muncul dengan status **Pending** |
| 11A.1.4 | Expand baris Pending → **Approve** | Toast sukses, badge berubah jadi Approved |
| 11A.1.5 | Coba login sebagai perusahaan itu | Berhasil masuk (sebelum di-approve seharusnya ditolak) |
| 11A.1.6 | Expand baris Pending lain → **Reject** | Muncul input alasan; tombol Confirm nonaktif selama alasan kosong |
| 11A.1.7 | Isi alasan → Confirm | Badge jadi Rejected, alasannya tampil di detail |
| 11A.1.8 | Login sebagai SUPERADMIN | Tombol **Suspend / Reactivate / Delete** ikut muncul |
| 11A.1.9 | Login sebagai ADMIN biasa | Ketiga tombol itu hilang, diganti keterangan bahwa perlu SUPERADMIN |
| 11A.1.10 | Cari nama/kode perusahaan di kotak pencarian | Daftar tersaring |

> **Catatan:** aksi SUPERADMIN disembunyikan di UI, tapi backend tetap membalas
> 401 untuk ADMIN biasa. Menyembunyikan tombol bukan pengamannya.

### 11A.2 Drop-off lewat perusahaan logistik (`/send-item`)

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 11A.2.1 | Buka `/send-item` | Mode default = driver, seperti sebelumnya |
| 11A.2.2 | Klik "I'm tracking item through a logistics company" | Form berganti: kode perusahaan, item, From, To — **tidak ada** field nomor penerima |
| 11A.2.3 | Isi kode 5 digit | "The company code is 6 digits" |
| 11A.2.4 | Isi kode yang tidak dikenal → submit | Pesan bahwa tidak ada perusahaan/batch yang cocok, form tetap utuh |
| 11A.2.5 | Isi kode valid + rute yang punya batch terbuka → submit | Layar sukses menampilkan **nomor batch yang dicocokkan server** dan jadwal berangkat |
| 11A.2.6 | Submit lagi dengan data sama | "You already have a pending request on that batch" |
| 11A.2.7 | Buka `/track` | Muncul bagian **Batch drop-offs** dengan status (Finding a batch / On a batch / dst) |

> Tidak ada pemilih batch: server mencocokkan berdasarkan jendela drop-off yang
> sedang terbuka, jadi meminta user menebak nomor batch justru mengundang salah.

### 11A.3 Regresi pembayaran

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 11A.3.1 | Alur listing driver sampai lookup kendaraan | Kartu kendaraan muncul — **v1.1 membuat endpoint ini butuh auth**, kalau 401 berarti header `x-user-id` hilang |
| 11A.3.2 | Lanjut ke pembayaran (nomor Nigeria) | Redirect ke checkout Paystack seperti biasa |
| 11A.3.3 | Selesaikan pembayaran, kembali | Verifikasi jalan **tanpa** mengirim reference (v1.1 menghapus body-nya) |
| 11A.3.4 | Nomor India (gateway Razorpay) | Layar "Finish this payment in the app" + order id, bukan halaman kosong |
| 11A.3.5 | Punya >20 kiriman | Tombol paginasi muncul — `GET /shipments` kini cursor-paginated |

---

## 12. Ringkasan perubahan desain

Halaman ganda / ambigu yang dirapikan, beserta alasannya:

| Sebelum | Sesudah | Alasan |
|---|---|---|
| `/list-item` + `/list-item/new-device` | Satu halaman `/list-item`, field kedua muncul saat dibutuhkan | Backend memperlakukannya sebagai satu panggilan `identify` |
| `/onboarding` + `/onboarding/info` | Satu form di `/onboarding` | Tidak ada identitas "agent" di backend; gate nomor HP diganti sesi admin |
| `/company/vehicles/onboarding` | Redirect ke `/company/vehicles` | Onboarding kendaraan hanya ada di Admin API |
| Tab "Companies" di admin | **Dipulihkan** di v1.1, plus tab Revenue & Settings yang tetap ada | Sempat diganti Revenue karena Admin API belum punya endpoint company; `/logistics-companies` menutup celah itu |
| `/payment` (stub timer) | `/payment/[shipmentId]` + `/payment/callback` | Alur Paystack yang sebenarnya: initialize → checkout → verify |
| `/dashboard` tanpa login | `/dashboard/login` + proxy + guard per halaman | API admin butuh email/password; portal tidak boleh terbuka |
| Mode "logistics company" di `/send-item` | **Dipulihkan** di v1.1, tanpa pemilih batch | Sempat dihapus karena tidak ada endpoint; `/batch-tracking/request` mencocokkan batch sendiri |
| Input teks From/To | Combobox kota berkoordinat, menyaring saat diketik | `POST /shipments` wajib lat/lng, backend tanpa geocoder; dropdown biasa tidak sanggup untuk 1000 lokasi |
| Floating nav di produksi | Hanya di development | Membocorkan peta route admin ke publik |

---

## 13. Perintah cepat

```bash
npm run dev        # development
npm run build      # build produksi (termasuk typecheck)
npm start          # jalankan hasil build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run sw:check       # uji perilaku service worker (13 assertions)
npm run password:check # uji ambang kekuatan password (16 assertions)
npm run splash         # regenerate 16 launch image iOS + lib/splash-screens.ts
npm run shots          # regenerate screenshot manifest
npm run shots      # regenerate screenshot manifest (server harus jalan)
npm run format     # prettier + urutkan class Tailwind
```
