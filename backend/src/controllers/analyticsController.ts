import { Request, Response, NextFunction } from 'express';
import Expense from '../models/Expense';
import { catchAsync } from '../utils/catchAsync';

export const getSpendingAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { startDate, endDate } = req.query;
  
  const matchStage: any = {};
  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate as string);
    if (endDate) matchStage.date.$lte = new Date(endDate as string);
  }
  
  const analytics = await Expense.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalExpenses: { $sum: '$amount' },
        averageExpense: { $avg: '$amount' },
        maxExpense: { $max: '$amount' },
        minExpense: { $min: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  res.status(200).json({
    status: 'success',
    data: analytics[0] || {
      totalExpenses: 0,
      averageExpense: 0,
      maxExpense: 0,
      minExpense: 0,
      count: 0
    }
  });
});

export const getCategoryBreakdown = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { startDate, endDate } = req.query;
  
  const matchStage: any = {};
  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate as string);
    if (endDate) matchStage.date.$lte = new Date(endDate as string);
  }
  
  const breakdown = await Expense.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        average: { $avg: '$amount' }
      }
    },
    {
      $project: {
        category: '$_id',
        total: 1,
        count: 1,
        average: { $round: ['$average', 2] },
        _id: 0
      }
    },
    { $sort: { total: -1 } }
  ]);
  
  const total = breakdown.reduce((sum, item) => sum + item.total, 0);
  const breakdownWithPercentage = breakdown.map(item => ({
    ...item,
    percentage: total > 0 ? Number(((item.total / total) * 100).toFixed(2)) : 0
  }));
  
  res.status(200).json({
    status: 'success',
    data: { breakdown: breakdownWithPercentage }
  });
});

export const getMonthlyTrends = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const trends = await Expense.aggregate([
    { $match: { date: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        average: { $avg: '$amount' }
      }
    },
    {
      $project: {
        year: '$_id.year',
        month: '$_id.month',
        total: { $round: ['$total', 2] },
        count: 1,
        average: { $round: ['$average', 2] },
        _id: 0
      }
    },
    { $sort: { year: 1, month: 1 } }
  ]);
  
  res.status(200).json({
    status: 'success',
    data: { trends }
  });
});

export const getPredictiveAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  const recentExpenses = await Expense.aggregate([
    { $match: { date: { $gte: threeMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);
  
  if (recentExpenses.length === 0) {
    return res.status(200).json({
      status: 'success',
      data: {
        predictedNextMonth: 0,
        trend: 'stable',
        confidence: 'low'
      }
    });
  }
  
  const monthlyTotals = recentExpenses.map(e => e.total);
  const avgMonthly = monthlyTotals.reduce((a, b) => a + b, 0) / monthlyTotals.length;
  
  let trend = 'stable';
  if (monthlyTotals.length >= 2) {
    const lastMonth = monthlyTotals[monthlyTotals.length - 1];
    const prevMonth = monthlyTotals[monthlyTotals.length - 2];
    if (lastMonth > prevMonth * 1.1) trend = 'increasing';
    else if (lastMonth < prevMonth * 0.9) trend = 'decreasing';
  }
  
  const growthRate = monthlyTotals.length >= 2 
    ? (monthlyTotals[monthlyTotals.length - 1] - monthlyTotals[0]) / monthlyTotals[0]
    : 0;
  
  const predicted = avgMonthly * (1 + growthRate);
  
  res.status(200).json({
    status: 'success',
    data: {
      predictedNextMonth: Number(predicted.toFixed(2)),
      trend,
      averageMonthly: Number(avgMonthly.toFixed(2)),
      confidence: monthlyTotals.length >= 3 ? 'high' : 'medium',
      historicalData: monthlyTotals
    }
  });
});