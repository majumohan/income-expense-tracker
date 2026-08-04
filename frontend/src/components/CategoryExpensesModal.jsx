import React from 'react';
import { X } from 'lucide-react';

export const CategoryExpensesModal = ({ category, transactions, onClose }) => {
  // Filter transactions by the selected category and expense type
  const categoryExpenses = transactions.filter(t => t.type === 'expense' && t.category === category)
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

  const totalAmount = categoryExpenses.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '500px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
          {category} Expenses
        </h3>
        
        <div style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
          Total Spent: <span className="minus" style={{ color: 'var(--accent-expense)' }}>₹{totalAmount.toFixed(2)}</span>
        </div>

        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {categoryExpenses.length > 0 ? (
            <ul className="list">
              {categoryExpenses.map(t => (
                <li key={t._id} className="minus" style={{ marginBottom: '8px' }}>
                  <div className="transaction-info">
                    <span style={{ fontWeight: '500' }}>{t.text}</span>
                    <span className="transaction-cat">{new Date(t.date || t.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="transaction-amount">₹{t.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No expenses in this category.</p>
          )}
        </div>
      </div>
    </div>
  );
};
