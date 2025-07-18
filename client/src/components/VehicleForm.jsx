import React, { useState } from 'react';
import { Plus, Truck, Edit } from 'lucide-react';



export const VehicleForm = ({ onSubmit, onCancel, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    capacityKg: 0,
    tyres: 4
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vehicle name is required';
    }

    if (formData.capacityKg <= 0) {
      newErrors.capacityKg = 'Capacity must be greater than 0';
    }

    if (formData.tyres < 2) {
      newErrors.tyres = 'Minimum 2 tyres required';
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
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacityKg' || name === 'tyres' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              {isEditing ? <Edit className="w-6 h-6 text-blue-600" /> : <Truck className="w-6 h-6 text-blue-600" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter vehicle name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity (kg)
              </label>
              <input
                type="number"
                name="capacityKg"
                value={formData.capacityKg || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.capacityKg ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter capacity in kg"
                min="1"
              />
              {errors.capacityKg && (
                <p className="text-red-500 text-xs mt-1">{errors.capacityKg}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Tyres
              </label>
              <input
                type="number"
                name="tyres"
                value={formData.tyres || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.tyres ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter number of tyres"
                min="2"
              />
              {errors.tyres && (
                <p className="text-red-500 text-xs mt-1">{errors.tyres}</p>
              )}
            </div>

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
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                {isEditing ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};