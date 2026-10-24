# GlowHacks

Free, private, browser-based tools for skincare, fashion, design, wellness and everyday life.
Built with Next.js 14 (App Router), TypeScript, Tailwind CSS and lucide-react.

## Run locally

```bash
npm install
npm run dev
```

## Deploy (GitHub -> Vercel)

1. Push this folder to a new GitHub repository.
2. On vercel.com choose **Add New -> Project**, import the repo, keep the defaults, click **Deploy**.
3. (Optional) Add the env var `NEXT_PUBLIC_SITE_URL` = your final domain (used for sitemap/SEO).

## Before applying to AdSense

- Replace the placeholder email in `src/lib/site.ts`.
- Review the About and Privacy pages.

## Adding a new tool

1. Create `src/components/tools/MyTool.tsx` (with `"use client"`).
2. Register it in `src/components/tools/index.ts` (slug -> component).
   The slug must match an entry in `src/lib/toolsData.ts`. Set that entry's `ready: true`.
