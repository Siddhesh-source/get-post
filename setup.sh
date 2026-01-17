#!/bin/bash

echo "🚀 Setting up Backend API..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️ Please update DATABASE_URL in .env file with your PostgreSQL connection string"
else
    echo "✅ .env file already exists"
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run db:generate

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update DATABASE_URL in .env file"
echo "2. Run: npm run db:push (to create database tables)"
echo "3. Run: npm run dev (to start development server)"
echo ""
