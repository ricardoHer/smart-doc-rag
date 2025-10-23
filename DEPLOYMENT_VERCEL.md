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

## Environment Variables

In Vercel dashboard, set the following environment variable:

- `VITE_API_URL`: Your backend URL (e.g., `https://your-app.onrender.com`)

## Manual Deployment Steps

1. **Connect GitHub repository to Vercel**
2. **Set framework preset:** Vite
3. **Set build command:** `npm run build`
4. **Set output directory:** `dist`
5. **Add environment variables in dashboard**

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
├── vercel.json          # Vercel configuration
├── vite.config.js       # Vite configuration
├── .env.local           # Local environment variables
├── .env.production      # Production environment template
└── dist/                # Build output (created by npm run build)
```

## Verification

After deployment:

1. Check if frontend loads correctly
2. Verify API calls to backend work
3. Test document upload and chat functionality
4. Check browser console for any errors

## Troubleshooting

- **CORS errors:** Ensure backend CORS is configured for your Vercel domain
- **API not found:** Check VITE_API_URL environment variable
- **Build failures:** Check Node.js version compatibility (18+)
