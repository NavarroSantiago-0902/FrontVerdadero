import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const IconGrid = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const IconUser = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const IconCalendar = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);

const IconChart = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">⚽</div>
        <div>
          <div className="logo-text">Real Madrid</div>
          <div className="logo-sub">Fútbol 5</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <IconGrid /> Dashboard
        </NavLink>
        <div className="nav-section">Gestión</div>
        <NavLink to="/players" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <IconUser /> Jugadores
        </NavLink>
        <NavLink to="/trainings" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <IconCalendar /> Entrenamientos
        </NavLink>
        <NavLink to="/results" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <IconChart /> Resultados
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-pill">
          <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
            {user?.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: 13 }}>{user}</span>
        </div>
        <button className="btn-logout" onClick={logout}>Cerrar sesión</button>
      </div>
    </aside>
  );
}
