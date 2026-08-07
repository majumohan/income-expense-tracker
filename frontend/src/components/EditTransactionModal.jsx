import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { X } from 'lucide-react';

export const EditTransactionModal = ({ transaction, onClose }) => {
  const predefinedExpenseCategories = ['Food', 'Grocery', 'Travel', 'Shopping', 'Medical', 'Education', 'Entertainment', 'Electricity', 'Fuel', 'Rent', 'Insurance', 'Mobile Recharge', 'Internet', 'Others'];
  const predefinedIncomeCategories = ['Salary', 'Business', 'Freelancing', 'Bonus', 'Interest'];

  const isCustom = transaction.type === 'expense' 
    ? !predefinedExpenseCategories.includes(transaction.category)
    : !predefinedIncomeCategories.includes(transaction.category);

  const [text, setText] = useState(transaction.text);
  const [amount, setAmount] = useState(transaction.amount);
  const [type, setType] = useState(transaction.type);
  const [category, setCategory] = useState(isCustom ? 'Custom' : transaction.category);
  const [customCategory, setCustomCategory] = useState(isCustom ? transaction.category : '');
  const [date, setDate] = useState(
    new Date(transaction.date || transaction.createdAt).toISOString().split('T')[0]
  );

  const { editTransaction } = useContext(GlobalContext);

  const onSubmit = (e) => {
    e.preventDefault();

    const finalCategory = category === 'Custom' ? customCategory : category;
    if (category === 'Custom' && !customCategory.trim()) {
      alert("Please enter a custom category name");
      return;
    }

    const updatedTransaction = {
      text,
      amount: +amount,
      type,
      category: finalCategory,
      date
    };

    editTransaction(transaction._id, updatedTransaction);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        <h3>Edit Transaction</h3>
        
        <form onSubmit={onSubmit}>
          <div className="form-control">
            <label>Description</label>
            <input 
              type="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              required
            />
          </div>

          <div className="form-control">
            <label>Amount</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
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
            <label>Type</label>
            <select value={type} onChange={(e) => {
              setType(e.target.value);
              setCategory(e.target.value === 'income' ? 'Salary' : 'General');
            }}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          
          <div className="form-control">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {type === 'expense' ? (
                <>
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
                </>
              ) : (
                <>
                  <option value="Salary">Salary</option>
                  <option value="Business">Business</option>
                  <option value="Freelancing">Freelancing</option>
                  <option value="Bonus">Bonus</option>
                  <option value="Interest">Interest</option>
                  <option value="Custom">Custom</option>
                </>
              )}
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

          <button className="btn" type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};
