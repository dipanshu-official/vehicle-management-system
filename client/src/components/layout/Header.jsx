import React, { useEffect } from "react";
import { Users, Settings, Truck, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { userDataSelector } from "../../store/globalSelector";
import { getUserProfileAsync } from "../../store/globalAction";
import {  useNavigate } from "react-router-dom";

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const users = useSelector(userDataSelector); // Assuming user data is stored in global state
  console.log("user", users);

  useEffect(() => {
    dispatch(getUserProfileAsync());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logged out successfully");
  };
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-lg mr-3 backdrop-blur-sm">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Fleet Link</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-white/80" />
              <p>{users.username}</p>
              
            </div>

            <div className="flex items-center space-x-2 text-sm text-white/90">
              <Settings className="w-4 h-4" />
              <span className="font-medium">
                {users.role === "admin" ? "Admin Panel" : "User Panel"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
