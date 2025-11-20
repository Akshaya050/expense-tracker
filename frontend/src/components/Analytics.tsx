import { useState, useEffect } from 'react';
import { getAnalytics, getCategoryBreakdown, getMonthlyTrends, getPredictiveAnalytics } from '../services/api';
import { BarChart3, PieChart, TrendingUp, AlertCircle } from 'lucide-react';


interface AnalyticsProps {
  darkMode?: boolean;
}

export default function Analytics({ darkMode = false }: AnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [predictive, setPredictive] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsData, categoryBreakdown, monthlyTrends, predictiveData] = await Promise.all([
        getAnalytics(),
        getCategoryBreakdown(),
        getMonthlyTrends(),
        getPredictiveAnalytics()
      ]);
      setAnalytics(analyticsData);
      setCategoryData(categoryBreakdown.breakdown);
      setTrends(monthlyTrends.trends);
      setPredictive(predictiveData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className={darkMode ? 'text-gray-200' : 'text-slate-800'}>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatBox
          title="Total Spent"
          value={`₹${analytics?.totalExpenses?.toFixed(2) || '0.00'}`}
          icon={<BarChart3 className="w-6 h-6" />}
          color="blue"
        />
        <StatBox
          title="Average"
          value={`₹${analytics?.averageExpense?.toFixed(2) || '0.00'}`}
          icon={<PieChart className="w-6 h-6" />}
          color="green"
        />
        <StatBox
          title="Highest"
          value={`₹${analytics?.maxExpense?.toFixed(2) || '0.00'}`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
        />
        <StatBox
          title="Total Count"
          value={analytics?.count || '0'}
          icon={<AlertCircle className="w-6 h-6" />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Category Breakdown</h3>
          <div className="space-y-4">
            {categoryData.map((cat, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getCategoryEmoji(cat.category)}</span>
                    <span className="font-medium text-slate-700 capitalize">{cat.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-800">₹{cat.total.toFixed(2)}</div>
                    <div className="text-xs text-slate-500">{cat.percentage}%</div>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
            {categoryData.length === 0 && (
              <p className="text-slate-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Monthly Trends</h3>
          <div className="space-y-3">
            {trends.map((trend, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-medium text-slate-800">
                    {monthNames[trend.month - 1]} {trend.year}
                  </div>
                  <div className="text-sm text-slate-500">{trend.count} expenses</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-800">₹{trend.total.toFixed(2)}</div>
                  <div className="text-xs text-slate-500">Avg: ₹{trend.average.toFixed(2)}</div>
                </div>
              </div>
            ))}
            {trends.length === 0 && (
              <p className="text-slate-500 text-center py-8">No trend data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Predictive Analytics */}
      {predictive && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Predictive Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Predicted Next Month</p>
                  <p className="text-2xl font-bold text-slate-800">₹{predictive.predictedNextMonth.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Spending Trend</p>
                  <p className="text-lg font-semibold capitalize text-slate-800">
                    {predictive.trend === 'increasing' && '📈 Increasing'}
                    {predictive.trend === 'decreasing' && '📉 Decreasing'}
                    {predictive.trend === 'stable' && '➡️ Stable'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Confidence Level</p>
                  <p className="text-lg font-semibold capitalize text-slate-800">{predictive.confidence}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-4">
                Based on your average monthly spending of ₹{predictive.averageMonthly.toFixed(2)}, 
                we predict your expenses for next month.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ title, value, icon, color }: any) {
  const colors = {
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    orange: 'from-orange-400 to-orange-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
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