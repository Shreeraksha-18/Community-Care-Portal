import React, { useState } from 'react';

export default function AuthModule({ initialMode = 'signup' }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [role, setRole] = useState('volunteer');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      alert(`Signing in: ${formData.email}`);
    } else {
      alert(`Creating ${role} account for: ${formData.firstName} ${formData.lastName}`);
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

      <div style={styles.tabContainer}>
        <button
          type="button"
          style={isLogin ? styles.activeTab : styles.inactiveTab}
          onClick={() => setIsLogin(true)}
        >
          Sign In
        </button>
        <button
          type="button"
          style={!isLogin ? styles.activeTab : styles.inactiveTab}
          onClick={() => setIsLogin(false)}
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
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.submitBtn}>
          {isLogin ? 'Sign In to Portal' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  cardContainer: {
    maxWidth: '420px',
    margin: '30px auto',
    padding: '28px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    backgroundColor: '#ffffff',
    textAlign: 'center',
    fontFamily: 'Inter, sans-serif'
  },

  header: {
    backgroundColor: '#0a3d24',
    padding: '16px',
    borderRadius: '8px',
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
    marginBottom: '15px'
  },

  tabContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },

  activeTab: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#0f6b3f',
    color: '#ffffff',
    border: 'none',
    fontWeight: 'bold',
    borderRadius: '6px',
    cursor: 'pointer'
  },

  inactiveTab: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#f2f4f7',
    color: '#667085',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },

  roleContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '5px'
  },

  activeRole: {
    flex: 1,
    padding: '8px',
    border: '2px solid #16995a',
    backgroundColor: '#f2faf5',
    color: '#0f6b3f',
    fontWeight: 'bold',
    borderRadius: '6px',
    cursor: 'pointer'
  },

  inactiveRole: {
    flex: 1,
    padding: '8px',
    border: '1px solid #d0d5dd',
    backgroundColor: '#ffffff',
    color: '#667085',
    borderRadius: '6px',
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
    borderRadius: '6px',
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
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '6px'
  }
};
