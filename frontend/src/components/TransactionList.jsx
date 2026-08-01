import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { TransactionItem } from './TransactionItem';

export const TransactionList = () => {
  const { transactions, getTransactions, loading } = useContext(GlobalContext);

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="glass-panel animate-fade-in stagger-2">
      <h3>Recent Transactions</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list">
          {transactions.map(transaction => (
            <TransactionItem key={transaction._id} transaction={transaction} />
          ))}
          {transactions.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center' }}>No transactions yet.</p>}
        </ul>
      )}
    </div>
  );
};
