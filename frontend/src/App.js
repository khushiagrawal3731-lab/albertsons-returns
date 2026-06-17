import React, { useState, useEffect } from 'react';
import './index.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import CreateReturn from './pages/CreateReturn';
import MyReturns from './pages/MyReturns';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    setPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setPage('dashboard');
  };

  if (!user) return <Login onLogin={handleLogin} />;

  const renderPage = () => {
    if (user.role === 'admin') return <AdminPanel />;
    switch (page) {
      case 'orders': return <Orders setPage={setPage} />;
      case 'create-return': return <CreateReturn setPage={setPage} />;
      case 'my-returns': return <MyReturns />;
      default: return <Dashboard user={user} setPage={setPage} />;
    }
  };

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} setPage={setPage} />
      <div className="container">{renderPage()}</div>
    </div>
  );
}