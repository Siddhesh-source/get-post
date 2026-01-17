# Troubleshooting Guide

Complete guide to debug and resolve any issues with your backend API.

## Installation Issues

### Error: "npm install fails"

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json  # Mac/Linux
rmdir /s /q node_modules & del package-lock.json  # Windows

# Reinstall
npm install
```

### Error: "Cannot find module 'express'"

**Cause:** Dependencies not installed

**Solution:**
```bash
npm install
```

### Error: "Prisma Client not generated"

**Solution:**
```bash
npm run db:generate
```

## Database Issues

### Error: "Can't reach database server"

**Debugging Steps:**

1. Check DATABASE_URL format:
```env
# Correct format:
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# Example:
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/mydb?schema=public"
```

2. Test database connection:
```bash
# Install psql client and test
psql "postgresql://username:password@host:port/database"
```

3. Check logs:
```bash
# Look for connection errors
cat logs/error.log  # Mac/Linux
type logs\error.log  # Windows
```

4. Common fixes:
   - Ensure PostgreSQL is running
   - Check firewall allows connections
   - Verify username/password are correct
   - Check host and port are correct

### Error: "SSL connection required"

**Solution:** Add SSL to DATABASE_URL:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public&sslmode=require"
```

### Error: "Database does not exist"

**Solution:**
```bash
# Create database first
createdb mydb  # Mac/Linux
# Or use PostgreSQL client to create database

# Then run:
npm run db:push
```

### Error: "Migration failed"

**Solution:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or push schema again
npm run db:push
```

## Server Issues

### Error: "Port 3000 already in use"

**Solution 1:** Change port in .env:
```env
PORT=3001
```

**Solution 2:** Kill process using port:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Error: "Cannot find module './config/database'"

**Cause:** TypeScript not compiled

**Solution:**
```bash
# For development (auto-compile)
npm run dev

# For production
npm run build
npm start
```

### Server starts but no logs appear

**Check:**
1. LOG_LEVEL in .env (set to 'debug' for all logs)
2. logs/ directory exists
3. Console output is visible

## API Request Issues

### Error: "404 Not Found"

**Check:**
1. Server is running: `curl http://localhost:3000/health`
2. Correct endpoint: `/api/items` not `/items`
3. Correct method: GET or POST

### Error: "400 Bad Request"

**Cause:** Missing required fields

**Solution:** Include all required fields:
```bash
# Correct POST request
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Item Name","data":"Optional data"}'

# name is required, data is optional
```

### Error: "500 Internal Server Error"

**Debugging:**
1. Check server logs in console
2. Check `logs/error.log`
3. Look for stack traces

**Common causes:**
- Database connection failed
- Invalid data format
- Missing environment variables

### CORS Errors in Browser

**Solution:** CORS is already enabled, but if issues persist:

Update `src/index.ts`:
```typescript
app.use(cors({
  origin: 'http://localhost:3001', // Your frontend URL
  credentials: true
}));
```

## Build Issues

### Error: "tsc: command not found"

**Solution:**
```bash
npm install -g typescript
# Or use npx
npx tsc
```

### TypeScript compilation errors

**Solution:**
```bash
# Check for errors
npx tsc --noEmit

# Common fix: regenerate Prisma Client
npm run db:generate
```

## Deployment Issues

### Vercel: "Build failed"

**Check:**
1. All dependencies in package.json
2. Build command is correct
3. DATABASE_URL environment variable is set

**Solution:**
```bash
# Test build locally
npm run build

# Check vercel logs
vercel logs
```

### Railway: "Application failed to start"

**Check:**
1. DATABASE_URL is set (auto-set if using Railway PostgreSQL)
2. Start command is correct: `npm start`
3. Build completed successfully

**Solution:**
```bash
# View logs
railway logs

# Redeploy
railway up
```

### Render: "Deploy failed"

**Check:**
1. render.yaml is present
2. Environment variables are set
3. Build command includes `npm run db:generate`

**Solution:**
- Check Render dashboard logs
- Ensure PostgreSQL database is connected
- Verify build and start commands

### Docker: "Container exits immediately"

**Debugging:**
```bash
# View logs
docker logs <container-id>

# Run interactively
docker run -it --env-file .env backend-api sh

# Check environment variables
docker run --env-file .env backend-api env
```

## Logging and Debugging

### Enable Maximum Logging

Update .env:
```env
LOG_LEVEL=debug
NODE_ENV=development
```

### View All Logs

```bash
# Error logs only
cat logs/error.log  # Mac/Linux
type logs\error.log  # Windows

# All logs
cat logs/combined.log  # Mac/Linux
type logs\combined.log  # Windows

# Follow logs in real-time
tail -f logs/combined.log  # Mac/Linux
Get-Content logs\combined.log -Wait  # Windows PowerShell
```

### Add Custom Debug Logs

In any file:
```typescript
import logger from './config/logger';

logger.debug('Debug message', { data: someData });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', error);
```

## Testing Issues

### curl: command not found (Windows)

**Solution:** Use PowerShell or install curl:
```powershell
# PowerShell alternative
Invoke-WebRequest -Uri http://localhost:3000/health
```

Or install curl from: https://curl.se/windows/

### Cannot test API

**Use these alternatives:**

1. **Postman** - Download from postman.com
2. **Thunder Client** - VS Code extension
3. **Browser** - For GET requests only
4. **PowerShell:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/items -Method Get
```

## Performance Issues

### Slow database queries

**Enable query logging:**

Update `src/config/database.ts`:
```typescript
prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

Check logs for slow queries.

### High memory usage

**Solutions:**
1. Limit query results with pagination
2. Use `select` to fetch only needed fields
3. Close database connections properly

## Still Having Issues?

### Collect Debug Information

Run these commands and share output:

```bash
# Node version
node --version

# npm version
npm --version

# Check if server is running
curl http://localhost:3000/health

# View recent logs
tail -n 50 logs/error.log  # Mac/Linux
Get-Content logs\error.log -Tail 50  # Windows PowerShell

# Check environment
cat .env  # Mac/Linux (remove sensitive data before sharing)
type .env  # Windows
```

### Reset Everything

```bash
# Stop server (Ctrl+C)

# Delete everything
rm -rf node_modules dist logs  # Mac/Linux
rmdir /s /q node_modules dist logs  # Windows

# Reinstall
npm install
npm run db:generate
npm run db:push

# Restart
npm run dev
```

### Check System Requirements

- Node.js 18 or higher
- PostgreSQL 12 or higher
- 512MB RAM minimum
- Internet connection for npm packages

## Quick Diagnostic Checklist

- [ ] Node.js installed and version 18+
- [ ] Dependencies installed (`npm install`)
- [ ] .env file exists with DATABASE_URL
- [ ] Prisma Client generated (`npm run db:generate`)
- [ ] Database schema pushed (`npm run db:push`)
- [ ] Server starts without errors
- [ ] Health check returns 200 OK
- [ ] Logs directory exists
- [ ] No port conflicts

If all checked, your API should be working! 🎉
