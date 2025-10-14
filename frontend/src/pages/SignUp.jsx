import React from 'react'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SignUp = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [form, setForm] = useState({ 
    firstName: '', 
    middleName: '', 
    lastName: '', 
    email: '', 
    mobile: '',
    password: '', 
    confirmPassword: '',
    role: 'student' 
  })
  const [showPassword, setShowPassword] = useState(false)

  const nameRegex = /^[A-Za-z\s]+$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const mobileRegex = /^(\+?\d{1,3})?[\s-]?\d{10}$/
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

  const validateField = (fieldName, value) => {
    let error = ''
    
    switch (fieldName) {
      case 'firstName':
        if (!value.trim()) error = 'First name is required'
        else if (!nameRegex.test(value)) error = 'First name must contain only letters and spaces'
        break
      case 'lastName':
        if (!value.trim()) error = 'Last name is required'
        else if (!nameRegex.test(value)) error = 'Last name must contain only letters and spaces'
        break
      case 'middleName':
        if (value && !nameRegex.test(value)) error = 'Middle name must contain only letters and spaces'
        break
      case 'email':
        if (!value.trim()) error = 'Email is required'
        else if (!emailRegex.test(value)) error = 'Enter a valid email address'
        break
      case 'mobile':
        if (value && !mobileRegex.test(value)) error = 'Enter a valid mobile number'
        break
      case 'password':
        if (!value.trim()) error = 'Password is required'
        else if (!passwordRegex.test(value)) error = 'Password must be 8+ chars with A-Z, a-z, 0-9 and a special char'
        break
      case 'confirmPassword':
        if (!value.trim()) error = 'Confirm password is required'
        else if (value !== form.password) error = 'Passwords do not match'
        break
      case 'role':
        if (!value) error = 'Role is required'
        break
    }
    
    setFieldErrors(prev => ({ ...prev, [fieldName]: error }))
    return error === ''
  }

  const handleFieldChange = (fieldName, value) => {
    setForm(prev => ({ ...prev, [fieldName]: value }))
    setError('') // Clear general error when user starts typing
    
    // Validate the field in real-time
    validateField(fieldName, value)
    
    // Special case for confirmPassword - also validate when password changes
    if (fieldName === 'password') {
      validateField('confirmPassword', form.confirmPassword)
    }
  }

  const validate = () => {
    const errors = {}
    let hasErrors = false
    
    Object.keys(form).forEach(field => {
      if (!validateField(field, form[field])) {
        errors[field] = true
        hasErrors = true
      }
    })
    
    return hasErrors ? 'Please fix the errors above' : ''
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    try {
      const payload = {
        name: `${form.firstName} ${form.middleName ? form.middleName + ' ' : ''}${form.lastName}`.trim(),
        email: form.email,
        mobile: form.mobile,
        password: form.password,
        role: form.role,
      }
      register(payload)
      navigate(form.role === 'owner' ? '/add' : '/listings')
    } catch (err) {
      setError(err.message || 'Registration failed')
    }
  }

  return (
    <section className="mx-auto max-w-sm px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Create Account</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Demo registration form.</p>
      {error && <div className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30">{error}</div>}
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="text-sm">First name *</label>
            <input 
              value={form.firstName} 
              onChange={e => handleFieldChange('firstName', e.target.value)} 
              className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:bg-neutral-900 ${
                fieldErrors.firstName ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30' : 'border-neutral-300 bg-white dark:border-neutral-700'
              }`} 
            />
            {fieldErrors.firstName && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.firstName}</p>}
          </div>
          <div>
            <label className="text-sm">Middle name</label>
            <input 
              value={form.middleName} 
              onChange={e => handleFieldChange('middleName', e.target.value)} 
              className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:bg-neutral-900 ${
                fieldErrors.middleName ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30' : 'border-neutral-300 bg-white dark:border-neutral-700'
              }`} 
            />
            {fieldErrors.middleName && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.middleName}</p>}
          </div>
          <div>
            <label className="text-sm">Last name *</label>
            <input 
              value={form.lastName} 
              onChange={e => handleFieldChange('lastName', e.target.value)} 
              className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:bg-neutral-900 ${
                fieldErrors.lastName ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30' : 'border-neutral-300 bg-white dark:border-neutral-700'
              }`} 
            />
            {fieldErrors.lastName && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.lastName}</p>}
          </div>
        </div>
        <div>
          <label className="text-sm">Email *</label>
          <input 
            type="email" 
            value={form.email} 
            onChange={e => handleFieldChange('email', e.target.value)} 
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:bg-neutral-900 ${
              fieldErrors.email ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30' : 'border-neutral-300 bg-white dark:border-neutral-700'
            }`} 
          />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.email}</p>}
        </div>
        <div>
          <label className="text-sm">Mobile *</label>
          <input 
            type="tel" 
            value={form.mobile} 
            onChange={e => handleFieldChange('mobile', e.target.value)} 
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:bg-neutral-900 ${
              fieldErrors.mobile ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30' : 'border-neutral-300 bg-white dark:border-neutral-700'
            }`} 
            placeholder="Enter your mobile number" 
          />
          {fieldErrors.mobile && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.mobile}</p>}
        </div>
        <div>
          <label className="text-sm">Create password *</label>
          <div className="mt-1 relative">
            <input 
              type={showPassword ? 'text' : 'password'} 
              value={form.password} 
              onChange={e => handleFieldChange('password', e.target.value)} 
              className={`w-full rounded-md border px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:bg-neutral-900 ${
                fieldErrors.password ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30' : 'border-neutral-300 bg-white dark:border-neutral-700'
              }`} 
              placeholder="Min 8 chars, A-Z, a-z, 0-9, 1 special" 
            />
            <button type="button" onClick={()=>setShowPassword(s=>!s)} className="absolute inset-y-0 right-0 grid place-items-center px-2 text-neutral-500 hover:text-neutral-700">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {fieldErrors.password && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.password}</p>}
        </div>
        <div>
          <label className="text-sm">Confirm password *</label>
          <input 
            type="password" 
            value={form.confirmPassword} 
            onChange={e => handleFieldChange('confirmPassword', e.target.value)} 
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:bg-neutral-900 ${
              fieldErrors.confirmPassword ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30' : 'border-neutral-300 bg-white dark:border-neutral-700'
            }`} 
          />
          {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.confirmPassword}</p>}
        </div>
        <div>
          <label className="text-sm">Role *</label>
          <select 
            value={form.role} 
            onChange={e => handleFieldChange('role', e.target.value)} 
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none dark:bg-neutral-900 ${
              fieldErrors.role ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30' : 'border-neutral-300 bg-white dark:border-neutral-700'
            }`}
          >
            <option value="student">Student</option>
            <option value="owner">Owner</option>
          </select>
          {fieldErrors.role && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.role}</p>}
        </div>
        <button type="submit" className="w-full rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500">Sign Up</button>
      </form>
      
      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}

export default SignUp
