import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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

const NAV = [
  { to: '/',          label: 'Dashboard',    icon: '⊞', roles: null },
  { to: '/equipment', label: 'Equipment',    icon: '⚙', roles: null },
  { to: '/tickets',   label: 'Tickets',      icon: '🔧', roles: null },
  { to: '/locations', label: 'Locations',    icon: '📍', roles: null },
  { to: '/users',     label: 'Users',        icon: '👤', roles: ['admin'] },
  { to: '/activity',  label: 'Activity Log', icon: '📋', roles: ['admin'] },
]

export default function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleSignOut = () => { signOut(); navigate('/login', { replace: true }) }
  const visibleNav = NAV.filter((n) => !n.roles || n.roles.includes(user?.role))
  const closeDrawer = () => setDrawerOpen(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Skip to main content — visible on focus for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-brand-600 focus:text-white focus:rounded focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      {/* Mobile backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — fixed overlay on mobile, static on desktop */}
      <nav
        aria-label="Primary navigation"
        className={`fixed inset-y-0 left-0 z-40 w-56 flex-shrink-0 bg-gray-900 text-gray-100 flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="px-4 py-5 border-b border-gray-700">
          <Link to="/" className="flex items-center gap-2" aria-label="OpsTrack home" onClick={closeDrawer}>
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
                onClick={closeDrawer}
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

      {/* Right side: mobile header + main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-700 flex-shrink-0">
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-gray-400 hover:text-white focus:outline-none"
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" aria-hidden="true">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <Link to="/" className="flex items-center gap-2" aria-label="OpsTrack home">
            <LogoMark />
            <span className="font-bold text-white text-sm">OpsTrack</span>
          </Link>
        </header>

        <main id="main-content" className="flex-1 overflow-y-auto bg-gray-50" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
