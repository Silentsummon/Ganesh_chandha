# Chandha Management

Vite + React app for Lakshmi Narasima Swamy Youth Association, backed by
Supabase, with CSV/PDF export on the list screen.

## 1. Prerequisites (Arch Linux)

```bash
sudo pacman -S nodejs npm git
node -v   # confirm Node 18+
```

## 2. Get the project onto your machine

Unzip the project you downloaded, then:

```bash
cd chandha-management
npm install
```

## 3. Create the Supabase project

1. Go to https://supabase.com and create a free account/project.
2. In the project dashboard, open **SQL Editor -> New query**, paste the
   contents of `supabase/schema.sql`, and run it. This creates the
   `chandhas` table and the read/insert policies.
3. Go to **Project Settings -> API** and copy the **Project URL** and the
   **anon public key**.

## 4. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 5. Run it locally

```bash
npm run dev
```

Open the URL it prints (usually http://localhost:5173).

## 6. Build for production

```bash
npm run build
npm run preview   # sanity-check the production build locally
```

## 7. Deploy (Vercel)

```bash
npm install -g vercel
vercel login
vercel
```

When prompted, set the same two environment variables
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the Vercel project
settings, or run:

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel --prod
```

Alternative hosts, same build command (`npm run build`, output in `dist/`):

- **Netlify**: `npm install -g netlify-cli && netlify deploy --prod`
- **Cloudflare Pages**: connect the GitHub repo in the dashboard, set build
  command `npm run build`, output directory `dist`

## 8. Push to GitHub (recommended, enables auto-deploy)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/chandha-management.git
git push -u origin main
```

Then connect the repo in Vercel/Netlify's dashboard for automatic deploys
on every push.

## Project structure

```
chandha-management/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── supabase/
│   └── schema.sql          -- run this in the Supabase SQL editor
├── public/
│   └── logo.webp            -- association crest, used as watermark + badge
└── src/
    ├── main.jsx
    ├── App.jsx               -- screen routing + Supabase data fetching
    ├── index.css
    ├── theme.js              -- shared colors/style tokens
    ├── lib/
    │   └── supabaseClient.js
    ├── utils/
    │   └── export.js         -- CSV and PDF export functions
    ├── components/
    │   └── Logo.jsx          -- watermark + crest badge
    └── screens/
        ├── Home.jsx
        ├── AddChandha.jsx
        └── ChandhaList.jsx
```
# Ganesh_chandha
