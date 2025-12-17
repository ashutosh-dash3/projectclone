import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { readJson, writeJson } from '../utils/storage'
import apiService from '../services/api'

const ListingsContext = createContext(null)

const demo = [
  { id: 'd1', title: 'Student PG near Campus', city: 'Delhi', rent: 6000, beds: 2, baths: 1, size: '700 sqft', ownerId: 'demo', image: '/demo_2.jpg' },
  { id: 'd2', title: 'Shared Room for Students', city: 'Pune', rent: 4500, beds: 1, baths: 1, size: '400 sqft', ownerId: 'demo', image: '/demo_3.jpg' },
]

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState(() => readJson('listings:data', demo))
  const [wishlist, setWishlist] = useState(() => readJson('listings:wishlist', []))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { writeJson('listings:data', listings) }, [listings])
  useEffect(() => { writeJson('listings:wishlist', wishlist) }, [wishlist])

  // Load listings from API on component mount
  useEffect(() => {
    loadListings()
  }, [])

  const loadListings = async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getListings(params)
      setListings(response.listings || [])
    } catch (apiError) {
      console.log('API not available, using local data')
      setError('Using offline data')
    } finally {
      setLoading(false)
    }
  }

  const addListing = async (payload) => {
    setLoading(true)
    try {
      // Try API first
      const response = await apiService.createListing(payload)
      setListings(prev => [response.listing, ...prev])
      return response
    } catch (apiError) {
      // Fallback to local storage
      const listing = { id: crypto.randomUUID(), ...payload }
      setListings(prev => [listing, ...prev])
      return { listing }
    } finally {
      setLoading(false)
    }
  }

  const removeListing = async (id) => {
    setLoading(true)
    try {
      // Try API first
      await apiService.deleteListing(id)
      setListings(prev => prev.filter(l => l.id !== id))
    } catch (apiError) {
      // Fallback to local storage
      setListings(prev => prev.filter(l => l.id !== id))
    } finally {
      setLoading(false)
    }
  }

  const toggleWishlist = (id) => {
    const isInWishlist = wishlist.includes(id)
    // Optimistic update for snappy UI
    if (isInWishlist) {
      setWishlist(prev => prev.filter(x => x !== id))
      // Fire-and-forget API call
      Promise.resolve().then(async () => {
        try { await apiService.removeFromWishlist(id) } catch (_) {}
      })
    } else {
      setWishlist(prev => [...prev, id])
      Promise.resolve().then(async () => {
        try { await apiService.addToWishlist(id) } catch (_) {}
      })
    }
  }

  const value = useMemo(() => ({ 
    listings, 
    addListing, 
    removeListing, 
    wishlist, 
    toggleWishlist,
    loading,
    error,
    loadListings
  }), [listings, wishlist, loading, error])
  
  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>
}

export function useListings() {
  const ctx = useContext(ListingsContext)
  if (!ctx) throw new Error('useListings must be used within ListingsProvider')
  return ctx
}
