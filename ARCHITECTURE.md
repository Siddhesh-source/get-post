# Architecture Overview

## System Flow

```
Client Request
     ↓
[Express Server] (src/index.ts)
     ↓
[Middleware Stack]
     ├── Helmet (Security Headers)
     ├── CORS (Cross-Origin)
     ├── Body Parser (JSON)
     └── Request Logger (Log incoming)
     ↓
[Route Handler] (src/routes/items.ts)
     ├── Validate Input
     ├── Log Operation
     └── Process Request
     ↓
[Database Layer] (src/config/database.ts)
     ├── Prisma Client
     ├── Query Logging
     └── Error Handling
     ↓
[PostgreSQL Database]
     ↓
[Response]
     ├── Format JSON
     ├── Add Timestamp
     └── Log Response
     ↓
Client Response
```

## Request Lifecycle

### 1. Incoming Request
```
Client sends: POST /api/items
Body: { "name": "Test", "data": "Hello" }
```

### 2. Middleware Processing
```
✅ Security headers added (Helmet)
✅ CORS headers added
✅ JSON body parsed
✅ Request logged:
   📥 Incoming Request: {
     method: 'POST',
     path: '/api/items',
     body: { name: 'Test', data: 'Hello' }
   }
```

### 3. Route Handler
```typescript
// src/routes/items.ts
router.post('/', async (req, res, next) => {
  // 1. Extract data
  const { name, data } = req.body;
  
  // 2. Validate
  if (!name) throw new AppError('Name required', 400);
  
  // 3. Log operation
  logger.info('Creating item...', { name, data });
  
  // 4. Database operation
  const item = await prisma.item.create({ ... });
  
  // 5. Return response
  res.status(201).json({ success: true, data: item });
});
```

### 4. Database Operation
```
🔌 Prisma Client executes:
   INSERT INTO Item (name, data) VALUES ($1, $2)
   
📊 Query logged:
   Database Query: {
     query: 'INSERT INTO Item...',
     params: '["Test", "Hello"]',
     duration: '15ms'
   }
```

### 5. Response Sent
```
✅ Response logged:
   📤 Response Sent: {
     method: 'POST',
     path: '/api/items',
     statusCode: 201,
     duration: '45ms'
   }

Client receives:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Test",
    "data": "Hello",
    "createdAt": "2024-01-17T10:30:00.000Z",
    "updatedAt": "2024-01-17T10:30:00.000Z"
  },
  "timestamp": "2024-01-17T10:30:00.000Z"
}
```

## Error Handling Flow

```
Error Occurs
     ↓
[Try/Catch Block]
     ↓
[Error Handler Middleware]
     ├── Log Error Details
     ├── Determine Error Type
     └── Format Response
     ↓
[Error Response]
     ├── Status Code (400/404/500)
     ├── Error Message
     └── Timestamp
     ↓
Client Receives Error
```

### Example Error Flow

```
Client sends: POST /api/items
Body: {} (missing name)
     ↓
Validation fails
     ↓
throw new AppError('Name required', 400)
     ↓
Error Handler catches:
   ❌ Error occurred: {
     message: 'Name required',
     statusCode: 400,
     path: '/api/items',
     method: 'POST'
   }
     ↓
Client receives:
{
  "success": false,
  "error": "Name required",
  "timestamp": "2024-01-17T10:30:00.000Z"
}
```

## Logging Architecture

```
[Application Code]
     ↓
[Winston Logger] (src/config/logger.ts)
     ├── Format: JSON + Timestamp
     ├── Level: debug/info/warn/error
     └── Metadata: service, context
     ↓
[Transports]
     ├── Console (colored, formatted)
     ├── File: logs/error.log (errors only)
     └── File: logs/combined.log (all logs)
```

### Log Levels

```
DEBUG → Everything (queries, details)
  ↓
INFO  → Operations (requests, responses)
  ↓
WARN  → Warnings (not found, deprecated)
  ↓
ERROR → Errors (failures, exceptions)
```

## Database Architecture

```
[Application]
     ↓
[Prisma Client] (src/config/database.ts)
     ├── Connection Pool
     ├── Query Builder
     └── Type Safety
     ↓
[PostgreSQL]
     └── Table: Item
         ├── id (Primary Key)
         ├── name (String)
         ├── data (String, nullable)
         ├── createdAt (DateTime)
         └── updatedAt (DateTime)
```

### Database Operations

```
CREATE
  prisma.item.create({ data: { name, data } })
  → INSERT INTO Item...

READ ALL
  prisma.item.findMany()
  → SELECT * FROM Item ORDER BY createdAt DESC

READ ONE
  prisma.item.findUnique({ where: { id } })
  → SELECT * FROM Item WHERE id = $1

UPDATE
  prisma.item.update({ where: { id }, data: { ... } })
  → UPDATE Item SET ... WHERE id = $1

DELETE
  prisma.item.delete({ where: { id } })
  → DELETE FROM Item WHERE id = $1
```

## File Structure & Responsibilities

