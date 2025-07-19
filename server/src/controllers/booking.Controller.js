import Vehicle from "../controllers/vehicle.Controller.js"
import Booking from "../models/booking.Model.js";


export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const { vehicleId, fromPincode, toPincode, startTime, customerId } = req.body;

    // Verify vehicle exists
    const vehicle = await Vehicle.findById(vehicleId).session(session);
    if (!vehicle) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Verify customer exists
    const customer = await User.findById(customerId).session(session);
    if (!customer) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Calculate ride duration and end time
    const estimatedRideDurationHours = calculateRideDuration(fromPincode, toPincode);
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(startDateTime.getTime() + (estimatedRideDurationHours * 60 * 60 * 1000));

    // Check for conflicting bookings (race condition prevention)
    const conflictingBookings = await Booking.find({
      vehicleId: vehicleId,
      status: 'active',
      $or: [
        {
          startTime: { $lt: endDateTime },
          endTime: { $gt: startDateTime }
        }
      ]
    }).session(session);

    if (conflictingBookings.length > 0) {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message: 'Vehicle is already booked for an overlapping time slot',
        conflictingBookings: conflictingBookings.map(booking => ({
          id: booking._id,
          startTime: booking.startTime,
          endTime: booking.endTime
        }))
      });
    }

    // Calculate total cost
    const totalCost = calculateBookingCost(estimatedRideDurationHours, vehicle.capacityKg);

    // Create booking
    const booking = new Booking({
      vehicleId,
      customerId,
      fromPincode,
      toPincode,
      startTime: startDateTime,
      endTime: endDateTime,
      estimatedRideDurationHours,
      totalCost
    });

    const savedBooking = await booking.save({ session });

    // Populate vehicle and customer details
    await savedBooking.populate('vehicleId', 'name capacityKg tyres');
    await savedBooking.populate('customerId', 'username email');

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: savedBooking
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    session.endSession();
  }
};

export const getBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, customerId } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (customerId) filter.customerId = customerId;

    // Check if user is admin or requesting their own bookings
    if (req.user.role !== 'admin' && customerId !== req.user.id) {
      filter.customerId = req.user.id;
    }

    const bookings = await Booking.find(filter)
      .populate('vehicleId', 'name capacityKg tyres')
      .populate('customerId', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('vehicleId', 'name capacityKg tyres')
      .populate('customerId', 'username email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is admin or owner of the booking
    if (req.user.role !== 'admin' && booking.customerId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking retrieved successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error getting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['active', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: active, completed, cancelled'
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is admin or owner of the booking
    if (req.user.role !== 'admin' && booking.customerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    booking.status = status;
    await booking.save();

    await booking.populate('vehicleId', 'name capacityKg tyres');
    await booking.populate('customerId', 'username email');

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


