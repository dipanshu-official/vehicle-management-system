// src/routes/AppRouter.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { VehicleManagement } from "../pages/admin/VehicleManagement";
import { BookingManagement } from "../pages/admin/BookingManagement";
import { VehicleFormPage } from "../pages/admin/VehicleForm";
import { BookingFormPage } from "../pages/admin/BookingForm";
import { UserDashboard } from "../pages/user/UserDashboard";
import { SearchVehicles } from "../pages/user/SearchVehicles";
import { UserBookings } from "../pages/user/UserBookings";
import { BookVehicle } from "../pages/user/BookVehicle";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* ✅ Default Redirect to /user or /admin */}
          <Route index element={<Navigate to="/user" replace />} />
          <Route path="*" element={<Navigate to="/user" replace />} />

          {/* ✅ Admin Routes */}
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/vehicles" element={<VehicleManagement />} />
          <Route path="admin/vehicles/new" element={<VehicleFormPage />} />
          <Route path="admin/vehicles/edit/:id" element={<VehicleFormPage />} />
          <Route path="admin/bookings" element={<BookingManagement />} />
          <Route path="admin/bookings/new" element={<BookingFormPage />} />
          <Route path="admin/bookings/edit/:id" element={<BookingFormPage />} />

          {/* ✅ User Routes */}
          <Route path="user" element={<UserDashboard />} />
          <Route path="user/search" element={<SearchVehicles />} />
          <Route path="user/bookings" element={<UserBookings />} />
          <Route path="user/book/:vehicleId" element={<BookVehicle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
