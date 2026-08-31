# Notes for the Backend Team

From: MyKaggo frontend (Next.js web app / PWA)
Against: mobile API `v1.1.0`, admin API `v1.1.0`

Thanks for the v1.1 update — `/logistics-companies` and `/batch-tracking/*`
closed the two gaps that were blocking us, and both are now live in the web app.

Below is what we hit while integrating. Section 1 needs a decision from you;
sections 2–3 are things we worked around but would rather not have to.

---

## 1. Blocking — needs your input

### 1.1 The Company Portal API has no OpenAPI document

`GET /company/openapi.yaml` returns **404**, even though the admin v1.1 spec
refers to *"the Company Portal API's own spec"* (under `EditVehicleRequest` →
`companyId`).

We reverse-engineered the surface by probing. What we found:

| Endpoint | Result |
|---|---|
| `POST /company/auth/register` | Works — `{ name, address, email, phone, password }` |
| `POST /company/auth/login` | Works — `{ email, password }` |
| `GET /company/auth/profile` | **Never responds** — request hangs until our client times out |
| `GET /company/dashboard` | **Never responds** |
| `GET /company/batches` | **Never responds** |
| `POST /company/batches` | 404 |
| `POST /company/batches/{id}/assign-driver` | 404 |
| `GET /company/vehicles` | 404 |

**Please publish the spec at `/company/openapi.yaml`** like the other two
services. Until then we are guessing at request and response shapes.

### 1.2 Three company endpoints hang instead of answering

`GET /company/auth/profile`, `GET /company/dashboard` and `GET /company/batches`
never send a response — with **or without** an `Authorization` header. They do
not 401, 404 or 500; the connection just stays open.

Reproduce:

```bash
curl -m 10 https://backend-production-6e6bd.up.railway.app/company/dashboard
# curl: (28) Operation timed out after 10001 ms with 0 bytes received

curl -m 10 -H 'Authorization: Bearer anything' \
  https://backend-production-6e6bd.up.railway.app/company/dashboard
# same — times out
```

Compare with a route that genuinely does not exist, which answers immediately:

```bash
curl -m 10 https://backend-production-6e6bd.up.railway.app/company/nope
# {"success":false,"error":{"code":"NOT_FOUND","message":"Route not found: GET /company/nope"}}
```

So the routes are registered but their handlers never complete. A missing
`await`, an unresolved promise, or a query without a timeout would all look like
this. **Even an error response would be better than silence** — right now the
company dashboard can only show a "could not load, retry" card.

### 1.3 Does company login actually enforce approval?

Our registration flow ends on a screen that says *"submitted for approval — you
will receive access once your account is approved"*, matching the design.

Now that `POST /admin/logistics-companies/{id}/approve` exists we can approve
them. But we could not confirm whether `POST /company/auth/login` **rejects** a
company still in `PENDING`, because testing it means creating a real company row
on production and there is no delete endpoint on the company API to clean it up.

**Please confirm:** does login return an error for `PENDING`, `REJECTED` and
`SUSPENDED` companies? If not, the approval step is cosmetic and anyone who
registers can sign in immediately.

---

## 2. Things that broke us silently in v1.1

Not complaints — just flagging that these were behaviour changes an existing
client could not detect without re-reading the spec. A short "breaking changes"
list in the release note would have caught all four.

### 2.1 `GET /vehicles/lookup` became authenticated

v1.0 had `security: []`; v1.1 has `security: [{ UserIdHeader: [] }]`.

This one was the worst, because it is invisible to a type checker. Our vehicle
lookup simply started returning 401 and the parcel-listing form could not get
past vehicle confirmation. Fixed on our side by sending `x-user-id`.

### 2.2 `POST /shipments/{id}/verify-payment` dropped its request body

We were sending `{ reference }`. It now takes no body and verifies the stored
attempt. Fixed.

### 2.3 `POST /shipments/{id}/pay` changed response shape

It is now a `oneOf` keyed on `provider`. Any client reading `authorizationUrl`
unconditionally breaks on the Razorpay branch. Fixed — see §3.1 for the
follow-on problem.

