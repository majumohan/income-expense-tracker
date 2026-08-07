import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import '../index.css';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const { forgotPassword } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    const res = await forgotPassword(email);

    if (res.success) {
      setMessage('An email has been sent with instructions to reset your password.');
    } else {
      setError(res.error || 'Failed to send password reset email');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container" style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
      <div className="auth-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.75rem' }}>Reset Password</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Enter your email to receive a reset link</p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {message && (
        <div className="alert alert-success" style={{ padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Email Address</label>
          <div className="input-with-icon" style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem', transition: 'all 0.2s' }}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '0.875rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s', marginBottom: '1.5rem' }}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send Reset Link'}
        </button>
      </form>

      <div style={{ textAlign: 'center' }}>
        <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', transition: 'color 0.2s' }}>
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </div>
    </div>
  );
};
