import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { X } from 'lucide-react';

export const AddIncomeModal = ({ onClose }) => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Salary');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const { addTransaction } = useContext(GlobalContext);

  const onSubmit = (e) => {
    e.preventDefault();

    const newTransaction = {
      text,
      amount: +amount,
      type: 'income',
      category,
      date
    };

    addTransaction(newTransaction);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        <h3>Add Income</h3>
        
        <form onSubmit={onSubmit}>
          <div className="form-control">
            <label>Description</label>
            <input 
              type="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="Enter description..."
              required
            />
          </div>

          <div className="form-control">
            <label>Amount</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="Enter amount..."
              min="0.01" step="0.01"
              required
            />
          </div>

          <div className="form-control">
            <label>Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required
            />
          </div>
          
          <div className="form-control">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Salary">Salary</option>
              <option value="Business">Business</option>
              <option value="Freelancing">Freelancing</option>
              <option value="Bonus">Bonus</option>
              <option value="Interest">Interest</option>
            </select>
          </div>

          <button className="btn" type="submit">Add Income</button>
        </form>
      </div>
    </div>
  );
};
