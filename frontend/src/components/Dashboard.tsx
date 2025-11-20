import { useMemo } from 'react';
import { Expense, User } from '../types';
import { TrendingUp, TrendingDown, DollarSign, Calendar, PieChart } from 'lucide-react';

interface DashboardProps {
  expenses: Expense[];
  user: User;
  darkMode?: boolean;
}

export default function Dashboard({ expenses, user, darkMode }: DashboardProps) {
  const stats = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const thisMonth = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      const now = new Date();
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    });
    const lastMonth = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      const now = new Date();
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
      return expDate.getMonth() === lastMonthDate.getMonth() && expDate.getFullYear() === lastMonthDate.getFullYear();
    });
    
    const thisMonthTotal = thisMonth.reduce((sum, exp) => sum + exp.amount, 0);
    const lastMonthTotal = lastMonth.reduce((sum, exp) => sum + exp.amount, 0);
    const change = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];

    return {
      total,
      thisMonthTotal,
      change,
      count: expenses.length,
      average: expenses.length > 0 ? total / expenses.length : 0,
      topCategory: topCategory ? topCategory[0] : 'N/A',
      topCategoryAmount: topCategory ? topCategory[1] : 0
    };
  }, [expenses]);

  const recentExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [expenses]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Expenses"
          value={`₹${stats.total.toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="This Month"
          value={`₹${stats.thisMonthTotal.toFixed(2)}`}
          icon={<Calendar className="w-6 h-6" />}
          color="green"
          trend={stats.change}
        />
        <StatCard
          title="Average Expense"
          value={`₹${stats.average.toFixed(2)}`}
          icon={<PieChart className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Top Category"
          value={stats.topCategory.charAt(0).toUpperCase() + stats.topCategory.slice(1)}
          subtitle={`₹${stats.topCategoryAmount.toFixed(2)}`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Expenses</h2>
        <div className="space-y-3">
          {recentExpenses.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No expenses yet. Add your first expense!</p>
          ) : (
            recentExpenses.map((expense) => (
              <div key={expense._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
                    {getCategoryEmoji(expense.category)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{expense.title}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(expense.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-slate-800">₹{expense.amount.toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      </div>
      <h2 className="text-lg font-medium">{user.name}'s Dashboard</h2>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color, trend }: any) {
  const colors = {
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    orange: 'from-orange-400 to-orange-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span className="font-medium">{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${colors[color as keyof typeof colors]} rounded-lg flex items-center justify-center text-white`}>
          {icon}
        </div>
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