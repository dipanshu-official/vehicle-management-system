import React from 'react';
import { Users, Settings, Truck, LogOut } from 'lucide-react';



export const Header = ({ currentUser, users, onUserSwitch, onLogout }) => {
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
              <select
                value={currentUser._id}
                onChange={(e) => {
                  const user = users.find(u => u._id === e.target.value);
                  if (user) onUserSwitch(user);
                }}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm"
              >
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-white/90">
              <Settings className="w-4 h-4" />
              <span className="font-medium">
                {currentUser.role === 'admin' ? 'Admin Panel' : 'User Panel'}
              </span>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};