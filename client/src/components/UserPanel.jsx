import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, MapPin } from 'lucide-react';
import { getBookings, getVehicles, getUsers, getCurrentUser, addBooking, calculateCost, updateBookingStatus } from '../utils/storage';
import { SearchBooking } from './SearchBooking';
import { BookingForm } from './BookingForm';
import { BookingList } from './BookingList';

export const UserPanel = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'bookings'>('search');
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setVehicles(getVehicles());
    setUsers(getUsers());
    
    // Get bookings for current user
    const allBookings = getBookings();
    const userBookings = user ? allBookings.filter(b => b.customerId === user._id) : [];
    setBookings(userBookings);
  };

  const handleBookVehicle = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setShowBookingForm(true);
  };

  const handleAddBooking = (bookingData) => {
    const totalCost = calculateCost(bookingData.vehicleId, bookingData.estimatedRideDurationHours);
    addBooking({ 
      ...bookingData, 
      totalCost, 
      status: 'active',
      customerId: currentUser?._id || bookingData.customerId
    });
    loadData();
    setShowBookingForm(false);
    setSelectedVehicleId('');
  };

  const handleCancelBooking = (bookingId) => {
    updateBookingStatus(bookingId, status);
    loadData();
  };

  const userStats = {
    totalBookings: bookings.length,
    activeBookings: bookings.filter(b => b.status === 'active').length,
    completedBookings: bookings.filter(b => b.status === 'completed').length,
    totalSpent: bookings.reduce((sum, b) => sum + b.totalCost, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, {currentUser?.name || 'User'}
              </h1>
              <p className="text-gray-600">Search and book vehicles for your transportation needs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Bookings</h3>
              <p className="text-2xl font-bold text-blue-600">{userStats.totalBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg mr-4">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Active Bookings</h3>
              <p className="text-2xl font-bold text-orange-600">{userStats.activeBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Completed</h3>
              <p className="text-2xl font-bold text-green-600">{userStats.completedBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <Search className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Spent</h3>
              <p className="text-2xl font-bold text-purple-600">₹{userStats.totalSpent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'search'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Search & Book
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'bookings'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Bookings ({bookings.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'search' && (
            <SearchBooking onBookVehicle={handleBookVehicle} />
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <BookingList
                bookings={bookings}
                vehicles={vehicles}
                users={users}
                showUserActions={true}
                onStatusChange={handleCancelBooking}
              />
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <BookingForm
          onSubmit={handleAddBooking}
          onCancel={() => {
            setShowBookingForm(false);
            setSelectedVehicleId('');
          }}
          preSelectedVehicle={selectedVehicleId}
          preSelectedUser={currentUser?._id}
        />
      )}
    </div>
  );
};