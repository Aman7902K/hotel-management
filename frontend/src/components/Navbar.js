import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-white text-xl font-bold hover:text-blue-400 transition">
            Hotel Management
          </Link>
          <ul className="flex items-center space-x-6">
            <li>
              <Link to="/" className="text-white hover:text-blue-400 transition">Home</Link>
            </li>
            <li>
              <Link to="/rooms" className="text-white hover:text-blue-400 transition">Rooms</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/dashboard" className="text-white hover:text-blue-400 transition">Dashboard</Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link to="/admin" className="text-white hover:text-blue-400 transition">Admin</Link>
                  </li>
                )}
                <li>
                  <span className="text-white">Hi, {user?.name}</span>
                </li>
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="text-white hover:text-blue-400 transition">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="text-white hover:text-blue-400 transition">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
