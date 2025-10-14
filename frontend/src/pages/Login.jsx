import React from 'react'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login, users } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    try {
      login(form)
      const user = users.find(u => u.email === form.email && u.password === form.password)
      if (!user) {
        setError('Invalid email or password')
        return
      }
      navigate(user?.role === 'owner' ? '/add' : '/listings')
    } catch (err) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <section className="mx-auto max-w-sm px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Login</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Sign in to continue.</p>
      {error && <div className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30">{error}</div>}
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm">Email</label>
          <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} type="email" className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900" />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <div className="mt-1 relative">
            <input 
              value={form.password} 
              onChange={e=>setForm({...form,password:e.target.value})} 
              type={showPassword ? 'text' : 'password'} 
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pr-10 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900" 
            />
            <button type="button" onClick={()=>setShowPassword(s=>!s)} className="absolute inset-y-0 right-0 grid place-items-center px-2 text-neutral-500 hover:text-neutral-700">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button type="submit" className="w-full rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500">Login</button>
      </form>
      
      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Login
