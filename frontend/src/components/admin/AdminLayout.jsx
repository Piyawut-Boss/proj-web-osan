import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const navItems = [
  { to:'/admin', label:'แดชบอร์ด', end:true },
  { to:'/admin/products', label:'สินค้า' },
  { to:'/admin/news', label:'ข่าวสาร' },
  { to:'/admin/reviews', label:'รีวิว' },
  { to:'/admin/certificates', label:'ใบรับรอง' },
  { to:'/admin/board-members', label:'คณะกรรมการ' },
  { to:'/admin/banners', label:'แบนเนอร์' },
  { to:'/admin/settings', label:'ตั้งค่าเว็บไซต์' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <img src="/logo.jpg" alt="PSU Blen" className="sidebar-logo-img" />
          <small className="sidebar-admin-label">Admin Panel</small>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({isActive}) => `sidebar-link${isActive?' active':''}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p className="sidebar-user">{user?.username || 'Admin'}</p>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>ออกจากระบบ</button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
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
