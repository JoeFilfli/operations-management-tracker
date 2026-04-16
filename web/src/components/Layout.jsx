import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/',          label: 'Dashboard',    icon: '⊞', roles: null },
  { to: '/equipment', label: 'Equipment',    icon: '⚙', roles: null },
  { to: '/tickets',   label: 'Tickets',      icon: '🔧', roles: null },
  { to: '/locations', label: 'Locations',    icon: '📍', roles: null },
  { to: '/users',     label: 'Users',        icon: '👤', roles: ['admin'] },
  { to: '/activity',  label: 'Activity Log', icon: '📋', roles: ['admin'] },
]

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M16 2.5L28 9L28 23L16 29.5L4 23L4 9Z" fill="#111d2e" stroke="#3b6ef0" strokeWidth="1.5"/>
      <circle cx="16" cy="16" r="5" stroke="#3b6ef0" strokeWidth="1" strokeOpacity="0.4"/>
      <circle cx="16" cy="16" r="2.5" fill="#3b6ef0"/>
      <line x1="16" y1="4.5"  x2="16" y2="8"    stroke="#3b6ef0" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="24"   x2="16" y2="27.5"  stroke="#3b6ef0" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => { signOut(); navigate('/login', { replace: true }) }
  const visibleNav = NAV.filter((n) => !n.roles || n.roles.includes(user?.role))

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Skip to main content — visible on focus for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-brand-600 focus:text-white focus:rounded focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      {/* Sidebar */}
      <nav aria-label="Primary navigation" className="w-56 flex-shrink-0 bg-gray-900 text-gray-100 flex flex-col">
        <div className="px-4 py-5 border-b border-gray-700">
          <Link to="/" className="flex items-center gap-2" aria-label="OpsTrack home">
            <LogoMark />
            <span className="font-bold text-white">OpsTrack</span>
          </Link>
        </div>

        <ul className="flex-1 py-3 overflow-y-auto list-none m-0 p-0">
          {visibleNav.map((n) => (
            <li key={n.to}>
              <NavLink
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
                    isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`
                }
              >
                <span aria-hidden="true" className="text-base">{n.icon}</span>
                {n.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="px-4 py-3 border-t border-gray-700 text-xs">
          <p className="font-medium text-white truncate">{user?.full_name}</p>
          <p className="text-gray-400 truncate">{user?.email}</p>
          <button
            onClick={handleSignOut}
            className="mt-2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:underline"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main id="main-content" className="flex-1 overflow-y-auto bg-gray-50" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  )
}
