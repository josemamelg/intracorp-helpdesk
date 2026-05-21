import { Activity, BarChart3, ClipboardList, LogOut, ServerCog, Shield, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, roles: ['admin', 'soporte', 'empleado'] },
  { id: 'tickets', label: 'Tickets', icon: ClipboardList, roles: ['admin', 'soporte', 'empleado'] },
  { id: 'users', label: 'Usuarios', icon: Users, roles: ['admin'] },
  { id: 'audit', label: 'Auditoria', icon: Shield, roles: ['admin'] },
  { id: 'status', label: 'Sistema', icon: ServerCog, roles: ['admin', 'soporte'] },
  { id: 'simulate', label: 'Errores', icon: Activity, roles: ['admin', 'soporte'] }
];

export function Layout({ activePage, setActivePage, children }) {
  const { user, logout } = useAuth();
  const visibleItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">IC</div>
          <div>
            <strong>IntraCorp</strong>
            <span>Helpdesk</span>
          </div>
        </div>

        <nav className="nav-list">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={activePage === item.id ? 'active' : ''}
                onClick={() => setActivePage(item.id)}
                title={item.label}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <span className="eyebrow">Portal interno</span>
            <h1>IntraCorp Helpdesk</h1>
          </div>
          <div className="user-pill">
            <div>
              <strong>{user.name}</strong>
              <span>{user.role} · {user.email}</span>
            </div>
            <button className="icon-button" onClick={logout} title="Cerrar sesion">
              <LogOut size={18} />
            </button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
