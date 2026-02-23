import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PropertyMap from '../components/map/PropertyMap';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

const MapView = () => {
  const { currentUser } = useAuth();
  const [filters, setFilters] = useState({});
  
  const { data: listingsResponse, isLoading, error } = useQuery({
    queryKey: ['map-listings', filters],
    queryFn: () => apiService.getListings({ ...filters, limit: 100 }), // Get more listings for map
    keepPreviousData: true
  });

  const listings = listingsResponse?.listings || [];

  // Filter listings that have location data
  const listingsWithLocation = listings.filter(listing => 
    listing.location && 
    listing.location.coordinates && 
    Array.isArray(listing.location.coordinates) &&
    listing.location.coordinates.length === 2
  );

  // Calculate center based on listings or default to India
  const calculateCenter = () => {
    if (listingsWithLocation.length > 0) {
      // Calculate average of all locations
      const avgLat = listingsWithLocation.reduce((sum, listing) => sum + listing.location.coordinates[1], 0) / listingsWithLocation.length;
      const avgLng = listingsWithLocation.reduce((sum, listing) => sum + listing.location.coordinates[0], 0) / listingsWithLocation.length;
      return [avgLat, avgLng];
    }
    return [20.5937, 78.9629]; // Center of India
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
        <div className="text-center p-4">
          <p className="text-red-500 mb-4">Error loading map: {error.message}</p>
          <p className="text-gray-600 dark:text-gray-400">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Property Map View</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore properties on the map. Click on markers to view details.
          </p>
        </div>

        {/* Map Container */}
        <div className="rounded-lg overflow-hidden shadow-lg" style={{ height: '70vh' }}>
          <PropertyMap 
            listings={listingsWithLocation} 
            center={calculateCenter()}
            zoom={listingsWithLocation.length > 0 ? 8 : 5}
          />
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-lg">Total Properties</h3>
            <p className="text-2xl font-bold text-teal-600">{listings.length}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-lg">On Map</h3>
            <p className="text-2xl font-bold text-teal-600">{listingsWithLocation.length}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-lg">User Role</h3>
            <p className="text-2xl font-bold text-teal-600 capitalize">
              {currentUser?.role || 'Guest'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;