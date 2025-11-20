import { Request, Response, NextFunction } from 'express';
import Expense from '../models/Expense';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

export const createExpense = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const expense = await Expense.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { expense }
  });
});

export const getAllExpenses = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { page = 1, limit = 10, category, startDate, endDate, sort = '-date' } = req.query;
  
  // Build query
  const query: any = {};
  
  if (category) {
    query.category = category;
  }
  
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate as string);
    if (endDate) query.date.$lte = new Date(endDate as string);
  }
  
  // Execute query with pagination
  const skip = (Number(page) - 1) * Number(limit);
  const expenses = await Expense
    .find(query)
    .sort(sort as string)
    .skip(skip)
    .limit(Number(limit))
    .lean();
  
  const total = await Expense.countDocuments(query);
  
  res.status(200).json({
    status: 'success',
    results: expenses.length,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    },
    data: { expenses }
  });
});

export const getBulkExpenses = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const expenses = await Expense
    .find()
    .sort('-date')
    .limit(1000)
    .lean();
  
  res.status(200).json({
    status: 'success',
    results: expenses.length,
    data: { expenses }
  });
});

export const getExpenseById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const expense = await Expense.findById(req.params.id);
  
  if (!expense) {
    return next(new AppError('Expense not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: { expense }
  });
});

export const updateExpense = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const expense = await Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!expense) {
    return next(new AppError('Expense not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: { expense }
  });
});

export const deleteExpense = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);
  
  if (!expense) {
    return next(new AppError('Expense not found', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});