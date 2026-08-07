import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GlobalContext } from '../context/GlobalState';
import { User, Mail, Shield, LogOut } from 'lucide-react';

export const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const { clearTransactions } = useContext(GlobalContext);

  const handleLogout = () => {
    logout();
    clearTransactions();
  };

  if (!user) return null;

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <User size={24} /> My Profile
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
          <User size={20} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Full Name</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '500', whiteSpace: 'normal', wordBreak: 'break-word' }}>{user.name}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
          <Mail size={20} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email Address</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '500', whiteSpace: 'normal', wordBreak: 'break-all' }}>{user.email}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
          <Shield size={20} color={user.role === 'developer' ? 'var(--accent-income)' : 'var(--accent-primary)'} style={{ flexShrink: 0 }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Account Role</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '500', textTransform: 'capitalize', whiteSpace: 'normal', wordBreak: 'break-word' }}>
              {user.role} {user.role === 'developer' && <span style={{ fontSize: '0.8rem', background: 'var(--accent-income)', color: '#fff', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px', whiteSpace: 'nowrap' }}>PRO</span>}
            </div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleLogout}
        className="btn animate-fade-in stagger-3" 
        style={{ marginTop: '2.5rem', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', transition: 'all 0.3s' }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.3)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
      >
        <LogOut size={20} /> Sign Out
      </button>
      <div className="watermark" style={{marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.6}}>
        Developed by<br />
        <span>Wise Automation&Technology</span>
      </div>
    </div>
  );
};
