import { useState } from 'react';

export const useLoading = () => {
  const [loading, setLoading] = useState(false);

  const withLoading = async (asyncFn) => {
    setLoading(true);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      // Add minimum loading time for better UX
      setTimeout(() => setLoading(false), 300);
    }
  };

  return { loading, withLoading };
};