```
src/
├── index.ts
│   ├── Server setup
│   ├── Middleware registration
│   ├── Route mounting
│   └── Graceful shutdown
│
├── config/
│   ├── database.ts
│   │   ├── Prisma client initialization
│   │   ├── Connection management
│   │   └── Query logging
│   │
│   └── logger.ts
│       ├── Winston configuration
│       ├── Log formatting
│       └── Transport setup
│
├── middleware/
│   ├── errorHandler.ts
│   │   ├── Global error catching
│   │   ├── Error formatting
│   │   └── Error logging
│   │
│   └── requestLogger.ts
│       ├── Request logging
│       ├── Response logging
│       └── Duration tracking
│
└── routes/
    └── items.ts
        ├── GET /api/items (list all)
        ├── GET /api/items/:id (get one)
        └── POST /api/items (create)
```

## Deployment Architecture

### Development
```
Local Machine
├── Node.js Server (port 3000)
├── PostgreSQL (local or remote)
└── Logs (./logs/)
```

### Production (Railway)
```
Railway Platform
├── Web Service (Node.js)
├── PostgreSQL Database
├── Environment Variables
└── Automatic Logs
```

### Production (Render)
```
Render Platform
├── Web Service (Node.js)
├── External PostgreSQL
├── Environment Variables
└── Log Streaming
```

### Production (Docker)
```
Docker Container
├── Node.js Application
├── Environment Variables
└── Volume: logs/
     ↓
External PostgreSQL
```

## Security Layers

```
[Client Request]
     ↓
[Helmet Middleware]
     ├── X-Content-Type-Options
     ├── X-Frame-Options
     ├── X-XSS-Protection
     └── Strict-Transport-Security
     ↓
[CORS Middleware]
     ├── Access-Control-Allow-Origin
     └── Access-Control-Allow-Methods
     ↓
[Input Validation]
     ├── Type checking
     ├── Required fields
     └── Data sanitization
     ↓
[Prisma ORM]
     ├── SQL injection prevention
     ├── Parameterized queries
     └── Type safety
     ↓
[Database]
```

## Performance Considerations

### Connection Pooling
```
[Multiple Requests]
     ↓
[Prisma Connection Pool]
     ├── Reuse connections
     ├── Limit concurrent connections
     └── Auto-reconnect
     ↓
[PostgreSQL]
```

### Query Optimization
```
[Request]
     ↓
[Prisma Query]
     ├── Select only needed fields
     ├── Use indexes (createdAt)
     └── Limit results
     ↓
[Fast Response]
```

## Monitoring & Observability

```
[Application Events]
     ↓
[Winston Logger]
     ├── Structured JSON logs
     ├── Contextual metadata
     └── Timestamp tracking
     ↓
[Log Storage]
     ├── Console (real-time)
     ├── Files (persistent)
     └── External service (optional)
     ↓
[Analysis & Alerts]
```

## Scalability Path

### Current (Single Instance)
```
Client → Server → Database
```

### Future (Load Balanced)
```
         ┌─ Server 1 ─┐
Client → Load Balancer ├─ Server 2 ─┤→ Database
         └─ Server 3 ─┘
```

### Future (Microservices)
```
Client → API Gateway
         ├─ Items Service → Items DB
         ├─ Users Service → Users DB
         └─ Auth Service → Auth DB
```

## Technology Stack

```
Runtime:     Node.js 18+
Language:    TypeScript
Framework:   Express.js
Database:    PostgreSQL
ORM:         Prisma
Logging:     Winston
Security:    Helmet, CORS
Deployment:  Railway, Render, Vercel, Docker
```

## Data Flow Example

### Creating an Item

```
1. Client Request
   POST /api/items
   { "name": "Book", "data": "Novel" }

2. Server Receives
   📥 Log: Incoming POST /api/items

3. Validation
   ✅ name exists
   ✅ name is string

4. Database Insert
   🔌 Prisma: INSERT INTO Item...
   📊 Log: Query executed in 15ms

5. Response Created
   ✅ Log: Item created with ID: 1

6. Response Sent
   📤 Log: Response 201 in 45ms
   { "success": true, "data": { "id": 1, ... } }

7. Client Receives
   Status: 201 Created
   Body: { "success": true, ... }
```

## Key Design Decisions

### Why Express?
- Mature, stable framework
- Large ecosystem
- Easy to understand
- Production-proven

### Why Prisma?
- Type-safe database access
- Auto-generated client
- Migration support
- Great developer experience

### Why Winston?
- Flexible logging
- Multiple transports
- Structured logging
- Production-ready

### Why PostgreSQL?
- Reliable and robust
- ACID compliance
- Great performance
- Wide hosting support

## Summary

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Comprehensive error handling
- ✅ Extensive logging for debugging
- ✅ Type safety throughout
- ✅ Security best practices
- ✅ Production-ready deployment
- ✅ Easy to understand and maintain
- ✅ Scalable foundation

Every component is designed to be:
- **Observable** - Logs show what's happening
- **Debuggable** - Errors include full context
- **Maintainable** - Clear structure and naming
- **Reliable** - Handles failures gracefully
- **Secure** - Multiple security layers
