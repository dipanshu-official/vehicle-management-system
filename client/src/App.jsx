import React, { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';
import { getCurrentUser, setCurrentUser, getUsers } from './utils/storage';
import { AppRouter } from './router/AppRouter';
import { LoadingSpinner } from './components/common/LoadingSpinner';

function App() {
  const [currentUser, setCurrentUserState] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      const user = getCurrentUser();
      setCurrentUserState(user);
      setUsers(getUsers());
      setLoading(false);
    }, 1000);
  }, []);

  const handleUserSwitch = (user) => {
    setCurrentUser(user);
    setCurrentUserState(user);
  };

  const handleLogout = () => {
    const defaultUser = getUsers()[0]; // Default to admin
    setCurrentUser(defaultUser);
    setCurrentUserState(defaultUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center shadow-lg">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <LoadingSpinner size="lg" text="Loading Fleet Link..." />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Unable to load user data</p>
        </div>
      </div>
    );
  }

  return (
    <AppRouter
      currentUser={currentUser}
      users={users}
      onUserSwitch={handleUserSwitch}
      onLogout={handleLogout}
    />
  );
}

export default App;