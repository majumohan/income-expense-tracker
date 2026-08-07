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
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Profile } from './pages/Profile';
import { Blog } from './pages/Blog';
import { AuthProvider, AuthContext, setAuthToken } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Menu, X, LayoutDashboard, TrendingUp, TrendingDown, PieChart, Calendar, User, LogOut, LogIn, UserPlus, BookOpen, Home, ArrowRightLeft, Bell, Plus, BarChart2 } from 'lucide-react';

import './index.css';

const MainLayout = () => {
  const { getTransactions, clearTransactions, getBudgets } = React.useContext(GlobalContext);
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
      getBudgets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || 
                     location.pathname === '/register' || 
                     location.pathname === '/dev-login' || 
                     location.pathname === '/dev-register' ||
                     location.pathname === '/forgot-password' ||
                     location.pathname.startsWith('/reset-password');

  return (
    <div className={isAuthPage ? "auth-layout" : "app-layout mobile-app-layout"}>
      {/* Mobile Top Bar */}
      {!isAuthPage && (
        <header className="top-app-bar">

          <div className="app-title-container">
            <img src="/wallet_icon.png" alt="Wallet Logo" style={{ width: '24px', height: '24px', marginRight: '8px', objectFit: 'contain' }} />
            <span className="app-title">Income Expense Tracker</span>
          </div>

        </header>
      )}

      {/* Desktop Sidebar */}
      {!isAuthPage && (
        <aside className="desktop-sidebar">
          <div className="nav-brand">
            <div className="brand-text-container">
              <img src="/wallet_icon.png" alt="Wallet Logo" style={{ width: '28px', height: '28px', marginRight: '10px', objectFit: 'contain' }} />
              <span className="brand-text">Income Expense Tracker</span>
            </div>
          </div>
          
          <div className="nav-links">
            {isAuthenticated ? (
              <>
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                  <LayoutDashboard size={20} /> Dashboard
                </Link>
                <Link to="/income" className={`nav-link ${location.pathname === '/income' ? 'active' : ''}`}>
                  <TrendingUp size={20} /> Income
                </Link>
                <Link to="/expense" className={`nav-link ${location.pathname === '/expense' ? 'active' : ''}`}>
                  <TrendingDown size={20} /> Expense
                </Link>
                <Link to="/budgets" className={`nav-link ${location.pathname === '/budgets' ? 'active' : ''}`}>
                  <PieChart size={20} /> Budgets
                </Link>
                <Link to="/calendar" className={`nav-link ${location.pathname === '/calendar' ? 'active' : ''}`}>
                  <Calendar size={20} /> Calendar
                </Link>

                <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
                  <User size={20} /> Profile
                </Link>

              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  <LogIn size={20} /> Login
                </Link>
                <Link to="/register" className="nav-link">
                  <UserPlus size={20} /> Register
                </Link>
              </>
            )}
            <div className="watermark">
              Developed by<br /><span>Wise Automation&Technology</span>
            </div>
          </div>
        </aside>
      )}


      <main className={isAuthPage ? "auth-content" : "main-content mobile-main-content"}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/dev-login" element={<Login isDeveloper={true} />} />
          <Route path="/dev-register" element={<DeveloperRegister />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/income" element={<PrivateRoute><IncomeManagement /></PrivateRoute>} />
          <Route path="/expense" element={<PrivateRoute><ExpenseManagement /></PrivateRoute>} />
          <Route path="/budgets" element={<PrivateRoute><Budgets /></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><CalendarView /></PrivateRoute>} />
          <Route path="/blog" element={<PrivateRoute><Blog /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </main>

      {!isAuthPage && (
        <nav className="bottom-nav-bar">
          <Link to="/" className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <LayoutDashboard size={24} />
            <span>Dashboard</span>
          </Link>
          <Link to="/income" className={`bottom-nav-item ${location.pathname === '/income' ? 'active' : ''}`}>
            <TrendingUp size={24} />
            <span>Income</span>
          </Link>
          


          <Link to="/expense" className={`bottom-nav-item ${location.pathname === '/expense' ? 'active' : ''}`}>
            <TrendingDown size={24} />
            <span>Expense</span>
          </Link>
          <Link to="/budgets" className={`bottom-nav-item ${location.pathname === '/budgets' ? 'active' : ''}`}>
            <PieChart size={24} />
            <span>Budgets</span>
          </Link>
          <Link to="/calendar" className={`bottom-nav-item ${location.pathname === '/calendar' ? 'active' : ''}`}>
            <Calendar size={24} />
            <span>Calendar</span>
          </Link>
          <Link to="/profile" className={`bottom-nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
            <User size={24} />
            <span>Profile</span>
          </Link>
        </nav>
      )}
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
