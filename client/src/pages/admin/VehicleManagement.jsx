import React, { useState, useEffect } from 'react';
import { Plus, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getVehicles, deleteVehicle } from '../../utils/storage';
import { VehicleList } from '../../components/VehicleList';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useLoading } from '../../hooks/useLoading';

export const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const { loading, withLoading } = useLoading();

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    await withLoading(async () => {
      setVehicles(getVehicles());
    });
  };

  const handleDeleteVehicle = async (vehicleId) => {
    await withLoading(async () => {
      deleteVehicle(vehicleId);
      setVehicles(getVehicles());
    });
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading vehicles..." className="py-12" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Vehicle Management</h1>
              <p className="text-gray-600">Manage your fleet vehicles</p>
            </div>
          </div>
          <Link
            to="/admin/vehicles/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </Link>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          All Vehicles ({vehicles.length})
        </h2>
        <VehicleList 
          vehicles={vehicles} 
          showAdminActions={true}
          onDeleteVehicle={handleDeleteVehicle}
        />
      </div>
    </div>
  );
};