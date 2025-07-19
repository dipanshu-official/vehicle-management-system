import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Truck, Edit, ArrowLeft } from "lucide-react";
import { LoadingButton } from "../../components/common/LoadingButton";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { useLoading } from "../../hooks/useLoading";
import { addVehicleAsync, updateVehiclesAsync } from "../../store/globalAction";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

export const VehicleFormPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEditing = !!id;
  const { loading, withLoading } = useLoading();

  const [formData, setFormData] = useState({
    name: "",
    capacityKg: 0,
    tyres: 4,
  });
  const [errors, setErrors] = useState({});
  const [initialLoading, setInitialLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing && id) {
      const vehicle = getVehicleById(id);
      if (vehicle) {
        setFormData({
          name: vehicle.name,
          capacityKg: vehicle.capacityKg,
          tyres: vehicle.tyres,
        });
      }
      setInitialLoading(false);
    }
  }, [id, isEditing]);

  const validate = () => {
    const newErrors = {};

    // ✅ Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Vehicle name is required";
    } else if (formData.name.length > 12) {
      newErrors.name = "Vehicle name must not exceed 12 characters";
    }

    // ✅ Capacity validation
    if (!formData.capacityKg || formData.capacityKg <= 0) {
      newErrors.capacityKg = "Capacity must be greater than 0";
    }

    // ✅ Tyres validation
    if (!formData.tyres || formData.tyres < 2) {
      newErrors.tyres = "Minimum 2 tyres required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix validation errors");
      return;
    }

    const vehicleData = {
      name: formData.name.trim(),
      capacityKg: parseInt(formData.capacityKg),
      tyres: parseInt(formData.tyres),
    };

    dispatch(addVehicleAsync(vehicleData))
      .unwrap()
      .then(() => {
        toast.success("Vehicle added successfully");
        navigate("/admin/vehicles")
      })
      .catch((error) => {
        toast.error(error.message || "Failed to add vehicle");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "capacityKg" || name === "tyres"
          ? parseInt(value) || 0
          : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (initialLoading) {
    return (
      <LoadingSpinner size="lg" text="Loading vehicle..." className="py-12" />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/admin/vehicles")}
            className="mr-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="bg-blue-100 p-3 rounded-lg mr-4">
            {isEditing ? (
              <Edit className="w-6 h-6 text-blue-600" />
            ) : (
              <Truck className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEditing ? "Edit Vehicle" : "Add New Vehicle"}
            </h1>
            <p className="text-gray-600">
              {isEditing
                ? "Update vehicle information"
                : "Register a new vehicle in your fleet"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter vehicle name (e.g., Toyota Hiace)"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity (kg)
              </label>
              <input
                type="number"
                name="capacityKg"
                value={formData.capacityKg || ""}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.capacityKg ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter capacity in kg"
                min="1"
              />
              {errors.capacityKg && (
                <p className="text-red-500 text-sm mt-1">{errors.capacityKg}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Tyres
              </label>
              <input
                type="number"
                name="tyres"
                value={formData.tyres || ""}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.tyres ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter number of tyres"
                min="2"
              />
              {errors.tyres && (
                <p className="text-red-500 text-sm mt-1">{errors.tyres}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/vehicles")}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <LoadingButton
              type="submit"
              loading={loading}
              variant="primary"
              className="flex-1 px-6 py-3"
            >
              {isEditing ? "Update Vehicle" : "Add Vehicle"}
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};
