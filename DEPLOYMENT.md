# Deployment Guide

This guide covers deploying your backend API to various platforms.

## Prerequisites

1. PostgreSQL database (you can use free tiers from):
   - [Supabase](https://supabase.com) - Free PostgreSQL database
   - [Neon](https://neon.tech) - Serverless PostgreSQL
   - [Railway](https://railway.app) - PostgreSQL + hosting
   - [ElephantSQL](https://www.elephantsql.com) - Free tier available

2. Get your DATABASE_URL connection string

## Option 1: Railway (Recommended - Easiest)

Railway provides both database and hosting in one place.

### Steps:

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login:
```bash
railway login
```

3. Initialize project:
```bash
railway init
```

4. Add PostgreSQL:
```bash
railway add
# Select PostgreSQL
```

5. Deploy:
```bash
railway up
```

6. Set environment variables in Railway dashboard:
   - `NODE_ENV=production`
   - `LOG_LEVEL=info`
   - DATABASE_URL is automatically set

7. Your API will be live at the provided Railway URL!

## Option 2: Render

### Steps:

1. Push your code to GitHub

2. Go to [Render Dashboard](https://dashboard.render.com)

3. Click "New +" → "Web Service"

4. Connect your GitHub repository

5. Configure:
   - Name: backend-api
   - Environment: Node
   - Build Command: `npm install && npm run db:generate && npm run build`
   - Start Command: `npm run db:migrate && npm start`

6. Add environment variables:
   - `DATABASE_URL` (from your PostgreSQL provider)
   - `NODE_ENV=production`
   - `LOG_LEVEL=info`

7. Click "Create Web Service"

8. Render will auto-deploy from the `render.yaml` file!

## Option 3: Vercel

### Steps:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables:
```bash
vercel env add DATABASE_URL
vercel env add NODE_ENV production
vercel env add LOG_LEVEL info
```

4. Redeploy:
```bash
vercel --prod
```

Note: You'll need a separate PostgreSQL database (Supabase, Neon, etc.)

## Option 4: Docker + Any Cloud Provider

### Build and run locally:

```bash
docker build -t backend-api .
docker run -p 3000:3000 --env-file .env backend-api
```

### Deploy to cloud:

**AWS ECS, Google Cloud Run, Azure Container Instances:**

1. Build and push to container registry:
```bash
docker build -t your-registry/backend-api .
docker push your-registry/backend-api
```

2. Deploy using your cloud provider's container service

3. Set environment variables in cloud console

## Database Setup

After deployment, initialize your database:

```bash
# If using Railway
railway run npm run db:push

# If using Render (runs automatically via start command)
# No action needed

# If using Vercel or other platforms
# Run locally with production DATABASE_URL:
DATABASE_URL="your-production-url" npm run db:push
```

## Testing Your Deployment

```bash
# Replace YOUR_URL with your deployed URL

# Health check
curl https://YOUR_URL/health

# Create item
curl -X POST https://YOUR_URL/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","data":"Hello World"}'

# Get all items
curl https://YOUR_URL/api/items
```

## Monitoring and Logs

### Railway
```bash
railway logs
```

### Render
- View logs in Render dashboard
- Logs are automatically collected

### Vercel
```bash
vercel logs
```

## Troubleshooting

### Database Connection Errors

1. Check DATABASE_URL is correct
2. Ensure database allows connections from your hosting IP
3. Check logs for specific error messages

### Build Failures

1. Ensure all dependencies are in package.json
2. Check Node.js version matches (18+)
3. Run `npm run db:generate` before build

### Runtime Errors

1. Check environment variables are set
2. View application logs
3. Ensure database migrations ran successfully

## Cost Estimates

- **Railway**: Free tier available, ~$5/month for small apps
- **Render**: Free tier available (spins down after inactivity)
- **Vercel**: Free tier available, serverless pricing
- **Database**: Most providers offer free tiers (500MB-1GB)

## Security Checklist

- ✅ Environment variables set (not hardcoded)
- ✅ HTTPS enabled (automatic on most platforms)
- ✅ CORS configured properly
- ✅ Helmet security headers enabled
- ✅ Database connection string kept secret
- ✅ Error messages don't expose sensitive info

## Next Steps

1. Set up monitoring (e.g., Sentry, LogRocket)
2. Configure custom domain
3. Set up CI/CD pipeline
4. Add rate limiting for production
5. Set up database backups
