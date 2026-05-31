# SkyLab STEM Academy — Vercel Deployment

## Quick Deploy

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/skylab.git
git push -u origin main
```

### 2. Import into Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Vercel auto-detects Vite — no changes needed
4. Click **Deploy**

### 3. Add API Key (for SkyBot chatbot)
1. In Vercel → your project → **Settings → Environment Variables**
2. Add: `ANTHROPIC_API_KEY` = `your-api-key-here`
3. Redeploy

Get your API key at: https://console.anthropic.com

## Local Development
```bash
npm install
npm run dev
```

For local chatbot testing, create `.env.local`:
```
ANTHROPIC_API_KEY=your-key-here
```
Then use `vercel dev` instead of `npm run dev` to test the API routes locally.
