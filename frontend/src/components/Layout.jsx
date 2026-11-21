import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutGrid, BarChart3, LogOut } from 'lucide-react';

export default function Layout() {
  const { user, logoutUser } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)' }}>
      {/* ── Navbar ── */}
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          height: '48px',
          background: 'var(--c-surface)',
          borderBottom: '1px solid var(--c-border)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link
            to="/board"
            style={{
              fontSize: '13px', fontWeight: 700,
              color: 'var(--c-txt)', textDecoration: 'none',
              letterSpacing: '-0.02em',
            }}
          >
            SkillGraph<span style={{ color: 'var(--c-txt-3)', fontWeight: 500 }}>+</span>
          </Link>

          <nav style={{ display: 'flex', gap: '2px' }}>
            {[
              { to: '/board',     icon: <LayoutGrid size={13} />, label: 'Board'     },
              { to: '/dashboard', icon: <BarChart3  size={13} />, label: 'Dashboard' },
            ].map(({ to, icon, label }) => (
              <NavLink key={to} to={to}>
                {({ isActive }) => (
                  <span
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '5px 10px',
                      fontSize: '12px', fontWeight: 500,
                      borderRadius: '6px',
                      color: isActive ? 'var(--c-txt)' : 'var(--c-txt-2)',
                      background: isActive ? 'var(--c-accent-bg)' : 'transparent',
                      transition: 'all 0.12s',
                      cursor: 'pointer',
                      textDecoration: 'none',
                    }}
                  >
                    {icon} {label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--c-txt-2)' }}>
            {user?.name}
          </span>
          <div style={{ width: '1px', height: '16px', background: 'var(--c-border)' }} />
          <button
            onClick={logoutUser}
            title="Sign out"
            style={{
              display: 'flex', alignItems: 'center',
              padding: '6px',
              color: 'var(--c-txt-3)',
              background: 'none', border: 'none',
              borderRadius: '6px', cursor: 'pointer',
              transition: 'color 0.12s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--c-txt)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--c-txt-3)'}
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
