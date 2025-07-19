import Vehicle from "../models/vehicle.Model.js";
import Booking from "../models/booking.Model.js";

export const addVehicle = async (req, res) => {
  try {
    const { name, capacityKg, tyres } = req.body;

    const vehicle = new Vehicle({
      name,
      capacityKg,
      tyres,
    });

    const savedVehicle = await vehicle.save();

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      data: savedVehicle,
    });
  } catch (error) {
    console.error("Error adding vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacityKg, tyres } = req.body;
    console.log(req.body);
    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, {
      name,
      capacityKg,
      tyres,
    });

    if (!updatedVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: updatedVehicle,
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
      data: deletedVehicle,
    });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAvailableVehicles = async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

    // Calculate estimated ride duration
    const estimatedRideDurationHours = calculateRideDuration(
      fromPincode,
      toPincode
    );

    // Calculate end time
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(
      startDateTime.getTime() + estimatedRideDurationHours * 60 * 60 * 1000
    );

    // Find vehicles with sufficient capacity
    const vehiclesWithCapacity = await Vehicle.find({
      capacityKg: { $gte: parseInt(capacityRequired) },
    });

    // Filter out vehicles with overlapping bookings
    const availableVehicles = [];

    for (const vehicle of vehiclesWithCapacity) {
      // Get all bookings for this vehicle
      const existingBookings = await Booking.find({
        vehicleId: vehicle._id,
      });

      // Check if any booking overlaps with the requested time window
      const hasOverlap = existingBookings.some((booking) =>
        checkTimeOverlap(
          startDateTime,
          endDateTime,
          booking.startTime,
          booking.endTime
        )
      );

      if (!hasOverlap) {
        availableVehicles.push(vehicle);
      }
    }

    res.status(200).json({
      success: true,
      message: "Available vehicles retrieved successfully",
      data: {
        vehicles: availableVehicles,
        estimatedRideDurationHours,
        searchCriteria: {
          capacityRequired: parseInt(capacityRequired),
          fromPincode,
          toPincode,
          startTime: startDateTime,
          endTime: endDateTime,
        },
      },
    });
  } catch (error) {
    console.error("Error getting available vehicles:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: vehicles,
    });
  } catch (error) {
    console.error("Error getting vehicles:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: vehicle,
    });
  } catch (error) {
    console.error("Error getting vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
