import React, { useState, useEffect } from 'react';
import { roomAPI, bookingAPI } from '../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    type: 'single',
    price: '',
    capacity: '',
    description: '',
    amenities: '',
    images: '',
    isAvailable: true,
  });

  useEffect(() => {
    if (activeTab === 'rooms') {
      fetchRooms();
    } else {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data } = await roomAPI.getRooms({});
      setRooms(data.data);
    } catch (error) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await bookingAPI.getAllBookings();
      setBookings(data.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomForm({
      ...roomForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();

    const roomData = {
      ...roomForm,
      amenities: roomForm.amenities.split(',').map((a) => a.trim()),
      images: roomForm.images.split(',').map((i) => i.trim()),
    };

    try {
      if (editingRoom) {
        await roomAPI.updateRoom(editingRoom, roomData);
        toast.success('Room updated successfully');
      } else {
        await roomAPI.createRoom(roomData);
        toast.success('Room created successfully');
      }
      setShowRoomForm(false);
      setEditingRoom(null);
      setRoomForm({
        roomNumber: '',
        type: 'single',
        price: '',
        capacity: '',
        description: '',
        amenities: '',
        images: '',
        isAvailable: true,
      });
      fetchRooms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save room');
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room._id);
    setRoomForm({
      roomNumber: room.roomNumber,
      type: room.type,
      price: room.price,
      capacity: room.capacity,
      description: room.description,
      amenities: room.amenities.join(', '),
      images: room.images.join(', '),
      isAvailable: room.isAvailable,
    });
    setShowRoomForm(true);
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      await roomAPI.deleteRoom(id);
      toast.success('Room deleted successfully');
      fetchRooms();
    } catch (error) {
      toast.error('Failed to delete room');
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await bookingAPI.updateBooking(id, status);
      toast.success('Booking status updated');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'rooms'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Manage Rooms
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'bookings'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Manage Bookings
          </button>
        </div>

        {activeTab === 'rooms' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowRoomForm(!showRoomForm);
                  setEditingRoom(null);
                  setRoomForm({
                    roomNumber: '',
                    type: 'single',
                    price: '',
                    capacity: '',
                    description: '',
                    amenities: '',
                    images: '',
                    isAvailable: true,
                  });
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                {showRoomForm ? 'Cancel' : 'Add New Room'}
              </button>
            </div>

            {showRoomForm && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  {editingRoom ? 'Edit Room' : 'Create New Room'}
                </h2>
                <form onSubmit={handleRoomSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                      <input
                        type="text"
                        name="roomNumber"
                        value={roomForm.roomNumber}
                        onChange={handleRoomFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select
                        name="type"
                        value={roomForm.type}
                        onChange={handleRoomFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="suite">Suite</option>
                        <option value="deluxe">Deluxe</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={roomForm.price}
                        onChange={handleRoomFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                      <input
                        type="number"
                        name="capacity"
                        value={roomForm.capacity}
                        onChange={handleRoomFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={roomForm.description}
                      onChange={handleRoomFormChange}
                      required
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amenities (comma separated)</label>
                    <input
                      type="text"
                      name="amenities"
                      value={roomForm.amenities}
                      onChange={handleRoomFormChange}
                      placeholder="WiFi, TV, AC"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs (comma separated)</label>
                    <input
                      type="text"
                      name="images"
                      value={roomForm.images}
                      onChange={handleRoomFormChange}
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={roomForm.isAvailable}
                      onChange={handleRoomFormChange}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">Available</label>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
                  >
                    {editingRoom ? 'Update Room' : 'Create Room'}
                  </button>
                </form>
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">Loading rooms...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div key={room._id} className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">
                      {room.type.charAt(0).toUpperCase() + room.type.slice(1)} - Room {room.roomNumber}
                    </h3>
                    <p className="text-gray-700 mb-2">Price: ${room.price}/night</p>
                    <p className="text-gray-700 mb-2">Capacity: {room.capacity}</p>
                    <p className={`mb-4 ${room.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {room.isAvailable ? 'Available' : 'Not Available'}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditRoom(room)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            {loading ? (
              <div className="text-center py-8">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-600 text-lg">No bookings found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {booking.room?.type?.charAt(0).toUpperCase() + booking.room?.type?.slice(1)} Room
                        </h3>
                        <p className="text-gray-600">Room: {booking.room?.roomNumber}</p>
                        <p className="text-gray-600">Guest: {booking.user?.name}</p>
                        <p className="text-gray-600">Email: {booking.user?.email}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Check-in</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(booking.checkInDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Check-out</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Guests</p>
                        <p className="font-semibold text-gray-800">{booking.numberOfGuests}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Price</p>
                        <p className="font-semibold text-green-600 text-xl">${booking.totalPrice}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <select
                        value={booking.status}
                        onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;