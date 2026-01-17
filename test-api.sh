#!/bin/bash

echo "🧪 Testing Backend API..."
echo ""

BASE_URL="http://localhost:3000"

echo "1️⃣ Testing Health Check..."
curl -s $BASE_URL/health | jq '.'
echo ""

echo "2️⃣ Creating Test Item..."
curl -s -X POST $BASE_URL/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","data":"Test Data"}' | jq '.'
echo ""

echo "3️⃣ Getting All Items..."
curl -s $BASE_URL/api/items | jq '.'
echo ""

echo "4️⃣ Testing Invalid Request (should return 400)..."
curl -s -X POST $BASE_URL/api/items \
  -H "Content-Type: application/json" \
  -d '{}' | jq '.'
echo ""

echo "5️⃣ Testing 404 Route..."
curl -s $BASE_URL/api/nonexistent | jq '.'
echo ""

echo "✅ Tests complete!"
