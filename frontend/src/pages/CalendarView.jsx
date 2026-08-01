import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

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
          <div className="modal-content glass-panel" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={() => setSelectedDayTransactions(null)}>
              <X size={24} />
            </button>
            <h3>Transactions for {monthNames[currentMonth]} {selectedDayTransactions.day}, {currentYear}</h3>
            
            <ul className="list" style={{ marginTop: '1.5rem' }}>
              {selectedDayTransactions.transactions.map(t => (
                <li key={t._id} className={t.type === 'income' ? 'plus' : 'minus'} style={{ cursor: 'default' }}>
                  <div className="transaction-info">
                    <span>{t.text}</span>
                    <span className="transaction-cat">{t.category}</span>
                  </div>
                  <span className="transaction-amount">
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
