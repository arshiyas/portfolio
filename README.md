# Portfolio

Personal portfolio site for Arshiya Sayyed.

## Preview (static)

```bash
cd preview && python3 -m http.server 3456
```

Open http://localhost:3456

## App (Next.js)

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

### Option A: Vercel CLI (fastest)

From the `web` directory:

```bash
cd web
npx vercel login          # one-time, opens browser to authenticate
npx vercel                # preview deploy
npx vercel --prod         # production URL
```

### Option B: GitHub + Vercel dashboard

1. Push this repo to GitHub (the `web` folder is the Next.js app).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Set **Root Directory** to `web` if the repo root is `portfolio/`, or leave blank if the repo root is `web/`.
4. Click Deploy. Vercel auto-detects Next.js.

Every push to `main` redeploys automatically.

### Custom domain

In the Vercel project → **Settings → Domains**, add your domain and follow the DNS instructions.
