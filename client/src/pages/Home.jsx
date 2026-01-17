import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      <div 
        className="h-[500px] flex items-center justify-center text-white text-center bg-cover bg-center relative"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200')"
        }}
      >
        <div>
          <h1 className="text-5xl font-bold mb-4">Welcome to Our Hotel</h1>
          <p className="text-2xl mb-8">Experience luxury and comfort in the heart of the city</p>
          <Link 
            to="/rooms" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            View Rooms
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-8 bg-gray-100 rounded-lg hover:-translate-y-2 transition-transform">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">🏨 Luxury Rooms</h3>
            <p className="text-gray-600">Choose from our selection of premium rooms</p>
          </div>
          <div className="text-center p-8 bg-gray-100 rounded-lg hover:-translate-y-2 transition-transform">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">🍽️ Fine Dining</h3>
            <p className="text-gray-600">Enjoy world-class cuisine at our restaurants</p>
          </div>
          <div className="text-center p-8 bg-gray-100 rounded-lg hover:-translate-y-2 transition-transform">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">💆 Spa & Wellness</h3>
            <p className="text-gray-600">Relax and rejuvenate at our spa facilities</p>
          </div>
          <div className="text-center p-8 bg-gray-100 rounded-lg hover:-translate-y-2 transition-transform">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">🎯 Prime Location</h3>
            <p className="text-gray-600">Conveniently located in the city center</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
