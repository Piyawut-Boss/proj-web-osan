import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    api.get('banners/admin/dashboard')
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = stats ? [
    { icon: '📦', label: 'ผลิตภัณฑ์', count: stats.products, link: '/admin/products', color: '#3498db' },
    { icon: '📰', label: 'ข่าวสาร', count: stats.news, link: '/admin/news', color: '#e74c3c' },
    { icon: '⭐', label: 'รีวิว', count: stats.reviews, link: '/admin/reviews', color: '#f39c12' },
    { icon: '📜', label: 'ใบรับรอง', count: stats.certificates, link: '/admin/certificates', color: '#2ecc71' },
    { icon: '👥', label: 'กรรมการ', count: stats.board_members, link: '/admin/board-members', color: '#9b59b6' },
    { icon: '🖼️', label: 'แบนเนอร์', count: stats.banners, link: '/admin/banners', color: '#1abc9c' },
  ] : [];

  const v = stats?.visitors || {};

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>ภาพรวมระบบจัดการเนื้อหา PSU AGRO FOOD</p>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">🌐 ดูหน้าเว็บ →</a>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : (
        <>
          {/* ── Visitor Stats ── */}
          <div className="visitor-banner">
            <div className="visitor-banner-header">
              <span className="visitor-banner-icon">👁️</span>
              <h2>สถิติผู้เข้าชมเว็บไซต์</h2>
            </div>
            <div className="visitor-grid">
              <div className="visitor-card">
                <span className="visitor-num">{(v.todayUnique || 0).toLocaleString()}</span>
                <span className="visitor-label">ผู้เข้าชมวันนี้</span>
                <span className="visitor-sub">{(v.today || 0).toLocaleString()} pageviews</span>
              </div>
              <div className="visitor-card">
                <span className="visitor-num">{(v.week || 0).toLocaleString()}</span>
                <span className="visitor-label">7 วันล่าสุด</span>
              </div>
              <div className="visitor-card">
                <span className="visitor-num">{(v.month || 0).toLocaleString()}</span>
                <span className="visitor-label">30 วันล่าสุด</span>
              </div>
              <div className="visitor-card visitor-card-total">
                <span className="visitor-num">{(v.total || 0).toLocaleString()}</span>
                <span className="visitor-label">ทั้งหมด</span>
              </div>
            </div>
          </div>

          {/* ── Content Stats ── */}
          <div className="stats-grid">
            {STAT_CARDS.map(s => (
              <Link to={s.link} key={s.label} className="stat-card">
                <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>{s.icon}</div>
                <div className="stat-info">
                  <span className="stat-count" style={{ color: s.color }}>{s.count}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              </Link>
            ))}
          </div>

          {stats?.recentNews?.length > 0 && (
            <div className="recent-section">
              <h2>ข่าวสารล่าสุด</h2>
              <div className="recent-list">
                {stats.recentNews.map(n => (
                  <div key={n.id} className="recent-item">
                    <span className="recent-icon">📰</span>
                    <div>
                      <p className="recent-title">{n.title}</p>
                      <p className="recent-date">{new Date(n.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="quick-links">
            <h2>Quick Actions</h2>
            <div className="quick-grid">
              {[
                { to: '/admin/products', icon: '➕', label: 'เพิ่มผลิตภัณฑ์ใหม่' },
                { to: '/admin/news', icon: '📝', label: 'เพิ่มข่าวสาร' },
                { to: '/admin/banners', icon: '🖼️', label: 'จัดการแบนเนอร์' },
                { to: '/admin/board-members', icon: '👤', label: 'จัดการคณะกรรมการ' },
              ].map(a => (
                <Link key={a.to} to={a.to} className="quick-item">
                  <span className="quick-icon">{a.icon}</span>
                  <span>{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
