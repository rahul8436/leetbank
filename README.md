# LeetBank

Your interview problem bank — a fast, mobile-first, fully static web app over **285 company-tagged coding interview problems**, each with a strategy, worked examples, complexity analysis, and full solutions in Python, C++, Java, and JavaScript.

Built with **Next.js 14 (App Router)** + **Tailwind CSS**. Every page is pre-rendered at build time (SSG) — no server, no database. Progress and identity live in the browser (`localStorage`), so the whole thing deploys as static files.

## Features

- 🔎 **Instant search + filters** — by title / company / number, difficulty, company, and your own progress (Solved / Unsolved / Starred)
- 🏦 **Companies browser** — every company with a dedicated page listing its problems + difficulty breakdown
- 👤 **Username identity** — no password/email; just a name that tags your progress on the device (guest progress migrates in when you name yourself)
- ✅ **Progress tracking** — mark problems Solved / Attempting / Saved; a personal **Dashboard** with stats and completion bars by difficulty
- 🌗 **Light / dark theme** with no flash of the wrong theme on load
- 🎲 **Random problem** button and **keyboard shortcuts** — `/` focus search, `r` random, `←/→` prev/next problem
- 💻 **Solution viewer** — language tabs, syntax highlighting, copy button, and a "reveal" gate so you can attempt first
- 📱 **Mobile-first** — bottom tab bar, sticky search, wrapping controls, 44px touch targets

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Deploy to Vercel

**Fastest (no GitHub needed):**

```bash
npx vercel          # first run: log in + link → preview URL
npx vercel --prod   # your live production URL
```

**Or via GitHub:** `git init && git add -A && git commit -m "LeetBank"`, push to a repo, then import at [vercel.com/new](https://vercel.com/new) (Next.js is auto-detected).

## Updating the data

All content lives in [`data/problems.json`](./data/problems.json). Replace it and rebuild — routes, filters, companies, and pages regenerate from the file. Solution scaffold markers (`[PROVIDED]` / `[USER]` / `[COMMENT]`) are stripped at render time by `lib/utils.ts`.

## Structure

```
app/
  layout.tsx                 # shell: theme bootstrap, header, providers
  page.tsx                   # home: hero + searchable browser
  problems/[slug]/page.tsx   # 285 static problem pages
  companies/page.tsx         # company index
  companies/[slug]/page.tsx  # per-company pages
  dashboard/page.tsx         # personal progress dashboard
components/
  SiteHeader, ProblemBrowser, ProblemList, ProblemActions,
  Solutions, Examples, Markdown, DifficultyBadge,
  CompaniesBrowser, Dashboard, UsernameModal, KeyboardNav
lib/
  store.tsx                  # client context: theme + username + progress (localStorage)
  problems.ts                # loads JSON, builds index/companies/neighbors
  utils.ts, types.ts
data/problems.json           # the 285 problems
```

Everything is client-side and private to the visitor's browser — there's no backend collecting anything.
