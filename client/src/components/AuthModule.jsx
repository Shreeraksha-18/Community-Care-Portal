import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function AuthModule({ initialMode = 'signup' }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [role, setRole] = useState('volunteer');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      let res;
      if (isLogin) {
        // Call login endpoint
        res = await API.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
      } else {
        // Call register endpoint
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        res = await API.post('/auth/register', {
          name: fullName || 'User',
          email: formData.email,
          password: formData.password,
          role: role,
          phone: formData.phone
        });
      }

      const userData = res.data.data;
      // Store user info and JWT token in localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));

      // Navigate to corresponding role dashboard
      const targetRole = userData.role || role;
      if (targetRole === 'donor') {
        navigate('/donor');
      } else if (targetRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/volunteer');
      }
    } catch (err) {
      console.error('Authentication Error:', err);
      // Fallback for offline mode if local server isn't running yet
      if (err.message && err.message.includes('Network Error')) {
        const fallbackUser = {
          name: isLogin ? formData.email.split('@')[0] : `${formData.firstName} ${formData.lastName}`.trim() || 'User',
          email: formData.email,
          role: role,
          token: 'offline_demo_token'
        };
        localStorage.setItem('currentUser', JSON.stringify(fallbackUser));
        if (role === 'donor') navigate('/donor');
        else if (role === 'admin') navigate('/admin');
        else navigate('/volunteer');
      } else {
        setErrorMsg(err.response?.data?.message || 'Authentication failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.cardContainer}>
      <div style={styles.header}>
        <h1 style={styles.title}>Community Care</h1>
        <p style={styles.subtitle}>One Platform for Every Good Cause</p>
      </div>

      <h2 style={styles.formTitle}>
        {isLogin ? 'Welcome Back' : 'Create your account'}
      </h2>

      {errorMsg && (
        <div style={styles.errorBox}>
          ⚠️ {errorMsg}
        </div>
      )}

      <div style={styles.tabContainer}>
        <button
          type="button"
          style={isLogin ? styles.activeTab : styles.inactiveTab}
          onClick={() => {
            setIsLogin(true);
            setErrorMsg('');
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          style={!isLogin ? styles.activeTab : styles.inactiveTab}
          onClick={() => {
            setIsLogin(false);
            setErrorMsg('');
          }}
        >
          Create Account
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {!isLogin && (
          <div style={styles.roleContainer}>
            <button
              type="button"
              style={role === 'volunteer' ? styles.activeRole : styles.inactiveRole}
              onClick={() => setRole('volunteer')}
            >
              Volunteer
            </button>
            <button
              type="button"
              style={role === 'donor' ? styles.activeRole : styles.inactiveRole}
              onClick={() => setRole('donor')}
            >
              Donor
            </button>
            <button
              type="button"
              style={role === 'admin' ? styles.activeRole : styles.inactiveRole}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>
          </div>
        )}

        {!isLogin && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />

        {!isLogin && (
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            style={styles.input}
          />
        )}

        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          required
          minLength={6}
        />

        <button type="submit" style={styles.submitBtn} disabled={loading}>
          {loading ? 'Processing...' : isLogin ? 'Sign In to Portal' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  cardContainer: {
    maxWidth: '440px',
    margin: '30px auto',
    padding: '28px',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    backgroundColor: '#ffffff',
    textAlign: 'center',
    fontFamily: 'Inter, sans-serif'
  },
  header: {
    backgroundColor: '#0a3d24',
    padding: '16px',
    borderRadius: '10px',
    marginBottom: '20px'
  },
  title: {
    color: '#ffffff',
    margin: 0,
    fontSize: '22px',
    fontWeight: '800'
  },
  subtitle: {
    color: '#e3f5ea',
    margin: '4px 0 0 0',
    fontSize: '12px'
  },
  formTitle: {
    color: '#101828',
    fontSize: '18px',
    marginBottom: '15px',
    fontWeight: '700'
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '14px',
    textAlign: 'left'
  },
  tabContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px'
  },
  activeTab: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#0f6b3f',
    color: '#ffffff',
    border: 'none',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  inactiveTab: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#f2f4f7',
    color: '#667085',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  roleContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '5px'
  },
  activeRole: {
    flex: 1,
    padding: '8px',
    border: '2px solid #16995a',
    backgroundColor: '#f2faf5',
    color: '#0f6b3f',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  inactiveRole: {
    flex: 1,
    padding: '8px',
    border: '1px solid #d0d5dd',
    backgroundColor: '#ffffff',
    color: '#667085',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '8px',
    border: '1.5px solid #d0d5dd',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  submitBtn: {
    padding: '12px',
    backgroundColor: '#0f6b3f',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '6px'
  }
};
