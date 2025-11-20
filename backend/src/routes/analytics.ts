import express from 'express';
import { query } from 'express-validator';
import { 
  getSpendingAnalytics, 
  getCategoryBreakdown, 
  getMonthlyTrends,
  getPredictiveAnalytics 
} from '../controllers/analyticsController';
import { validate } from '../middleware/validate';
import { cacheMiddleware } from '../middleware/cache';

const router = express.Router();

const dateRangeValidation = [
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
];

router.get('/spending', dateRangeValidation, validate, cacheMiddleware(300), getSpendingAnalytics);
router.get('/category-breakdown', dateRangeValidation, validate, cacheMiddleware(300), getCategoryBreakdown);
router.get('/monthly-trends', cacheMiddleware(300), getMonthlyTrends);
router.get('/predictive', cacheMiddleware(600), getPredictiveAnalytics);

export default router;