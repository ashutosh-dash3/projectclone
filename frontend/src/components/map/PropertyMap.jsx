import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PropertyMap = ({ listings = [], center = [20.5937, 78.9629], zoom = 5 }) => {
  const [selectedListing, setSelectedListing] = useState(null);

  // Function to handle marker click
  const handleMarkerClick = (listing) => {
    setSelectedListing(listing);
  };

  return (
    <div className="h-full w-full relative">
      {listings.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center p-8">
            <div className="text-xl font-semibold mb-2">No Properties with Location Data</div>
            <p className="text-gray-600 dark:text-gray-400">There are currently no properties with location data to display on the map.</p>
          </div>
        </div>
      ) : (
        <div>
          <MapContainer 
            center={center} 
            zoom={zoom} 
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {listings.map((listing) => {
              if (!listing.location || !listing.location.coordinates) {
                return null;
              }
              
              // Coordinates in MongoDB are [longitude, latitude]
              const position = [listing.location.coordinates[1], listing.location.coordinates[0]];
              
              return (
                <Marker 
                  key={listing._id} 
                  position={position}
                  eventHandlers={{
                    click: () => handleMarkerClick(listing),
                  }}
                >
                  <Popup>
                    <div className="max-w-xs">
                      <div className="font-semibold">{listing.title}</div>
                      <div className="text-sm text-gray-600">{listing.city}</div>
                      <div className="text-sm font-bold text-teal-600">₹{listing.price}</div>
                      <div className="text-xs mt-1">
                        {listing.bedrooms} bed, {listing.bathrooms} bath
                      </div>
                      <div className="mt-2">
                        <a 
                          href={`/listings/${listing._id}`} 
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
          
          {/* Selected listing panel */}
          {selectedListing && (
            <div className="absolute top-4 right-4 bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-4 max-w-sm z-[1000]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{selectedListing.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{selectedListing.city}</p>
                  <p className="font-bold text-teal-600">₹{selectedListing.price}</p>
                </div>
                <button 
                  onClick={() => setSelectedListing(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <div className="mt-2 text-sm">
                <p>{selectedListing.bedrooms} bed, {selectedListing.bathrooms} bath</p>
                <p className="mt-1">{selectedListing.size}</p>
              </div>
              <div className="mt-3">
                <a 
                  href={`/listings/${selectedListing._id}`} 
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 inline-block"
                >
                  View Details
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyMap;