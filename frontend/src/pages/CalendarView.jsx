import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const CalendarView = () => {
  const { transactions } = useContext(GlobalContext);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayTransactions, setSelectedDayTransactions] = useState(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getTransactionsForDay = (day) => {
    return transactions.filter(t => {
      const d = new Date(t.date || t.createdAt);
      return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  };

  // Generate blank cells for padding
  const blanks = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    blanks.push(<div key={`blank-${i}`} className="calendar-day empty"></div>);
  }

  // Generate day cells
  const days = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dayTransactions = getTransactionsForDay(d);
    
    let totalIncome = 0;
    let totalExpense = 0;
    
    dayTransactions.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      if (t.type === 'expense') totalExpense += t.amount;
    });

    const isToday = new Date().getDate() === d && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear;

    days.push(
      <div 
        key={`day-${d}`} 
        className={`calendar-day ${isToday ? 'today' : ''} ${dayTransactions.length > 0 ? 'has-data' : ''}`}
        onClick={() => {
          if (dayTransactions.length > 0) {
            setSelectedDayTransactions({ day: d, transactions: dayTransactions });
          }
        }}
      >
        <div className="day-number">{d}</div>
        <div className="day-summary">
          {totalIncome > 0 && <span className="summary-income">+₹{totalIncome.toFixed(0)}</span>}
          {totalExpense > 0 && <span className="summary-expense">-₹{totalExpense.toFixed(0)}</span>}
        </div>
      </div>
    );
  }

  const totalSlots = [...blanks, ...days];

  return (
    <>
      <div className="glass-panel animate-fade-in" style={{ width: '100%' }}>
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="action-btn"><ChevronLeft /></button>
        <h3>{monthNames[currentMonth]} {currentYear}</h3>
        <button onClick={handleNextMonth} className="action-btn"><ChevronRight /></button>
      </div>

      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {totalSlots}
      </div>
      </div>

      {selectedDayTransactions && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxHeight: '80vh', overflowY: 'auto', width: '90%', maxWidth: '500px' }}>
            <button className="modal-close" onClick={() => setSelectedDayTransactions(null)}>
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: '1.5rem' }}>Transactions for {monthNames[currentMonth]} {selectedDayTransactions.day}, {currentYear}</h3>
            
            {(() => {
              const dayExpenses = selectedDayTransactions.transactions.filter(t => t.type === 'expense');
              const expenseCategories = {};
              dayExpenses.forEach(t => {
                expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
              });

              const donutColors = ['#F87171', '#FBBF24', '#34D399', '#A78BFA', '#60A5FA'];
              const hasExpenses = Object.keys(expenseCategories).length > 0;
              const totalExpenses = hasExpenses ? Object.values(expenseCategories).reduce((a,b)=>a+b,0) : 0;

              const donutData = {
                labels: hasExpenses ? Object.keys(expenseCategories) : ['No Expenses'],
                datasets: [{
                  data: hasExpenses ? Object.values(expenseCategories) : [1],
                  backgroundColor: hasExpenses ? donutColors : ['rgba(255,255,255,0.1)'],
                  borderWidth: 0,
                  hoverOffset: 4,
                  cutout: '75%',
                }]
              };

              const donutOptions = {
                plugins: { legend: { display: false }, tooltip: { enabled: hasExpenses } },
                maintainAspectRatio: false,
              };

              return (
                <>
                  <div style={{ height: '200px', position: 'relative', marginBottom: '2rem' }}>
                    <Doughnut data={donutData} options={donutOptions} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                      <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        ₹{totalExpenses.toFixed(0)}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Expenses</span>
                    </div>
                  </div>
                  
                  {hasExpenses && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                      {Object.keys(expenseCategories).map((cat, i) => (
                        <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: donutColors[i % donutColors.length] }}></div>
                          <span style={{ color: 'var(--text-secondary)' }}>{cat}</span>
                          <span style={{ fontWeight: 'bold' }}>₹{expenseCategories[cat]}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}

            <ul className="list" style={{ marginTop: '1.5rem', padding: 0 }}>
              {selectedDayTransactions.transactions.map(t => (
                <li key={t._id} className={t.type === 'income' ? 'plus' : 'minus'} style={{ cursor: 'default', display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '0.5rem' }}>
                  <div className="transaction-info" style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{t.text}</span>
                    <span className="transaction-cat" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.category}</span>
                  </div>
                  <span className="transaction-amount" style={{ fontWeight: 'bold', color: t.type === 'income' ? '#34D399' : '#F87171' }}>
                    {t.type === 'income' ? '+' : '-'}₹{Math.abs(t.amount).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
