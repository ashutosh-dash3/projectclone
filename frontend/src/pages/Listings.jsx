import React from 'react'
import { useState, useMemo } from 'react'
import { useListings } from '../context/ListingsContext'
import { useAuth } from '../context/AuthContext'

const Listings = () => {
  const { listings, wishlist, toggleWishlist, removeListing } = useListings()
  const { currentUser } = useAuth()
  const [query, setQuery] = useState('')
  const [minRent, setMinRent] = useState('')
  const [maxRent, setMaxRent] = useState('')

  const filtered = useMemo(() => {
    let filteredListings = listings
    
    // If user is owner, show only their listings
    if (currentUser?.role === 'owner') {
      filteredListings = listings.filter(l => l.ownerId === currentUser.id)
    }
    
    return filteredListings.filter(l => {
      const matchCity = query ? (l.city || '').toLowerCase().includes(query.toLowerCase()) || (l.title || '').toLowerCase().includes(query.toLowerCase()) : true
      const minOk = minRent !== '' ? l.rent >= Number(minRent) : true
      const maxOk = maxRent !== '' ? l.rent <= Number(maxRent) : true
      return matchCity && minOk && maxOk
    })
  }, [listings, query, minRent, maxRent, currentUser])

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {currentUser?.role === 'owner' ? 'My Listings' : 'Browse Listings'}
        </h1>
        <div className="flex flex-wrap gap-2">
          <input value={query} onChange={e=>setQuery(e.target.value)} className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900" placeholder="Search by city or title" />
          <input value={minRent} onChange={e=>setMinRent(e.target.value)} type="number" placeholder="Min Rent" className="w-28 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900" />
          <input value={maxRent} onChange={e=>setMaxRent(e.target.value)} type="number" placeholder="Max Rent" className="w-28 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((l)=> (
          <article key={l.id} className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900">
            <img alt={l.title} className="h-44 w-full object-cover" src={l.image || `https://picsum.photos/seed/${l.id}/800/400`} />
            <div className="p-4">
              <h3 className="font-semibold">{l.title}</h3>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{l.city} • {l.beds} beds • {l.baths} baths • {l.size}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-semibold text-teal-600 dark:text-teal-400">₹{l.rent}</span>
                <div className="flex gap-2">
                  {currentUser?.role !== 'owner' && (
                    <button onClick={() => toggleWishlist(l.id)} className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700">{wishlist.includes(l.id) ? 'Wishlisted' : 'Wishlist'}</button>
                  )}
                  {currentUser?.role === 'owner' && (
                    <button onClick={() => removeListing(l.id)} className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 dark:border-red-700 dark:text-red-400">Delete</button>
                  )}
                  <button onClick={() => alert('Details page coming soon in major version')} className="rounded-md bg-teal-600 px-3 py-1.5 text-sm text-white">Details</button>
                </div>
              </div>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-md border border-neutral-200 p-6 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">No listings match your filters.</div>
        )}
      </div>
    </section>
  )
}

export default Listings
