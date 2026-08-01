import React, { useContext, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GlobalContext } from '../context/GlobalState';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { TransactionItem } from './TransactionItem';

ChartJS.register(ArcElement, Tooltip, Legend);

export const Dashboard = () => {
  const { transactions, budgets } = useContext(GlobalContext);
  const [viewMode, setViewMode] = useState('monthly'); // 'daily' or 'monthly'
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const MONTHLY_BUDGET = budgets ? budgets.reduce((acc, b) => acc + b.amount, 0) : 0; 
  const DAILY_BUDGET = MONTHLY_BUDGET / 30;
  const BUDGET = viewMode === 'monthly' ? MONTHLY_BUDGET : DAILY_BUDGET;

  // 1. Total Balance (Always all-time)
  const amounts = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);
  const totalBalance = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const targetMonth = selectedDate.getMonth();
  const targetYear = selectedDate.getFullYear();
  const targetDay = selectedDate.getDate();
  
  // Filter transactions based on viewMode and selectedDate
  const filteredTransactions = transactions.filter(t => {
    const d = new Date(t.date || t.createdAt);
    if (viewMode === 'monthly') {
      return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
    } else {
      return d.getDate() === targetDay && d.getMonth() === targetMonth && d.getFullYear() === targetYear;
    }
  });

  // 2. Period Income
  const periodIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)
    .toFixed(2);

  // 3. Period Expense
  const periodExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)
    .toFixed(2);

  // 4. Savings (Income - Expense)
  const savings = (periodIncome - periodExpense).toFixed(2);

  // 5. Budget Progress 
  const budgetProgressPercent = BUDGET > 0 
    ? Math.min((periodExpense / BUDGET) * 100, 100).toFixed(1) 
    : "0.0";
  let progressColor = 'var(--accent-income)'; // Green
  if (budgetProgressPercent > 75) progressColor = '#f59e0b'; // Amber
  if (budgetProgressPercent > 90) progressColor = 'var(--accent-expense)'; // Red

  // 6. Expense Chart (Doughnut based on Categories of Expenses)
  const expensesOnly = filteredTransactions.filter(t => t.type === 'expense');
  const expenseCategories = {};
  expensesOnly.forEach(t => {
    expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
  });
  
  const chartData = {
    labels: Object.keys(expenseCategories).length > 0 ? Object.keys(expenseCategories) : ['No Expenses'],
    datasets: [
      {
        data: Object.keys(expenseCategories).length > 0 ? Object.values(expenseCategories) : [1],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { position: 'right', labels: { color: '#f8fafc', font: { size: 10 } } }
    },
    cutout: '70%',
    maintainAspectRatio: false
  };

  // 7. Recent Transactions (Top 5 for the selected period, sorted by newest)
  const recentTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
    .slice(0, 5);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const handlePrev = () => {
    if (viewMode === 'monthly') {
      setSelectedDate(new Date(targetYear, targetMonth - 1, 1));
    } else {
      setSelectedDate(new Date(targetYear, targetMonth, targetDay - 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'monthly') {
      setSelectedDate(new Date(targetYear, targetMonth + 1, 1));
    } else {
      setSelectedDate(new Date(targetYear, targetMonth, targetDay + 1));
    }
  };

  const displayDate = viewMode === 'monthly' 
    ? `${monthNames[targetMonth]} ${targetYear}`
    : selectedDate.toLocaleDateString();

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h3>Dashboard Overview</h3>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px' }}>
            <button onClick={handlePrev} className="action-btn" style={{ padding: '4px 8px' }}><ChevronLeft size={18} /></button>
            <span style={{ minWidth: '120px', textAlign: 'center', fontWeight: '500', fontSize: '0.9rem' }}>{displayDate}</span>
            <button onClick={handleNext} className="action-btn" style={{ padding: '4px 8px' }}><ChevronRight size={18} /></button>
          </div>
        </div>
        <select 
          value={viewMode} 
          onChange={(e) => {
            setViewMode(e.target.value);
            setSelectedDate(new Date()); // Reset to today when switching views
          }}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', outline: 'none' }}
        >
          <option value="daily">Daily View</option>
          <option value="monthly">Monthly View</option>
        </select>
      </div>
      
      <div className="dashboard-grid animate-fade-in stagger-1">
      
      {/* Overview Cards */}
      <div className="glass-panel stat-card">
        <h4>Total Balance</h4>
        <h2 className={totalBalance >= 0 ? 'plus' : 'minus'}>₹{totalBalance}</h2>
      </div>

      <div className="glass-panel stat-card">
        <h4>{viewMode === 'monthly' ? 'Monthly Income' : 'Daily Income'}</h4>
        <h2 className="plus">+₹{periodIncome}</h2>
      </div>

      <div className="glass-panel stat-card">
        <h4>{viewMode === 'monthly' ? 'Monthly Expense' : 'Daily Expense'}</h4>
        <h2 className="minus">-₹{periodExpense}</h2>
      </div>

      <div className="glass-panel stat-card">
        <h4>Savings ({viewMode === 'monthly' ? 'This Month' : 'This Day'})</h4>
        <h2 className={savings >= 0 ? 'plus' : 'minus'}>₹{savings}</h2>
      </div>

      {/* Budget Progress & Chart Row */}
      <div className="glass-panel budget-panel">
        <h4>Budget Progress ({viewMode === 'monthly' ? 'Monthly' : 'Daily'})</h4>
        <div className="budget-info">
          <span>₹{periodExpense} spent</span>
          <span>of ₹{BUDGET.toFixed(0)}</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${budgetProgressPercent}%`, backgroundColor: progressColor }}
          ></div>
        </div>
        <p className="progress-text">{budgetProgressPercent}% of {viewMode} budget used</p>
      </div>

      <div className="glass-panel chart-panel">
        <h4>Expense Breakdown</h4>
        <div className="chart-container">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-panel transactions-panel">
        <h4>Recent Transactions</h4>
        <ul className="list">
          {recentTransactions.length > 0 ? (
            recentTransactions.map(transaction => (
              <TransactionItem key={transaction._id} transaction={transaction} />
            ))
          ) : (
            <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '1rem' }}>No recent transactions.</p>
          )}
        </ul>
      </div>

    </div>
    </div>
  );
};
