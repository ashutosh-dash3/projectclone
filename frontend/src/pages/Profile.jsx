import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import apiService from '../services/api'

const Profile = () => {
  const { currentUser, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('account')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showDeletePassword, setShowDeletePassword] = useState(false)
  
  const [accountForm, setAccountForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    profileImage: currentUser?.profileImage || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    deletePassword: ''
  })

  if (!currentUser) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="text-center py-12">
          <h1 className="text-3xl font-extrabold tracking-tight mb-4">Profile</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">You are not logged in.</p>
          <button 
            onClick={() => navigate('/login')}
            className="rounded-md bg-teal-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
          >
            Login
          </button>
        </div>
      </section>
    )
  }

  const handleAccountChange = (field, value) => {
    setAccountForm(prev => ({ ...prev, [field]: value }))
    setError('')
    setSuccess('')
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Update profile information
      const updateData = {
        name: accountForm.name,
        phone: accountForm.phone,
        profileImage: accountForm.profileImage
      }
      
      // Only include email if it's different
      if (accountForm.email !== currentUser.email) {
        updateData.email = accountForm.email
      }
      
      const response = await apiService.put('/users/profile', updateData)
      
      if (response.success && response.user) {
        // Update local state with new user data
        setAccountForm(prev => ({
          ...prev,
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone,
          profileImage: response.user.profileImage
        }));
        
        // Update auth context
        updateUser(response.user);
        
        setSuccess('Profile updated successfully!')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    if (accountForm.newPassword !== accountForm.confirmNewPassword) {
      setError('New passwords do not match')
      return
    }
    
    if (accountForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const response = await apiService.post('/auth/change-password', {
        currentPassword: accountForm.currentPassword,
        newPassword: accountForm.newPassword
      })
      
      if (response.success) {
        setSuccess('Password changed successfully!')
        setAccountForm(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }))
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }
    
    if (!accountForm.deletePassword) {
      setError('Please enter your password to confirm account deletion')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const response = await apiService.delete('/users/profile', {
        password: accountForm.deletePassword
      })
      
      if (response.success) {
        logout()
        navigate('/')
      }
    } catch (err) {
      console.error('Account deletion error:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      if (err.response) {
        console.error('Error response status:', err.response.status);
        console.error('Error response data:', err.response.data);
      }
      setError(err.response?.data?.message || err.message || 'Failed to delete account')
    } finally {
      setLoading(false)
      // Clear the delete password field
      setAccountForm(prev => ({ ...prev, deletePassword: '' }))
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Your Profile</h1>
      
      {error && (
        <div className="mb-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/30">
          {success}
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img 
                  src={accountForm.profileImage || currentUser.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'User')}&background=0D8ABC&color=fff`} 
                  alt="Profile" 
                  className="h-24 w-24 rounded-full object-cover border-4 border-teal-500"
                />
              </div>
              <h2 className="mt-4 text-xl font-semibold">{currentUser.name}</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{currentUser.email}</p>
            </div>
            
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'account' 
                    ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' 
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                Account Settings
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'listings' 
                    ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' 
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                Your Listings
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:w-3/4">
          {activeTab === 'account' && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
              
              {/* Profile Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        value={accountForm.name}
                        onChange={(e) => handleAccountChange('name', e.target.value)}
                        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={accountForm.email}
                        onChange={(e) => handleAccountChange('email', e.target.value)}
                        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={accountForm.phone}
                        onChange={(e) => handleAccountChange('phone', e.target.value)}
                        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Profile Picture</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              handleAccountChange('profileImage', event.target.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-teal-600 file:px-4 file:py-2 file:text-white hover:file:bg-teal-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              </div>
              
              {/* Change Password */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={accountForm.currentPassword}
                        onChange={(e) => handleAccountChange('currentPassword', e.target.value)}
                        className="w-full rounded-md border border-neutral-300 px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showCurrentPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                            <circle cx="12" cy="12" r="3"/>
                            <path d="m18 6-6 6-6-6"/>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={accountForm.newPassword}
                        onChange={(e) => handleAccountChange('newPassword', e.target.value)}
                        className="w-full rounded-md border border-neutral-300 px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showNewPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                            <circle cx="12" cy="12" r="3"/>
                            <path d="m18 6-6 6-6-6"/>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={accountForm.confirmNewPassword}
                        onChange={(e) => handleAccountChange('confirmNewPassword', e.target.value)}
                        className="w-full rounded-md border border-neutral-300 px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showConfirmPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                            <circle cx="12" cy="12" r="3"/>
                            <path d="m18 6-6 6-6-6"/>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500 disabled:opacity-50"
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>
              
              {/* Delete Account */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Delete Account</h3>
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                  <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Enter your password to confirm
                    </label>
                    <div className="relative">
                      <input
                        type={showDeletePassword ? 'text' : 'password'}
                        value={accountForm.deletePassword}
                        onChange={(e) => handleAccountChange('deletePassword', e.target.value)}
                        placeholder="Enter your password"
                        className="w-full rounded-md border border-neutral-300 px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowDeletePassword(!showDeletePassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showDeletePassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                            <circle cx="12" cy="12" r="3"/>
                            <path d="m18 6-6 6-6-6"/>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading || !accountForm.deletePassword}
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'listings' && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Listings</h2>
                <button
                  onClick={() => navigate('/add')}
                  className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
                >
                  Add New Listing
                </button>
              </div>
              
              <div className="text-center py-12">
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  You haven't created any listings yet.
                </p>
                <button
                  onClick={() => navigate('/add')}
                  className="mt-4 rounded-md bg-teal-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
                >
                  Create Your First Listing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Profile
