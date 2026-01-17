@echo off
echo 🚀 Setting up Backend API...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

echo ✅ Node.js is installed
node --version

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ⚠️ Please update DATABASE_URL in .env file with your PostgreSQL connection string
) else (
    echo ✅ .env file already exists
)

REM Generate Prisma Client
echo 🔧 Generating Prisma Client...
call npm run db:generate

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Update DATABASE_URL in .env file
echo 2. Run: npm run db:push (to create database tables)
echo 3. Run: npm run dev (to start development server)
echo.
pause
