import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBooking } from '../../components/SearchBooking';

export const SearchVehicles = () => {
  const navigate = useNavigate();

  const handleBookVehicle = (vehicleId) => {
    navigate(`/user/book/${vehicleId}`);
  };

  return (
    <div className="space-y-6">
      <SearchBooking onBookVehicle={handleBookVehicle} />
    </div>
  );
};