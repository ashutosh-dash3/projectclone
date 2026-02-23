const mongoose = require('mongoose');
const Listing = require('./models/Listing');
const User = require('./models/User');
require('dotenv').config();

const seedListings = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flatbuddy');
    console.log('📊 Connected to MongoDB');

    // Clear existing data
    await Listing.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create sample user
    const sampleUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'vendor',
      phone: '+919876543210'
    });
    
    const savedUser = await sampleUser.save();
    console.log('👤 Created sample user');

    // Create sample listings
    const sampleListings = [
      {
        title: "Modern 2BHK Apartment in Central Delhi",
        description: "Beautiful 2 bedroom apartment located in the heart of Delhi. Fully furnished with modern amenities. Close to metro station and shopping centers.",
        price: 15000,
        city: "Delhi",
        address: "Connaught Place, New Delhi",
        propertyType: "apartment",
        bedrooms: 2,
        bathrooms: 2,
        size: "1200 sq ft",
        amenities: ["WiFi", "AC", "Parking", "Laundry", "Kitchen"],
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop"
        ],
        owner: savedUser._id,
        location: {
          type: "Point",
          coordinates: [77.2090, 28.6139] // [longitude, latitude] - Delhi
        },
        isFeatured: true,
        isAvailable: true
      },
      {
        title: "Cozy Studio in Mumbai",
        description: "Compact and comfortable studio apartment perfect for singles or couples. Well-connected to business districts.",
        price: 12000,
        city: "Mumbai",
        address: "Bandra, Mumbai",
        propertyType: "studio",
        bedrooms: 1,
        bathrooms: 1,
        size: "600 sq ft",
        amenities: ["WiFi", "AC", "Kitchen"],
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"
        ],
        owner: savedUser._id,
        location: {
          type: "Point",
          coordinates: [72.8777, 19.0760] // [longitude, latitude] - Mumbai
        },
        isFeatured: true,
        isAvailable: true
      },
      {
        title: "Luxury 3BHK in Bangalore",
        description: "Spacious 3 bedroom apartment in a premium locality. Modern facilities and excellent connectivity to IT parks.",
        price: 25000,
        city: "Bangalore",
        address: "Koramangala, Bangalore",
        propertyType: "apartment",
        bedrooms: 3,
        bathrooms: 3,
        size: "1800 sq ft",
        amenities: ["WiFi", "AC", "Parking", "Gym", "Swimming Pool", "Laundry", "Kitchen"],
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
        ],
        owner: savedUser._id,
        location: {
          type: "Point",
          coordinates: [77.6094, 12.9716] // [longitude, latitude] - Bangalore
        },
        isFeatured: true,
        isAvailable: true
      },
      {
        title: "Affordable PG in Hyderabad",
        description: "Budget-friendly paying guest accommodation with all basic amenities. Perfect for students and working professionals.",
        price: 8000,
        city: "Hyderabad",
        address: "HITEC City, Hyderabad",
        propertyType: "pg",
        bedrooms: 1,
        bathrooms: 1,
        size: "200 sq ft",
        amenities: ["WiFi", "Laundry", "Kitchen"],
        images: [
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop"
        ],
        owner: savedUser._id,
        location: {
          type: "Point",
          coordinates: [78.4867, 17.3850] // [longitude, latitude] - Hyderabad
        },
        isFeatured: false,
        isAvailable: true
      },
      {
        title: "Serviced Apartment in Chennai",
        description: "Fully serviced apartment with housekeeping and maintenance included. Ideal for short-term stays.",
        price: 18000,
        city: "Chennai",
        address: "Anna Nagar, Chennai",
        propertyType: "apartment",
        bedrooms: 2,
        bathrooms: 2,
        size: "1000 sq ft",
        amenities: ["WiFi", "AC", "Parking", "Laundry", "Kitchen", "Housekeeping"],
        images: [
          "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&h=600&fit=crop"
        ],
        owner: savedUser._id,
        location: {
          type: "Point",
          coordinates: [80.2707, 13.0827] // [longitude, latitude] - Chennai
        },
        isFeatured: true,
        isAvailable: true
      },
      {
        title: "Independent House in Pune",
        description: "Spacious independent house with garden. Perfect for families looking for a peaceful environment.",
        price: 22000,
        city: "Pune",
        address: "Koregaon Park, Pune",
        propertyType: "house",
        bedrooms: 3,
        bathrooms: 2,
        size: "2000 sq ft",
        amenities: ["WiFi", "AC", "Parking", "Garden", "Laundry", "Kitchen"],
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
        ],
        owner: savedUser._id,
        location: {
          type: "Point",
          coordinates: [73.8567, 18.5204] // [longitude, latitude] - Pune
        },
        isFeatured: false,
        isAvailable: true
      }
    ];

    // Insert sample listings
    const insertedListings = await Listing.insertMany(sampleListings);
    console.log(`✅ Inserted ${insertedListings.length} sample listings`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('You can now view listings in your application.');
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedListings();