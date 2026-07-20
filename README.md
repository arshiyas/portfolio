# Portfolio

Personal portfolio site for Arshiya Sayyed.

## Preview (static)

```bash
cd preview && python3 -m http.server 3456
```

Open http://localhost:3456

## App (TanStack Start)

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

The app uses TanStack Start with Nitro. Keep **Root Directory** set to `web`.

### Option A: Vercel CLI

```bash
cd web
npx vercel login
npx vercel
npx vercel --prod
```

### Option B: GitHub + Vercel dashboard

1. Push this repo to GitHub.
2. Import at [vercel.com/new](https://vercel.com/new).
3. Set **Root Directory** to `web`.
4. Deploy. Vercel picks up the Nitro/Start build via `web/vercel.json`.

`web-next/` is an archived copy of the previous Next.js app (rollback only). Do not deploy it.

### Custom domain

In the Vercel project → **Settings → Domains**, add your domain and follow the DNS instructions.
