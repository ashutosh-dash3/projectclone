import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Moon, Sun, LogOut, User, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const { isDark, isLoaded, toggleTheme } = useTheme()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Base navigation (always visible)
  const baseNavItems = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Listings', to: '/listings' },
    { label: 'Contact', to: '/contact' },
  ]

  // Student navigation (after login) - keep only unique links
  const studentNavItems = [
    { label: 'Wishlist', to: '/wishlist' },
  ]

  // Owner navigation (after login) - keep only unique links
  const ownerNavItems = [
    { label: 'My Listings', to: '/listings' },
    { label: 'Add Listing', to: '/add' },
  ]

  const getNavItems = () => {
    if (!currentUser) return baseNavItems
    if (currentUser.role === 'owner') return [...baseNavItems, ...ownerNavItems]
    return [...baseNavItems, ...studentNavItems]
  }

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
    // Force a refresh of UI state and redirect to home
    window.location.replace('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-teal-50 text-teal-900 shadow-sm border-b border-teal-200 dark:bg-teal-800 dark:text-white dark:border-transparent">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-extrabold text-2xl tracking-tight">FlatBuddy</Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          {getNavItems().map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({isActive}) => isActive
                ? 'text-sm/6 font-medium text-teal-700 dark:text-teal-200'
                : 'text-sm/6 text-teal-700/80 hover:text-teal-900 transition dark:text-white/80 dark:hover:text-white'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button 
            onClick={toggleTheme} 
            aria-label="Toggle theme" 
            className="inline-flex items-center justify-center rounded-md p-2 transition text-teal-700 bg-teal-100 hover:bg-teal-200 dark:text-white dark:bg-white/10 dark:hover:bg-white/20"
            disabled={!isLoaded}
          >
            {isLoaded ? (isDark ? <Sun size={18} /> : <Moon size={18} />) : <Moon size={18} />}
          </button>
          
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="hidden items-center gap-2 md:flex">
                <User size={16} />
                <span className="text-sm">{currentUser.name || currentUser.email}</span>
                <span className="text-xs opacity-75">({currentUser.role})</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition bg-teal-600 text-white hover:bg-teal-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden rounded-md px-3 py-1.5 text-sm transition bg-teal-100 text-teal-800 hover:bg-teal-200 md:inline">Login</Link>
              <Link to="/signup" className="rounded-md px-3 py-1.5 text-sm font-medium text-white bg-teal-600 transition hover:bg-teal-700 dark:text-teal-800 dark:bg-white dark:hover:bg-neutral-100">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={toggleTheme} 
              aria-label="Toggle theme" 
              className="inline-flex items-center justify-center rounded-md p-2 transition text-teal-700 bg-teal-100 hover:bg-teal-200 dark:text-white dark:bg-white/10 dark:hover:bg-white/20"
              disabled={!isLoaded}
            >
              {isLoaded ? (isDark ? <Sun size={18} /> : <Moon size={18} />) : <Moon size={18} />}
            </button>
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            className="inline-flex items-center justify-center rounded-md p-2 transition text-teal-700 bg-teal-100 hover:bg-teal-200 dark:text-white dark:bg-white/10 dark:hover:bg-white/20"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-teal-200 dark:border-white/20 px-4 py-3">
          <nav className="flex flex-col gap-2">
            {getNavItems().map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `text-sm transition px-3 py-2 rounded-md ${
                    isActive
                      ? 'font-medium text-teal-800 bg-teal-100 dark:text-teal-200 dark:bg-white/10'
                      : 'text-teal-700/80 hover:text-teal-900 dark:text-white/80 dark:hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          
          {/* Mobile User Actions */}
          <div className="mt-4 pt-4 border-t border-teal-200 dark:border-white/20">
            {currentUser ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-3 py-2">
                  <User size={16} />
                  <span className="text-sm">{currentUser.name || currentUser.email}</span>
                  <span className="text-xs opacity-75">({currentUser.role})</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm transition bg-teal-600 text-white hover:bg-teal-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-sm transition text-teal-800 bg-teal-100 hover:bg-teal-200 text-center"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-white bg-teal-600 transition hover:bg-teal-700 dark:text-teal-800 dark:bg-white dark:hover:bg-neutral-100 text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default NavBar
