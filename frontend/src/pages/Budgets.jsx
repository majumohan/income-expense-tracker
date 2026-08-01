import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';

export const Budgets = () => {
  const { transactions, budgets, getBudgets, addBudget, deleteBudget } = useContext(GlobalContext);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    getBudgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!category || !amount) return;

    addBudget({
      category,
      amount: +amount
    });

    setCategory('');
    setAmount('');
  };

  // Get current month start and end dates
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return (
    <div className="animate-fade-in" style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Budget Management</h2>
      
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h3>Set a Category Budget</h3>
        <form onSubmit={onSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <div className="form-control" style={{ flex: '1', minWidth: '200px' }}>
            <label>Category</label>
            <input 
              type="text" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              placeholder="e.g. Food, Travel, Shopping..." 
              required
            />
          </div>
          <div className="form-control" style={{ flex: '1', minWidth: '200px' }}>
            <label>Budget Amount (₹)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="Enter amount..."
              min="1"
              required
            />
          </div>
          <button className="btn" type="submit" style={{ alignSelf: 'flex-end', minWidth: '150px' }}>Save Budget</button>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {budgets.map(budget => {
          // Calculate spent for this category in the current month
          const spent = transactions
            .filter(t => 
              t.type === 'expense' && 
              t.category.toLowerCase() === budget.category.toLowerCase() &&
              new Date(t.date || t.createdAt) >= startOfMonth &&
              new Date(t.date || t.createdAt) <= endOfMonth
            )
            .reduce((acc, t) => acc + t.amount, 0);
          
          const isExceeded = spent > budget.amount;
          const percentage = Math.min((spent / budget.amount) * 100, 100);
          const remaining = budget.amount - spent;

          return (
            <div key={budget._id} className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
              <button 
                onClick={() => deleteBudget(budget._id)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', color: 'var(--accent-expense)', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
                title="Delete Budget"
              >
                &times;
              </button>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'flex-end' }}>
                <div>
                  <h3 style={{ margin: 0, textTransform: 'capitalize' }}>{budget.category}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Monthly Budget: ₹{budget.amount.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: isExceeded ? 'var(--accent-expense)' : 'var(--text-primary)' }}>
                    ₹{spent.toLocaleString()} Spent
                  </div>
                  {isExceeded ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-expense)', fontWeight: 'bold' }}>
                      Exceeded by ₹{Math.abs(remaining).toLocaleString()}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-income)' }}>
                      ₹{remaining.toLocaleString()} Remaining
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar Container */}
              <div style={{ height: '12px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${percentage}%`, 
                  background: isExceeded ? 'var(--accent-expense)' : 'var(--accent-primary)',
                  transition: 'width 0.5s ease-in-out, background 0.3s ease'
                }} />
              </div>
            </div>
          );
        })}

        {budgets.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
            No budgets set yet. Add a category above to start tracking!
          </div>
        )}
      </div>
    </div>
  );
};
