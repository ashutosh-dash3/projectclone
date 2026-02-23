import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Bed, Bath, Filter, X } from 'lucide-react';

const ListingFilter = ({ onFilterChange, initialFilters = {} }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    sort: '',
    furnished: '',
    amenity: ''
  });

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      ...initialFilters
    }));
  }, [initialFilters]);

  useEffect(() => {
    // Filter out empty values before sending to parent
    const filteredFilters = Object.keys(filters).reduce((acc, key) => {
      if (filters[key] !== '' && filters[key] !== undefined && filters[key] !== null) {
        acc[key] = filters[key];
      }
      return acc;
    }, {});
    
    onFilterChange(filteredFilters);
  }, [filters, onFilterChange]);

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      sort: '',
      furnished: '',
      amenity: ''
    };
    setFilters(clearedFilters);
    // Send empty object to clear all filters
    onFilterChange({});
  };

  const propertyTypes = ['apartment', 'house', 'studio', 'shared', 'pg'];
  const amenities = ['wifi', 'parking', 'ac', 'furnished', 'laundry', 'gym', 'pool'];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by location, property name, or keywords..."
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                City
              </label>
              <input
                type="text"
                placeholder="Enter city"
                value={filters.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleInputChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Property Type
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
              >
                <option value="">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Bed className="w-4 h-4 inline mr-1" />
                Bedrooms
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
              >
                <option value="">Any</option>
                {[0, 1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}+{num === 5 ? '+' : ''}</option>
                ))}
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Bath className="w-4 h-4 inline mr-1" />
                Bathrooms
              </label>
              <select
                value={filters.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
              >
                <option value="">Any</option>
                {[0, 1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}+{num === 5 ? '+' : ''}</option>
                ))}
              </select>
            </div>

            {/* Furnished */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Furnished
              </label>
              <select
                value={filters.furnished}
                onChange={(e) => handleInputChange('furnished', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
              >
                <option value="">Any</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={(e) => handleInputChange('sort', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
              >
                <option value="">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* Amenity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amenity
              </label>
              <select
                value={filters.amenity}
                onChange={(e) => handleInputChange('amenity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
              >
                <option value="">Any</option>
                {amenities.map(amenity => (
                  <option key={amenity} value={amenity}>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
            
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {Object.values(filters).some(value => value !== '') && (
        <div className="flex flex-wrap gap-2 mt-4">
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
              Search: {filters.search}
              <button onClick={() => handleInputChange('search', '')}>×</button>
            </span>
          )}
          {filters.city && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
              City: {filters.city}
              <button onClick={() => handleInputChange('city', '')}>×</button>
            </span>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
              Price: {filters.minPrice || '0'} - {filters.maxPrice || '∞'}
              <button onClick={() => { handleInputChange('minPrice', ''); handleInputChange('maxPrice', ''); }}>×</button>
            </span>
          )}
          {filters.propertyType && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">
              Type: {filters.propertyType}
              <button onClick={() => handleInputChange('propertyType', '')}>×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ListingFilter;