import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const DEMO_EMAIL = 'admin@opstrack.local'
const DEMO_PASSWORD = 'password123'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const signInWith = async (email, password) => {
    setError('')
    setLoading(true)
    try {
      const data = await login(email, password)
      signIn({ access_token: data.access_token, refresh_token: data.refresh_token }, data.user)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error === 'invalid_credentials'
        ? 'Invalid email or password.'
        : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signInWith(form.email, form.password)
  }

  const handleDemoSignIn = async () => {
    setForm({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
    await signInWith(DEMO_EMAIL, DEMO_PASSWORD)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex mb-3">
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M16 2.5L28 9L28 23L16 29.5L4 23L4 9Z" fill="#111d2e" stroke="#3b6ef0" strokeWidth="1.5"/>
              <circle cx="16" cy="16" r="5" stroke="#3b6ef0" strokeWidth="1" strokeOpacity="0.4"/>
              <circle cx="16" cy="16" r="2.5" fill="#3b6ef0"/>
              <line x1="16" y1="4.5"  x2="16" y2="8"    stroke="#3b6ef0" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="16" y1="24"   x2="16" y2="27.5"  stroke="#3b6ef0" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">OpsTrack</h1>
          <p className="text-sm text-gray-500 mt-1">Equipment & Operations Management</p>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Sign in</h2>
          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="input"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                className="input"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={loading}
              className="btn-secondary w-full justify-center"
            >
              Sign in with demo account
            </button>
            <p className="mt-2 text-xs text-gray-500 text-center">
              Explore OpsTrack with a pre-seeded admin account.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
