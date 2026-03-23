import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const navItems = [
  { to:'/admin', label:'แดชบอร์ด', icon:'📊', end:true },
  { to:'/admin/products', label:'สินค้า', icon:'📦' },
  { to:'/admin/news', label:'ข่าวสาร', icon:'📰' },
  { to:'/admin/reviews', label:'รีวิว', icon:'⭐' },
  { to:'/admin/certificates', label:'ใบรับรอง', icon:'📜' },
  { to:'/admin/board-members', label:'คณะกรรมการ', icon:'👥' },
  { to:'/admin/banners', label:'แบนเนอร์', icon:'🖼️' },
  { to:'/admin/settings', label:'ตั้งค่าเว็บไซต์', icon:'⚙️' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleLogout = () => { logout(); navigate('/admin/login'); };

  // Close sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`admin-sidebar${mobileOpen ? ' open' : ''}`}>
        <div className="sidebar-logo">
          <img src="/logo.jpg" alt="PSU Blen" className="sidebar-logo-img" />
          <small className="sidebar-admin-label">Admin Panel</small>
          <button className="sidebar-close-btn" onClick={() => setMobileOpen(false)} aria-label="ปิดเมนู">✕</button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({isActive}) => `sidebar-link${isActive?' active':''}`}>
              <span className="sidebar-link-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p className="sidebar-user">👤 {user?.username || 'Admin'}</p>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>ออกจากระบบ</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <button className="hamburger-btn" onClick={() => setMobileOpen(true)} aria-label="เปิดเมนู">
            <span /><span /><span />
          </button>
          <h2 className="topbar-title">PSU AGRO FOOD — Admin CMS</h2>
          <a href="/" target="_blank" rel="noreferrer" className="topbar-preview">ดูเว็บไซต์</a>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
