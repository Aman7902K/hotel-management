const mongoose = require('mongoose');
const Room = require('./models/Room'); // Adjust the path to your Room model
require('dotenv').config();

const rooms = [
  // Single Rooms
  {
    roomNumber: '101',
    type: 'single',
    price: 99,
    capacity: 1,
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Fridge', 'Work Desk'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800'
    ],
    description: 'Cozy single room perfect for solo travelers.  Features a comfortable bed, modern amenities, and a great view.',
    isAvailable: true,
  },
  {
    roomNumber: '102',
    type:  'single',
    price:  99,
    capacity: 1,
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Coffee Maker'],
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
    ],
    description: 'Comfortable single room with all essential amenities for a pleasant stay.',
    isAvailable: true,
  },
  {
    roomNumber: '103',
    type: 'single',
    price: 109,
    capacity: 1,
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Fridge', 'Work Desk', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    ],
    description: 'Premium single room with a private balcony overlooking the city.',
    isAvailable: true,
  },

  // Double Rooms
  {
    roomNumber: '201',
    type: 'double',
    price: 149,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Fridge', 'Coffee Maker', 'Work Desk', 'Safe'],
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'
    ],
    description: 'Spacious double room with a queen-size bed, perfect for couples or friends traveling together.',
    isAvailable: true,
  },
  {
    roomNumber: '202',
    type: 'double',
    price: 159,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Fridge', 'Coffee Maker', 'Balcony', 'Bathtub'],
    images:  [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
    ],
    description: 'Elegant double room featuring a private balcony and luxurious bathtub for ultimate relaxation.',
    isAvailable: false,
  },
  {
    roomNumber: '203',
    type: 'double',
    price: 149,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Fridge', 'Work Desk', 'Iron'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
    ],
    description: 'Modern double room with contemporary design and all necessary amenities.',
    isAvailable: true,
  },
  {
    roomNumber: '204',
    type: 'double',
    price: 169,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Coffee Maker', 'Balcony', 'Sofa', 'Safe'],
    images: [
      'https://images.unsplash.com/photo-1590490359854-48f08ae83c2f?w=800',
    ],
    description: 'Deluxe double room with extra seating area and premium amenities.',
    isAvailable: true,
  },

  // Suite Rooms
  {
    roomNumber: '301',
    type: 'suite',
    price: 299,
    capacity: 3,
    amenities: ['WiFi', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'Coffee Maker', 'Work Desk', 'Safe', 'Balcony', 'Living Room', 'Bathtub', 'Room Service'],
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800'
    ],
    description: 'Luxurious suite with separate living area, premium furnishings, and stunning views.  Perfect for families or extended stays.',
    isAvailable: true,
  },
  {
    roomNumber: '302',
    type: 'suite',
    price: 319,
    capacity: 4,
    amenities: ['WiFi', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'Espresso Machine', 'Work Desk', 'Safe', 'Balcony', 'Living Room', 'Jacuzzi', 'Room Service', 'Kitchen'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800'
    ],
    description: 'Executive suite with kitchenette, jacuzzi, and spacious living area.  Ideal for business travelers or families.',
    isAvailable: true,
  },
  {
    roomNumber: '303',
    type: 'suite',
    price: 289,
    capacity: 3,
    amenities: ['WiFi', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'Coffee Maker', 'Safe', 'Living Room', 'Bathtub', 'Room Service'],
    images: [
      'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800',
    ],
    description: 'Comfortable suite with modern amenities and elegant decor.',
    isAvailable: false,
  },

  // Deluxe Rooms
  {
    roomNumber:  '401',
    type: 'deluxe',
    price: 449,
    capacity: 4,
    amenities: ['WiFi', 'Smart TV', 'Air Conditioning', 'Premium Mini Bar', 'Espresso Machine', 'Work Desk', 'Safe', 'Private Balcony', 'Living Room', 'Jacuzzi', '24/7 Room Service', 'Walk-in Closet', 'Premium Toiletries'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1631049552240-59c37f563fd3?w=800',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
    ],
    description: 'Premium deluxe room with top-tier amenities, panoramic views, and unparalleled comfort.  The ultimate luxury experience.',
    isAvailable: true,
  },
  {
    roomNumber: '402',
    type: 'deluxe',
    price: 499,
    capacity: 4,
    amenities: ['WiFi', 'Smart TV', 'Air Conditioning', 'Premium Mini Bar', 'Espresso Machine', 'Executive Work Desk', 'Safe', 'Private Terrace', 'Separate Living & Dining Room', 'Spa Bathtub', '24/7 Butler Service', 'Walk-in Closet', 'Premium Toiletries', 'Sound System'],
    images: [
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'
    ],
    description: 'Exclusive penthouse-style deluxe room with butler service, private terrace, and premium entertainment system.',
    isAvailable: true,
  },
  {
    roomNumber: '403',
    type: 'deluxe',
    price:  429,
    capacity: 3,
    amenities: ['WiFi', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'Espresso Machine', 'Work Desk', 'Safe', 'Balcony', 'Living Room', 'Jacuzzi', 'Room Service', 'Premium Bedding'],
    images: [
      'https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=800',
    ],
    description: 'Sophisticated deluxe room with premium bedding and modern luxury amenities.',
    isAvailable: true,
  },

  // Additional rooms for variety
  {
    roomNumber:  '104',
    type: 'single',
    price: 89,
    capacity: 1,
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Work Desk'],
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800',
    ],
    description:  'Budget-friendly single room with essential amenities for comfortable stay.',
    isAvailable: true,
  },
  {
    roomNumber: '205',
    type: 'double',
    price: 139,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Fridge', 'Coffee Maker'],
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
    ],
    description: 'Affordable double room with comfortable bedding and essential facilities.',
    isAvailable: true,
  },
];

// Connect to MongoDB and seed the database
const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose. connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected.. .');

    // Clear existing rooms
    await Room.deleteMany({});
    console.log('Existing rooms deleted');

    // Insert new rooms
    await Room.insertMany(rooms);
    console.log('Sample rooms added successfully! ');

    // Disconnect
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDB();