import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowDownToLine, ArrowUpFromLine, Plus, Eye, TrendingUp, TrendingDown, PiggyBank, Briefcase } from 'lucide-react';
import { GlobalContext } from '../context/GlobalState';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { TransactionItem } from './TransactionItem';
import { AddExpenseModal } from './AddExpenseModal';
import { AddIncomeModal } from './AddIncomeModal';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

export const Dashboard = () => {
  const navigate = useNavigate();
  const { transactions, budgets } = useContext(GlobalContext);
  const [timeFilter, setTimeFilter] = useState('Monthly');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showRecentTxsModal, setShowRecentTxsModal] = useState(false);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  // Calculations
  const amounts = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);
  const totalBalance = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  
  const incomes = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const savings = (incomes - expenses).toFixed(2);

  // Trend Calculations
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  let currentMonthIncome = 0;
  let lastMonthIncome = 0;
  let currentMonthExpense = 0;
  let lastMonthExpense = 0;

  transactions.forEach(t => {
    const d = new Date(t.date || t.createdAt);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      if (t.type === 'income') currentMonthIncome += t.amount;
      else if (t.type === 'expense') currentMonthExpense += t.amount;
    } else if (d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear) {
      if (t.type === 'income') lastMonthIncome += t.amount;
      else if (t.type === 'expense') lastMonthExpense += t.amount;
    }
  });

  const calcTrend = (current, last) => last === 0 ? (current > 0 ? 100 : 0) : ((current - last) / Math.abs(last)) * 100;
  
  const incomeTrend = calcTrend(currentMonthIncome, lastMonthIncome);
  const expenseTrend = calcTrend(currentMonthExpense, lastMonthExpense);
  
  const currentMonthSavings = currentMonthIncome - currentMonthExpense;
  const lastMonthSavings = lastMonthIncome - lastMonthExpense;
  const savingsTrend = calcTrend(currentMonthSavings, lastMonthSavings);
  
  const balanceTrend = savingsTrend;

  // Expense Chart Data
  const expensesOnly = transactions.filter(t => {
    if (t.type !== 'expense') return false;
    const tDate = new Date(t.date || t.createdAt);
    if (timeFilter === 'Daily') {
      return tDate.getDate() === now.getDate() && tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
    }
    if (timeFilter === 'Weekly') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return tDate >= oneWeekAgo;
    }
    if (timeFilter === 'Monthly') {
      return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
    }
    if (timeFilter === 'Yearly') {
      return tDate.getFullYear() === now.getFullYear();
    }
    return true;
  });
  
  const expenseCategories = {};
  expensesOnly.forEach(t => {
    expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
  });

  const donutColors = ['#F87171', '#FBBF24', '#34D399', '#A78BFA', '#60A5FA'];
  
  const donutData = {
    labels: Object.keys(expenseCategories).length > 0 ? Object.keys(expenseCategories) : ['Food', 'Fuel', 'Bills', 'Shopping', 'Others'],
    datasets: [{
      data: Object.keys(expenseCategories).length > 0 ? Object.values(expenseCategories) : [150, 100, 77, 250, 50],
      backgroundColor: donutColors,
      borderWidth: 0,
      hoverOffset: 4,
      cutout: '75%',
    }]
  };

  const handleDonutClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const clickedCategory = donutData.labels[index];
      setSelectedCategory(clickedCategory);
      setShowCategoryModal(true);
    }
  };

  const donutOptions = {
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    maintainAspectRatio: false,
    onClick: handleDonutClick,
  };

  // Spending Trend Line Chart
  let lineLabels = [];
  let lineDataPoints = [];
  
  if (timeFilter === 'Daily') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      lineLabels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
      const sum = transactions.filter(t => t.type === 'expense' && new Date(t.date || t.createdAt).toDateString() === d.toDateString()).reduce((acc, t) => acc + t.amount, 0);
      lineDataPoints.push(sum);
    }
  } else if (timeFilter === 'Weekly') {
    lineLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    lineDataPoints = [0, 0, 0, 0];
    transactions.filter(t => t.type === 'expense' && new Date(t.date || t.createdAt).getMonth() === now.getMonth() && new Date(t.date || t.createdAt).getFullYear() === now.getFullYear()).forEach(t => {
      const d = new Date(t.date || t.createdAt);
      const week = Math.floor((d.getDate() - 1) / 7);
      if (week < 4) lineDataPoints[week] += t.amount;
      else lineDataPoints[3] += t.amount;
    });
  } else if (timeFilter === 'Monthly') {
    lineLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    lineDataPoints = new Array(12).fill(0);
    transactions.filter(t => t.type === 'expense' && new Date(t.date || t.createdAt).getFullYear() === now.getFullYear()).forEach(t => {
      lineDataPoints[new Date(t.date || t.createdAt).getMonth()] += t.amount;
    });
  } else if (timeFilter === 'Yearly') {
    const currentYear = now.getFullYear();
    for (let i = 4; i >= 0; i--) {
      lineLabels.push((currentYear - i).toString());
      const sum = transactions.filter(t => t.type === 'expense' && new Date(t.date || t.createdAt).getFullYear() === (currentYear - i)).reduce((acc, t) => acc + t.amount, 0);
      lineDataPoints.push(sum);
    }
  }

  const lineData = {
    labels: lineLabels,
    datasets: [{
      label: 'Spending',
      data: lineDataPoints,
      borderColor: '#A78BFA',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 150);
        gradient.addColorStop(0, 'rgba(167, 139, 250, 0.4)');
        gradient.addColorStop(1, 'rgba(167, 139, 250, 0.0)');
        return gradient;
      },
      borderWidth: 2,
      pointBackgroundColor: '#A78BFA',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      tension: 0.4,
      fill: true,
    }]
  };

  const lineOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false, drawBorder: false }, ticks: { color: '#6b7280', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false }, ticks: { color: '#6b7280', font: { size: 10 }, stepSize: 500, callback: (v) => v === 0 ? '0' : (v/1000) + 'K' } }
    },
    maintainAspectRatio: false,
  };

  // SVG Sparklines for Summary Cards
  const sparklineGreen = (
    <svg viewBox="0 0 100 30" className="sparkline">
      <defs>
        <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#34D399" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d="M0,25 L20,20 L40,25 L60,10 L80,15 L100,5" fill="none" stroke="#34D399" strokeWidth="2"/>
      <path d="M0,25 L20,20 L40,25 L60,10 L80,15 L100,5 L100,30 L0,30 Z" fill="url(#gradGreen)" stroke="none"/>
    </svg>
  );

  const sparklineRed = (
    <svg viewBox="0 0 100 30" className="sparkline">
      <defs>
        <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F87171" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#F87171" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d="M0,15 L20,10 L40,20 L60,15 L80,5 L100,20" fill="none" stroke="#F87171" strokeWidth="2"/>
      <path d="M0,15 L20,10 L40,20 L60,15 L80,5 L100,20 L100,30 L0,30 Z" fill="url(#gradRed)" stroke="none"/>
    </svg>
  );

  const sparklineBlue = (
    <svg viewBox="0 0 100 30" className="sparkline">
      <defs>
        <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d="M0,20 L20,25 L40,10 L60,15 L80,5 L100,15" fill="none" stroke="#60A5FA" strokeWidth="2"/>
      <path d="M0,20 L20,25 L40,10 L60,15 L80,5 L100,15 L100,30 L0,30 Z" fill="url(#gradBlue)" stroke="none"/>
    </svg>
  );

  const categoryDetails = {
    'Food': { icon: '🍔', color: '#34D399' },
    'Grocery': { icon: '🛒', color: '#10B981' },
    'Fuel': { icon: '⛽', color: '#FBBF24' },
    'Shopping': { icon: '🛍️', color: '#A78BFA' },
    'Bills': { icon: '⚡', color: '#F87171' },
    'Others': { icon: '📦', color: '#60A5FA' },
  };

  const getCategoryDetail = (cat) => {
    // Find case-insensitive match for predefined categories
    const foundKey = Object.keys(categoryDetails).find(k => k.toLowerCase() === (cat || '').toLowerCase());
    return foundKey ? categoryDetails[foundKey] : { icon: '📊', color: '#60A5FA' };
  };

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const dynamicBudgetItems = budgets.map(b => {
    const detail = getCategoryDetail(b.category);
    const spent = transactions
      .filter(t => 
        t.type === 'expense' && 
        (t.category || '').toLowerCase() === (b.category || '').toLowerCase() &&
        new Date(t.date || t.createdAt) >= startOfMonth &&
        new Date(t.date || t.createdAt) <= endOfMonth
      )
      .reduce((acc, curr) => acc + curr.amount, 0);

    return {
      id: b._id || b.id,
      icon: detail.icon,
      label: b.category,
      color: detail.color,
      spent: spent,
      total: b.amount
    };
  });

  return (
    <div className="dashboard-container animate-fade-in stagger-1">
      
      {/* Total Balance Card */}
      <div className="balance-card-premium">
        <div className="balance-header-premium">
          <span className="balance-label">Total Balance <Eye size={14} style={{marginLeft: '6px', opacity: 0.6}}/></span>
        </div>
        <h1 className="balance-amount-premium">₹{totalBalance.toLocaleString()}</h1>
        <div className="balance-trend">
          {balanceTrend >= 0 ? <TrendingUp size={14} color="#34D399" /> : <TrendingDown size={14} color="#F87171" />}
          <span style={{ color: balanceTrend >= 0 ? '#34D399' : '#F87171', marginLeft: '4px', fontSize: '0.8rem', fontWeight: 500 }}>{Math.abs(balanceTrend).toFixed(1)}%</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', marginLeft: '6px', fontSize: '0.8rem' }}>vs last month</span>
        </div>
        

        <div className="balance-actions">
          <button className="b-action-btn" onClick={() => setShowAddIncomeModal(true)}>
            <Plus size={14} color="#34D399" /> Add Income
          </button>
          <button className="b-action-btn" onClick={() => setShowAddExpenseModal(true)}>
            <Plus size={14} color="#F87171" /> Add Expense
          </button>
        </div>
      </div>

      {/* Summary Cards Row (3 Cards) */}
      <div className="summary-cards-row">
        <div className="summary-card-small">
          <div className="sc-header">
            <div className="sc-icon-bg bg-green"><ArrowDownToLine size={16} color="#fff"/></div>
            <div className="sc-details-right">
              <span className="sc-label">Income</span>
              <span className="sc-amount">₹{incomes.toFixed(2)}</span>
            </div>
          </div>
          <div className="sc-footer">
            <div className="sc-trend-text">
              <span style={{color: incomeTrend >= 0 ? '#34D399' : '#F87171'}}>
                {incomeTrend >= 0 ? <TrendingUp size={10}/> : <TrendingDown size={10}/>} {Math.abs(incomeTrend).toFixed(1)}%
              </span>
              <span className="sc-vs">vs last month</span>
            </div>
            {sparklineGreen}
          </div>
        </div>

        <div className="summary-card-small">
          <div className="sc-header">
            <div className="sc-icon-bg bg-red"><ArrowUpFromLine size={16} color="#fff"/></div>
            <div className="sc-details-right">
              <span className="sc-label">Expense</span>
              <span className="sc-amount">₹{expenses.toFixed(2)}</span>
            </div>
          </div>
          <div className="sc-footer">
            <div className="sc-trend-text">
              <span style={{color: expenseTrend >= 0 ? '#F87171' : '#34D399'}}>
                {expenseTrend >= 0 ? <TrendingUp size={10}/> : <TrendingDown size={10}/>} {Math.abs(expenseTrend).toFixed(1)}%
              </span>
              <span className="sc-vs">vs last month</span>
            </div>
            {sparklineRed}
          </div>
        </div>

        <div className="summary-card-small">
          <div className="sc-header">
            <div className="sc-icon-bg bg-blue"><PiggyBank size={16} color="#fff"/></div>
            <div className="sc-details-right">
              <span className="sc-label">Savings</span>
              <span className="sc-amount">₹{savings}</span>
            </div>
          </div>
          <div className="sc-footer">
            <div className="sc-trend-text">
              <span style={{color: savingsTrend >= 0 ? '#34D399' : '#F87171'}}>
                {savingsTrend >= 0 ? <TrendingUp size={10}/> : <TrendingDown size={10}/>} {Math.abs(savingsTrend).toFixed(1)}%
              </span>
              <span className="sc-vs">vs last month</span>
            </div>
            {sparklineBlue}
          </div>
        </div>
      </div>

      {/* Time Filter Pills */}
      <div className="time-filter-pills">
        {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(filter => (
          <button 
            key={filter} 
            className={`time-pill ${timeFilter === filter ? 'active' : ''}`}
            onClick={() => setTimeFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Budget Overview */}
      <div className="section-card">
        <div className="section-header">
          <h3>Budget Overview</h3>
          <span className="section-link pill-btn" onClick={() => navigate('/budgets')}>Manage Budgets &gt;</span>
        </div>
        <div className="budget-list-premium">
          {dynamicBudgetItems.length > 0 ? (
            dynamicBudgetItems.map((budget, index) => {
              const percentage = Math.min((budget.spent / budget.total) * 100, 100);
              return (
                <div key={index} className="budget-item-premium">
                  <div className="bi-icon" style={{ backgroundColor: `${budget.color}15` }}>
                    {budget.icon}
                  </div>
                  <span className="bi-title">{budget.label}</span>
                  <div className="bi-progress-bg">
                    <div className="bi-progress-fill" style={{ width: `${percentage}%`, backgroundColor: budget.color }}></div>
                  </div>
                  <span className="bi-percent" style={{ color: budget.color }}>{percentage.toFixed(0)}%</span>
                  <div className="bi-amounts">
                    <span className="bi-spent">₹{budget.spent.toLocaleString()}</span>
                    <span className="bi-total">of ₹{budget.total.toLocaleString()}</span>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="empty-text">No active budgets. Set up a budget to see your progress here!</div>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="section-card half-card donut-section">
          <div className="section-header">
            <h3>Expense Breakdown</h3>
            <span className="section-link pill-btn">{timeFilter === 'Daily' ? 'Today' : `This ${timeFilter.replace('ly', '')}`} v</span>
          </div>
          <div className="donut-container">
            <div className="donut-wrapper">
              <Doughnut data={donutData} options={donutOptions} />
              <div className="donut-center-text">
                <span className="dc-amount">₹{expenses.toFixed(0)}</span>
                <span className="dc-label">Total</span>
              </div>
            </div>
            <div className="custom-legend">
              {donutData.labels.map((cat, i) => {
                const amount = donutData.datasets[0].data[i];
                const total = donutData.datasets[0].data.reduce((a,b)=>a+b,0);
                const pct = ((amount / total) * 100).toFixed(1);
                const isActive = selectedCategory === cat;
                return (
                  <div 
                    key={cat} 
                    className="legend-item" 
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCategoryModal(true);
                    }}
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                  >
                    <div className="legend-color" style={{backgroundColor: donutColors[i]}}></div>
                    <span className="legend-label" style={{ fontWeight: isActive ? 700 : 400, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{cat}</span>
                    <span className="legend-value">₹{amount} <span className="legend-pct">({pct}%)</span></span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="card-footer-link">View Details &gt;</div>
        </div>

        <div className="section-card half-card trend-section">
          <div className="section-header">
            <h3>Spending Trend</h3>
            <span className="section-link pill-btn">{timeFilter === 'Daily' ? 'Today' : `This ${timeFilter.replace('ly', '')}`} v</span>
          </div>
          <div className="line-chart-container">
             <Line data={lineData} options={lineOptions} />
          </div>
          <div className="card-footer-link">View Details &gt;</div>
        </div>
      </div>

      {/* Recent Transactions - Hidden behind click */}
      <div className="section-card" onClick={() => setShowRecentTxsModal(true)} style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <h3>Recent Transactions</h3>
          <span className="section-link" style={{ pointerEvents: 'none' }}>Click to View &gt;</span>
        </div>
      </div>

      {showAddIncomeModal && <AddIncomeModal onClose={() => setShowAddIncomeModal(false)} />}
      {showAddExpenseModal && <AddExpenseModal onClose={() => setShowAddExpenseModal(false)} />}
      
      {showRecentTxsModal && ReactDOM.createPortal(
        <div className="modal-overlay">
          <div className="glass-panel modal-content" style={{maxWidth: '500px', padding: '1.5rem', borderRadius: '24px', background: 'var(--card-bg)'}}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{selectedCategory ? `Expenses: ${selectedCategory}` : 'Recent Transactions'}</h2>
              <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                {selectedCategory && <span className="section-link" onClick={(e) => { e.stopPropagation(); setSelectedCategory(null); }} style={{cursor: 'pointer', fontSize: '0.9rem'}}>Clear Filter</span>}
                <button className="modal-close" onClick={() => { setShowRecentTxsModal(false); setSelectedCategory(null); }} style={{ position: 'static', background: 'rgba(255,255,255,0.1)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>&times;</button>
              </div>
            </div>
            <div className="transaction-list-premium" style={{maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem'}}>
              {(() => {
                let displayTxs = [...transactions].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
                if (selectedCategory) {
                  displayTxs = displayTxs.filter(t => t.type === 'expense' && t.category === selectedCategory);
                }
                displayTxs = displayTxs.slice(0, 15); // Show top 15 in modal

                if (displayTxs.length === 0) {
                  return <div className="empty-text">No transactions found.</div>;
                }

                return displayTxs.map(t => {
                  const isIncome = t.type === 'income';
                  const Icon = isIncome ? ArrowDownToLine : ArrowUpFromLine;
                  const colorClass = isIncome ? 'bg-green' : 'bg-red';
                  const textClass = isIncome ? 'text-green' : 'text-red';
                  const prefix = isIncome ? '+' : '-';
                  const dateStr = new Date(t.date || t.createdAt).toLocaleDateString();

                  return (
                    <div 
                      key={t._id || t.id} 
                      className="t-item-mock" 
                      onClick={() => {
                        setShowRecentTxsModal(false); // Close list to show details properly
                        setSelectedTransaction(t);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={`t-icon ${colorClass}`}><Icon size={16} color="#fff"/></div>
                      <div className="t-details"><span className="t-title">{t.text}</span><span className="t-cat">{t.category}</span></div>
                      <div className="t-amount-date">
                        <span className={`t-amt ${textClass}`}>{prefix} ₹{t.amount.toLocaleString()}</span>
                        <span className="t-date">{dateStr}</span>
                      </div>
                      <span className="t-arrow">&gt;</span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>,
        document.body
      )}
      
      {showCategoryModal && selectedCategory && ReactDOM.createPortal(
        <div className="modal-overlay">
          <div className="glass-panel modal-content" style={{maxWidth: '500px', padding: '1.5rem', borderRadius: '24px', background: 'var(--card-bg)'}}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Expenses: {selectedCategory}</h2>
              <button className="modal-close" onClick={() => setShowCategoryModal(false)} style={{ position: 'static', background: 'rgba(255,255,255,0.1)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>&times;</button>
            </div>
            <div className="transaction-list-premium" style={{maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem'}}>
              {(() => {
                let displayTxs = [...transactions]
                  .filter(t => t.type === 'expense' && t.category === selectedCategory)
                  .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

                if (displayTxs.length === 0) {
                  return <div className="empty-text">No expenses found for this category.</div>;
                }

                return displayTxs.map(t => {
                  const dateStr = new Date(t.date || t.createdAt).toLocaleDateString();
                  return (
                    <div 
                      key={t._id || t.id} 
                      className="t-item-mock"
                      onClick={() => setSelectedTransaction(t)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="t-icon bg-red"><ArrowUpFromLine size={16} color="#fff"/></div>
                      <div className="t-details"><span className="t-title">{t.text}</span><span className="t-cat">{t.category}</span></div>
                      <div className="t-amount-date">
                        <span className="t-amt text-red">- ₹{t.amount.toLocaleString()}</span>
                        <span className="t-date">{dateStr}</span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>,
        document.body
      )}

      {selectedTransaction && ReactDOM.createPortal(
        <div className="modal-overlay">
          <div className="glass-panel modal-content" style={{maxWidth: '400px', padding: '2rem', borderRadius: '24px', background: 'var(--card-bg)', textAlign: 'center'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Transaction Details</h2>
              <button className="modal-close" onClick={() => setSelectedTransaction(null)} style={{ position: 'static', background: 'rgba(255,255,255,0.1)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>&times;</button>
            </div>
            
            <div style={{ padding: '1rem 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: selectedTransaction.type === 'income' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                {selectedTransaction.type === 'income' ? <ArrowDownToLine size={32} color="#34D399"/> : <ArrowUpFromLine size={32} color="#F87171"/>}
              </div>
              <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem', color: selectedTransaction.type === 'income' ? '#34D399' : '#F87171' }}>
                {selectedTransaction.type === 'income' ? '+' : '-'} ₹{selectedTransaction.amount.toLocaleString()}
              </h1>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem' }}>{selectedTransaction.text}</h3>
              <p style={{ margin: '0 0 2rem', color: 'var(--text-secondary)' }}>{new Date(selectedTransaction.date || selectedTransaction.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Category</span>
                  <span style={{ fontWeight: 600 }}>{selectedTransaction.category}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Type</span>
                  <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{selectedTransaction.type}</span>
                </div>
                {selectedTransaction.description && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Notes</span>
                    <span style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{selectedTransaction.description}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
