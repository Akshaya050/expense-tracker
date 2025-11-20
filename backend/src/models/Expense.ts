import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  category: string;
  date: Date;
  description?: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer';
  isRecurring: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
      validate: {
        validator: (v: number) => /^\d+(\.\d{1,2})?$/.test(v.toString()),
        message: 'Amount must have at most 2 decimal places'
      }
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['food', 'transport', 'utilities', 'entertainment', 'healthcare', 'shopping', 'education', 'other'],
        message: '{VALUE} is not a valid category'
      }
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
      validate: {
        validator: (v: Date) => v <= new Date(),
        message: 'Date cannot be in the future'
      }
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: ['cash', 'card', 'upi', 'bank_transfer'],
        message: '{VALUE} is not a valid payment method'
      }
    },
    isRecurring: {
      type: Boolean,
      default: false
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for optimized queries
ExpenseSchema.index({ date: -1 });
ExpenseSchema.index({ category: 1, date: -1 });
ExpenseSchema.index({ createdAt: -1 });

// Virtual for formatted amount
ExpenseSchema.virtual('formattedAmount').get(function() {
  return `₹${this.amount.toFixed(2)}`;
});

export default mongoose.model<IExpense>('Expense', ExpenseSchema);