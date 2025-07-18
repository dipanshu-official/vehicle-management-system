import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBookings, getVehicles, getUsers, getCurrentUser } from '../../utils/storage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useLoading } from '../../hooks/useLoading';

export const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const { loading, withLoading } = useLoading();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await withLoading(async () => {
      const user = getCurrentUser();
      setCurrentUser(user);
      setVehicles(getVehicles());
      setUsers(getUsers());
      
      const allBookings = getBookings();
      const userBookings = user ? allBookings.filter(b => b.customerId === user._id) : [];
      setBookings(userBookings);
    });
  };

  const userStats = {
    totalBookings: bookings.length,
    activeBookings: bookings.filter(b => b.status === 'active').length,
    completedBookings: bookings.filter(b => b.status === 'completed').length,
    totalSpent: bookings.reduce((sum, b) => sum + b.totalCost, 0)
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." className="py-12" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border border-green-100">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl mr-4 shadow-md">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {currentUser?.name || 'User'}
            </h1>
            <p className="text-green-700">Search and book vehicles for your transportation needs</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl mr-4 shadow-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Total Bookings</h3>
              <p className="text-2xl font-bold text-blue-600">{userStats.totalBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-6 border border-orange-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl mr-4 shadow-md">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-900">Active Bookings</h3>
              <p className="text-2xl font-bold text-orange-600">{userStats.activeBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border border-green-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl mr-4 shadow-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">Completed</h3>
              <p className="text-2xl font-bold text-green-600">{userStats.completedBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 border border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl mr-4 shadow-md">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-900">Total Spent</h3>
              <p className="text-2xl font-bold text-purple-600">₹{userStats.totalSpent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/user/search"
            className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-6 rounded-xl transition-all duration-300 border border-blue-200 hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg mr-4">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">Search & Book</h3>
                <p className="text-sm text-blue-600">Find and book available vehicles</p>
              </div>
            </div>
          </Link>
          <Link
            to="/user/bookings"
            className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 p-6 rounded-xl transition-all duration-300 border border-green-200 hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg mr-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">My Bookings</h3>
                <p className="text-sm text-green-600">View and manage your bookings</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      {bookings.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
            <Link
              to="/user/bookings"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {bookings.slice(0, 3).map(booking => {
              const vehicle = vehicles.find(v => v._id === booking.vehicleId);
              return (
                <div key={booking._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg mr-3">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{vehicle?.name || 'Unknown Vehicle'}</p>
                      <p className="text-sm text-gray-600">
                        {booking.fromPincode} → {booking.toPincode}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{booking.totalCost}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.status === 'active' ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800' :
                      booking.status === 'completed' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' :
                      'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};