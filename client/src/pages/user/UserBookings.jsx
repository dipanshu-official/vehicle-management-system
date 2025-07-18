import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { getBookings, getVehicles, getUsers, getCurrentUser, updateBookingStatus } from '../../utils/storage';
import { BookingList } from '../../components/BookingList';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useLoading } from '../../hooks/useLoading';

export const UserBookings= () => {
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

 const handleCancelBooking = async (bookingId, status) => {
  await withLoading(async () => {
    updateBookingStatus(bookingId, status);
    const user = getCurrentUser();
    const allBookings = getBookings();
    const userBookings = user ? allBookings.filter(b => b.customerId === user._id) : [];
    setBookings(userBookings);
  });
};

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading your bookings..." className="py-12" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="bg-green-100 p-3 rounded-lg mr-4">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
            <p className="text-gray-600">View and manage your vehicle bookings</p>
          </div>
        </div>
      </div>

      {/* Booking List */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Your Bookings ({bookings.length})
        </h2>
        <BookingList
          bookings={bookings}
          vehicles={vehicles}
          users={users}
          showUserActions={true}
          onStatusChange={handleCancelBooking}
        />
      </div>
    </div>
  );
};