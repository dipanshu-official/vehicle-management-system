import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import { addBooking, calculateCost, getCurrentUser, getVehicleById } from '../../utils/storage';
import { BookingForm } from '../../components/BookingForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const BookVehicle = () => {
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (vehicleId) {
      const foundVehicle = getVehicleById(vehicleId);
      setVehicle(foundVehicle || null);
    }
    setLoading(false);
  }, [vehicleId]);

  const handleBooking = (bookingData) => {
    const currentUser = getCurrentUser();
    const totalCost = calculateCost(bookingData.vehicleId, bookingData.estimatedRideDurationHours);
    
    addBooking({ 
      ...bookingData, 
      totalCost, 
      status: 'active',
      customerId: currentUser?._id || bookingData.customerId
    });
    
    navigate('/user/bookings');
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading booking form..." className="py-12" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/user/search')}
            className="mr-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="bg-green-100 p-3 rounded-lg mr-4">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Book Vehicle</h1>
            <p className="text-gray-600">
              {vehicle ? `Booking ${vehicle.name}` : 'Create your booking'}
            </p>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <BookingForm
          onSubmit={handleBooking}
          onCancel={() => navigate('/user/search')}
          preSelectedVehicle={vehicleId}
          preSelectedUser={getCurrentUser()?._id}
        />
      </div>
    </div>
  );
};