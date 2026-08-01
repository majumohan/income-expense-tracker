export default (state, action) => {
  switch (action.type) {
    case 'GET_TRANSACTIONS':
      return {
        ...state,
        loading: false,
        transactions: action.payload
      };
    case 'CLEAR_TRANSACTIONS':
      return {
        ...state,
        transactions: [],
        budgets: [],
        error: null,
        loading: false
      };
    case 'GET_BUDGETS':
      return {
        ...state,
        loading: false,
        budgets: action.payload
      };
    case 'ADD_BUDGET':
    case 'UPDATE_BUDGET':
      // Check if budget already exists in state
      const exists = state.budgets.find(b => b.category === action.payload.category);
      return {
        ...state,
        budgets: exists 
          ? state.budgets.map(b => b.category === action.payload.category ? action.payload : b)
          : [...state.budgets, action.payload]
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget._id !== action.payload)
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction._id !== action.payload)
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction._id === action.payload._id ? action.payload : transaction
        )
      };
    case 'TRANSACTION_ERROR':
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};
