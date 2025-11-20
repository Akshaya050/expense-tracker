import { useState } from 'react';
import { Expense } from '../types';
import { Edit2, Trash2, Search } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  darkMode?: boolean;
}

export default function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-800">All Expenses</h2>
        <span className="text-sm text-slate-500">{filteredExpenses.length} items</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search expenses..."
            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="food">🍔 Food</option>
          <option value="transport">🚗 Transport</option>
          <option value="utilities">💡 Utilities</option>
          <option value="entertainment">🎬 Entertainment</option>
          <option value="healthcare">🏥 Healthcare</option>
          <option value="shopping">🛍️ Shopping</option>
          <option value="education">📚 Education</option>
          <option value="other">📦 Other</option>
        </select>
      </div>

      {/* Expense List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No expenses found</p>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <div
              key={expense._id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
                  {getCategoryEmoji(expense.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-slate-800 truncate">{expense.title}</h3>
                    {expense.isRecurring && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                        Recurring
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm text-slate-500">
                      {new Date(expense.date).toLocaleDateString('en-IN', { 
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-sm text-slate-500 capitalize">{expense.paymentMethod}</span>
                  </div>
                  {expense.description && (
                    <p className="text-sm text-slate-500 mt-1 truncate">{expense.description}</p>
                  )}
                  {expense.tags && expense.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {expense.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4 ml-4">
                <span className="text-lg font-semibold text-slate-800 whitespace-nowrap">
                  ₹{expense.amount.toFixed(2)}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit expense"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(expense._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    food: '🍔',
    transport: '🚗',
    utilities: '💡',
    entertainment: '🎬',
    healthcare: '🏥',
    shopping: '🛍️',
    education: '📚',
    other: '📦'
  };
  return emojis[category] || '📦';
}