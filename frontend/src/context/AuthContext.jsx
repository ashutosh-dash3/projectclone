import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { readJson, writeJson } from '../utils/storage'
import apiService from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => readJson('auth:user', null))
  const [users, setUsers] = useState(() => readJson('auth:users', []))
  const [loading, setLoading] = useState(false)

  useEffect(() => { writeJson('auth:user', currentUser) }, [currentUser])
  useEffect(() => { writeJson('auth:users', users) }, [users])

  // Check for existing token on app load
  useEffect(() => {
    const token = apiService.getAuthToken()
    if (token && !currentUser) {
      // Try to get current user from API
      apiService.getCurrentUser()
        .then(response => {
          setCurrentUser(response.user)
        })
        .catch(() => {
          // Token is invalid, clear it
          apiService.clearAuth()
        })
    }
  }, [])

  const register = async (payload) => {
    setLoading(true)
    try {
      // Try API first
      const response = await apiService.register(payload)
      apiService.setAuthToken(response.token)
      setCurrentUser(response.user)
      return response
    } catch (apiError) {
      // Fallback to local storage
      const exists = users.some(u => u.email === payload.email)
      if (exists) throw new Error('User already exists')
      const user = { id: crypto.randomUUID(), ...payload, role: payload.role || 'student' }
      setUsers(prev => [...prev, user])
      setCurrentUser(user)
      return { user, token: null }
    } finally {
      setLoading(false)
    }
  }

  const login = async ({ email, password }) => {
    setLoading(true)
    try {
      // Try API first
      const response = await apiService.login({ email, password })
      apiService.setAuthToken(response.token)
      setCurrentUser(response.user)
      return response
    } catch (apiError) {
      // Fallback to local storage
      const user = users.find(u => u.email === email && u.password === password)
      if (!user) throw new Error('Invalid credentials')
      setCurrentUser(user)
      return { user, token: null }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setCurrentUser(null)
    apiService.clearAuth()
  }

  const value = useMemo(() => ({ 
    currentUser, 
    users, 
    loading,
    register, 
    login, 
    logout 
  }), [currentUser, users, loading])
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


