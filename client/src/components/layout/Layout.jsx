import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export const Layout = ({ currentUser }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
