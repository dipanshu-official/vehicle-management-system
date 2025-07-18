import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, DollarSign, Edit } from 'lucide-react';
import { getVehicles, getUsers, isVehicleAvailable, calculateCost } from '../utils/storage';



export const BookingForm = ({ 
  onSubmit, 
  onCancel, 
  preSelectedVehicle, 
  preSelectedUser,
  initialData,
  isEditing = false
}) => {
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(initialData || {
    vehicleId: preSelectedVehicle || '',
    customerId: preSelectedUser || '',
    fromPincode: '',
    toPincode: '',
    startTime: '',
    endTime: '',
    estimatedRideDurationHours: 0
  });

  const [errors, setErrors] = useState<Partial<BookingFormData>>({});
  const [totalCost, setTotalCost] = useState(0);
  const [availabilityMessage, setAvailabilityMessage] = useState('');

  useEffect(() => {
    setVehicles(getVehicles());
    setUsers(getUsers().filter(u => u.role === 'user'));
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
          
          // Check availability
          const available = isVehicleAvailable(formData.vehicleId, start, end);
          setAvailabilityMessage(available ? 'Vehicle is available' : 'Vehicle is not available for this time slot');
        }
      }
    }
  }, [formData.startTime, formData.endTime, formData.vehicleId]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name  ]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              {isEditing ? <Edit className="w-6 h-6 text-green-600" /> : <Calendar className="w-6 h-6 text-green-600" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{isEditing ? 'Edit Booking' : 'Create New Booking'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle
                </label>
                <select
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
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
                  <p className="text-red-500 text-xs mt-1">{errors.vehicleId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
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
                  <p className="text-red-500 text-xs mt-1">{errors.customerId}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Pincode
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="fromPincode"
                    value={formData.fromPincode}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.fromPincode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 6-digit pincode"
                    maxLength={6}
                  />
                </div>
                {errors.fromPincode && (
                  <p className="text-red-500 text-xs mt-1">{errors.fromPincode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Pincode
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="toPincode"
                    value={formData.toPincode}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.toPincode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 6-digit pincode"
                    maxLength={6}
                  />
                </div>
                {errors.toPincode && (
                  <p className="text-red-500 text-xs mt-1">{errors.toPincode}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.startTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.startTime && (
                  <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.endTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.endTime && (
                  <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>
                )}
              </div>
            </div>

            {formData.estimatedRideDurationHours > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Duration: {formData.estimatedRideDurationHours.toFixed(1)} hours</p>
                    <p className={`text-xs mt-1 ${availabilityMessage.includes('available') ? 'text-green-600' : 'text-red-600'}`}>
                      {availabilityMessage}
                    </p>
                  </div>
                  <div className="flex items-center text-blue-800">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="text-lg font-bold">₹{totalCost}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                {isEditing ? <Edit className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                {isEditing ? 'Update Booking' : 'Create Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};