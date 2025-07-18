import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Weight, Settings, Calendar, Edit, Trash2 } from 'lucide-react';



export const VehicleList = ({ 
  vehicles, 
  onBookVehicle, 
  showBookButton = false,
  onEditVehicle,
  onDeleteVehicle,
  showAdminActions = false
}) => {
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No vehicles available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map(vehicle => (
        <div key={vehicle._id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 transform hover:-translate-y-1">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl mr-4 shadow-md">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{vehicle.name}</h3>
                <p className="text-sm text-gray-500">Vehicle ID: {vehicle._id}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Weight className="w-4 h-4 mr-2" />
                <span className="text-sm">Capacity: {vehicle.capacityKg} kg</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Settings className="w-4 h-4 mr-2" />
                <span className="text-sm">Tyres: {vehicle.tyres}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Added: {new Date(vehicle.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {showBookButton && onBookVehicle && (
                <button
                  onClick={() => onBookVehicle(vehicle._id)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Calendar className="w-4 h-4" />
                  Book Now
                </button>
              )}
              
              {showAdminActions && (
                <div className="flex gap-2">
                  {onEditVehicle && (
                    <Link
                      to={`/admin/vehicles/edit/${vehicle._id}`}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 px-4 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                  )}
                  {onDeleteVehicle && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this vehicle?')) {
                          onDeleteVehicle(vehicle._id);
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};