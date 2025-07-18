import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Edit, ArrowLeft, MapPin, Clock, DollarSign } from 'lucide-react';
import { getVehicles, getUsers, addBooking, updateBooking, getBookings, isVehicleAvailable, calculateCost } from '../../utils/storage';
import { LoadingButton } from '../../components/common/LoadingButton';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useLoading } from '../../hooks/useLoading';

export const BookingFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const { loading, withLoading } = useLoading();
  
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    vehicleId: '',
    customerId: '',
    fromPincode: '',
    toPincode: '',
    startTime: '',
    endTime: '',
    estimatedRideDurationHours: 0
  });
  const [errors, setErrors] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      if (hours > 0) {
        setFormData(prev => ({ ...prev, estimatedRideDurationHours: hours }));
        
        if (formData.vehicleId) {
          const cost = calculateCost(formData.vehicleId, hours);
          setTotalCost(cost);
          
          const available = isVehicleAvailable(formData.vehicleId, start, end);
          setAvailabilityMessage(available ? 'Vehicle is available' : 'Vehicle is not available for this time slot');
        }
      }
    }
  }, [formData.startTime, formData.endTime, formData.vehicleId]);

  const loadInitialData = async () => {
    await withLoading(async () => {
      setVehicles(getVehicles());
      setUsers(getUsers().filter(u => u.role === 'user'));
      
      if (isEditing && id) {
        const bookings = getBookings();
        const booking = bookings.find(b => b._id === id);
        if (booking) {
          setFormData({
            vehicleId: booking.vehicleId,
            customerId: booking.customerId,
            fromPincode: booking.fromPincode,
            toPincode: booking.toPincode,
            startTime: new Date(booking.startTime).toISOString().slice(0, 16),
            endTime: new Date(booking.endTime).toISOString().slice(0, 16),
            estimatedRideDurationHours: booking.estimatedRideDurationHours
          });
        }
      }
      setInitialLoading(false);
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.vehicleId) {
      newErrors.vehicleId = 'Please select a vehicle';
    }

    if (!formData.customerId) {
      newErrors.customerId = 'Please select a customer';
    }

    if (!formData.fromPincode || formData.fromPincode.length !== 6) {
      newErrors.fromPincode = 'From pincode must be 6 digits';
    }

    if (!formData.toPincode || formData.toPincode.length !== 6) {
      newErrors.toPincode = 'To pincode must be 6 digits';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      
      if (start >= end) {
        newErrors.endTime = 'End time must be after start time';
      }
      
      if (start < new Date()) {
        newErrors.startTime = 'Start time cannot be in the past';
      }

      if (formData.vehicleId && !isVehicleAvailable(formData.vehicleId, start, end)) {
        newErrors.vehicleId = 'Vehicle is not available for this time slot';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await withLoading(async () => {
      if (isEditing && id) {
        updateBooking(id, formData);
      } else {
        addBooking({ 
          ...formData, 
          totalCost, 
          status: 'active' 
        });
      }
      navigate('/admin/bookings');
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name ]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (initialLoading) {
    return <LoadingSpinner size="lg" text="Loading booking form..." className="py-12" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/bookings')}
            className="mr-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="bg-green-100 p-3 rounded-lg mr-4">
            {isEditing ? <Edit className="w-6 h-6 text-green-600" /> : <Calendar className="w-6 h-6 text-green-600" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEditing ? 'Edit Booking' : 'Create New Booking'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update booking information' : 'Create a new vehicle booking'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle
              </label>
              <select
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.vehicleId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a vehicle</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.name} - {vehicle.capacityKg}kg
                  </option>
                ))}
              </select>
              {errors.vehicleId && (
                <p className="text-red-500 text-sm mt-1">{errors.vehicleId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer
              </label>
              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.customerId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a customer</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <p className="text-red-500 text-sm mt-1">{errors.customerId}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Pincode
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="fromPincode"
                  value={formData.fromPincode}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.fromPincode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                />
              </div>
              {errors.fromPincode && (
                <p className="text-red-500 text-sm mt-1">{errors.fromPincode}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Pincode
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="toPincode"
                  value={formData.toPincode}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.toPincode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                />
              </div>
              {errors.toPincode && (
                <p className="text-red-500 text-sm mt-1">{errors.toPincode}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.startTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.endTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.endTime && (
                <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
              )}
            </div>
          </div>

          {formData.estimatedRideDurationHours > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Duration: {formData.estimatedRideDurationHours.toFixed(1)} hours
                  </p>
                  <p className={`text-xs mt-1 ${availabilityMessage.includes('available') ? 'text-green-600' : 'text-red-600'}`}>
                    {availabilityMessage}
                  </p>
                </div>
                <div className="flex items-center text-blue-800">
                  <DollarSign className="w-5 h-5 mr-1" />
                  <span className="text-lg font-bold">₹{totalCost}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/bookings')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <LoadingButton
              type="submit"
              loading={loading}
              variant="success"
              className="flex-1 px-6 py-3"
            >
              {isEditing ? 'Update Booking' : 'Create Booking'}
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};