import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import apiService from '../services/api'
import ListingFilter from '../components/listings/ListingFilter'
import ConfirmationModal from '../components/ui/ConfirmationModal'

const Listings = () => {
  const location = useLocation();
  const { currentUser } = useAuth()
  const { showSuccess, showError } = useToast();
  const [filters, setFilters] = useState({})
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [key, setKey] = useState(0);

  // Force re-render when location changes
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [location.pathname]);

  const { data: listingsResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['listings', filters],
    queryFn: () => apiService.getListings(filters),
    keepPreviousData: true
  })

  const listings = listingsResponse?.listings || []
  const pagination = listingsResponse?.pagination

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="text-red-500 text-center">Error loading listings: {error.message}</div>
      </div>
    )
  }

  const handleDeleteListing = async () => {
    if (!listingToDelete) return;
    
    try {
      await apiService.deleteListing(listingToDelete);
      showSuccess('Listing deleted successfully');
      refetch();
      setShowDeleteModal(false);
      setListingToDelete(null);
    } catch (error) {
      showError('Error deleting listing: ' + error.message);
    }
  };

  return (
    <section key={key} className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {currentUser?.role === 'vendor' ? 'My Listings' : 'Browse Listings'}
        </h1>
      </div>

      {/* Filter Component */}
      <ListingFilter onFilterChange={setFilters} />

      {/* Listings Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.length > 0 ? (
          listings.map((l) => (
            <article key={l._id} className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900">
              <img 
                alt={l.title} 
                className="h-44 w-full object-cover" 
                src={l.images?.[0] || `https://picsum.photos/seed/${l._id}/800/400`} 
              />
              <div className="p-4">
                <h3 className="font-semibold truncate">{l.title}</h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 truncate">{l.city} • {l.bedrooms} beds • {l.bathrooms} baths • {l.size}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-teal-600 dark:text-teal-400">₹{l.price}</span>
                  <div className="flex gap-2">
                    {currentUser?.role !== 'vendor' && (
                      <button 
                        onClick={async () => {
                          try {
                            await apiService.addToWishlist(l._id);
                            showSuccess('Added to wishlist!');
                          } catch (error) {
                            showError('Error adding to wishlist: ' + error.message);
                          }
                        }}
                        className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700"
                      >
                        Wishlist
                      </button>
                    )}
                    {currentUser?.role === 'vendor' && l.owner._id === currentUser.id && (
                      <button 
                        onClick={() => {
                          setListingToDelete(l._id);
                          setShowDeleteModal(true);
                        }}
                        className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 dark:border-red-700 dark:text-red-400"
                      >
                        Delete
                      </button>
                    )}
                    <a href={`/listings/${l._id}`} className="rounded-md bg-teal-600 px-3 py-1.5 text-sm text-white">Details</a>
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full rounded-md border border-neutral-200 p-6 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400 text-center">
            No listings match your filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <button 
            disabled={pagination.current <= 1}
            onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, pagination.current - 1) }))}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="px-4 py-2">
            Page {pagination.current} of {pagination.pages}
          </span>
          
          <button 
            disabled={pagination.current >= pagination.pages}
            onClick={() => setFilters(prev => ({ ...prev, page: Math.min(pagination.pages, pagination.current + 1) }))}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default Listings
