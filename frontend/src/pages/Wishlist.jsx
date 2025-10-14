import React from 'react'
import { useListings } from '../context/ListingsContext'

const Wishlist = () => {
  const { listings, wishlist, toggleWishlist } = useListings()
  const saved = listings.filter(l => wishlist.includes(l.id))

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Your Wishlist</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Sign in later to sync across devices.</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {saved.map((l)=> (
          <article key={l.id} className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <img alt={l.title} className="h-40 w-full object-cover" src={l.image || `https://picsum.photos/seed/${l.id}/800/400`} />
            <div className="p-4">
              <h3 className="font-semibold">{l.title}</h3>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-semibold text-teal-600 dark:text-teal-400">₹{l.rent}</span>
                <button onClick={()=>toggleWishlist(l.id)} className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700">Remove</button>
              </div>
            </div>
          </article>
        ))}
        {saved.length === 0 && (
          <div className="col-span-full rounded-md border border-neutral-200 p-6 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">No saved properties yet.</div>
        )}
      </div>
    </section>
  )
}

export default Wishlist
