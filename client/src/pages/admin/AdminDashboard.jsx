import React, { useState, useEffect } from 'react';
import { Plus, Truck, Calendar, List, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getVehicles, getBookings, getUsers } from '../../utils/storage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useLoading } from '../../hooks/useLoading';

export const AdminDashboard= () => {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const { loading, withLoading } = useLoading();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await withLoading(async () => {
      setVehicles(getVehicles());
      setBookings(getBookings());
      setUsers(getUsers());
    });
  };

  const stats = {
    totalVehicles: vehicles.length,
    totalBookings: bookings.length,
    activeBookings: bookings.filter(b => b.status === 'active').length,
    totalRevenue: bookings.reduce((sum, b) => sum + b.totalCost, 0)
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." className="py-12" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl mr-4 shadow-md">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-blue-700">Manage your fleet and bookings</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/admin/vehicles/new"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </Link>
            <Link
              to="/admin/bookings/new"
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              Add Booking
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl mr-4 shadow-md">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Total Vehicles</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.totalVehicles}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border border-green-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl mr-4 shadow-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">Total Bookings</h3>
              <p className="text-2xl font-bold text-green-600">{stats.totalBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-6 border border-orange-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl mr-4 shadow-md">
              <List className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-900">Active Bookings</h3>
              <p className="text-2xl font-bold text-orange-600">{stats.activeBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 border border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl mr-4 shadow-md">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-900">Total Revenue</h3>
              <p className="text-2xl font-bold text-purple-600">₹{stats.totalRevenue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/vehicles"
            className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-4 rounded-xl transition-all duration-300 border border-blue-200 hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg mr-3">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">Manage Vehicles</h3>
                <p className="text-sm text-blue-600">View and edit vehicles</p>
              </div>
            </div>
          </Link>
          <Link
            to="/admin/bookings"
            className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 p-4 rounded-xl transition-all duration-300 border border-green-200 hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg mr-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Manage Bookings</h3>
                <p className="text-sm text-green-600">View and edit bookings</p>
              </div>
            </div>
          </Link>
          <Link
            to="/admin/vehicles/new"
            className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 p-4 rounded-xl transition-all duration-300 border border-purple-200 hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg mr-3">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-800">Add Vehicle</h3>
                <p className="text-sm text-purple-600">Register new vehicle</p>
              </div>
            </div>
          </Link>
          <Link
            to="/admin/bookings/new"
            className="bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 p-4 rounded-xl transition-all duration-300 border border-orange-200 hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg mr-3">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-800">Create Booking</h3>
                <p className="text-sm text-orange-600">New booking entry</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};