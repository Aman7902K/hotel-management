# Hotel Management System - MERN Stack

A complete hotel management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user authentication, room management, and booking functionality.

## Features

### Backend
- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-based Access Control**: Admin and customer roles
- **Room Management**: Full CRUD operations for rooms (admin only)
- **Booking System**: Create, view, and cancel bookings with availability validation
- **API Security**: CORS configuration, rate limiting, and input validation
- **Database**: MongoDB with Mongoose ODM

### Frontend
- **Responsive Design**: Built with Tailwind CSS for mobile-first responsive layouts
- **Authentication**: Login and registration with form validation
- **Room Browsing**: Filter rooms by type, price range, and availability
- **Booking Interface**: Interactive date picker and booking form
- **User Dashboard**: View and manage personal bookings
- **Admin Dashboard**: Manage rooms and all bookings
- **Toast Notifications**: Real-time feedback for user actions

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- express-rate-limit

### Frontend
- React 18
- React Router DOM v6
- Axios
- Tailwind CSS
- React DatePicker
- React Toastify

## Project Structure

```
hotel-management/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── roomController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── error.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── roomRoutes.js
│   │   └── bookingRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── PrivateRoute.js
    │   │   └── AdminRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Rooms.js
    │   │   ├── RoomDetails.js
    │   │   ├── Dashboard.js
    │   │   └── AdminDashboard.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .gitignore
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hotel-management
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

5. Start the backend server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The backend API will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Rooms
- `GET /api/rooms` - Get all rooms (with optional filters)
- `GET /api/rooms/:id` - Get single room
- `POST /api/rooms` - Create room (Admin only)
- `PUT /api/rooms/:id` - Update room (Admin only)
- `DELETE /api/rooms/:id` - Delete room (Admin only)

### Bookings
- `POST /api/bookings` - Create new booking (Protected)
- `GET /api/bookings/user` - Get user's bookings (Protected)
- `GET /api/bookings` - Get all bookings (Admin only)
- `PUT /api/bookings/:id` - Update booking status (Admin only)
- `DELETE /api/bookings/:id` - Cancel booking (Protected)

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (customer|admin),
  createdAt: Date
}
```

### Room
```javascript
{
  roomNumber: String (unique),
  type: String (single|double|suite|deluxe),
  price: Number,
  capacity: Number,
  amenities: [String],
  images: [String],
  description: String,
  isAvailable: Boolean,
  createdAt: Date
}
```

### Booking
```javascript
{
  user: ObjectId (ref: User),
  room: ObjectId (ref: Room),
  checkInDate: Date,
  checkOutDate: Date,
  numberOfGuests: Number,
  totalPrice: Number,
  status: String (pending|confirmed|cancelled|completed),
  createdAt: Date
}
```

## Usage

### For Customers
1. **Register/Login**: Create an account or login
2. **Browse Rooms**: View available rooms with filters
3. **Book a Room**: Select dates and number of guests
4. **Manage Bookings**: View and cancel bookings from dashboard

### For Admins
1. **Login**: Use admin credentials
2. **Manage Rooms**: Add, edit, or delete rooms
3. **Manage Bookings**: View all bookings and update status
4. **Monitor System**: View all users and bookings

### Creating an Admin User
To create an admin user, register normally and then update the user role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Testing

Run backend tests:
```bash
cd backend
npm test
```

Run frontend tests:
```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment
1. Set environment variables in production
2. Use a production MongoDB database
3. Deploy to platforms like Heroku, Railway, or AWS

### Frontend Deployment
1. Build the production bundle:
```bash
npm run build
```
2. Deploy to platforms like Vercel, Netlify, or AWS S3

## Security Features
- Password hashing with bcrypt
- JWT-based authentication
- Protected routes and API endpoints
- Role-based access control
- CORS configuration
- Rate limiting
- Input validation

## Future Enhancements
- Payment gateway integration
- Email notifications
- Room availability calendar
- Reviews and ratings
- Image upload functionality
- Advanced search filters
- Multi-language support

## License
ISC

## Contributors
Built as a demonstration of MERN stack development best practices.

