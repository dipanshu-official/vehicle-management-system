
const STORAGE_KEYS = {
  VEHICLES: 'fleet_vehicles',
  BOOKINGS: 'fleet_bookings',
  USERS: 'fleet_users',
  CURRENT_USER: 'current_user'
};

// Initialize with sample data
const initializeSampleData = () => {
  const vehicles = [
    {
      _id: '1',
      name: 'Toyota Hiace',
      capacityKg: 1500,
      tyres: 4,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      _id: '2',
      name: 'Mahindra Bolero',
      capacityKg: 1200,
      tyres: 4,
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16')
    },
    {
      _id: '3',
      name: 'Tata Ace',
      capacityKg: 750,
      tyres: 4,
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-17')
    }
  ];

  const users = [
    {
      _id: '1',
      name: 'Admin User',
      email: 'admin@fleetlink.com',
      role: 'admin'
    },
    {
      _id: '2',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    },
    {
      _id: '3',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user'
    }
  ];

  const bookings = [
    {
      _id: '1',
      vehicleId: '1',
      customerId: '2',
      fromPincode: '110001',
      toPincode: '110002',
      startTime: new Date('2024-01-20T10:00:00'),
      endTime: new Date('2024-01-20T14:00:00'),
      estimatedRideDurationHours: 4,
      status: 'active',
      totalCost: 2400,
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18')
    }
  ];

  if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[0]));
  }
};

// Vehicle operations
export const getVehicles = () => {
  const vehicles = localStorage.getItem(STORAGE_KEYS.VEHICLES);
  return vehicles ? JSON.parse(vehicles) : [];
};

export const addVehicle = (vehicle)=> {
  const vehicles = getVehicles();
  const newVehicle = {
    ...vehicle,
    _id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  vehicles.push(newVehicle);
  localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  return newVehicle;
};

export const getVehicleById = (id) => {
  const vehicles = getVehicles();
  return vehicles.find(v => v._id === id);
};

// Booking operations
export const getBookings = () => {
  const bookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  return bookings ? JSON.parse(bookings).map((b) => ({
    ...b,
    startTime: new Date(b.startTime),
    endTime: new Date(b.endTime),
    createdAt: new Date(b.createdAt),
    updatedAt: new Date(b.updatedAt)
  })) : [];
};

export const addBooking = (booking) => {
  const bookings = getBookings();
  const newBooking = {
    ...booking,
    _id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  bookings.push(newBooking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  return newBooking;
};

export const updateBookingStatus = (id, status) => {
  const bookings = getBookings();
  const updatedBookings = bookings.map(booking => 
    booking._id === id ? { ...booking, status, updatedAt: new Date() } : booking
  );
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updatedBookings));
};

export const updateVehicle = (id, vehicleData)=> {
  const vehicles = getVehicles();
  const vehicleIndex = vehicles.findIndex(v => v._id === id);
  if (vehicleIndex === -1) return null;
  
  const updatedVehicle = {
    ...vehicles[vehicleIndex],
    ...vehicleData,
    updatedAt: new Date()
  };
  
  vehicles[vehicleIndex] = updatedVehicle;
  localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  return updatedVehicle;
};

export const deleteVehicle = (id) => {
  const vehicles = getVehicles();
  const filteredVehicles = vehicles.filter(v => v._id !== id);
  if (filteredVehicles.length === vehicles.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(filteredVehicles));
  return true;
};

export const updateBooking = (id, bookingData ) => {
  const bookings = getBookings();
  const bookingIndex = bookings.findIndex(b => b._id === id);
  if (bookingIndex === -1) return null;
  
  const updatedBooking = {
    ...bookings[bookingIndex],
    ...bookingData,
    updatedAt: new Date()
  };
  
  bookings[bookingIndex] = updatedBooking;
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  return updatedBooking;
};

export const deleteBooking = (id) => {
  const bookings = getBookings();
  const filteredBookings = bookings.filter(b => b._id !== id);
  if (filteredBookings.length === bookings.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(filteredBookings));
  return true;
};

// User operations
export const getUsers = () => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const getCurrentUser = ()=> {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

// Check vehicle availability
export const isVehicleAvailable = (vehicleId, startTime, endTimete) => {
  const bookings = getBookings();
  const conflictingBookings = bookings.filter(booking => 
    booking.vehicleId === vehicleId && 
    booking.status === 'active' &&
    ((startTime >= booking.startTime && startTime < booking.endTime) ||
     (endTime > booking.startTime && endTime <= booking.endTime) ||
     (startTime <= booking.startTime && endTime >= booking.endTime))
  );
  return conflictingBookings.length === 0;
};

// Calculate cost based on duration and vehicle capacity
export const calculateCost = (vehicleId, hours) => {
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) return 0;
  
  const baseRate = 50; // Base rate per hour
  const capacityMultiplier = vehicle.capacityKg / 1000; // Per 1000kg capacity
  const tyreMultiplier = vehicle.tyres / 4; // Per 4 tyres
  
  return Math.round(hours * baseRate * capacityMultiplier * tyreMultiplier);
};

// Initialize sample data on first load
initializeSampleData();