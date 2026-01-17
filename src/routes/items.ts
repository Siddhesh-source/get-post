import { Router, Request, Response, NextFunction } from 'express';
import { getPrismaClient } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger';

const router = Router();

// GET /api/items - Fetch all items
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('🔍 Fetching all items...');
    
    const prisma = getPrismaClient();
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' },
    });

    logger.info(`✅ Successfully fetched ${items.length} items`);
    
    res.json({
      success: true,
      count: items.length,
      data: items,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('❌ Error fetching items:', error);
    next(error);
  }
});

// GET /api/items/:id - Fetch single item
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      throw new AppError('Invalid item ID', 400);
    }

    logger.info(`🔍 Fetching item with ID: ${id}`);
    
    const prisma = getPrismaClient();
    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      logger.warn(`⚠️ Item not found with ID: ${id}`);
      throw new AppError('Item not found', 404);
    }

    logger.info(`✅ Successfully fetched item: ${id}`);
    
    res.json({
      success: true,
      data: item,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/items - Create new item
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Debug: Log the entire request body
    logger.info('📝 Creating new item - Request received:', {
      body: req.body,
      bodyType: typeof req.body,
      bodyKeys: Object.keys(req.body || {}),
      contentType: req.get('content-type'),
      rawBody: (req as any).rawBody?.substring(0, 200), // First 200 chars
    });

    const { name, data } = req.body;

    logger.info('📝 Extracted fields:', { 
      name, 
      nameType: typeof name,
      data,
      dataType: typeof data,
    });

    // Validate name field
    if (!name || typeof name !== 'string' || name.trim() === '') {
      logger.warn('⚠️ Validation failed:', {
        name,
        nameType: typeof name,
        nameProvided: name !== undefined,
        bodyEmpty: Object.keys(req.body || {}).length === 0,
      });
      throw new AppError(
        'Name is required and must be a non-empty string. Example: {"name":"My Item","data":"optional data"}',
        400
      );
    }

    const prisma = getPrismaClient();
    const item = await prisma.item.create({
      data: {
        name: name.trim(),
        data: data || null,
      },
    });

    logger.info(`✅ Successfully created item with ID: ${item.id}`, {
      name: item.name,
      hasData: !!item.data,
    });
    
    res.status(201).json({
      success: true,
      data: item,
      message: 'Item created successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('❌ Error creating item:', error);
    next(error);
  }
});

export default router;
