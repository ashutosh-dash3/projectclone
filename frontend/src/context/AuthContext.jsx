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
    let isMounted = true;
    
    console.log('AuthContext useEffect running');
    const token = apiService.getAuthToken()
    console.log('Token from getAuthToken:', token ? 'found' : 'not found');
    if (token && !currentUser) {
      console.log('Attempting to get current user from API');
      // Try to get current user from API
      apiService.getCurrentUser()
        .then(response => {
          console.log('Current user response:', response);
          if (isMounted) {
            setCurrentUser(response.user)
          }
        })
        .catch((error) => {
          console.log('Token is invalid, clearing it:', error);
          // Token is invalid, clear it
          if (isMounted) {
            apiService.clearAuth()
          }
        })
    } else {
      console.log('No token found or user already exists');
    }
    
    return () => {
      isMounted = false;
    };
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
      console.log('Login response token:', response.token);
      apiService.setAuthToken(response.token)
      console.log('Token stored in localStorage:', localStorage.getItem('auth_token'));
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

  const updateUser = (userData) => {
    setCurrentUser(prev => ({ ...prev, ...userData }));
  }

  const value = useMemo(() => ({ 
    currentUser, 
    users, 
    loading,
    register, 
    login, 
    logout,
    updateUser
  }), [currentUser, users, loading])
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}