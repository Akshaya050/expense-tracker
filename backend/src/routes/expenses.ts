import express from 'express';
import { body, query, param } from 'express-validator';
import { 
  createExpense, 
  getAllExpenses, 
  getExpenseById, 
  updateExpense, 
  deleteExpense,
  getBulkExpenses
} from '../controllers/expenseController';
import { validate } from '../middleware/validate';
import { cacheMiddleware } from '../middleware/cache';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Protect all routes
//router.use(authenticate);

// Validation rules
const createExpenseValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('category')
    .isIn(['food', 'transport', 'utilities', 'entertainment', 'healthcare', 'shopping', 'education', 'other'])
    .withMessage('Invalid category'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  body('paymentMethod')
    .isIn(['cash', 'card', 'upi', 'bank_transfer'])
    .withMessage('Invalid payment method'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

const updateExpenseValidation = [
  param('id').isMongoId().withMessage('Invalid expense ID'),
  ...createExpenseValidation
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('category')
    .optional()
    .isIn(['food', 'transport', 'utilities', 'entertainment', 'healthcare', 'shopping', 'education', 'other'])
    .withMessage('Invalid category'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date')
];

// Routes
router.post('/', createExpenseValidation, validate, createExpense);
router.get('/', queryValidation, validate, cacheMiddleware(60), getAllExpenses);
router.get('/bulk', cacheMiddleware(120), getBulkExpenses);
router.get('/:id', param('id').isMongoId(), validate, getExpenseById);
router.put('/:id', updateExpenseValidation, validate, updateExpense);
router.delete('/:id', param('id').isMongoId(), validate, deleteExpense);

export default router;