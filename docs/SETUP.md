# Car Importers — Setup Guide

## Prerequisites

- Node.js 18+
- WordPress site with VEHICA theme (carimporters.co.uk)
- Vercel account (for deployment)

---

## WordPress Plugin Setup (For George)

### Step 1: JWT Authentication Plugin (enables login/register)

1. Go to **WordPress Admin → Plugins → Add New**
2. Search for **"JWT Authentication for WP REST API"** by Useful Team
3. Click **Install Now** → then **Activate**
4. Open your `wp-config.php` file (via File Manager or FTP)
5. Add these lines **BEFORE** the line that says `/* That's all, stop editing! */`:

```php
/** JWT Auth Secret Key — used to sign authentication tokens */
define('JWT_AUTH_SECRET_KEY', 'car-importers-jwt-secret-2024-george');
define('JWT_AUTH_CORS_ENABLE', true);
```

6. Save the file

**How to verify it works:**
- Visit: `https://carimporters.co.uk/wp-json/jwt-auth/v1/token`
- You should see a JSON response (not a 404 error)

### Step 2: ISR Revalidation (auto-updates frontend when you edit cars)

1. Go to **WordPress Admin → Plugins → Add New → Upload Plugin**
2. Download the plugin from: https://github.com/developer-developer/next-revalidate
3. Upload the ZIP file and activate
4. Go to **Settings → Next Revalidate**
5. Set these values:
   - **Webhook URL:** `https://car-importers.vercel.app/api/revalidate`
   - **Webhook Secret:** `car-importers-revalidate-2024`
   - **Content Types:** Check `vehica_car` and `post`
6. Save

**How to verify it works:**
- Edit any car listing in WordPress and click Update
- Wait 10 seconds, then refresh the frontend — the change should appear

### Step 3: CORS Headers (allows frontend to talk to WordPress)

Add these lines to your `wp-config.php` (same file as Step 1):

```php
/** Allow Next.js frontend to access WordPress REST API */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
```

### Step 4: Newsletter (Optional — Mailchimp)

If George wants the newsletter signup to work with Mailchimp:

1. Log in to Mailchimp → **Account → Extras → API Keys**
2. Create a new API key and copy it
3. Go to **Audience → Settings → Audience name and defaults** → copy the **Audience ID**
4. Add these environment variables in Vercel:
   - `MAILCHIMP_API_KEY` = your API key (e.g. `abc123-us14`)
   - `MAILCHIMP_LIST_ID` = your Audience ID

Without Mailchimp configured, the newsletter still works — emails are logged on the server for manual follow-up.

---

## Environment Variables

| Variable | Description | Value |
|----------|-------------|-------|
| `WORDPRESS_URL` | Full WordPress URL | `https://carimporters.co.uk` |
| `WORDPRESS_HOSTNAME` | WP hostname (for images) | `carimporters.co.uk` |
| `WORDPRESS_WEBHOOK_SECRET` | ISR revalidation secret | `car-importers-revalidate-2024` |
| `MAILCHIMP_API_KEY` | Mailchimp API key (optional) | `abc123def-us14` |
| `MAILCHIMP_LIST_ID` | Mailchimp audience ID (optional) | `abc123def` |

---

## Local Development

```bash
# Clone the repo
git clone <repo-url>
cd car-importers-nextjs

# Install dependencies
npm install

# Create .env.local (copy from .env.example)
cp .env.example .env.local
# Edit .env.local with your values

# Start dev server
npm run dev
# → http://localhost:3000
```

---

## Project Structure

