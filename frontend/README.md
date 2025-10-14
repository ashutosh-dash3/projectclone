# FlatBuddy - Student Accommodation Platform

A comprehensive full-stack web application for student accommodation management, built with React and Node.js.

## 🌟 Features

### General Features
- **Dark/Light Mode Toggle** – Theme switcher for better UX
- **Dynamic Home Page Listings** – Fetch property data from backend instead of hardcoding
- **Featured Listings with Wishlist Button** – Functional "Add to Wishlist" for each property card
- **Client Feedback Integration** – Show real feedback submitted through Contact Us form
- **Organized Project Structure** – Separate backend folder for routes, APIs, DB connections
- **Responsive & Modern UI** – Clean layout with cards, navbar, smooth scrolling

### 🧭 Navigation (Role-Based Navbars)

#### 1. Landing Page Navbar (Before Login)
- Home
- About
- Listings (public)
- Login/Signup (Student | Owner)
- Contact

#### 2. Student Navbar (After Login)
- Home/Dashboard
- Browse Listings
- Wishlist/Saved Rooms
- Profile (basic details)
- Logout

#### 3. Owner Navbar (After Login)
- Dashboard
- My Listings (view/edit/delete)
- Add New Listing
- Profile (basic details)
- Logout

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **React Router DOM** for routing
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers
- **CORS** for cross-origin requests

## 📁 Project Structure

```
FlatBuddy/
├── src/                          # Frontend source code
│   ├── components/               # Reusable components
│   │   ├── NavBar.jsx           # Role-based navigation
│   │   └── Footer.jsx           # Footer component
│   ├── context/                 # React Context providers
│   │   ├── AuthContext.jsx      # Authentication state
│   │   └── ListingsContext.jsx  # Listings and wishlist state
│   ├── pages/                   # Page components
│   │   ├── Home.jsx             # Landing page with featured listings
│   │   ├── Listings.jsx         # Browse listings page
│   │   ├── AddListings.jsx      # Add new listing (Owner only)
│   │   ├── Wishlist.jsx         # User's wishlist
│   │   ├── Login.jsx            # Login page
│   │   ├── SignUp.jsx           # Registration page
│   │   ├── Contact.jsx          # Contact/Feedback form
│   │   └── About.jsx            # About page
│   ├── services/                # API services
│   │   └── api.js               # API service layer
│   ├── utils/                   # Utility functions
│   │   └── storage.js           # Local storage helpers
│   └── config/                  # Configuration
│       └── env.js               # Environment configuration
├── backend/                     # Backend source code
│   ├── routes/                  # API routes
│   │   ├── auth.js              # Authentication routes
│   │   ├── listings.js          # Listings routes
│   │   ├── users.js             # User routes
│   │   └── feedback.js          # Feedback routes
│   ├── controllers/             # Route controllers
│   │   ├── authController.js    # Auth logic
│   │   ├── listingController.js # Listings logic
│   │   └── feedbackController.js # Feedback logic
│   ├── models/                  # Database models
│   │   ├── User.js              # User model
│   │   ├── Listing.js           # Listing model
│   │   ├── Feedback.js          # Feedback model
│   │   └── Wishlist.js          # Wishlist model
│   ├── middleware/              # Express middleware
│   │   └── auth.js              # Authentication middleware
│   ├── config/                  # Configuration
│   │   └── database.js          # Database connection
│   ├── server.js                # Main server file
│   └── package.json             # Backend dependencies
└── package.json                 # Frontend dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd FlatBuddy
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

4. **Set up environment variables**
```bash
# Create .env file in backend directory
cp backend/.env.example backend/.env

# Edit backend/.env with your configuration:
MONGODB_URI=mongodb://localhost:27017/flatbuddy
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

5. **Start the development servers**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## 📱 Usage

### For Students
1. **Register/Login** as a student
2. **Browse Listings** to find accommodation
3. **Add to Wishlist** properties you like
4. **Contact Owners** for inquiries
5. **Submit Feedback** about your experience

### For Property Owners
1. **Register/Login** as an owner
2. **Add Listings** with property details
3. **Manage Your Listings** (edit/delete)
4. **View Inquiries** from students
5. **Update Property Availability**

## 🔧 API Endpoints

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

## 🎨 UI Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Mode** - Toggle between themes
- **Modern Cards** - Clean property listing cards
- **Smooth Animations** - Hover effects and transitions
- **Loading States** - User feedback during API calls
- **Error Handling** - Graceful error messages
- **Form Validation** - Client-side validation

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs for password security
- **Rate Limiting** - Prevent API abuse
- **CORS Configuration** - Secure cross-origin requests
- **Input Validation** - Server-side validation
- **Helmet Security** - Security headers

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd backend
# Set environment variables
# Deploy with your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Frontend Development** - React, Tailwind CSS
- **Backend Development** - Node.js, Express, MongoDB
- **UI/UX Design** - Modern, responsive design
- **Database Design** - MongoDB with Mongoose

## 📞 Support

For support, email support@flatbuddy.com or create an issue in the repository.

---

**FlatBuddy** - Making student accommodation search simple and efficient! 🏠✨