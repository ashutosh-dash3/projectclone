import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ToastProvider } from './context/ToastContext'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import About from './pages/About'
import Listings from './pages/Listings'
import AddListings from './pages/AddListings'
import Wishlist from './pages/Wishlist'
import Contact from './pages/Contact'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import ListingDetail from './pages/ListingDetail'
import Messaging from './pages/Messaging'
import MapView from './pages/MapView'
import Footer from './components/Footer'
import './index.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

function App() {
  // Replace with your actual Google Client ID
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
  const location = useLocation();
  const [appKey, setAppKey] = useState(0);

  // Force re-render when location changes
  useEffect(() => {
    console.log('Location changed to:', location.pathname);
    setAppKey(prev => prev + 1);
  }, [location.pathname]);
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div key={appKey} className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
            <NavBar />
            <main>
              <Routes key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/listings/:id" element={<ListingDetail />} />
                <Route path="/add" element={<AddListings />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/messaging" element={<Messaging />} />
                <Route path="/map-view" element={<MapView />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}

export default App
