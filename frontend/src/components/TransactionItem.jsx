import React from 'react';

export const TransactionItem = ({ transaction }) => {
  const sign = transaction.type === 'income' ? '+' : '-';

  return (
    <li className={transaction.type === 'income' ? 'plus' : 'minus'}>
      <div className="transaction-info">
        <span>{transaction.text}</span>
        <span className="transaction-cat">{transaction.category} • {new Date(transaction.date || transaction.createdAt).toLocaleDateString()}</span>
      </div>
      <span className="transaction-amount">{sign}₹{Math.abs(transaction.amount).toFixed(2)}</span>
    </li>
  );
};
