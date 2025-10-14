import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useListings } from '../context/ListingsContext'

const Profile = () => {
  const { currentUser } = useAuth()
  const { listings } = useListings()

  if (!currentUser) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Profile</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">You are not logged in.</p>
      </section>
    )
  }

  const owned = listings.filter(l => l.ownerId === currentUser.id)
  const heading = currentUser.role === 'owner' ? 'Your Listings' : 'Your Activity'

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-teal-100 dark:bg-white/10" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{currentUser.name || currentUser.email}</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Role: {currentUser.role}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">{heading}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(currentUser.role === 'owner' ? owned : listings.slice(0, 6)).map(l => (
            <article key={l.id} className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <img alt={l.title} className="h-40 w-full object-cover" src={l.image || l.preview || `https://picsum.photos/seed/${l.id}/800/400`} />
              <div className="p-4">
                <h3 className="font-semibold">{l.title}</h3>
                {l.rent && <div className="mt-1 text-sm text-teal-600 dark:text-teal-400">₹{l.rent}</div>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Profile
