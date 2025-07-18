import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, DollarSign, User, Truck, CheckCircle, XCircle, AlertCircle, Edit, Trash2 } from 'lucide-react';



export const BookingList= ({ 
  bookings, 
  vehicles, 
  users, 
  onStatusChange,
  showStatusActions = false,
  onEditBooking,
  onDeleteBooking,
  showAdminActions = false,
  showUserActions = false
}) => {
  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find(v => v._id === vehicleId);
    return vehicle ? vehicle.name : 'Unknown Vehicle';
  };

  const getUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map(booking => (
        <div key={booking._id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl mr-4 shadow-md">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Booking #{booking._id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(booking.status)}
                <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Truck className="w-4 h-4 mr-2" />
                  <span className="text-sm">Vehicle: {getVehicleName(booking.vehicleId)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span className="text-sm">Customer: {getUserName(booking.customerId)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">Route: {booking.fromPincode} → {booking.toPincode}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Start: {new Date(booking.startTime).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    End: {new Date(booking.endTime).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">
                    Total Cost: ₹{booking.totalCost}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-4 border border-blue-100">
              <p className="text-sm text-gray-600">
                <strong className="text-blue-800">Duration:</strong> {booking.estimatedRideDurationHours} hours
              </p>
            </div>

            <div className="pt-4 border-t space-y-2">
              {showStatusActions && onStatusChange && booking.status === 'active' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onStatusChange(booking._id, 'completed')}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Completed
                  </button>
                  <button
                    onClick={() => onStatusChange(booking._id, 'cancelled')}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Booking
                  </button>
                </div>
              )}
              
              {showAdminActions && (
                <div className="flex gap-2">
                  {onEditBooking && (
                    <Link
                      to={`/admin/bookings/edit/${booking._id}`}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 px-4 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Booking
                    </Link>
                  )}
                  {onDeleteBooking && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this booking?')) {
                          onDeleteBooking(booking._id);
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Booking
                    </button>
                  )}
                </div>
              )}
              
              {showUserActions && onStatusChange && booking.status === 'active' && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this booking?')) {
                      onStatusChange(booking._id, 'cancelled');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};