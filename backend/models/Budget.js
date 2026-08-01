const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category for the budget'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add a positive number for the budget amount']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from creating multiple budgets for the same category
BudgetSchema.index({ user: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);
