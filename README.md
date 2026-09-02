# LIKEM Perfumes — Ghanaian Social-Commerce & E-Commerce Platform

A production-ready, database-backed social-commerce and e-commerce web platform for an independent Ghanaian perfume seller marketing through WhatsApp Status and social media.

---

## 1. Features Overview

- **Zero-Dummy Data**: The database contains only verified media imported from `Desktop/LIKEM/MEDIA/`. Incomplete items are flagged in a **Product Completion Dashboard** until the seller enters actual Ghana Cedi prices and physical stock counts.
- **Ghana-First Experience**: Default currency is **Ghana Cedis (GH₵ / GHS)** with decimal precision, integrated Ghana regional shipping tables (Accra, Kumasi, Tema, Western, Northern, etc.), and phone normalization for Ghana numbers (`+233`).
- **No Physical Shop Fabrication**: Honest local business messaging stating direct delivery across Accra and nationwide without false walk-in retail claims.
- **Dual Order Flow**:
  - **Mode A (WhatsApp Ordering)**: Click-to-chat links with prefilled product names, bottle sizes, and GH₵ prices.
  - **Mode B (Website Cart & Checkout)**: Server-side calculated checkout with Paystack Ghana integration (Mobile Money: MTN MoMo, Telecel Cash, AT Money, and Cards). Toggleable on/off by the owner in Admin Settings.
- **WhatsApp Sale Recorder**: The seller can record orders agreed on WhatsApp into the admin database, deducting inventory and keeping audit logs.
- **Media Library**: Photos imported with SHA256 deduplication and JPEG dimension parsing into managed application storage.
- **Owner Admin Portal**: First-run setup wizard, product price editor, catalog management, media manager, order tracker, and store settings.

---

## 2. Environment Setup

Create `.env` based on `.env.example`:

```env
DATABASE_URL="postgresql://postgres@localhost:5432/likem_perfume?schema=public"
AUTH_SECRET="your-secure-32-char-secret-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Paystack Ghana (Optional - for online card/MoMo payments)
PAYSTACK_SECRET_KEY=""
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=""

# Email Notifications (Optional - Resend)
RESEND_API_KEY=""
STORE_ALERT_EMAIL=""
```

---

## 3. Database & Media Import

1. Push the Prisma schema to PostgreSQL:
```bash
npm run prisma:push
```

2. Run the media import script to process images from `Desktop/LIKEM/MEDIA/`:
```bash
npm run import
```

3. Start development server:
```bash
npm run dev
```

---

## 4. Admin Credentials & Access

- **Portal URL**: `http://localhost:3000/admin/login`
- **Default Email**: `admin@likem.com`
- **Default Password**: `AdminLikem2026!`
*(Owner can change credentials and contact numbers in the Admin Settings tab)*

---

## 5. Deployment Options

- **Vercel / Railway / Render**: Deploy the Next.js App Router repository.
- **PostgreSQL**: Supabase, Neon, or Railway PostgreSQL.
- **Paystack**: Configure live keys in Paystack Dashboard and set the Webhook URL to `https://yourdomain.com/api/payments/paystack-webhook`.
