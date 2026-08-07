import React, { useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';
import '../index.css';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    const res = await resetPassword(token, password);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } else {
      setError(res.error || 'Failed to reset password');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container" style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
      <div className="auth-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.75rem' }}>New Password</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Enter your new password below</p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {success ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={32} />
            <p style={{ fontWeight: '500' }}>Password Reset Successfully!</p>
            <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>You are being redirected to the dashboard...</p>
          </div>
          <Link to="/" style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', textDecoration: 'none' }}>Go to Dashboard manually</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>New Password</label>
            <div className="input-with-icon" style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={loading}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem', transition: 'all 0.2s' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Confirm New Password</label>
            <div className="input-with-icon" style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={loading}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem', transition: 'all 0.2s' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '0.875rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s' }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
};
