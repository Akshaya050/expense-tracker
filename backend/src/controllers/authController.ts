import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'default-secret', {
    expiresIn: '7d'
  });
};

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered', 400));
  }

  const user = await User.create({ name, email, password });

  const token = generateToken((user._id as mongoose.Types.ObjectId).toString());

  res.status(201).json({
    status: 'success',
    data: {
      token,
      user: {
        id: (user._id as mongoose.Types.ObjectId).toString(),
        name: user.name,
        email: user.email,
        budgetLimit: user.budgetLimit,
        notificationsEnabled: user.notificationsEnabled,
        darkMode: user.darkMode
      }
    }
  });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = generateToken((user._id as mongoose.Types.ObjectId).toString());

  res.status(200).json({
    status: 'success',
    data: {
      token,
      user: {
        id: (user._id as mongoose.Types.ObjectId).toString(),
        name: user.name,
        email: user.email,
        budgetLimit: user.budgetLimit,
        notificationsEnabled: user.notificationsEnabled,
        darkMode: user.darkMode
      }
    }
  });
});

export const getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user?.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

export const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, budgetLimit, notificationsEnabled, darkMode } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user?.id,
    { name, budgetLimit, notificationsEnabled, darkMode },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});