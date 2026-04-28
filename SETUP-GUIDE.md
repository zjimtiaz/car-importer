# Car Importers — Setup & Deployment Guide

## What's Included

This is a **Next.js 16** headless frontend that connects to your existing WordPress site (with VEHICA theme) as a backend. WordPress manages all your car listings, blog posts, and content — this frontend displays it beautifully.

---

## Prerequisites

- **Node.js 18+** installed ([download](https://nodejs.org/))
- **pnpm** package manager (`npm install -g pnpm`)
- Your WordPress site running with VEHICA theme (e.g. `https://carimporters.co.uk`)
- A **Vercel** account ([vercel.com](https://vercel.com))

---

## Step 1: Extract the ZIP

Unzip the project folder to your desired location.

---

## Step 2: Install Dependencies

Open a terminal in the project folder and run:

```bash
pnpm install
```

---

## Step 3: Environment Variables

Create a `.env.local` file in the project root with:

```env
WORDPRESS_URL=https://carimporters.co.uk
WORDPRESS_HOSTNAME=carimporters.co.uk
WORDPRESS_WEBHOOK_SECRET=your-secret-key-here
```

- **WORDPRESS_URL** — Your full WordPress site URL (no trailing slash)
- **WORDPRESS_HOSTNAME** — Just the domain (used for image optimization)
- **WORDPRESS_WEBHOOK_SECRET** — A secret key for webhook revalidation (you choose any secure string)

---

## Step 4: Test Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site running locally.

---

## Step 5: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Push the code to a **GitHub repository** (public or private)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Click **"Import Git Repository"** and select your repo
4. Vercel will auto-detect it as a Next.js project
5. Add your **Environment Variables** (same as `.env.local` above):
   - `WORDPRESS_URL` = `https://carimporters.co.uk`
   - `WORDPRESS_HOSTNAME` = `carimporters.co.uk`
   - `WORDPRESS_WEBHOOK_SECRET` = your chosen secret
6. Click **Deploy**
7. Done! Vercel gives you a URL like `your-project.vercel.app`

### Option B: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts. Add environment variables when asked or via the Vercel dashboard after deployment.

---

## Step 6: Custom Domain

1. In Vercel dashboard, go to your project → **Settings → Domains**
2. Add your domain (e.g. `www.carimporters.co.uk`)
3. Vercel will provide DNS records to add at your domain registrar
4. Once DNS propagates, your site will be live on your domain with free SSL

---

## Step 7: Set Up Webhook (Auto-Update Content)

When you add/edit a car listing or blog post in WordPress, the frontend needs to know. Set up a webhook:

1. Install the **WP Webhooks** plugin in WordPress (or similar)
2. Create a webhook that fires on post/page create/update/delete
3. Set the webhook URL to: `https://your-domain.com/api/revalidate`
4. Add a custom header: `x-webhook-secret: your-secret-key-here` (same secret as your env variable)
5. Now when you update content in WordPress, the frontend refreshes automatically within 60 seconds

---

## Project Structure (Key Files)

```
├── app/                    # Pages and routes
│   ├── page.tsx            # Home page
│   ├── vehicles/           # Vehicle listings + detail pages
│   ├── import-news/        # Blog/news pages
│   ├── contact/            # Contact page
│   ├── about/              # About page
│   └── faq/                # FAQ page
├── components/             # Reusable components
│   ├── home/               # Home page sections
│   ├── cars/               # Vehicle cards, gallery, specs
│   ├── posts/              # Blog post cards, sidebar
│   ├── layout/             # Nav, footer
│   └── ui/                 # Base UI components (shadcn/ui)
├── lib/
│   ├── vehica.ts           # VEHICA API client (car data)
│   ├── wordpress.ts        # WordPress API client (blog data)
│   └── vehica-types.ts     # TypeScript types
├── menu.config.ts          # Navigation menu links
├── site.config.ts          # Site name, domain, description
└── next.config.ts          # Next.js configuration
```

---

## How to Update

### Change Menu Links
Edit `menu.config.ts` — the mega dropdown links are in `components/layout/nav.tsx`.

### Change Site Name / Domain
Edit `site.config.ts`.

### Change Home Page Sections
Each section is a separate component in `components/home/`. You can reorder them in `app/page.tsx`.

### Add New Pages
Create a new folder in `app/` (e.g. `app/services/page.tsx`).

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Images not loading | Check `WORDPRESS_HOSTNAME` matches your WP domain. Check `next.config.ts` → `remotePatterns`. |
| No cars showing | Verify `WORDPRESS_URL` is correct and the VEHICA API is accessible at `/wp-json/vehica/v1/cars` |
| Content not updating | Check webhook is configured. Content also refreshes every 60 seconds automatically. |
| Build fails on Vercel | Ensure all 3 environment variables are set in Vercel dashboard |

---

## Support

If you need any changes or run into issues, don't hesitate to reach out!
