# Hotel Management System

## Prerequisites
- Node.js v18 or higher recommended

## Tech Stack

### Frontend
- React 19.2.0
- Vite 7.2.4 (build tool)
- React Router DOM v7.12.0
- Axios 1.13.2
- Tailwind CSS 4.1.18
- React DatePicker 9.1.0
- React Toastify 11.0.5

### Backend
- Node.js (v18 or higher)
- Express.js 4.18.2
- MongoDB & Mongoose 7.5.0
- JWT (jsonwebtoken) 9.0.2
- bcryptjs 2.4.3
- CORS 2.8.5
- express-rate-limit 6.10.0
- express-validator 7.0.1

## Frontend Setup
- Use Vite instead of Create React App
- Run development server with `npm run dev`
- Frontend will run on http://localhost:5173 (Vite's default port)

## Frontend Deployment
- Build frontend using Vite command

## Vite Configuration
- Ensure ES modules are configured properly before deployment.

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


