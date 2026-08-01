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
      let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
      if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);
      if (!API_URL.endsWith('/api')) API_URL += '/api';
      const res = await axios.get(`${API_URL}/transactions`);

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
      let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
      if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);
      if (!API_URL.endsWith('/api')) API_URL += '/api';
      await axios.delete(`${API_URL}/transactions/${id}`);

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
      let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
      if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);
      if (!API_URL.endsWith('/api')) API_URL += '/api';
      const res = await axios.post(`${API_URL}/transactions`, transaction, config);

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
      let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
      if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);
      if (!API_URL.endsWith('/api')) API_URL += '/api';
      const res = await axios.put(`${API_URL}/transactions/${id}`, updatedTransaction, config);

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
      let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
      if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);
      if (!API_URL.endsWith('/api')) API_URL += '/api';
      const res = await axios.get(`${API_URL}/budgets`);

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
      let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
      if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);
      if (!API_URL.endsWith('/api')) API_URL += '/api';
      const res = await axios.post(`${API_URL}/budgets`, budget, config);
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
      let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
      if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);
      if (!API_URL.endsWith('/api')) API_URL += '/api';
      await axios.delete(`${API_URL}/budgets/${id}`);
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
