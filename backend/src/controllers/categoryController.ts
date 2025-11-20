import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';

const categories = [
  { id: 'food', name: 'Food & Dining', icon: '🍔' },
  { id: 'transport', name: 'Transportation', icon: '🚗' },
  { id: 'utilities', name: 'Utilities', icon: '💡' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'other', name: 'Other', icon: '📦' }
];

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: { categories }
  });
});
