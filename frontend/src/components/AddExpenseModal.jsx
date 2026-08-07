import React, { useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import { GlobalContext } from '../context/GlobalState';
import { X } from 'lucide-react';

export const AddExpenseModal = ({ onClose }) => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [customCategory, setCustomCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const { addTransaction } = useContext(GlobalContext);

  const onSubmit = (e) => {
    e.preventDefault();

    const finalCategory = category === 'Custom' ? customCategory : category;
    if (category === 'Custom' && !customCategory.trim()) {
      alert("Please enter a custom category name");
      return;
    }

    const newTransaction = {
      text,
      amount: +amount,
      type: 'expense',
      category: finalCategory,
      date
    };

    addTransaction(newTransaction);
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        <h3>Add Expense</h3>
        
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
              <option value="Food">Food</option>
              <option value="Grocery">Grocery</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Medical">Medical</option>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Electricity">Electricity</option>
              <option value="Fuel">Fuel</option>
              <option value="Rent">Rent</option>
              <option value="Insurance">Insurance</option>
              <option value="Mobile Recharge">Mobile Recharge</option>
              <option value="Internet">Internet</option>
              <option value="Others">Others</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          
          {category === 'Custom' && (
            <div className="form-control">
              <label>Custom Category</label>
              <input 
                type="text" 
                value={customCategory} 
                onChange={(e) => setCustomCategory(e.target.value)} 
                placeholder="Enter custom category..."
                required
              />
            </div>
          )}

          <button className="btn" type="submit" style={{ backgroundColor: 'var(--accent-expense)' }}>Add Expense</button>
        </form>
      </div>
    </div>,
    document.body
  );
};
