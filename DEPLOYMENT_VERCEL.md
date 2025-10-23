# Deployment Guide - Vercel Frontend

## Quick Deploy

1. **Build and test locally:**

   ```bash
   cd smartdocrag-ui
   npm run build
   npm run preview
   ```

2. **Deploy to Vercel:**

   ```bash
   # Install Vercel CLI (if not installed)
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Deploy
   vercel --prod
   ```

## Environment Variables Setup (IMPORTANT)

**After deployment, you MUST configure the environment variable in Vercel dashboard:**

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:

   - **Name:** `VITE_API_URL`
   - **Value:** Your backend URL (e.g., `https://your-app.onrender.com`)
   - **Environment:** Production (and Preview if needed)

4. **Redeploy** after adding the environment variable

## Manual Deployment Steps

1. **Connect GitHub repository to Vercel**
2. **Set framework preset:** Vite
3. **Set build command:** `npm run build`
4. **Set output directory:** `dist`
5. **⚠️ IMPORTANT: Add environment variables in dashboard (see above)**
6. **Redeploy to apply environment variables**

## Environment Variable Configuration

The app uses `VITE_API_URL` to connect to your backend:

- **Development:** Defaults to `http://localhost:3000`
- **Production:** Uses `VITE_API_URL` from Vercel environment variables
- **Fallback:** If not set, defaults to localhost (will cause CORS errors in production)

## Local Development

```bash
# Development server
npm run dev

# Production preview
npm run preview:production
```

## File Structure

```
smartdocrag-ui/
├── vercel.json          # Vercel configuration (simplified)
├── vite.config.js       # Vite configuration
├── .env.local           # Local environment variables
├── .env.production      # Production environment template
└── dist/                # Build output (created by npm run build)
```

## Verification

After deployment and environment variable setup:

1. Check if frontend loads correctly
2. Verify API calls to backend work (check Network tab)
3. Test document upload and chat functionality
4. Check browser console for any errors

## Troubleshooting

- **"Environment Variable references Secret which does not exist":**

  - Use Vercel dashboard to set environment variables, not vercel.json
  - Redeploy after adding variables

- **CORS errors:**

  - Ensure backend CORS is configured for your Vercel domain
  - Check that VITE_API_URL is correctly set

- **API not found (404 errors):**

  - Verify VITE_API_URL environment variable in Vercel dashboard
  - Check backend URL is accessible

- **Build failures:**
  - Check Node.js version compatibility (18+)
  - Ensure all dependencies are installed
