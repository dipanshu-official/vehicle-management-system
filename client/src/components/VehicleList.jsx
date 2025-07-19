import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import {
  Truck,
  Weight,
  Settings,
  Calendar,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteVehiclesAsync,
  getAllVehicles,
  updateVehiclesAsync,
} from "../store/globalAction";
import { vehicleDataSelector } from "../store/globalSelector";
import toast from "react-hot-toast";

export const VehicleList = ({}) => {
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    capacityKg: "",
    tyres: "",
  });

  useEffect(() => {
    dispatch(getAllVehicles());
  }, [dispatch]);

  const vehicles = useSelector(vehicleDataSelector);

  const handleEdit = (vehicle) => {
    setEditingId(vehicle._id);
    setFormData({
      name: vehicle.name,
      capacityKg: vehicle.capacityKg,
      tyres: vehicle.tyres,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: "",
      capacityKg: "",
      tyres: "",
    });
  };

  const handleSaveEdit = (vehicleId) => {
    if (!formData.name || !formData.capacityKg || !formData.tyres) {
      toast.error("Please fill in all fields");
      return;
    }

    const updateData = {
      id: vehicleId,
      vehicleData: formData,
    };

    dispatch(updateVehiclesAsync(updateData))
      .unwrap()
      .then(() => {
        toast.success("Vehicle updated successfully");
        setEditingId(null);
        setFormData({
          name: "",
          capacityKg: "",
          tyres: "",
        });
      })
      .catch((error) => {
        toast.error(error.message || "Failed to update vehicle");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this vehicle?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteVehiclesAsync(id))
          .unwrap()
          .then(() => {
            toast.success("Vehicle deleted successfully");
          })
          .catch((error) => {
            toast.error(error.message || "Failed to delete vehicle");
          });
      }
    });
  };

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
      {vehicles.map((vehicle) => (
        <div
          key={vehicle._id}
          className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 transform hover:-translate-y-1"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl mr-4 shadow-md">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                {editingId === vehicle._id ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-lg font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Vehicle name"
                  />
                ) : (
                  <h3 className="text-lg font-semibold text-gray-900">
                    {vehicle.name}
                  </h3>
                )}
                <p className="text-sm text-gray-500">
                  Vehicle ID: {vehicle._id}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Weight className="w-4 h-4 mr-2" />
                {editingId === vehicle._id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Capacity:</span>
                    <input
                      type="number"
                      name="capacityKg"
                      value={formData.capacityKg}
                      onChange={handleInputChange}
                      className="text-sm bg-white border border-gray-300 rounded px-2 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                    <span className="text-sm">kg</span>
                  </div>
                ) : (
                  <span className="text-sm">
                    Capacity: {vehicle.capacityKg} kg
                  </span>
                )}
              </div>

              <div className="flex items-center text-gray-600">
                <Settings className="w-4 h-4 mr-2" />
                {editingId === vehicle._id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Tyres:</span>
                    <input
                      type="number"
                      name="tyres"
                      value={formData.tyres}
                      onChange={handleInputChange}
                      className="text-sm bg-white border border-gray-300 rounded px-2 py-1 w-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                ) : (
                  <span className="text-sm">Tyres: {vehicle.tyres}</span>
                )}
              </div>

              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Added: {new Date(vehicle.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex gap-2">
                {editingId === vehicle._id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(vehicle._id)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2 px-4 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(vehicle)}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 px-4 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(vehicle._id)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
