export const calculateRideDuration = (fromPincode, toPincode) => {
  // Simplified logic: calculate based on pincode difference
  const from = parseInt(fromPincode);
  const to = parseInt(toPincode);
  const difference = Math.abs(from - to);
  
  // Base duration of 1 hour + additional time based on distance
  let baseDuration = 1;
  
  if (difference < 1000) {
    baseDuration = 1; // Same city/nearby
  } else if (difference < 10000) {
    baseDuration = 3; // Same state/region
  } else if (difference < 100000) {
    baseDuration = 6; // Different states
  } else {
    baseDuration = 12; // Far distances
  }
  
  // Add some randomness based on specific pincodes
  const variance = (difference % 100) / 100; // 0 to 0.99
  const finalDuration = baseDuration + (variance * 2); // Add up to 2 hours variance
  
  return Math.round(finalDuration * 10) / 10; // Round to 1 decimal
};

/**
 * Check if two time windows overlap
 */
export const checkTimeOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && end1 > start2;
};

/**
 * Calculate booking cost based on duration and vehicle capacity
 */
export const calculateBookingCost = (durationHours, capacityKg) => {
  const baseRate = 100; // Base rate per hour
  const capacityMultiplier = capacityKg / 1000; // Additional cost per 1000kg capacity
  
  const cost = (baseRate * durationHours) + (capacityMultiplier * 50);
  return Math.round(cost * 100) / 100; // Round to 2 decimal places
};