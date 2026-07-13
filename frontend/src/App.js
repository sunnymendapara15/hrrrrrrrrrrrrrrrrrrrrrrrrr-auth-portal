import React, { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import UserManagement from './components/UserManagement';
import { login, signup } from './api';
import './styles.css';

const tokenKey = 'hr-auth-portal-token';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey));
  const [view, setView] = useState(token ? 'dashboard' : 'login');
  const [alert, setAlert] = useState('');

  useEffect(() => {
    if (token) {
      localStorage.setItem(tokenKey, token);
    } else {
      localStorage.removeItem(tokenKey);
    }
  }, [token]);

  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    setToken(result.token);
    setView('dashboard');
    setAlert(`Welcome back, ${result.user.name}`);
  };

  const handleSignup = async (form) => {
    const result = await signup(form);
    setToken(result.token);
    setView('dashboard');
    setAlert(`Account created for ${result.user.name}`);
  };

  const handleLogout = () => {
    setToken(null);
    setView('login');
    setAlert('You have been logged out.');
  };

  const handleViewSwitch = (name) => {
    setView(name);
    setAlert('');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>HR Auth Portal</h1>
          <p className="subtitle">Login, signup, and manage HR users in one place.</p>
        </div>
        {token ? (
          <button className="ghost-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <div className="header-links">
            <button
              className={view === 'login' ? 'active' : ''}
              onClick={() => handleViewSwitch('login')}
            >
              Login
            </button>
            <button
              className={view === 'signup' ? 'active' : ''}
              onClick={() => handleViewSwitch('signup')}
            >
              Signup
            </button>
          </div>
        )}
      </header>
      <main className="app-main">
        {alert && <p className="alert">{alert}</p>}
        {!token && view === 'login' && (
          <LoginForm onSubmit={handleLogin} onSwitch={() => handleViewSwitch('signup')} />
        )}
        {!token && view === 'signup' && (
          <SignupForm onSubmit={handleSignup} onSwitch={() => handleViewSwitch('login')} />
        )}
        {token && (
          <UserManagement
            token={token}
            onLogout={handleLogout}
            onNotify={(message) => setAlert(message)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
