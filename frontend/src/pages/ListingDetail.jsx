import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, MapPin, Bed, Bath, Ruler, Star, MessageCircle, Phone, Mail } from 'lucide-react';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

const ListingDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => apiService.getListing(id),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">Error loading listing: {error.message}</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Listing not found</div>
      </div>
    );
  }

  const handleSaveListing = async () => {
    try {
      if (!currentUser) {
        alert('Please log in to save listings');
        return;
      }
      await apiService.addToWishlist(listing._id);
      alert('Listing saved to wishlist!');
    } catch (error) {
      console.error('Error saving listing:', error);
      alert('Failed to save listing');
    }
  };

  const nextImage = () => {
    if (listing.images && listing.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (listing.images && listing.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Hero Section with Image Gallery */}
      <div className="relative">
        {listing.images && listing.images.length > 0 ? (
          <>
            <img 
              src={listing.images[currentImageIndex]} 
              alt={listing.title}
              className="w-full h-96 object-cover"
            />
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              &#8249;
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              &#8250;
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {listing.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No images available</span>
          </div>
        )}
        
        <button
          onClick={handleSaveListing}
          className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100"
        >
          <Heart className="w-6 h-6 text-red-500" />
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {listing.title}
              </h1>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{listing.city}, {listing.address}</span>
              </div>
              <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-4">
                ₹{listing.price}
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center">
                <Bed className="w-5 h-5 mr-2 text-gray-600" />
                <span>{listing.bedrooms} Beds</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-5 h-5 mr-2 text-gray-600" />
                <span>{listing.bathrooms} Baths</span>
              </div>
              <div className="flex items-center">
                <Ruler className="w-5 h-5 mr-2 text-gray-600" />
                <span>{listing.size}</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-gray-600" />
                <span>{listing.rating || 'N/A'} Rating</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {listing.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mr-2"></div>
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Location</h2>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <p>Located in {listing.city}, near {listing.nearbyPlaces?.slice(0, 3)?.map(place => place.name).join(', ') || 'various amenities'}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 sticky top-4">
              <div className="flex items-center mb-4">
                <img 
                  src={`https://ui-avatars.com/api/?name=${listing.owner?.name}&background=random`} 
                  alt={listing.owner?.name}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-semibold">{listing.owner?.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Property Owner</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Owner
                </button>
                
                <button className="w-full border border-gray-300 dark:border-gray-600 py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Owner
                </button>
                
                <button className="w-full border border-gray-300 dark:border-gray-600 py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Email Owner
                </button>
              </div>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                <p>Posted on {new Date(listing.createdAt).toLocaleDateString()}</p>
                <p className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
                  listing.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {listing.isAvailable ? 'Available' : 'Not Available'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;