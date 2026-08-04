import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Trash2, Edit2, Search, Plus } from 'lucide-react';
import { EditTransactionModal } from '../components/EditTransactionModal';
import { AddIncomeModal } from '../components/AddIncomeModal';

export const IncomeManagement = () => {
  const { transactions, deleteTransaction, loading } = useContext(GlobalContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter only income transactions
  const incomeTransactions = transactions.filter(t => t.type === 'income');

  // Apply search filter and sort by date descending
  const filteredIncome = incomeTransactions
    .filter(t => 
      t.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

  return (
    <>
      <div className="glass-panel animate-fade-in" style={{ gridColumn: 'span 2' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3>Income Management</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="search-bar">
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search income..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 16px', background: 'var(--accent-income)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}
          >
            <Plus size={18} /> Add Income
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : filteredIncome.length > 0 ? (
              filteredIncome.map(t => (
                <tr key={t._id}>
                  <td>{new Date(t.date || t.createdAt).toLocaleDateString()}</td>
                  <td>{t.text}</td>
                  <td><span className="badge badge-income">{t.category}</span></td>
                  <td className="plus">₹{t.amount.toFixed(2)}</td>
                  <td>
                    <button className="action-btn edit" onClick={() => setEditingTransaction(t)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="action-btn delete" onClick={() => {
                      if (window.confirm("Are you sure you want to delete this income?")) {
                        deleteTransaction(t._id);
                      }
                    }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8' }}>No income records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      </div>

      {editingTransaction && (
        <EditTransactionModal 
          transaction={editingTransaction} 
          onClose={() => setEditingTransaction(null)} 
        />
      )}

      {showAddModal && (
        <AddIncomeModal 
          onClose={() => setShowAddModal(false)}
        />
      )}
    </>
  );
};
