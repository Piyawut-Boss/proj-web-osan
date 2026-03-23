import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.username, form.password);
    setLoading(false);
    if (result.success) {
      setError('');
      navigate('/admin');
    } else {
      setError(result.message || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      {/* Navbar with real logo */}
      <nav className="login-nav">
        <div className="login-nav-inner">
          <a href="/" className="login-brand">
            <img src="/logo.jpg" alt="PSU Blen" className="login-nav-logo" />
          </a>
          <div className="login-nav-links">
            <a href="/">หน้าหลัก</a>
            <a href="/about">เกี่ยวกับเรา</a>
            <a href="/products">ผลิตภัณฑ์</a>
            <a href="/news">ข่าวสาร</a>
            <a href="/certificates">ใบรับรองมาตรฐาน</a>
            <a href="/contact">ติดต่อเรา</a>
          </div>
        </div>
      </nav>

      <div className="login-body">
        <div className="login-card">
          {/* Card logo — real image */}
          <div className="login-card-logo">
            <img src="/logo.jpg" alt="PSU Blen — PSU AGRO FOOD CO., LTD." className="login-card-logo-img" />
          </div>

          <h2 className="login-title">Admin Login</h2>
          <p className="login-subtitle">PSU AGRO FOOD CO., LTD.</p>

          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="Enter username"
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
