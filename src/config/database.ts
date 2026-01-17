import { PrismaClient } from '@prisma/client';
import logger from './logger';

let prisma: PrismaClient;

export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    logger.info('🔌 Initializing Prisma Client...');
    
    prisma = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
    });

    // Log database queries in development
    if (process.env.NODE_ENV !== 'production') {
      prisma.$on('query' as never, (e: any) => {
        logger.debug('Database Query:', {
          query: e.query,
          params: e.params,
          duration: `${e.duration}ms`,
        });
      });
    }

    prisma.$on('error' as never, (e: any) => {
      logger.error('Database Error:', e);
    });

    prisma.$on('warn' as never, (e: any) => {
      logger.warn('Database Warning:', e);
    });

    logger.info('✅ Prisma Client initialized successfully');
  }

  return prisma;
};

export const connectDatabase = async (): Promise<void> => {
  try {
    logger.info('🔄 Connecting to database...');
    const client = getPrismaClient();
    await client.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    if (prisma) {
      logger.info('🔄 Disconnecting from database...');
      await prisma.$disconnect();
      logger.info('✅ Database disconnected successfully');
    }
  } catch (error) {
    logger.error('❌ Database disconnection failed:', error);
    throw error;
  }
};
