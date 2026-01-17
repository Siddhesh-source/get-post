@echo off
echo 🧪 Testing Backend API...
echo.

set BASE_URL=http://localhost:3000

echo 1️⃣ Testing Health Check...
curl -s %BASE_URL%/health
echo.
echo.

echo 2️⃣ Creating Test Item...
curl -s -X POST %BASE_URL%/api/items -H "Content-Type: application/json" -d "{\"name\":\"Test Item\",\"data\":\"Test Data\"}"
echo.
echo.

echo 3️⃣ Getting All Items...
curl -s %BASE_URL%/api/items
echo.
echo.

echo 4️⃣ Testing Invalid Request (should return 400)...
curl -s -X POST %BASE_URL%/api/items -H "Content-Type: application/json" -d "{}"
echo.
echo.

echo 5️⃣ Testing 404 Route...
curl -s %BASE_URL%/api/nonexistent
echo.
echo.

echo ✅ Tests complete! Check the output above.
pause
