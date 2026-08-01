import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import AppReducer from './AppReducer';

// Initial state
const initialState = {
  transactions: [],
  budgets: [],
  error: null,
  loading: true
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  async function getTransactions() {
    try {
      const res = await axios.get('http://localhost:5006/api/transactions');

      dispatch({
        type: 'GET_TRANSACTIONS',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response?.data?.error || err.message
      });
    }
  }

  function clearTransactions() {
    dispatch({ type: 'CLEAR_TRANSACTIONS' });
  }

  async function deleteTransaction(id) {
    try {
      await axios.delete(`http://localhost:5006/api/transactions/${id}`);

      dispatch({
        type: 'DELETE_TRANSACTION',
        payload: id
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response?.data?.error || err.message
      });
    }
  }

  async function addTransaction(transaction) {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('http://localhost:5006/api/transactions', transaction, config);

      dispatch({
        type: 'ADD_TRANSACTION',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response?.data?.error || err.message
      });
    }
  }

  async function editTransaction(id, updatedTransaction) {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(`http://localhost:5006/api/transactions/${id}`, updatedTransaction, config);

      dispatch({
        type: 'EDIT_TRANSACTION',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response?.data?.error || err.message
      });
    }
  }

  // Budget Actions
  async function getBudgets() {
    try {
      const res = await axios.get('http://localhost:5006/api/budgets');

      dispatch({
        type: 'GET_BUDGETS',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response?.data?.error || err.message
      });
    }
  }

  async function addBudget(budget) {
    const config = { headers: { 'Content-Type': 'application/json' } };
    try {
      const res = await axios.post('http://localhost:5006/api/budgets', budget, config);
      dispatch({
        type: 'ADD_BUDGET',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response?.data?.error || err.message
      });
    }
  }

  async function deleteBudget(id) {
    try {
      await axios.delete(`http://localhost:5006/api/budgets/${id}`);
      dispatch({
        type: 'DELETE_BUDGET',
        payload: id
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response?.data?.error || err.message
      });
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        budgets: state.budgets,
        error: state.error,
        loading: state.loading,
        getTransactions,
        clearTransactions,
        deleteTransaction,
        addTransaction,
        editTransaction,
        getBudgets,
        addBudget,
        deleteBudget
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
