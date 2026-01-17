import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import itemsRouter from './routes/items';
import logger from './config/logger';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  logger.info('📁 Created logs directory');
}

// Middleware
logger.info('⚙️ Setting up middleware...');
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS

// JSON body parser with error handling
app.use(express.json({
  verify: (req: any, res, buf, encoding) => {
    // Store raw body for debugging
    req.rawBody = buf.toString((encoding as BufferEncoding) || 'utf8');
  }
}));

// Handle JSON parsing errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    logger.error('🚨 JSON Parsing Error:', {
      error: err.message,
      rawBody: (req as any).rawBody,
      contentType: req.get('content-type'),
      method: req.method,
      path: req.path,
    });
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON format',
      message: err.message,
      hint: 'Please check your JSON syntax. Common issues: missing quotes, trailing commas, or unclosed strings',
      timestamp: new Date().toISOString(),
    });
  }
  next(err);
});

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// HTTP request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Custom request logger
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  logger.info('🏥 Health check requested');
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
logger.info('🛣️ Setting up routes...');
app.use('/api/items', itemsRouter);

// 404 handler
app.use('*', (req, res) => {
  logger.warn(`⚠️ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`\n🛑 ${signal} received. Starting graceful shutdown...`);
  
  try {
    await disconnectDatabase();
    logger.info('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const startServer = async () => {
  try {
    logger.info('🚀 Starting server...');
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`Log Level: ${process.env.LOG_LEVEL || 'info'}`);

    // Connect to database
    await connectDatabase();

    // Start listening
    app.listen(PORT, () => {
      logger.info('='.repeat(50));
      logger.info(`✅ Server is running on port ${PORT}`);
      logger.info(`📍 Health check: http://localhost:${PORT}/health`);
      logger.info(`📍 API endpoint: http://localhost:${PORT}/api/items`);
      logger.info('='.repeat(50));
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
