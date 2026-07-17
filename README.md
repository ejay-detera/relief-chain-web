Relief Chain Web is the Next.js 16 (App Router) Super Admin dashboard for reviewing organization
registrations submitted through the Relief Chain mobile app. It shares one Supabase project with
that app.

## Getting Started

Copy `.env.example` to `.env` and fill in your Supabase project's URL and anon/publishable key:

```bash
cp .env.example .env
```

Then run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser. The public landing page is
at `/`; the Super Admin dashboard is behind `/login`.

## Testing

```bash
npm run test
```

## Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket and import it into a new Vercel project (or run
   `vercel` from the CLI). Vercel auto-detects Next.js — no custom build command is required.
2. In the Vercel project's **Settings → Environment Variables**, add:
   - `SUPABASE_URL` — your Supabase project URL
   - `SUPABASE_ANON_KEY` — your Supabase anon/publishable key
   Set these for the Production, Preview, and Development environments as needed.
3. Deploy. `npm run build` / `next build` is run automatically by Vercel.

### Database migrations

This app reads from and writes to tables, RLS policies, and triggers defined in the `relief-chain`
mobile app's `supabase/migrations` folder (a shared Supabase project). Before pointing a deployment
at a new Supabase project, apply all of those migrations first — the dashboard will throw a runtime
error on any table/policy that hasn't been created yet.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
