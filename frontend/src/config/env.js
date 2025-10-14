// Environment configuration
export const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'FlatBuddy',
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Student Accommodation Platform',
  NODE_ENV: import.meta.env.MODE || 'development'
};

export default config;

