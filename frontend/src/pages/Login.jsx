import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Login = ({ isDeveloper = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, isAuthenticated, error, clearErrors } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        {isDeveloper ? 'Developer Login' : 'Login to Account'}
      </h3>
      
      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-expense)', padding: '10px', borderRadius: '5px', marginBottom: '1rem', border: '1px solid var(--accent-expense)' }}>
          {error}
          <span style={{ float: 'right', cursor: 'pointer' }} onClick={clearErrors}>&times;</span>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="form-control">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter email..."
            required
          />
        </div>

        <div className="form-control">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter password..."
            required
          />
        </div>

        <button className="btn" type="submit" style={{ marginTop: '1rem' }}>Login</button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Don't have an account? <Link to={isDeveloper ? "/dev-register" : "/register"} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Register here</Link>
      </div>
    </div>
  );
};