### 2.4 `GET /shipments` became cursor-paginated

Response moved from a bare array to `{ data, meta.pagination }`. Fixed.

---

## 3. Design questions

### 3.1 Razorpay cannot be completed in a web browser

`InitializePaymentResponseData` for Razorpay returns `razorpayOrderId` +
`razorpayKeyId` and explicitly notes *"there is no hosted checkout URL for
Razorpay"*. That is fine for the Flutter app, which has the native SDK.

The **web app has no way to finish that payment.** Razorpay's browser checkout
requires loading their JavaScript SDK from `checkout.razorpay.com`, which our
Content-Security-Policy blocks, and opening it up is a security decision we did
not want to make unilaterally.

Right now an India-resolved user reaches a screen saying the payment must be
completed in the mobile app. **Is there a hosted checkout URL we could use
instead** (Razorpay Payment Links / Payment Pages)? One extra field on the
Razorpay branch — a `checkoutUrl` — would let the web flow work exactly like
Paystack's.

### 3.2 401 is used for "authenticated but not SUPERADMIN"

`suspend`, `reactivate`, `DELETE /logistics-companies/{id}` and
`PATCH /settings/countries/{code}` all document
`"401": "Caller is authenticated but not SUPERADMIN"`.

401 conventionally means *not authenticated*, and our client — reasonably —
treated it as an expired session: it cleared the cookie and sent the admin to
the login screen. So a plain ADMIN tapping "Suspend" got logged out.

We now special-case those specific calls, but the two states are genuinely
indistinguishable by status code. **Could these return 403 instead?** That would
let any client tell "your session died" apart from "you lack the rights" without
hard-coding which endpoints are privileged.

### 3.3 `x-user-id` is not proof of identity

The mobile spec notes that `x-user-id` is *"re-validated against the database on
every request, not blindly trusted"* — but as far as we can tell that validates
the id **exists**, not that the caller owns it. Anyone who learns another user's
UUID can send it and act as them: list their parcels, create shipments in their
name, and pay.

Our web client stores the id in an HttpOnly cookie **signed with an HMAC**, so a
visitor cannot edit their own cookie into someone else's identity. That protects
our users, but it is a frontend mitigation for a backend property — any other
client, or a direct `curl`, is unaffected.

Worth considering a real token (even a short-lived opaque one issued by
`/users/identify`) before launch.

### 3.4 Multi-country phone numbers

v1.1 says country is auto-detected from the dialling code, and India is
supported. Our validation was Nigeria-only, which would have blocked Indian
users at the identify step — fixed on our side.

**Which countries are actually live?** We currently accept any well-formed E.164
number and let the backend decide. If only NG and IN are supported it would be
better to reject others up front with a clear message rather than letting the
user get as far as payment.

---

## 4. Smaller observations

- **`GET /admin/overview` has no `totalCompanies` for a date range** — it
  respects `?range=` for the other totals. Is `totalCompanies` range-filtered
  too, or always all-time? The description says only *"excludes soft-deleted"*.
- **`DELETE /logistics-companies/{id}` takes a request body.** Some HTTP clients
  and proxies drop bodies on DELETE. It works for us, but a `POST .../delete`
  would be more portable.
- **`GET /shipments/{id}/company-address`** does exact-string matching against
  the uploaded address list. Since the listing form sends city names from a
  fixed gazetteer, this 404s unless the uploaded CSV uses byte-identical labels.
  Is fuzzy or case-insensitive matching planned?
- **`/shipments/{id}/mark-paid` is disabled in production** — noted, we do not
  call it. Mentioning it only because it means end-to-end payment cannot be
  exercised against production without a real charge.

---

## 5. What the web app does not use yet

So you know what is and is not exercised:

- `POST /users/push-token` — needs Firebase Cloud Messaging on our side.
- `GET /admin/logistics-companies/{id}` — the list rows carry enough for the
  current screen.
- `GET /admin/logistics-batches` — no screen for it yet.
- `PATCH /admin/vehicles/{id}` — no edit screen in the designs.

---

Happy to jump on a call about §1 and §3.1 — those two are what stand between
the web app and a complete flow.