```
app/
├── page.tsx              → Homepage (hero, featured, body types, calculator, blog, CTA)
├── cars/
│   ├── page.tsx          → Vehicle listings with 10 filters
│   └── [slug]/page.tsx   → Vehicle detail (gallery + lightbox, tabs, enquiry form)
├── posts/                → Blog (restyled with breadcrumbs, JSON-LD)
├── about/page.tsx        → About page (WP content or fallback)
├── contact/page.tsx      → Contact form → CF7 proxy
├── faq/page.tsx          → FAQ with JSON-LD FAQPage schema
├── auth/                 → Login, Register, Forgot Password
├── dashboard/            → Protected user area
└── api/
    ├── auth/route.ts     → JWT auth endpoints
    ├── contact/route.ts  → CF7 form proxy
    ├── newsletter/route.ts → Mailchimp newsletter signup
    └── revalidate/route.ts → ISR webhook

lib/
├── vehica.ts            → VEHICA API client (getVehicaCars, parseCar, taxonomies)
├── vehica-types.ts      → TypeScript types for VEHICA data
├── auth.ts              → JWT authentication helpers
├── wordpress.ts         → WP REST API client (posts, pages, etc.)
└── wordpress.d.ts       → WP TypeScript types

components/
├── cars/                → VehicleCard, VehicleGrid, VehicleGallery (with lightbox), VehicleSpecs, EnquiryForm
├── filters/             → FilterSidebar (desktop + mobile drawer)
├── home/                → Hero, QuickSearch, FeaturedVehicles, BodyTypes, BrandLogos, LoanCalculator, Services, CTA
├── auth/                → UserMenu
└── layout/              → Nav, Footer, NewsletterForm
```

---

## VEHICA API Reference

Cars are fetched from `/vehica/v1/cars`. Each car has an `attributes[]` array with these IDs:

| ID | Attribute | Type | Value Format |
|----|-----------|------|-------------|
| 6659 | Make | taxonomy | `[{ name, slug, ... }]` |
| 6660 | Model | taxonomy | `[{ name, slug, ... }]` |
| 6655 | Body Type | taxonomy | `[{ name, slug, ... }]` |
| 6656 | Price | price | `{ currency_key: number }` |
| 6663 | Fuel Type | taxonomy | `[{ name, slug, ... }]` |
| 6662 | Transmission | taxonomy | `[{ name, slug, ... }]` |
| 6661 | Drive Type | taxonomy | `[{ name, slug, ... }]` |
| 6665 | Engine Size | number | `3.8` (displayValue: `"3.8L"`) |
| 6666 | Color | taxonomy | `[{ name, slug, ... }]` |
| 14696 | Year | number | `2021` |
| 6654 | Condition | taxonomy | `[{ name, slug, ... }]` |
| 12770 | Doors | taxonomy | `[{ name, slug, ... }]` |
| 6664 | Mileage | number | `"15000"` (displayValue: `"15000 miles"`) |
| 6673 | Gallery | gallery | `images: [{ url, thumb }]` |
| 16721 | Location | location | `{ address, position: { lat, lng } }` |
| 6674 | Video | embed | `{ url, embed }` |

Taxonomy filter dropdowns use `/wp/v2/vehica_XXXX` where XXXX is the attribute ID.

---

## Vercel Deployment

1. Push to GitHub
2. Import in Vercel → connect repo
3. Add environment variables (same as `.env.local`)
4. Deploy

ISR revalidation: when a car is edited in WP admin, the Next Revalidate plugin sends a webhook to `/api/revalidate`, which clears the cache tag `vehica-cars`.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Images not loading | Check `WORDPRESS_HOSTNAME` matches the WP media domain |
| Cars not showing | Verify `/vehica/v1/cars` returns data at your WP URL |
| Auth not working | Ensure JWT Auth plugin is active and `JWT_AUTH_SECRET_KEY` is set in wp-config.php |
| Filters empty | Check taxonomy endpoints like `/wp/v2/vehica_6659` return terms |
| Newsletter not saving to Mailchimp | Add `MAILCHIMP_API_KEY` and `MAILCHIMP_LIST_ID` env vars in Vercel |
| Changes not appearing on frontend | Install the Next Revalidate plugin and configure webhook URL |
