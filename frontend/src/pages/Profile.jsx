import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

export const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <User size={24} /> My Profile
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
          <User size={20} color="var(--accent-primary)" />
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Full Name</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{user.name}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
          <Mail size={20} color="var(--accent-primary)" />
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email Address</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{user.email}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
          <Shield size={20} color={user.role === 'developer' ? 'var(--accent-income)' : 'var(--accent-primary)'} />
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Account Role</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '500', textTransform: 'capitalize' }}>
              {user.role} {user.role === 'developer' && <span style={{ fontSize: '0.8rem', background: 'var(--accent-income)', color: '#fff', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>PRO</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
