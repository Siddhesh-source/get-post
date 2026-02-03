# Solutions API Documentation

## Base URL
```
https://crypto-isotope-483913-f4.el.r.appspot.com
```

## Endpoints

### 1. Create/Update Solution
**POST** `/api/solutions`

Creates a new solution or updates an existing one (based on problemId + username combination).

**Request Body:**
```json
{
  "problemId": "1",
  "username": "john_doe",
  "solutionLink": "https://github.com/john/solution"
}
```

**Response:**
```json
{
  "problemId": "1",
  "username": "john_doe",
  "solutionLink": "https://github.com/john/solution",
  "createdAt": {
    "_seconds": 1768642342,
    "_nanoseconds": 881000000
  },
  "updatedAt": {
    "_seconds": 1768642342,
    "_nanoseconds": 881000000
  }
}
```

**cURL Example:**
```bash
curl -X POST https://crypto-isotope-483913-f4.el.r.appspot.com/api/solutions \
  -H "Content-Type: application/json" \
  -d '{"problemId":"1","username":"john_doe","solutionLink":"https://github.com/john/solution"}'
```

---

### 2. Get Solutions by Problem ID
**GET** `/api/solutions?problemId={id}`

Retrieves all solutions for a specific problem, ordered by newest first.

**Query Parameters:**
- `problemId` (required): The problem ID to fetch solutions for

**Response:**
```json
[
  {
    "username": "john_doe",
    "solutionLink": "https://github.com/john/solution",
    "createdAt": {
      "_seconds": 1768642342,
      "_nanoseconds": 881000000
    }
  },
  {
    "username": "jane_smith",
    "solutionLink": "https://github.com/jane/solution",
    "createdAt": {
      "_seconds": 1768640227,
      "_nanoseconds": 36000000
    }
  }
]
```

**cURL Example:**
```bash
curl https://crypto-isotope-483913-f4.el.r.appspot.com/api/solutions?problemId=1
```

**Note:** problemId should be passed as a string in the query parameter.

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing fields"
}
```
or
```json
{
  "error": "problemId required"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error message details"
}
```

---

## Notes
- The API is publicly accessible (no authentication required)
- **problemId should be sent as a string** (e.g., "1", "2", "100")
- Solutions are uniquely identified by `problemId` + `username` combination
- Submitting the same `problemId` + `username` will update the existing solution
- Solutions are stored in Firebase Firestore
- Timestamps are in Unix epoch format with nanoseconds

---

## Tech Stack
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore (crud database)
- **Hosting**: Google Cloud App Engine
- **Region**: Asia South 1
