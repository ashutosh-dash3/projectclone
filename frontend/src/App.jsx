import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ListingsProvider } from './context/ListingsContext'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import About from './pages/About'
import Listings from './pages/Listings'
import AddListings from './pages/AddListings'
import Wishlist from './pages/Wishlist'
import Contact from './pages/Contact'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Footer from './components/Footer'
import './index.css'
import Profile from './pages/Profile'

function App() {
  return (
    <AuthProvider>
      <ListingsProvider>
        <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
          <NavBar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/add" element={<AddListings />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ListingsProvider>
    </AuthProvider>
  )
}

export default App
