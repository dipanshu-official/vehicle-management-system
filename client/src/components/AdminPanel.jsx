import React, { useState, useEffect } from 'react';
import { Plus, Truck, Calendar, List, BarChart3 } from 'lucide-react';
import { getVehicles, getBookings, getUsers, addVehicle, addBooking, updateBookingStatus, updateVehicle, deleteVehicle, updateBooking, deleteBooking } from '../utils/storage';
import { VehicleForm } from './VehicleForm';
import { BookingForm } from './BookingForm';
import { VehicleList } from './VehicleList';
import { BookingList } from './BookingList';

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vehicles' | 'bookings'>('dashboard');
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setVehicles(getVehicles());
    setBookings(getBookings());
    setUsers(getUsers());
  };

  const handleAddVehicle = (vehicleData) => {
    if (editingVehicle) {
      updateVehicle(editingVehicle._id, vehicleData);
      setEditingVehicle(null);
    } else {
      addVehicle(vehicleData);
    }
    loadData();
    setShowVehicleForm(false);
  };

  const handleAddBooking = (bookingData) => {
    if (editingBooking) {
      updateBooking(editingBooking._id, bookingData);
      setEditingBooking(null);
    } else {
      const totalCost = bookingData.estimatedRideDurationHours * 100;
      addBooking({ ...bookingData, totalCost, status: 'active' });
    }
    loadData();
    setShowBookingForm(false);
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowVehicleForm(true);
  };

  const handleDeleteVehicle = (vehicleId) => {
    deleteVehicle(vehicleId);
    loadData();
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setShowBookingForm(true);
  };

  const handleDeleteBooking = (bookingId) => {
    deleteBooking(bookingId);
    loadData();
  };

  const handleStatusChange = (bookingId) => {
    updateBookingStatus(bookingId, status);
    loadData();
  };

  const stats = {
    totalVehicles: vehicles.length,
    totalBookings: bookings.length,
    activeBookings: bookings.filter(b => b.status === 'active').length,
    totalRevenue: bookings.reduce((sum, b) => sum + b.totalCost, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your fleet and bookings</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowVehicleForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </button>
            <button
              onClick={() => setShowBookingForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Booking
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Vehicles</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.totalVehicles}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Bookings</h3>
              <p className="text-2xl font-bold text-green-600">{stats.totalBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg mr-4">
              <List className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Active Bookings</h3>
              <p className="text-2xl font-bold text-orange-600">{stats.activeBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
              <p className="text-2xl font-bold text-purple-600">₹{stats.totalRevenue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'vehicles'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Vehicles ({vehicles.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'bookings'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Bookings ({bookings.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Fleet Management Overview</h3>
                <p className="text-gray-600">
                  Welcome to your fleet management dashboard. Use the tabs above to manage vehicles and bookings.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div className="space-y-6">
              <VehicleList 
                vehicles={vehicles} 
                showAdminActions={true}
                onEditVehicle={handleEditVehicle}
                onDeleteVehicle={handleDeleteVehicle}
              />
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <BookingList
                bookings={bookings}
                vehicles={vehicles}
                users={users}
                onStatusChange={handleStatusChange}
                showStatusActions={true}
                showAdminActions={true}
                onEditBooking={handleEditBooking}
                onDeleteBooking={handleDeleteBooking}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showVehicleForm && (
        <VehicleForm
          onSubmit={handleAddVehicle}
          onCancel={() => {
            setShowVehicleForm(false);
            setEditingVehicle(null);
          }}
          initialData={editingVehicle ? {
            name: editingVehicle.name,
            capacityKg: editingVehicle.capacityKg,
            tyres: editingVehicle.tyres
          } : undefined}
          isEditing={!!editingVehicle}
        />
      )}

      {showBookingForm && (
        <BookingForm
          onSubmit={handleAddBooking}
          onCancel={() => {
            setShowBookingForm(false);
            setEditingBooking(null);
          }}
          initialData={editingBooking ? {
            vehicleId: editingBooking.vehicleId,
            customerId: editingBooking.customerId,
            fromPincode: editingBooking.fromPincode,
            toPincode: editingBooking.toPincode,
            startTime: new Date(editingBooking.startTime).toISOString().slice(0, 16),
            endTime: new Date(editingBooking.endTime).toISOString().slice(0, 16),
            estimatedRideDurationHours: editingBooking.estimatedRideDurationHours
          } : undefined}
          isEditing={!!editingBooking}
        />
      )}
    </div>
  );
};