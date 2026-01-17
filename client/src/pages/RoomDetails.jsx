import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { roomAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    checkInDate: null,
    checkOutDate: null,
    numberOfGuests: 1,
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const { data } = await roomAPI.getRoom(id);
      setRoom(data.data);
    } catch (error) {
      toast.error('Failed to load room details');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate || !room) {
      return 0;
    }
    const days = Math.ceil(
      (bookingData.checkOutDate - bookingData.checkInDate) / (1000 * 60 * 60 * 24)
    );
    return days * room.price;
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to book a room');
      navigate('/login');
      return;
    }

    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (bookingData.numberOfGuests > room.capacity) {
      toast.error(`Room capacity is ${room.capacity} guests`);
      return;
    }

    setBookingLoading(true);

    try {
      const totalPrice = calculateTotalPrice();
      await bookingAPI.createBooking({
        room: room._id,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        numberOfGuests: bookingData.numberOfGuests,
        totalPrice,
      });

      toast.success('Booking created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-xl">Loading room details...</div>;
  }

  if (!room) {
    return <div className="text-center py-8 text-xl">Room not found</div>;
  }

  const totalPrice = calculateTotalPrice();

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            {room.images && room.images.length > 0 ? (
              room.images.map((image, index) => (
                <img 
                  key={index} 
                  src={image} 
                  alt={`${room.type} ${index + 1}`} 
                  className="w-full h-80 object-cover rounded-lg shadow-md"
                />
              ))
            ) : (
              <div className="w-full h-80 bg-gray-300 flex items-center justify-center text-gray-500 rounded-lg">
                No Image Available
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-800">
              {room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room
            </h1>
            <p className="text-gray-600 mb-4">Room Number: {room.roomNumber}</p>
            <p className="text-3xl font-bold text-green-600 mb-2">${room.price} per night</p>
            <p className="text-gray-700 mb-6">Capacity: {room.capacity} guests</p>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Description</h3>
              <p className="text-gray-700 leading-relaxed">{room.description}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Amenities</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {room.amenities.map((amenity, index) => (
                  <li key={index} className="bg-gray-100 p-3 rounded text-gray-700">
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>

            {room.isAvailable ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Book This Room</h3>
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                      <DatePicker
                        selected={bookingData.checkInDate}
                        onChange={(date) =>
                          setBookingData({ ...bookingData, checkInDate: date })
                        }
                        minDate={new Date()}
                        dateFormat="yyyy-MM-dd"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        placeholderText="Select check-in date"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                      <DatePicker
                        selected={bookingData.checkOutDate}
                        onChange={(date) =>
                          setBookingData({ ...bookingData, checkOutDate: date })
                        }
                        minDate={bookingData.checkInDate || new Date()}
                        dateFormat="yyyy-MM-dd"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        placeholderText="Select check-out date"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                    <input
                      type="number"
                      min="1"
                      max={room.capacity}
                      value={bookingData.numberOfGuests}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          numberOfGuests: parseInt(e.target.value),
                        })
                      }
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {totalPrice > 0 && (
                    <div className="bg-gray-100 p-4 rounded-md text-center">
                      <strong className="text-2xl text-green-600">Total Price: ${totalPrice}</strong>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingLoading ? 'Booking...' : 'Book Now'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-red-100 p-4 rounded-md text-center text-red-700">
                <p>This room is currently not available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
