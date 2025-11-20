
export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  darkMode?: boolean;
  notificationsEnabled?: boolean;
  budgetLimit?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'bank_transfer';

export interface Expense {
  _id: string;
  userId?: string;
  title: string;
  amount: number;
  category: 'food' | 'transport' | 'utilities' | 'entertainment' | 'healthcare' | 'shopping' | 'education' | 'other';
  date: string | Date;
  description?: string;
  paymentMethod?: PaymentMethod;
  isRecurring?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BudgetStatus {
  isOverBudget: boolean;
  overAmount: number;
  percentageUsed: number;
}
