# FlatBuddy Backend API

A comprehensive backend API for the FlatBuddy student accommodation platform.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Property Listings**: CRUD operations for property listings with advanced filtering
- **Wishlist Management**: Add/remove properties from user wishlists
- **Feedback System**: Submit and manage user feedback
- **Search & Filtering**: Advanced search with location, price, and property type filters
- **Security**: Rate limiting, CORS, helmet security headers

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers
- **CORS** for cross-origin requests

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing (Owner only)
- `PUT /api/listings/:id` - Update listing (Owner only)
- `DELETE /api/listings/:id` - Delete listing (Owner only)

### Wishlist
- `POST /api/listings/wishlist` - Add to wishlist
- `DELETE /api/listings/wishlist/:listingId` - Remove from wishlist
- `GET /api/listings/wishlist/user` - Get user's wishlist

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/public` - Get public feedbacks
- `GET /api/feedback/all` - Get all feedbacks (Admin)
- `PUT /api/feedback/:id/status` - Update feedback status (Admin)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## Database Models

### User
- name, email, password, role (student/owner)
- phone, profileImage, preferences

### Listing
- title, description, price, city, address
- propertyType, bedrooms, bathrooms, size
- images, amenities, owner, isAvailable, isFeatured

### Feedback
- name, email, subject, message, rating
- isPublic, status (pending/reviewed/resolved)

### Wishlist
- user, listing (references)

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet security headers
- Input validation and sanitization

## API Response Format

```json
{
  "message": "Success message",
  "data": { ... },
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 50
  }
}
```

## Error Handling

All errors follow a consistent format:
```json
{
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

