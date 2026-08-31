# MyKaggo — Live Intercity Parcel Tracking & Logistics Monorepo

MyKaggo is an intercity parcel tracking and logistics management platform in Nigeria. It connects parcel senders/receivers (Riders), Logistics Companies, and Drivers with live GPS device visibility and secure Paystack payments in Nigerian Naira (₦).

---

## 🏛️ Monorepo Architecture

Built using **PNPM Workspaces** and **Turborepo** with Next.js 16 (Turbopack), React 19, and Tailwind CSS 4.

```
kaggo/
├── apps/
│   ├── user-company/      # Port 3000 — Rider (Send & Track), Company & Vehicle Onboarding
│   └── admin/             # Port 3002 — Admin Operations, Rates & Fleet Console
├── packages/
│   ├── config/            # Shared TypeScript tsconfig presets (@kaggo/config)
│   ├── types/             # Shared TypeScript API models and domain entities (@kaggo/types)
│   ├── validation/        # Zod schemas, Nigerian phone & password strength checkers (@kaggo/validation)
│   ├── api/               # Shared HTTP fetch client & API endpoints (@kaggo/api)
│   └── ui/                # Shared Base UI & Tailwind CSS 4 design system (@kaggo/ui)
├── scripts/               # Test suites (Service Worker, Phone normalization, Password strength)
├── pnpm-workspace.yaml    # Workspace definition
├── turbo.json             # Turborepo task pipeline & caching
└── package.json           # Root scripts and workspace devDependencies
```

---

## 📱 Applications & Portals

| Application | Path | Default Port | Description |
| :--- | :--- | :--- | :--- |
| **User & Company** | `apps/user-company` | `3000` | Parcel listing, free-text route selection, Paystack (₦) checkout, live tracking, Logistics Company batch management, and free Vehicle Onboarding. |
| **Admin Operations** | `apps/admin` | `3002` | Admin console for rate settings, approving logistics companies, monitoring shipments, and revenue tracking. |

Each application is a fully configured **Progressive Web App (PWA)** with its own manifest, service worker offline fallback, Apple splash screens, and SEO metadata.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `>= 20.0.0`
- **PNPM**: `>= 10.0.0`

### Installation
```bash
# Clone the repository
git clone https://github.com/AamHermansyah/kaggo.git
cd kaggo

# Install all workspace dependencies
pnpm install
```

### Environment Configuration
Copy the `.env.example` template into each application or at the root:
```bash
cp .env.example .env.local
cp .env.example apps/user-company/.env.local
cp .env.example apps/admin/.env.local
```

Key environment variables:
```ini
API_BASE_URL=https://backend-production-6e6bd.up.railway.app
NEXT_PUBLIC_SITE_URL=http://localhost:3000
API_TIMEOUT_MS=15000
SESSION_SECRET=your_32_char_random_session_secret_key

# Customer Support
NEXT_PUBLIC_SUPPORT_EMAIL=support@mykaggo.com
NEXT_PUBLIC_SUPPORT_WHATSAPP=https://wa.me/message/YZMUE44CZHKTN1
```

---

## 💻 Development Commands

```bash
# Start both applications simultaneously in development mode
pnpm dev

# Start specific applications individually:
pnpm dev:user-company   # Runs on http://localhost:3000
pnpm dev:admin          # Runs on http://localhost:3002
```

---

## 🏗️ Production Build

```bash
# Build both applications in parallel with Turborepo caching
pnpm build

# Build individual applications:
pnpm build:user-company
pnpm build:admin

# Start production server for a specific application:
pnpm start:user-company
pnpm start:admin
```

---

## 🧪 Testing & Verification

```bash
# Type check all packages and apps
pnpm typecheck

# Run offline Service Worker decision tree checks (13 assertions)
pnpm sw:check

# Run Nigeria & International phone number normalization tests (28 assertions)
pnpm phone:check

# Run password entropy and monotonicity tests (24 assertions)
pnpm password:check

# Run linter
pnpm lint
```

---

## ☁️ Deployment on Vercel

To deploy on Vercel, create **2 separate projects** linked to the same repository:

1. **User & Company (`kaggo-user-company`)**:
   - **Root Directory**: `apps/user-company`
   - **Include files outside Root Directory**: `Checked (ON)`
   - **Domain**: `mykaggo.com` (or `mykaggo.vercel.app`)

2. **Admin Console (`kaggo-admin`)**:
   - **Root Directory**: `apps/admin`
   - **Include files outside Root Directory**: `Checked (ON)`
   - **Domain**: `admin.mykaggo.com` (or `mykaggo-admin.vercel.app`)

---

## 📄 License

Proprietary — Rovasoft Tech Solutions Ltd / MyKaggo. All rights reserved.
