import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Analytics from './components/Analytics';
import LoginForm from './components/LoginForm';
import Settings from './components/Settings';
import { Expense, User } from './types';
import { getExpenses, createExpense, updateExpense, deleteExpense, checkBudgetStatus } from './services/api';
import { Toaster, toast } from 'react-hot-toast';
import { Moon, Sun, Settings as SettingsIcon, LogOut } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses' | 'analytics' | 'settings'>('dashboard');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setDarkMode(JSON.parse(savedUser).darkMode || false);
      fetchExpenses();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
      setExpenses(data);
      
      // Check budget and show notification
      if (user?.budgetLimit && user.budgetLimit > 0) {
        const status = await checkBudgetStatus();
        if (status.isOverBudget && user.notificationsEnabled) {
          toast.error(`⚠️ Budget Alert: You've exceeded your budget by ₹${status.overAmount.toFixed(2)}!`, {
            duration: 6000,
            position: 'top-center'
          });
        } else if (status.percentageUsed >= 80 && status.percentageUsed < 100 && user.notificationsEnabled) {
          toast(`📊 You've used ${status.percentageUsed.toFixed(0)}% of your budget`, {
            icon: '⚠️',
            duration: 4000
          });
        }
      }
    } catch (error) {
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = async (expenseData: Omit<Expense, '_id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      await createExpense(expenseData);
      toast.success('Expense added successfully!');
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  const handleUpdateExpense = async (id: string, expenseData: Partial<Expense>) => {
    try {
      await updateExpense(id, expenseData);
      toast.success('Expense updated successfully!');
      setEditingExpense(null);
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to update expense');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await deleteExpense(id);
      toast.success('Expense deleted!');
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  const handleLogin = (userData: User, token: string) => {
    setUser(userData);
    setDarkMode(userData.darkMode || false);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    fetchExpenses();
  };

  const handleLogout = () => {
    setUser(null);
    setExpenses([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (!user) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (

    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      <Toaster position="top-right" />
      
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} shadow-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">💰</span>
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  Expense Manager
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  Welcome, {user.name}!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-1">
                {(['dashboard', 'expenses', 'analytics', 'settings'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-blue-500 text-white shadow-md'
                        : darkMode 
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab === 'settings' ? <SettingsIcon className="w-5 h-5" /> : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'bg-gray-700 text-red-400 hover:bg-gray-600' : 'bg-slate-100 text-red-600 hover:bg-slate-200'
                }`}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && <Dashboard expenses={expenses} user={user} darkMode={darkMode} />}
            
            {activeTab === 'expenses' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <ExpenseForm
                    onSubmit={editingExpense ? (data) => handleUpdateExpense(editingExpense._id, data) : handleCreateExpense}
                    initialData={editingExpense || undefined}
                    onCancel={() => setEditingExpense(null)}
                    darkMode={darkMode}
                  />
                </div>
                <div className="lg:col-span-2">
                  <ExpenseList
                    expenses={expenses}
                    onEdit={setEditingExpense}
                    onDelete={handleDeleteExpense}
                    darkMode={darkMode}
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'analytics' && <Analytics darkMode={darkMode} />}
            
            {activeTab === 'settings' && (
              <Settings 
                user={user} 
                onUpdate={(updatedUser) => {
                  setUser(updatedUser);
                  setDarkMode(updatedUser.darkMode ?? false);
                  localStorage.setItem('user', JSON.stringify(updatedUser));
                }}
                darkMode={darkMode}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;