import express from 'express';
import { getCategories } from '../controllers/categoryController';
import { cacheMiddleware } from '../middleware/cache';

const router = express.Router();

router.get('/', cacheMiddleware(3600), getCategories);

export default router;