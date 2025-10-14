const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        data = null;
      }

      if (!response.ok) {
        const message = (data && (data.error || data.message)) || `${response.status} ${response.statusText}`;
        throw new Error(message || 'Request failed');
      }

      return data ?? {};
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      includeAuth: false,
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      includeAuth: false,
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Listings endpoints
  async getListings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/listings?${queryString}` : '/listings';
    return this.request(endpoint, { includeAuth: false });
  }

  async getListing(id) {
    return this.request(`/listings/${id}`, { includeAuth: false });
  }

  async createListing(listingData) {
    return this.request('/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  }

  async updateListing(id, listingData) {
    return this.request(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listingData),
    });
  }

  async deleteListing(id) {
    return this.request(`/listings/${id}`, {
      method: 'DELETE',
    });
  }

  // Wishlist endpoints
  async addToWishlist(listingId) {
    return this.request('/listings/wishlist', {
      method: 'POST',
      body: JSON.stringify({ listingId }),
    });
  }

  async removeFromWishlist(listingId) {
    return this.request(`/listings/wishlist/${listingId}`, {
      method: 'DELETE',
    });
  }

  async getWishlist() {
    return this.request('/listings/wishlist/user');
  }

  // Feedback endpoints
  async submitFeedback(feedbackData) {
    return this.request('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
      includeAuth: false,
    });
  }

  async getPublicFeedbacks(limit = 10) {
    return this.request(`/feedback/public?limit=${limit}`, { includeAuth: false });
  }

  // Utility methods
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getAuthToken() {
    return localStorage.getItem('auth_token');
  }

  clearAuth() {
    localStorage.removeItem('auth_token');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
