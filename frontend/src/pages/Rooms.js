import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roomAPI } from '../services/api';
import { toast } from 'react-toastify';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async (filterParams = {}) => {
    try {
      setLoading(true);
      const { data } = await roomAPI.getRooms(filterParams);
      setRooms(data.data);
    } catch (error) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const filterParams = {};
    if (filters.type) filterParams.type = filters.type;
    if (filters.minPrice) filterParams.minPrice = filters.minPrice;
    if (filters.maxPrice) filterParams.maxPrice = filters.maxPrice;
    filterParams.isAvailable = true;
    fetchRooms(filterParams);
  };

  const handleClearFilters = () => {
    setFilters({ type: '', minPrice: '', maxPrice: '' });
    fetchRooms({ isAvailable: true });
  };

  if (loading) {
    return <div className="text-center py-8 text-xl">Loading rooms...</div>;
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Available Rooms</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
              <select 
                name="type" 
                value={filters.type} 
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="deluxe">Deluxe</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition">
              Apply Filters
            </button>
            <button type="button" onClick={handleClearFilters} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition">
              Clear
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.length === 0 ? (
            <p className="col-span-full text-center py-8 text-gray-600">No rooms available</p>
          ) : (
            rooms.map((room) => (
              <div key={room._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:-translate-y-2 hover:shadow-xl transition-all">
                <div className="h-48 overflow-hidden">
                  {room.images && room.images.length > 0 ? (
                    <img src={room.images[0]} alt={room.type} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">No Image</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room</h3>
                  <p className="text-gray-600 text-sm mb-2">Room {room.roomNumber}</p>
                  <p className="text-gray-700 mb-4 line-clamp-2">{room.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-700">Capacity: {room.capacity} guests</span>
                    <span className="text-2xl font-bold text-green-600">${room.price}/night</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <Link 
                    to={`/rooms/${room._id}`} 
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 rounded-md transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Rooms;
