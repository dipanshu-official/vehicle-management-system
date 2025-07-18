import React, { useState, useEffect } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBookings, getVehicles, getUsers, updateBookingStatus, deleteBooking } from '../../utils/storage';
import { BookingList } from '../../components/BookingList';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useLoading } from '../../hooks/useLoading';

export const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const { loading, withLoading } = useLoading();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await withLoading(async () => {
      setBookings(getBookings());
      setVehicles(getVehicles());
      setUsers(getUsers());
    });
  };

  const handleStatusChange = async (bookingId) => {
    await withLoading(async () => {
      updateBookingStatus(bookingId, );
      setBookings(getBookings());
    });
  };

  const handleDeleteBooking = async (bookingId) => {
    await withLoading(async () => {
      deleteBooking(bookingId);
      setBookings(getBookings());
    });
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading bookings..." className="py-12" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>
              <p className="text-gray-600">Manage all vehicle bookings</p>
            </div>
          </div>
          <Link
            to="/admin/bookings/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Booking
          </Link>
        </div>
      </div>

      {/* Booking List */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          All Bookings ({bookings.length})
        </h2>
        <BookingList
          bookings={bookings}
          vehicles={vehicles}
          users={users}
          onStatusChange={handleStatusChange}
          showStatusActions={true}
          showAdminActions={true}
          onDeleteBooking={handleDeleteBooking}
        />
      </div>
    </div>
  );
};