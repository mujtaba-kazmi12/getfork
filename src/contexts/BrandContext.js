'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const BrandContext = createContext();

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};

export const BrandProvider = ({ children }) => {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch brands function (reusable)
  const fetchBrands = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setLoading(false);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/brands`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Brand context API response:', data);
        
        if (data.data?.brands && Array.isArray(data.data.brands)) {
          const brandsWithNames = data.data.brands.map(brand => ({
            ...brand,
            // Ensure restaurantName is set from either field or brand_fetch
            restaurantName: brand.restaurantName || brand.brand_fetch?.name || 'Unknown Restaurant'
          }));
          
          setBrands(brandsWithNames);
          
          // Update selected brand if it exists in the new data
          if (selectedBrand) {
            const updatedSelectedBrand = brandsWithNames.find(b => b._id === selectedBrand._id);
            if (updatedSelectedBrand) {
              setSelectedBrand(updatedSelectedBrand);
            }
          } else if (brandsWithNames.length > 0) {
            // Set the first brand as selected by default if no brand is selected
            setSelectedBrand(brandsWithNames[0]);
          }
        }
      } else {
        console.error('Failed to fetch brands:', response.status);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch brands on mount
  useEffect(() => {
    fetchBrands();
  }, []);

  const value = {
    selectedBrand,
    setSelectedBrand,
    brands,
    setBrands,
    loading,
    refreshBrands: fetchBrands, // Expose refresh function
  };

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  );
};