# 🚀 Minimal Backend API

Production-ready backend API with database integration, comprehensive logging, and deployment support.

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure database (edit .env file)
DATABASE_URL="postgresql://user:pass@host:5432/db"

# 3. Setup database
npm run db:generate
npm run db:push

# 4. Start server
npm run dev

# 5. Test it
curl http://localhost:3000/health
```

**✅ That's it! Your API is running!**

👉 **New here? Start with [START_HERE.md](START_HERE.md)**

---

# 📚 Complete Documentation

- **[START_HERE.md](START_HERE.md)** - Choose your path (Quick Start, Setup, or Deploy)
- **[INDEX.md](INDEX.md)** - Complete documentation index
- **[QUICKSTART.md](QUICKSTART.md)** - Detailed 5-minute setup
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to production
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Fix any issues
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - How it works
- **[LOGS_EXAMPLE.md](LOGS_EXAMPLE.md)** - Understanding logs
- **[CHECKLIST.md](CHECKLIST.md)** - Verify everything
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - What you have

---

## Features

- ✅ GET and POST endpoints
- ✅ PostgreSQL database with Prisma ORM
- ✅ Comprehensive logging with Winston
- ✅ Error handling and validation
- ✅ Security headers with Helmet
- ✅ CORS enabled
- ✅ Health check endpoint
- ✅ Production-ready deployment configuration

## API Endpoints

### Health Check
```
GET /health
```

### Items API

**Get all items**
```
GET /api/items
```

**Get single item**
```
GET /api/items/:id
```

**Create new item**
```
POST /api/items
Content-Type: application/json

{
  "name": "Item name",
  "data": "Optional data"
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
```

### 3. Setup Database
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
npm start
```

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Railway Deployment

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login and deploy:
```bash
railway login
railway init
railway up
```

### Render Deployment

1. Create `render.yaml` (already included)
2. Connect your GitHub repo to Render
3. Render will auto-deploy

### Docker Deployment

```bash
docker build -t backend-api .
docker run -p 3000:3000 --env-file .env backend-api
```

## Debugging

All logs are stored in the `logs/` directory:
- `error.log` - Error logs only
- `combined.log` - All logs

Console logs show:
- 📥 Incoming requests with full details
- 📤 Response status and duration
- 🔍 Database queries (in development)
- ✅ Success operations
- ❌ Errors with stack traces
- ⚠️ Warnings

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (required)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level (debug/info/warn/error)

## Testing the API

```bash
# Health check
curl http://localhost:3000/health

# Create item
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","data":"Some data"}'

# Get all items
curl http://localhost:3000/api/items

# Get single item
curl http://localhost:3000/api/items/1
```

## Troubleshooting

### Database Connection Issues
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check logs in `logs/error.log`

### Port Already in Use
- Change PORT in .env file
- Kill process using the port

### Build Errors
- Run `npm run db:generate` first
- Check TypeScript errors: `npx tsc --noEmit`

## Project Structure

```
├── src/
│   ├── config/
│   │   ├── database.ts      # Database connection
│   │   └── logger.ts        # Winston logger setup
│   ├── middleware/
│   │   ├── errorHandler.ts  # Error handling
│   │   └── requestLogger.ts # Request logging
│   ├── routes/
│   │   └── items.ts         # API routes
│   └── index.ts             # Server entry point
├── prisma/
│   └── schema.prisma        # Database schema
├── logs/                    # Log files
├── .env                     # Environment variables
└── package.json
```
