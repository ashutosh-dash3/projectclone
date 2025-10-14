import { useState, useEffect } from 'react'

export const useTheme = () => {
  const [isDark, setIsDark] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initial = saved ? saved === 'dark' : prefersDark
      
      setIsDark(initial)
      setIsLoaded(true)
      
      // Apply theme to document
      if (initial) {
        document.documentElement.classList.add('dark')
        document.documentElement.setAttribute('data-theme', 'dark')
        document.body.style.backgroundColor = '#111827'
        document.body.style.color = '#f9fafb'
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.setAttribute('data-theme', 'light')
        document.body.style.backgroundColor = '#ffffff'
        document.body.style.color = '#111827'
      }
    } catch (e) {
      console.error('Error initializing theme:', e)
      setIsLoaded(true)
    }
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    
    try {
      // Apply theme changes
      if (next) {
        document.documentElement.classList.add('dark')
        document.documentElement.setAttribute('data-theme', 'dark')
        document.body.style.backgroundColor = '#111827'
        document.body.style.color = '#f9fafb'
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.setAttribute('data-theme', 'light')
        document.body.style.backgroundColor = '#ffffff'
        document.body.style.color = '#111827'
      }
      
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch (e) {
      console.error('Error toggling theme:', e)
    }
  }

  return { isDark, isLoaded, toggleTheme }
}

