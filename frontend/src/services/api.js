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
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      console.log('Token found in localStorage:', token ? 'Yes' : 'No');
      console.log('Raw token value:', token);
      if (token) {
        headers.Authorization = `Bearer ${token}`;
        console.log('Authorization header set to:', headers.Authorization);
      } else {
        console.log('No token available for Authorization header');
      }
    } else {
      console.log('Auth disabled for this request');
    }

    console.log('Final headers:', headers);
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    console.log('Making request to:', url);
    console.log('Request config:', config);
    console.log('Request headers:', config.headers);

    try {
      const response = await fetch(url, config);
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        data = null;
      }

      if (!response.ok) {
        // Extract error message properly
        let errorMessage = 'Request failed';
        if (data) {
          if (typeof data === 'string') {
            errorMessage = data;
          } else if (data.message) {
            errorMessage = data.message;
          } else if (data.error) {
            errorMessage = data.error;
          } else {
            errorMessage = JSON.stringify(data);
          }
        } else {
          errorMessage = `${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
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

  // HTTP methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  async delete(endpoint, data = null, options = {}) {
    const config = { method: 'DELETE', includeAuth: true, ...options };
    if (data) {
      config.body = JSON.stringify(data);
      // Ensure Content-Type is set for DELETE requests with body
      if (!config.headers) {
        config.headers = {};
      }
      config.headers['Content-Type'] = 'application/json';
    }
    return this.request(endpoint, config);
  }

  // Utility methods
  setAuthToken(token) {
    console.log('Setting auth token:', token ? 'setting' : 'clearing');
    if (token) {
      localStorage.setItem('auth_token', token);
      console.log('Token stored in localStorage:', localStorage.getItem('auth_token'));
    } else {
      localStorage.removeItem('auth_token');
      console.log('Token cleared from localStorage');
    }
  }

  getAuthToken() {
    const token = localStorage.getItem('auth_token');
    console.log('getAuthToken called, token:', token ? 'found' : 'not found');
    console.log('Token length:', token ? token.length : 'N/A');
    console.log('Token starts with:', token ? token.substring(0, 20) + '...' : 'N/A');
    return token;
  }

  clearAuth() {
    localStorage.removeItem('auth_token');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
