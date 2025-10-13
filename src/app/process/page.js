'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

export default function ProcessPage() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [orderingSystem, setOrderingSystem] = useState('');
  const [menuUrl, setMenuUrl] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [brandData, setBrandData] = useState(null);
  const [primaryColor, setPrimaryColor] = useState('#f97316'); // orange-500
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingMenu, setIsFetchingMenu] = useState(false);

  // Determine if form is complete to style the Create button
  const isFormComplete = Boolean(
    websiteUrl &&
    (brandData?.name || restaurantName) &&
    (orderingSystem === '' ? true : menuUrl)
  );



  const handleFetchHomePage = async () => {
    if (websiteUrl.trim()) {
      setIsFetching(true);
      setFetchProgress(0);
      
      // Start progress animation
      const progressInterval = setInterval(() => {
        setFetchProgress(prev => {
          if (prev >= 25) {
            clearInterval(progressInterval);
            return 25;
          }
          return prev + 2;
        });
      }, 100);
      
      try {
        // Extract hostname from URL
        let hostname = websiteUrl.trim();
        
        // Remove protocol if present
        if (hostname.startsWith('http://') || hostname.startsWith('https://')) {
          hostname = new URL(hostname).hostname;
        }
        
        // Remove www. if present
        if (hostname.startsWith('www.')) {
          hostname = hostname.substring(4);
        }
        
        console.log('Fetching brand data for:', hostname);
        
        // Add minimum delay to show loading animation
        const [response] = await Promise.all([
          fetch(`https://api.brandfetch.io/v2/brands/${hostname}`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer 7v7OyIYILdz9GGE0chcKdD+6+dYp0t6yxz/NyIon9HQ=',
              'Content-Type': 'application/json'
            }
          }),
          new Promise(resolve => setTimeout(resolve, 2000)) // Minimum 2 second delay
        ]);
        
        const data = await response.json();
        console.log('Brandfetch API response:', data);
        
        // Store the brand data
        setBrandData(data);
        
        // Complete progress animation
        clearInterval(progressInterval);
        setFetchProgress(28.2);
        
        // Small delay before showing form
        setTimeout(() => {
          setShowForm(true);
          setIsFetching(false);
        }, 500);
        
      } catch (error) {
        console.error('Error fetching brand data:', error);
        // Still show form even if API fails
        clearInterval(progressInterval);
        setFetchProgress(28.2);
        
        setTimeout(() => {
          setShowForm(true);
          setIsFetching(false);
        }, 500);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFetchHomePage();
    }
  };

  const handleFetchMenu = async () => {
    try {
      if (!menuUrl || !menuUrl.trim()) {
        showToast('Please enter your menu URL first.', 'warning');
        return;
      }
      setIsFetchingMenu(true);
      // Simulate fetching the menu; replace with real implementation later
      await new Promise((resolve) => setTimeout(resolve, 1200));
      showToast('Menu fetched (simulated)', 'info');
    } catch (err) {
      console.error('Fetch menu error:', err);
      showToast('Failed to fetch menu', 'error');
    } finally {
      setIsFetchingMenu(false);
    }
  };

  const handleCreateBrand = async () => {
    try {
      if (!brandData || !brandData.id) {
        showToast('No brand data found. Please fetch first.', 'error');
        return;
      }

      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (!token) {
        showToast('You must be signed in to create a brand.', 'error');
        return;
      }

      setIsSaving(true);

      const payload = {
        brandId: brandData.id,
        brand_fetch: brandData,
        restaurantName: brandData.name || restaurantName || '',
        style: { primaryColor },
      };

      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json?.success) {
        showToast(json?.message || 'Failed to save brand', 'error');
      } else {
        showToast('Brand saved successfully', 'success');
        // Optionally navigate or update UI here
        // router.push('/dashboard')
      }
    } catch (err) {
      console.error('Create brand error:', err);
      showToast('Unexpected error while saving brand', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="flex">
          {/* Left Section Header */}
          <div className="flex-1 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="px-6 py-4 flex justify-end">
                <div className="max-w-2xl w-full">
                  {/* Logo */}
                  <div className="flex items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                      </div>
                      <span className="text-xl font-semibold text-gray-900">Getfork.ai</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section Header */}
          <div className="flex-1 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="border-l border-gray-200 px-6 py-4">
                {/* Right side - Language selector and profile */}
                <div className="flex items-center justify-end space-x-4">
                  {/* Language Selector */}
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <span>English</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>


                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Two Section Layout */}
      <main className="flex min-h-[calc(100vh-80px)]">
        {/* Left Section - Full width white background */}
        <div className="flex-1 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="px-6 py-12 flex justify-end">
              <div className="max-w-2xl space-y-8">
                {/* Title Section */}
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Let's Find Your Menu & Website
                  </h1>
                  
                  <div className="space-y-3">
                    <h2 className="text-lg font-medium text-gray-900">
                      Help Us Get to Know You
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      We'll use your links to personalise customer answers and fetch your menu. Add your website and any ordering platforms like Uber Eats or DoorDash.
                    </p>
                  </div>
                </div>

                {/* Form Section */}
                <div className="space-y-6">
                  {!showForm ? (
                    /* Initial Form */
                    <div className="space-y-3">
                      {/* Progress Bar at Top */}
                      {isFetching && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Fetching home page...</span>
                            <span className="text-sm font-medium text-gray-900">{fetchProgress.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${fetchProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <label htmlFor="website" className="block text-sm font-medium text-gray-900">
                        Your Website
                      </label>
                      
                      <div className="flex gap-3 items-start relative">
                        <input
                          id="website"
                          type="url"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="https://ilcaminetto.com.au"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                        />
                        
                        {/* Fetch Button with Question Mark */}
                        <div className="relative">
                          <button
                             onClick={handleFetchHomePage}
                             disabled={!websiteUrl.trim() || isFetching}
                             className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                           >
                             {isFetching ? 'Fetching...' : 'Fetch Home Page'}
                           </button>
                          
                          {/* Question Mark Icon */}
                          <button
                            type="button"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            className="absolute -bottom-3 -right-2 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-orange-600 transition-colors"
                          >
                            ?
                          </button>
                          
                          {/* Tooltip */}
                          {showTooltip && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 text-white text-sm rounded-lg p-3 shadow-lg z-10">
                              <div className="relative">
                                Enter your website URL and click Fetch Home Page.
                                <div className="absolute -top-1 right-6 w-2 h-2 bg-gray-800 transform rotate-45"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Complete Form After Fetching */
                    <div className="space-y-6">
                      {/* Your Website Field */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-900">
                          Your Website
                        </label>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                          <span className="text-gray-900">{websiteUrl}</span>
                          <button className="text-gray-400 hover:text-gray-600 text-sm">
                            ✏️ Edit
                          </button>
                        </div>
                      </div>

                      {/* Ordering System Dropdown */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-900">
                          Please select Your ordering system
                        </label>
                        <select 
                          value={orderingSystem}
                          onChange={(e) => setOrderingSystem(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                        >
                          <option value="">Select your ordering system</option>
                          <option value="uber-eats">Uber Eats</option>
                          <option value="doordash">DoorDash</option>
                          <option value="grubhub">GrubHub</option>
                          <option value="postmates">Postmates</option>
                          <option value="custom">Custom System</option>
                        </select>
                      </div>

                      {/* Link Your Online Menu (show only when an ordering system is selected) */}
                      {orderingSystem !== '' && (
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-900">
                            Link Your Online Menu
                          </label>
                          <div className="flex gap-3">
                            <input
                              type="url"
                              value={menuUrl}
                              onChange={(e) => setMenuUrl(e.target.value)}
                              placeholder="Enter your menu URL"
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                            />
                            <button
                              onClick={handleFetchMenu}
                              disabled={isFetchingMenu}
                              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                                isFetchingMenu
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : menuUrl && menuUrl.trim()
                                    ? 'bg-black text-white hover:bg-black'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {isFetchingMenu ? (
                                <>
                                  <svg className="animate-spin h-5 w-5 mr-2 text-current" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                  </svg>
                                  Fetching…
                                </>
                              ) : (
                                'Fetch Menu'
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Restaurant Name */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-900">
                          Restaurant Name
                        </label>
                        <input
                          type="text"
                          value={brandData?.name || restaurantName}
                          onChange={(e) => setRestaurantName(e.target.value)}
                          placeholder="e.g. Ilcaminetto"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                        />
                      </div>

                      {/* Primary Color */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-900">
                          Primary Color
                        </label>
                        <div className="flex gap-2">
                          {[
                            '#6B7280', // gray
                            '#EF4444', // red
                            '#F97316', // orange
                            '#F59E0B', // amber
                            '#10B981', // emerald
                            '#3B82F6', // blue
                            '#8B5CF6', // violet
                            '#1F2937'  // gray-800
                          ].map((color) => (
                            <button
                              key={color}
                              onClick={() => setPrimaryColor(color)}
                              className={`w-12 h-12 rounded-lg border-2 ${
                                primaryColor === color ? 'border-gray-400' : 'border-gray-200'
                              } hover:border-gray-400 transition-colors`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                          <button className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 flex items-center justify-center">
                            <span className="text-white text-xs">🎨</span>
                          </button>
                        </div>
                      </div>

                      {/* Create Button */}
                      <button
                        onClick={handleCreateBrand}
                        disabled={isSaving}
                        className={`w-full py-3 rounded-lg font-medium transition-colors ${
                          isSaving
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : isFormComplete
                              ? 'bg-black text-white hover:bg-black'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {isSaving ? 'Creating…' : 'Create'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Full width grey background */}
        <div className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="border-l border-gray-200 h-full">
              {isFetching ? (
                <div className="relative h-full min-h-[700px]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src="/animationLogo.png" 
                      alt="Loading..." 
                      className="w-16 h-16 animate-pulse"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative h-full min-h-[500px]">
                  {brandData && brandData.logos && brandData.logos.length > 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {(() => {
                        const format = brandData?.logos?.[0]?.formats?.find(f => typeof f?.src === 'string' && f.src.trim().length > 0);
                        const logoSrc = format?.src?.trim();
                        const width = format?.width || 256;
                        const height = format?.height || 256;
                        if (!logoSrc) {
                          return (
                            <p className="text-gray-500">Logo URL missing from brand data</p>
                          );
                        }
                        return (
                          <Image
                            src={logoSrc}
                            alt={`${brandData?.name || 'Brand'} logo`}
                            width={width}
                            height={height}
                            className="max-w-xs max-h-64 object-contain mt-8 md:mt-20"
                            referrerPolicy="no-referrer"
                            onLoad={() => console.log('Logo loaded successfully:', logoSrc)}
                            onError={() => console.log('Logo failed to load:', logoSrc)}
                          />
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-500">Brand logo will appear here after fetching</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}