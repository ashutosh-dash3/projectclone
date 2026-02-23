import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import apiService from '../services/api'

const AddListings = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [form, setForm] = useState({ 
    title: '', 
    city: '', 
    price: '', 
    description: '',
    propertyType: 'pg',
    address: '',
    bedrooms: 1,
    bathrooms: 1,
    size: '',
    amenities: [],
    // PG specific
    pgFood: 'no', 
    pgWifi: 'no', 
    pgCharges: '',
    // Room specific
    roomOwnBed: 'yes',
    // Flat specific
    flatBhk: 1, 
    flatFacilities: '',
    // Media
    photos: [],
    preview: ''
  })
  
  const [fieldErrors, setFieldErrors] = useState({})

  // Validation functions
  const validateField = (fieldName, value) => {
    let error = ''
    
    switch (fieldName) {
      case 'title':
        if (!value.trim()) error = 'Title is required'
        else if (value.length < 10) error = 'Title must be at least 10 characters'
        else if (value.length > 100) error = 'Title cannot exceed 100 characters'
        break
      case 'city':
        if (!value.trim()) error = 'City is required'
        break
      case 'price':
        if (!value) error = 'Price is required'
        else if (isNaN(value) || Number(value) <= 0) error = 'Price must be a positive number'
        break
      case 'description':
        if (!value.trim()) error = 'Description is required'
        else if (value.length < 20) error = 'Description must be at least 20 characters'
        else if (value.length > 1000) error = 'Description cannot exceed 1000 characters'
        break
      case 'address':
        if (!value.trim()) error = 'Address is required'
        break
      case 'photos':
        if (!value || value.length === 0) error = 'At least one photo is required'
        else if (value.length > 5) error = 'Maximum 5 photos allowed'
        break
      case 'pgCharges':
        if (form.propertyType === 'pg' && (!value || isNaN(value) || Number(value) <= 0)) {
          error = 'Valid charges amount is required for PG'
        }
        break
      default:
        break
    }
    
    setFieldErrors(prev => ({ ...prev, [fieldName]: error }))
    return error === ''
  }
  
  const validateForm = () => {
    const errors = {}
    let isValid = true
    
    // Required fields
    const requiredFields = ['title', 'city', 'price', 'description', 'address', 'photos']
    requiredFields.forEach(field => {
      if (!validateField(field, form[field])) {
        errors[field] = true
        isValid = false
      }
    })
    
    // PG specific validation
    if (form.propertyType === 'pg') {
      if (!validateField('pgCharges', form.pgCharges)) {
        errors.pgCharges = true
        isValid = false
      }
    }
    
    return isValid
  }
  
  const handleFieldChange = (fieldName, value) => {
    setForm(prev => ({ ...prev, [fieldName]: value }))
    setError('')
    setSuccess('')
    
    // Validate field in real-time
    if (form[fieldName] !== undefined) {
      validateField(fieldName, value)
    }
  }
  
  const onSubmit = async (e) => {
    e.preventDefault()
    
    // Check authentication
    if (!currentUser) {
      setError('Please login to add a listing')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
      return
    }
    
    // Anyone can add listings now - no role restriction
    
    // Validate form
    if (!validateForm()) {
      setError('Please fix the errors below')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // Prepare listing data as JSON
      const listingData = {
        title: form.title,
        city: form.city,
        price: form.price,
        description: form.description,
        address: form.address,
        propertyType: form.propertyType,
        bedrooms: form.bedrooms,
        bathrooms: form.bathrooms,
        size: form.size,
        amenities: form.amenities
      }
      
      // Add property type specific fields
      if (form.propertyType === 'pg') {
        listingData.pgFood = form.pgFood
        listingData.pgWifi = form.pgWifi
        listingData.pgCharges = form.pgCharges
      } else if (form.propertyType === 'room') {
        listingData.roomOwnBed = form.roomOwnBed
      } else if (form.propertyType === 'flat' || form.propertyType === 'apartment') {
        listingData.flatBhk = form.flatBhk
        listingData.flatFacilities = form.flatFacilities
      }
      
      // For file uploads, we need to use FormData
      const formData = new FormData()
      
      // Append JSON data as a string
      formData.append('data', JSON.stringify(listingData))
      
      // Add photos
      form.photos.forEach((photo, index) => {
        formData.append('images', photo)
      })
      
      // Submit to API with multipart form data
      const response = await apiService.post('/listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      if (response.success) {
        setSuccess('Listing added successfully!')
        // Reset form
        setForm({
          title: '', city: '', price: '', description: '',
          propertyType: 'pg', address: '', bedrooms: 1, bathrooms: 1,
          size: '', amenities: [], pgFood: 'no', pgWifi: 'no', pgCharges: '',
          roomOwnBed: 'yes', flatBhk: 1, flatFacilities: '', photos: [], preview: ''
        })
        setFieldErrors({})
        
        // Redirect to listings page after 2 seconds
        setTimeout(() => {
          navigate('/listings')
        }, 2000)
      } else {
        setError(response.message || 'Failed to add listing')
      }
    } catch (err) {
      console.error('Add listing error:', err)
      const errorMessage = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || err.message || 'Failed to add listing. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Add New Property Listing</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Add your property to help students find their perfect accommodation
        </p>
      </div>
      
      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/30">
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Property Type */}
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="text-lg font-semibold mb-4">Property Type</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { value: 'pg', label: 'PG/Hostel' },
              { value: 'apartment', label: 'Apartment' },
              { value: 'house', label: 'House' },
              { value: 'studio', label: 'Studio' }
            ].map(type => (
              <label key={type.value} className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-3 text-sm transition-colors ${form.propertyType===type.value?'border-teal-500 bg-teal-50 dark:bg-teal-900/20':'border-neutral-300 hover:border-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-500'}`}>
                <input 
                  type="radio" 
                  name="propertyType" 
                  value={type.value} 
                  checked={form.propertyType===type.value} 
                  onChange={e=>handleFieldChange('propertyType', e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="capitalize">{type.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Basic Information */}
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input 
                value={form.title} 
                onChange={e=>handleFieldChange('title', e.target.value)}
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:bg-neutral-900 ${fieldErrors.title ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30' : 'border-neutral-300 bg-white dark:border-neutral-700'}`}
                placeholder="e.g., Modern 2BHK Apartment in Koramangala"
              />
              {fieldErrors.title && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input 
                value={form.city} 
                onChange={e=>handleFieldChange('city', e.target.value)}
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:bg-neutral-900 ${fieldErrors.city ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30' : 'border-neutral-300 bg-white dark:border-neutral-700'}`}
                placeholder="e.g., Bangalore"
              />
              {fieldErrors.city && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.city}</p>}
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Monthly Price (₹) <span className="text-red-500">*</span>
              </label>
              <input 
                value={form.price} 
                onChange={e=>handleFieldChange('price', e.target.value)}
                type="number" 
                min="0"
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:bg-neutral-900 ${fieldErrors.price ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30' : 'border-neutral-300 bg-white dark:border-neutral-700'}`}
                placeholder="Enter monthly rent"
              />
              {fieldErrors.price && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Size (sq ft)</label>
              <input 
                value={form.size} 
                onChange={e=>handleFieldChange('size', e.target.value)}
                type="number" 
                min="0"
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900"
                placeholder="e.g., 1200"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input 
              value={form.address} 
              onChange={e=>handleFieldChange('address', e.target.value)}
              className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:bg-neutral-900 ${fieldErrors.address ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30' : 'border-neutral-300 bg-white dark:border-neutral-700'}`}
              placeholder="Full address of the property"
            />
            {fieldErrors.address && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.address}</p>}
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea 
              value={form.description} 
              onChange={e=>handleFieldChange('description', e.target.value)}
              rows="4" 
              className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:bg-neutral-900 ${fieldErrors.description ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30' : 'border-neutral-300 bg-white dark:border-neutral-700'}`}
              placeholder="Describe the property, amenities, location benefits, and what makes it special for students..."
            ></textarea>
            {fieldErrors.description && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.description}</p>}
          </div>
        </div>

        {/* Amenities */}
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="text-lg font-semibold mb-4">Amenities</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {[
              'WiFi', 'AC', 'Parking', 'Laundry', 'Kitchen', 
              'Gym', 'Swimming Pool', 'Security', 'CCTV', 'Power Backup',
              'Lift', 'Garden', 'Study Room', 'Common Area'
            ].map(amenity => (
              <label key={amenity} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.amenities.includes(amenity)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleFieldChange('amenities', [...form.amenities, amenity])
                    } else {
                      handleFieldChange('amenities', form.amenities.filter(a => a !== amenity))
                    }
                  }}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Photos */}
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="text-lg font-semibold mb-4">Property Photos <span className="text-red-500">*</span></h2>
          <div className="mb-4">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                if (files.length > 5) {
                  setError('Maximum 5 photos allowed')
                  return
                }
                const previews = files.map(f => URL.createObjectURL(f))
                handleFieldChange('photos', files)
                setForm(prev => ({ ...prev, preview: previews[0] || '' }))
              }}
              className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-teal-600 file:px-4 file:py-2 file:text-white hover:file:bg-teal-500"
            />
            {fieldErrors.photos && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.photos}</p>}
            <p className="mt-2 text-sm text-gray-500">Upload clear photos of your property (maximum 5 images)</p>
          </div>
          
          {form.preview && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {form.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img 
                    src={URL.createObjectURL(photo)} 
                    alt={`Property ${index + 1}`} 
                    className="h-32 w-full rounded-md object-cover border border-neutral-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newPhotos = form.photos.filter((_, i) => i !== index)
                      handleFieldChange('photos', newPhotos)
                      setForm(prev => ({ ...prev, preview: newPhotos[0] ? URL.createObjectURL(newPhotos[0]) : '' }))
                    }}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Property Type Specific Fields */}
        {form.propertyType === 'pg' && (
          <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="text-lg font-semibold mb-4">PG/Hostel Specific Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Food Provided</label>
                <select 
                  value={form.pgFood} 
                  onChange={e=>handleFieldChange('pgFood', e.target.value)}
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">WiFi Available</label>
                <select 
                  value={form.pgWifi} 
                  onChange={e=>handleFieldChange('pgWifi', e.target.value)}
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Additional Monthly Charges (₹) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={form.pgCharges} 
                  onChange={e=>handleFieldChange('pgCharges', e.target.value)}
                  min="0"
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:bg-neutral-900 ${fieldErrors.pgCharges ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30' : 'border-neutral-300 bg-white dark:border-neutral-700'}`}
                  placeholder="e.g., 2000 for food and other services"
                />
                {fieldErrors.pgCharges && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.pgCharges}</p>}
                <p className="mt-1 text-xs text-gray-500">Include charges for food, maintenance, and other services</p>
              </div>
            </div>
          </div>
        )}
        
        {form.propertyType === 'apartment' && (
          <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="text-lg font-semibold mb-4">Apartment Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Bedrooms</label>
                <input 
                  type="number" 
                  value={form.bedrooms} 
                  onChange={e=>handleFieldChange('bedrooms', e.target.value)}
                  min="1"
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bathrooms</label>
                <input 
                  type="number" 
                  value={form.bathrooms} 
                  onChange={e=>handleFieldChange('bathrooms', e.target.value)}
                  min="1"
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900"
                />
              </div>
            </div>
          </div>
        )}
        
        {form.propertyType === 'house' && (
          <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="text-lg font-semibold mb-4">House Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Bedrooms</label>
                <input 
                  type="number" 
                  value={form.bedrooms} 
                  onChange={e=>handleFieldChange('bedrooms', e.target.value)}
                  min="1"
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bathrooms</label>
                <input 
                  type="number" 
                  value={form.bathrooms} 
                  onChange={e=>handleFieldChange('bathrooms', e.target.value)}
                  min="1"
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900"
                />
              </div>
            </div>
          </div>
        )}
        
        {form.propertyType === 'studio' && (
          <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="text-lg font-semibold mb-4">Studio Details</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Studio Type</label>
              <select 
                value={form.roomOwnBed} 
                onChange={e=>handleFieldChange('roomOwnBed', e.target.value)}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900"
              >
                <option value="yes">Private Studio (Own Kitchen/Bathroom)</option>
                <option value="no">Shared Studio (Shared Facilities)</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/listings')}
            className="rounded-md border border-neutral-300 px-6 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="rounded-md bg-teal-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            )}
            {loading ? 'Adding Listing...' : 'Add Listing' }
          </button>
        </div>
      </form>
    </section>
  )
}

export default AddListings
