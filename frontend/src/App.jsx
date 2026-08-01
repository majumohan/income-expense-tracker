import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { GlobalProvider, GlobalContext } from './context/GlobalState';
import { IncomeManagement } from './pages/IncomeManagement';
import { ExpenseManagement } from './pages/ExpenseManagement';
import { CalendarView } from './pages/CalendarView';
import { Budgets } from './pages/Budgets';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DeveloperRegister } from './pages/DeveloperRegister';
import { Profile } from './pages/Profile';
import { AuthProvider, AuthContext, setAuthToken } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Menu, X, LayoutDashboard, TrendingUp, TrendingDown, PieChart, Calendar, User, LogOut, LogIn, UserPlus } from 'lucide-react';

import './index.css';

const MainLayout = () => {
  const { getTransactions, clearTransactions } = React.useContext(GlobalContext);
  const { isAuthenticated, logout, user, loadUser } = React.useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  React.useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      getTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || 
                     location.pathname === '/register' || 
                     location.pathname === '/dev-login' || 
                     location.pathname === '/dev-register';

  return (
    <div className={isAuthPage ? "auth-layout" : "app-layout"}>
      {!isAuthPage && (
        <aside className="sidebar">
        <div className="nav-brand">
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="brand-text-container">
            <span style={{ fontSize: '1.5rem' }}>💼</span> 
            <span className="brand-text">Income Expense Tracker</span>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
        )}
        
        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-drawer-header">
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Menu</span>
            <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          {isAuthenticated ? (
            <>
              <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <LayoutDashboard size={20} /> Dashboard
              </Link>
              <Link to="/income" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <TrendingUp size={20} /> Income
              </Link>
              <Link to="/expense" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <TrendingDown size={20} /> Expense
              </Link>
              <Link to="/budgets" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <PieChart size={20} /> Budgets
              </Link>
              <Link to="/calendar" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <Calendar size={20} /> Calendar
              </Link>
              <Link to="/profile" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <User size={20} /> Profile
              </Link>
              
              <div>
                <button 
                  onClick={() => { logout(); clearTransactions(); setIsMobileMenuOpen(false); }}
                  className="nav-link"
                  style={{ width: '100%', border: 'none', cursor: 'pointer', color: 'var(--accent-expense)' }}
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <LogIn size={20} /> Login
              </Link>
              <Link to="/register" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <UserPlus size={20} /> Register
              </Link>
            </>
          )}

          {/* Watermark */}
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.8, lineHeight: '1.4' }}>
            Developed by<br />
            <span style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>Wise Automation&Technology</span>
          </div>
        </div>
      </aside>
      )}

      <main className={isAuthPage ? "auth-content" : "main-content"}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dev-login" element={<Login isDeveloper={true} />} />
          <Route path="/dev-register" element={<DeveloperRegister />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/income" element={<PrivateRoute><IncomeManagement /></PrivateRoute>} />
          <Route path="/expense" element={<PrivateRoute><ExpenseManagement /></PrivateRoute>} />
          <Route path="/budgets" element={<PrivateRoute><Budgets /></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><CalendarView /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <Router>
          <MainLayout />
        </Router>
      </GlobalProvider>
    </AuthProvider>
  );
}

export default App;
