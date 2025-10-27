'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { useBrand } from '../../contexts/BrandContext';

// Dynamically import libraries for file processing
let mammoth, pdfjsLib;

if (typeof window !== 'undefined') {
  import('mammoth').then(module => mammoth = module.default || module);
  import('pdfjs-dist/build/pdf.worker').then(() => {
    import('pdfjs-dist').then(module => pdfjsLib = module.default || module);
    // Set the worker path for pdfjs
    if (typeof window !== 'undefined' && pdfjsLib) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    }
  });
}

export default function OperationsPage() {
  const router = useRouter();
  const { selectedBrand, refreshBrands } = useBrand();
  
  // Helper function to convert R2 URLs to proxied URLs
  const getProxiedImageUrl = (url) => {
    if (!url) return '';
    // If it's an R2 URL, proxy it through our API
    if (url.includes('r2.dev')) {
      return `/api/proxy-image?url=${encodeURIComponent(url)}`;
    }
    return url;
  };
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('FAQ');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [deliveryOffer, setDeliveryOffer] = useState('no');
  const [ownWebsiteChecked, setOwnWebsiteChecked] = useState(false);

  // Delivery Settings state
  const [deliverySettings, setDeliverySettings] = useState({
    deliveryType: [],
    deliveryDistance: '',
    category: '',
    deliveryArea: '',
    orderingPlatforms: [],
    websiteUrl: '',
    typeOfOrders: '',
    deliveryFee: '',
    minimumOrderAmount: '',
    additionalCharges: '',
    availability: '',
    estimateDeliveryTime: '',
    deliveryNotes: '',
    deliveryInquiriesPhone: '',
    deliveryInquiriesEmail: '',
  });
  const [isSavingDelivery, setIsSavingDelivery] = useState(false);

  // Restaurant Settings state
  const [restaurantSettings, setRestaurantSettings] = useState({
    restaurantName: '',
    websiteUrl: '',
    emailAddress: '',
    address: '',
    contactNumber: '',
    restaurantLogo: '',
    restaurantBanner: '',
  });
  
  const [restaurantTiming, setRestaurantTiming] = useState([
    { day: 'Monday', status: 'Open', openTime: '09:00', closeTime: '22:00' },
    { day: 'Tuesday', status: 'Open', openTime: '09:00', closeTime: '22:00' },
    { day: 'Wednesday', status: 'Open', openTime: '09:00', closeTime: '22:00' },
    { day: 'Thursday', status: 'Open', openTime: '09:00', closeTime: '22:00' },
    { day: 'Friday', status: 'Open', openTime: '09:00', closeTime: '22:00' },
    { day: 'Saturday', status: 'Open', openTime: '09:00', closeTime: '22:00' },
    { day: 'Sunday', status: 'Open', openTime: '09:00', closeTime: '22:00' },
  ]);
  
  const [notificationEmails, setNotificationEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Option 3 state
  const [option3Filename, setOption3Filename] = useState('');
  const [option3Data, setOption3Data] = useState('');

  // FAQ data and loading states
  const [faqData, setFaqData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for currently viewed FAQ
  const [viewedFaq, setViewedFaq] = useState(null);
  
  // Ref to track if default FAQ has been set
  const hasSetDefaultFaq = useRef(false);

  // Scraping states
  const [isScrapingLoading, setIsScrapingLoading] = useState(false);
  const [scrapingError, setScrapingError] = useState('');

  // Check authentication and fetch FAQ data
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData') || localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/sign-in');
      return;
    }

    // Reset viewed FAQ and default FAQ flag when brand changes
    setViewedFaq(null);
    hasSetDefaultFaq.current = false;

    // Only fetch FAQ data if we have a selected brand
    if (selectedBrand?.brandId) {
      fetchFAQData(token);
      loadBrandSettings();
      loadDeliverySettings(token);
    }
  }, [router, selectedBrand?.brandId]);

  // Load brand settings into form
  const loadBrandSettings = () => {
    if (!selectedBrand) return;
    
    console.log('Loading brand settings:', selectedBrand);
    
    // Get restaurant name from either restaurantName field or brand_fetch.name
    const restaurantName = selectedBrand.restaurantName || 
                          selectedBrand.brand_fetch?.name || 
                          '';
    
    // Get primary email from emailAddresses array or emailAddress field
    const primaryEmail = selectedBrand.emailAddresses?.[0] || 
                        selectedBrand.emailAddress || 
                        '';
    
    setRestaurantSettings({
      restaurantName: restaurantName,
      websiteUrl: selectedBrand.websiteUrl || '',
      emailAddress: primaryEmail,
      address: selectedBrand.address || '',
      contactNumber: selectedBrand.contactNumber || '',
      restaurantLogo: selectedBrand.restaurantLogo || '',
      restaurantBanner: selectedBrand.restaurantBanner || '',
    });
    
    if (selectedBrand.restaurantTiming && selectedBrand.restaurantTiming.length > 0) {
      setRestaurantTiming(selectedBrand.restaurantTiming);
    }
    
    if (selectedBrand.emailAddresses && selectedBrand.emailAddresses.length > 0) {
      setNotificationEmails(selectedBrand.emailAddresses);
    }
  };

  // Load delivery settings from API
  const loadDeliverySettings = async (token) => {
    if (!selectedBrand?.brandId) return;

    try {
      console.log('🔄 Loading delivery settings...');
      
      const response = await fetch(`/api/delivery?brandId=${selectedBrand.brandId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success && result.data.delivery) {
        const delivery = result.data.delivery;
        console.log('✅ Delivery settings loaded:', delivery);
        
        // Set delivery offer based on whether any data exists
        const hasDeliveryData = delivery.deliveryType?.length > 0 || 
                               delivery.deliveryDistance || 
                               delivery.orderingPlatforms?.length > 0;
        setDeliveryOffer(hasDeliveryData ? 'yes' : 'no');
        
        // Set website checkbox
        setOwnWebsiteChecked(delivery.orderingPlatforms?.includes('Your own website') || false);
        
        // Load all delivery settings
        setDeliverySettings({
          deliveryType: delivery.deliveryType || [],
          deliveryDistance: delivery.deliveryDistance || '',
          category: delivery.category || '',
          deliveryArea: delivery.deliveryArea || '',
          orderingPlatforms: delivery.orderingPlatforms || [],
          websiteUrl: delivery.websiteUrl || '',
          typeOfOrders: delivery.typeOfOrders || '',
          deliveryFee: delivery.deliveryFee || '',
          minimumOrderAmount: delivery.minimumOrderAmount || '',
          additionalCharges: delivery.additionalCharges || '',
          availability: delivery.availability || '',
          estimateDeliveryTime: delivery.estimateDeliveryTime || '',
          deliveryNotes: delivery.deliveryNotes || '',
          deliveryInquiriesPhone: delivery.deliveryInquiriesPhone || '',
          deliveryInquiriesEmail: delivery.deliveryInquiriesEmail || '',
        });
      } else {
        console.log('ℹ️ No delivery settings found');
      }
    } catch (error) {
      console.error('❌ Error loading delivery settings:', error);
    }
  };

  // Handle delivery settings change
  const handleDeliverySettingsChange = (field, value) => {
    setDeliverySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle delivery type checkbox toggle
  const handleDeliveryTypeToggle = (type) => {
    setDeliverySettings(prev => {
      const currentTypes = prev.deliveryType || [];
      const newTypes = currentTypes.includes(type)
        ? currentTypes.filter(t => t !== type)
        : [...currentTypes, type];
      return { ...prev, deliveryType: newTypes };
    });
  };

  // Handle ordering platform checkbox toggle
  const handlePlatformToggle = (platform) => {
    setDeliverySettings(prev => {
      const currentPlatforms = prev.orderingPlatforms || [];
      const newPlatforms = currentPlatforms.includes(platform)
        ? currentPlatforms.filter(p => p !== platform)
        : [...currentPlatforms, platform];
      return { ...prev, orderingPlatforms: newPlatforms };
    });
  };

  // Save delivery settings to API
  const handleSaveDeliverySettings = async () => {
    if (!selectedBrand?.brandId) {
      setScrapingError('No brand selected');
      return;
    }

    setIsSavingDelivery(true);
    setScrapingError('');

    try {
      const token = localStorage.getItem('authToken');

      console.log('✅ Starting delivery settings save...');

      // Prepare payload
      const payload = {
        brandId: selectedBrand.brandId,
        deliveryType: deliverySettings.deliveryType,
        deliveryDistance: deliverySettings.deliveryDistance,
        category: deliverySettings.category,
        deliveryArea: deliverySettings.deliveryArea,
        orderingPlatforms: deliverySettings.orderingPlatforms,
        typeOfOrders: deliverySettings.typeOfOrders,
        deliveryFee: deliverySettings.deliveryFee,
        minimumOrderAmount: deliverySettings.minimumOrderAmount,
        additionalCharges: deliverySettings.additionalCharges,
        availability: deliverySettings.availability,
        estimateDeliveryTime: deliverySettings.estimateDeliveryTime,
        deliveryNotes: deliverySettings.deliveryNotes,
        deliveryInquiriesPhone: deliverySettings.deliveryInquiriesPhone,
        deliveryInquiriesEmail: deliverySettings.deliveryInquiriesEmail,
      };

      console.log('📤 Delivery Payload:', payload);

      const response = await fetch('/api/delivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('📥 Delivery Response status:', response.status);

      if (!response.ok) {
        throw new Error('Failed to save delivery settings');
      }

      const result = await response.json();

      if (result.success) {
        console.log('✅ Delivery settings saved successfully');

        // Create formatted delivery description for FAQ
        const deliveryTypeText = deliverySettings.deliveryType?.length > 0
          ? `Delivery types: ${deliverySettings.deliveryType.join(', ')}.`
          : '';

        const platformsText = deliverySettings.orderingPlatforms?.length > 0
          ? `Available on ${deliverySettings.orderingPlatforms.join(', ')}.`
          : '';

        const feeText = deliverySettings.deliveryFee
          ? `Delivery fee: ${deliverySettings.deliveryFee}.`
          : '';

        const minimumText = deliverySettings.minimumOrderAmount
          ? `Minimum order: ${deliverySettings.minimumOrderAmount}.`
          : '';

        const timeText = deliverySettings.estimateDeliveryTime
          ? `Estimated time: ${deliverySettings.estimateDeliveryTime}.`
          : '';

        const contactText = (deliverySettings.deliveryInquiriesPhone || deliverySettings.deliveryInquiriesEmail)
          ? `Contact for delivery inquiries: ${deliverySettings.deliveryInquiriesPhone || ''}${deliverySettings.deliveryInquiriesPhone && deliverySettings.deliveryInquiriesEmail ? ' or ' : ''}${deliverySettings.deliveryInquiriesEmail || ''}.`
          : '';

        const deliveryDescription = `Delivery service information: ${deliveryTypeText} ${platformsText} ${feeText} ${minimumText} ${deliverySettings.deliveryArea ? `Delivery areas: ${deliverySettings.deliveryArea}.` : ''} ${timeText} ${deliverySettings.availability ? `Available: ${deliverySettings.availability}.` : ''} ${contactText} ${deliverySettings.deliveryNotes ? `Notes: ${deliverySettings.deliveryNotes}` : ''}`.trim();

        console.log('📝 Generated delivery FAQ description:', deliveryDescription);

        // Save to FAQ API
        try {
          console.log('🔄 Attempting to save delivery settings to FAQ...');

          const faqPayload = {
            brandId: selectedBrand.brandId,
            uploadType: 'delivery_settings',
            filename: 'delivery',
            data: {
              description: deliveryDescription,
              deliveryType: deliverySettings.deliveryType,
              deliveryDistance: deliverySettings.deliveryDistance,
              category: deliverySettings.category,
              deliveryArea: deliverySettings.deliveryArea,
              orderingPlatforms: deliverySettings.orderingPlatforms,
              typeOfOrders: deliverySettings.typeOfOrders,
              deliveryFee: deliverySettings.deliveryFee,
              minimumOrderAmount: deliverySettings.minimumOrderAmount,
              additionalCharges: deliverySettings.additionalCharges,
              availability: deliverySettings.availability,
              estimateDeliveryTime: deliverySettings.estimateDeliveryTime,
              deliveryNotes: deliverySettings.deliveryNotes,
              deliveryInquiriesPhone: deliverySettings.deliveryInquiriesPhone,
              deliveryInquiriesEmail: deliverySettings.deliveryInquiriesEmail,
              updatedAt: new Date().toISOString(),
            },
          };

          console.log('📤 FAQ Payload:', faqPayload);

          const faqResponse = await fetch('/api/faq', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(faqPayload),
          });

          console.log('📥 FAQ Response status:', faqResponse.status);

          if (!faqResponse.ok) {
            const errorText = await faqResponse.text();
            console.error('❌ Failed to save delivery settings to FAQ:', errorText);
          } else {
            const faqResult = await faqResponse.json();
            console.log('✅ Delivery settings saved to FAQ:', faqResult);
          }
        } catch (faqError) {
          console.error('❌ Error saving delivery settings to FAQ:', faqError);
          // Don't fail the whole operation if FAQ save fails
        }

        // Refresh FAQ data to show the updated entry
        console.log('🔄 Refreshing FAQ data...');
        await fetchFAQData(token);

        // Close drawer and show success
        setIsDrawerOpen(false);
        setScrapingError('');
        console.log('✅ Delivery settings saved successfully');
      } else {
        throw new Error(result.message || 'Failed to save delivery settings');
      }
    } catch (error) {
      console.error('❌ Error saving delivery settings:', error);
      setScrapingError(error.message || 'Failed to save delivery settings. Please try again.');
    } finally {
      setIsSavingDelivery(false);
    }
  };

  const fetchFAQData = async (token) => {
    if (!selectedBrand?.brandId) {
      console.log('No selected brand available for FAQ fetch');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/faq/get?brandId=${selectedBrand.brandId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Transform FAQ data to match the table structure
        const transformedData = data.data.faqs.map((faq, index) => ({
          id: faq._id,
          fileName: faq.filename || faq.question || `FAQ ${index + 1}`,
          type: 'faq',
          characters: (faq.question?.length || 0) + (faq.answer?.length || 0),
          status: 'Trained',
          lastTrained: new Date(faq.createdAt).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          question: faq.question,
          answer: faq.answer,
          createdAt: faq.createdAt,
          data: faq.data, // Include the full data object
          uploadType: faq.uploadType,
          date: faq.date
        }));
        
        setFaqData(transformedData);
        
        // Set the first FAQ as the default viewed FAQ only on initial load
        if (transformedData.length > 0 && !hasSetDefaultFaq.current) {
          setViewedFaq(transformedData[0]);
          hasSetDefaultFaq.current = true;
        }
      } else {
        setError(data.message || 'Failed to fetch FAQ data');
      }
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle URL scraping
  const handleUrlScraping = async () => {
    if (!urlInput.trim()) {
      setScrapingError('Please enter a valid URL');
      return;
    }

    setIsScrapingLoading(true);
    setScrapingError('');

    try {
      const token = localStorage.getItem('authToken');
      
      // Call the scraping API
      const scrapingResponse = await fetch('https://fdata.getfork.ai/scrape', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: urlInput.trim(),
          api_key: process.env.NEXT_PUBLIC_SCRAPING_API_KEY
        })
      });

      if (!scrapingResponse.ok) {
        throw new Error(`Scraping failed: ${scrapingResponse.status}`);
      }

      const scrapingData = await scrapingResponse.json();
      
      // Save the scraped data to FAQ API
      const faqResponse = await fetch('/api/faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          brandId: selectedBrand.brandId,
          uploadType: 'url_scraping',
          filename: 'Faq Default',
          data: scrapingData
        })
      });

      if (!faqResponse.ok) {
        throw new Error('Failed to save scraped data');
      }

      const faqResult = await faqResponse.json();
      
      if (faqResult.success) {
        // Clear the URL input and refresh FAQ data
        setUrlInput('');
        await fetchFAQData(token);
        setIsDrawerOpen(false);
      } else {
        throw new Error(faqResult.message || 'Failed to save scraped data');
      }

    } catch (error) {
      console.error('Error during URL scraping:', error);
      setScrapingError(error.message || 'Failed to scrape URL. Please try again.');
    } finally {
      setIsScrapingLoading(false);
    }
  };

  // Handle file upload for DOC, DOCX, PDF files
  const handleFileUpload = async (file) => {
    if (!file) return;

    setIsScrapingLoading(true);
    setScrapingError('');

    try {
      const token = localStorage.getItem('authToken');
      
      // Extract text content from files
      let fileContent = '';
      
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
          file.name.endsWith('.docx')) {
        // For DOCX files, extract text content using mammoth
        try {
          if (typeof window !== 'undefined' && mammoth) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            fileContent = result.value;
          } else {
            // Fallback content if mammoth is not available
            fileContent = `Content from DOCX file: ${file.name}`;
          }
        } catch (error) {
          console.error('Error extracting DOCX content:', error);
          fileContent = `Error extracting content from ${file.name}`;
        }
      } else if (file.type === 'application/msword' || 
                 file.name.endsWith('.doc')) {
        // For DOC files, we'll need a different approach
        // For now, we'll create a placeholder content
        fileContent = `Content from DOC file: ${file.name}\n\n(Note: Full content extraction from .doc files requires server-side processing)`;
      } else if (file.type === 'application/pdf' || 
                 file.name.endsWith('.pdf')) {
        // For PDF files, we would extract text content
        fileContent = `Content from PDF file: ${file.name}\n\n(Note: Full content extraction from PDF files requires additional processing)`;
      } else {
        // For other file types
        fileContent = `File: ${file.name}\nSize: ${file.size} bytes\nType: ${file.type}`;
      }

      // Create data object with extracted content
      const fileData = {
        content: fileContent,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        extractedAt: new Date().toISOString()
      };

      // Save the file data to FAQ API
      const faqResponse = await fetch('/api/faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          brandId: selectedBrand.brandId,
          uploadType: 'file_upload',
          filename: file.name,
          data: fileData
        })
      });

      if (!faqResponse.ok) {
        throw new Error('Failed to save file data');
      }

      const faqResult = await faqResponse.json();
      
      if (faqResult.success) {
        // Clear the uploaded file and refresh FAQ data
        setUploadedFile(null);
        await fetchFAQData(token);
        setIsDrawerOpen(false);
      } else {
        throw new Error(faqResult.message || 'Failed to save file data');
      }

    } catch (error) {
      console.error('Error during file upload:', error);
      setScrapingError(error.message || 'Failed to upload file. Please try again.');
    } finally {
      setIsScrapingLoading(false);
    }
  };

  // Handle saving Option 3 data (manual entry) to FAQs
  const handleSaveOption3Data = async () => {
    if (!option3Filename.trim() || !option3Data.trim()) {
      setScrapingError('Please enter both filename and data');
      return;
    }

    setIsScrapingLoading(true);
    setScrapingError('');

    try {
      const token = localStorage.getItem('authToken');
      
      // Create data object with user-entered content
      const manualData = {
        content: option3Data,
        enteredAt: new Date().toISOString()
      };

      // Save the manual data to FAQ API
      const faqResponse = await fetch('/api/faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          brandId: selectedBrand.brandId,
          uploadType: 'manual_entry',
          filename: option3Filename,
          data: manualData
        })
      });

      if (!faqResponse.ok) {
        throw new Error('Failed to save manual data');
      }

      const faqResult = await faqResponse.json();
      
      if (faqResult.success) {
        // Clear the input fields and refresh FAQ data
        setOption3Filename('');
        setOption3Data('');
        await fetchFAQData(token);
        setIsDrawerOpen(false);
      } else {
        throw new Error(faqResult.message || 'Failed to save manual data');
      }

    } catch (error) {
      console.error('Error during manual data save:', error);
      setScrapingError(error.message || 'Failed to save data. Please try again.');
    } finally {
      setIsScrapingLoading(false);
    }
  };

  // Handle image upload to Cloudflare R2
  const handleImageUpload = async (file, type) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const result = await response.json();
      console.log(`${type} upload result:`, result);
      
      if (result.success && result.data?.url) {
        return result.data.url;
      } else {
        throw new Error('Invalid upload response');
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setScrapingError(`Failed to upload ${type}. Please try again.`);
      return null;
    }
  };

  // Handle logo file selection
  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogoFile(file);
    setIsUploadingLogo(true);

    const url = await handleImageUpload(file, 'logo');
    if (url) {
      setRestaurantSettings(prev => ({ ...prev, restaurantLogo: url }));
    }

    setIsUploadingLogo(false);
  };

  // Handle banner file selection
  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBannerFile(file);
    setIsUploadingBanner(true);

    const url = await handleImageUpload(file, 'banner');
    if (url) {
      setRestaurantSettings(prev => ({ ...prev, restaurantBanner: url }));
    }

    setIsUploadingBanner(false);
  };

  // Handle restaurant settings input change
  const handleSettingsChange = (field, value) => {
    setRestaurantSettings(prev => ({ ...prev, [field]: value }));
  };

  // Handle timing change
  const handleTimingChange = (index, field, value) => {
    setRestaurantTiming(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Add notification email
  const handleAddEmail = () => {
    if (newEmail.trim() && /^\S+@\S+\.\S+$/.test(newEmail)) {
      setNotificationEmails(prev => [...prev, newEmail.trim()]);
      setNewEmail('');
    } else {
      setScrapingError('Please enter a valid email address');
    }
  };

  // Remove notification email
  const handleRemoveEmail = (index) => {
    setNotificationEmails(prev => prev.filter((_, i) => i !== index));
  };

  // Save restaurant settings to API
  const handleSaveRestaurantSettings = async () => {
    if (!selectedBrand?.brandId) {
      setScrapingError('No brand selected');
      return;
    }

    setIsSavingSettings(true);
    setScrapingError('');

    try {
      const token = localStorage.getItem('authToken');

      const payload = {
        brandId: selectedBrand.brandId,
        brand_fetch: selectedBrand.brand_fetch,
        restaurantName: restaurantSettings.restaurantName,
        style: selectedBrand.style || { primaryColor: '' },
        restaurantLogo: restaurantSettings.restaurantLogo,
        restaurantBanner: restaurantSettings.restaurantBanner,
        websiteUrl: restaurantSettings.websiteUrl,
        address: restaurantSettings.address,
        contactNumber: restaurantSettings.contactNumber,
        restaurantTiming: restaurantTiming,
        emailAddresses: notificationEmails,
      };

      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save restaurant settings');
      }

      const result = await response.json();

      if (result.success) {
        console.log('✅ Brand settings saved successfully');
        
        // Create formatted restaurant settings description for FAQ
        const timingText = restaurantTiming
          .filter(t => t.status === 'Open')
          .map(t => `${t.day} from ${t.openTime} to ${t.closeTime}`)
          .join('; ');
        
        const emailText = notificationEmails.length > 0 
          ? `Notifications go to ${notificationEmails.join(', ')}.` 
          : '';
        
        const logoText = restaurantSettings.restaurantLogo 
          ? `View logo at ${restaurantSettings.restaurantLogo}` 
          : '';
        
        const bannerText = restaurantSettings.restaurantBanner 
          ? `banner at ${restaurantSettings.restaurantBanner}` 
          : '';
        
        const imageText = (logoText || bannerText) 
          ? `${logoText}${logoText && bannerText ? ' and ' : ''}${bannerText}.` 
          : '';

        const restaurantDescription = `${restaurantSettings.restaurantName || 'Restaurant'}${restaurantSettings.address ? `, located at ${restaurantSettings.address}` : ''}${timingText ? `, is open ${timingText}` : ''}${restaurantSettings.emailAddress || restaurantSettings.contactNumber ? '. Contact via' : ''}${restaurantSettings.emailAddress ? ` ${restaurantSettings.emailAddress}` : ''}${restaurantSettings.emailAddress && restaurantSettings.contactNumber ? ' or' : ''}${restaurantSettings.contactNumber ? ` ${restaurantSettings.contactNumber}` : ''}${restaurantSettings.emailAddress || restaurantSettings.contactNumber ? '.' : ''} ${emailText} ${imageText}`.trim();

        console.log('📝 Generated FAQ description:', restaurantDescription);

        // Save to FAQ API
        try {
          console.log('🔄 Attempting to save restaurant settings to FAQ...');
          
          const faqPayload = {
            brandId: selectedBrand.brandId,
            uploadType: 'restaurant_settings',
            filename: 'restuarant setting',
            data: {
              description: restaurantDescription,
              restaurantName: restaurantSettings.restaurantName,
              address: restaurantSettings.address,
              websiteUrl: restaurantSettings.websiteUrl,
              emailAddress: restaurantSettings.emailAddress,
              contactNumber: restaurantSettings.contactNumber,
              restaurantLogo: restaurantSettings.restaurantLogo,
              restaurantBanner: restaurantSettings.restaurantBanner,
              timing: restaurantTiming,
              notificationEmails: notificationEmails,
              updatedAt: new Date().toISOString(),
            },
          };
          
          console.log('📤 FAQ Payload:', faqPayload);
          
          const faqResponse = await fetch('/api/faq', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(faqPayload),
          });

          console.log('📥 FAQ Response status:', faqResponse.status);

          if (!faqResponse.ok) {
            const errorText = await faqResponse.text();
            console.error('❌ Failed to save restaurant settings to FAQ:', errorText);
          } else {
            const faqResult = await faqResponse.json();
            console.log('✅ Restaurant settings saved to FAQ:', faqResult);
          }
        } catch (faqError) {
          console.error('❌ Error saving restaurant settings to FAQ:', faqError);
          // Don't fail the whole operation if FAQ save fails
        }

        // Refresh FAQ data to show the updated entry
        console.log('🔄 Refreshing FAQ data...');
        await fetchFAQData(token);
        
        // Refresh brands to get updated data
        if (refreshBrands) {
          console.log('🔄 Refreshing brands...');
          await refreshBrands();
        }
        
        // Close drawer and show success
        setIsDrawerOpen(false);
        setScrapingError('');
        console.log('✅ Restaurant settings saved successfully');
      } else {
        throw new Error(result.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving restaurant settings:', error);
      setScrapingError(error.message || 'Failed to save settings. Please try again.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Filter FAQ data based on search term
  const filteredFaqData = faqData.filter(faq =>
    faq.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFaqData.length && filteredFaqData.length > 0) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFaqData.map(faq => faq.id));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            {/* Header Section */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sources</h1>
              
              {/* Description with Add Operations Button */}
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  Add documents or links to training materials for increase your AI Agent&apos;s knowledge
                </p>
                <button 
                  onClick={() => setIsDrawerOpen(true)}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Operations</span>
                </button>
              </div>
            </div>

            {/* Trained Data Section */}
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">Trained Data</h2>
                      </div>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => {
                        setViewedFaq(null);
                        fetchFAQData(localStorage.getItem('authToken'));
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="sr-only">Refresh</span>
                    </button>
                  </div>
                  
                  {/* Initial Data Info - Inside Container Header */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Text/Plain</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span>
                    <span className="text-gray-500">09/22/2025, 11:11:42 PM</span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Display viewed FAQ entry data */}
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                      <span className="ml-2 text-gray-500">Loading trained data...</span>
                    </div>
                  ) : viewedFaq ? (
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900 mb-2"># {viewedFaq.fileName}</h3>
                      <div className="text-sm text-gray-600 space-y-2">
                        {viewedFaq.data && typeof viewedFaq.data === 'object' ? (
                          // If data is an object, display the actual data content
                          Object.entries(viewedFaq.data).map(([key, value]) => (
                            <div key={key}>
                              {key === 'data' && typeof value === 'object' ? (
                                // Special handling for nested data object
                                Object.entries(value).map(([subKey, subValue]) => (
                                  <div key={subKey}>
                                    <p><strong>## {subKey.charAt(0).toUpperCase() + subKey.slice(1).replace(/_/g, ' ')}</strong></p>
                                    <p>{typeof subValue === 'string' ? subValue : JSON.stringify(subValue, null, 2)}</p>
                                  </div>
                                ))
                              ) : key !== '__v' && key !== '_id' && key !== 'userId' && key !== 'brandId' && key !== 'createdAt' && key !== 'updatedAt' ? (
                                // Display other fields except internal ones
                                <div>
                                  <p><strong>## {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</strong></p>
                                  <p>{typeof value === 'string' ? value : JSON.stringify(value, null, 2)}</p>
                                </div>
                              ) : null}
                            </div>
                          ))
                        ) : viewedFaq.question && viewedFaq.answer ? (
                          // If it has question and answer format
                          <>
                            <div>
                              <p><strong>## Question</strong></p>
                              <p>{viewedFaq.question}</p>
                            </div>
                            <div>
                              <p><strong>## Answer</strong></p>
                              <p>{viewedFaq.answer}</p>
                            </div>
                          </>
                        ) : (
                          // Fallback display
                          <div>
                            <p><strong>## Data</strong></p>
                            <p>{typeof viewedFaq.data === 'string' ? viewedFaq.data : JSON.stringify(viewedFaq.data, null, 2)}</p>
                          </div>
                        )}
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            <strong>File Type:</strong> {viewedFaq.type} | 
                            <strong> Characters:</strong> {viewedFaq.characters} | 
                            <strong> Last Trained:</strong> {viewedFaq.lastTrained}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm text-gray-500">No trained data available</p>
                      <p className="text-xs text-gray-400 mt-1">Select a file to view its content</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Train Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">Train</h2>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {isLoading ? 'Loading...' : `${filteredFaqData.length}/ Training Materials`}
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Search and Actions */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => setSelectedFiles([])}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Delete
                    </button>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                      Re-train
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                      Re-train Daily
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">
                          <input
                            type="checkbox"
                            checked={!isLoading && selectedFiles.length === filteredFaqData.length && filteredFaqData.length > 0}
                            onChange={handleSelectAll}
                            disabled={isLoading}
                            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 disabled:opacity-50"
                          />
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">File Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Characters</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Last Trained</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan="7" className="py-8 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                              <span className="text-gray-500">Loading FAQ data...</span>
                            </div>
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan="7" className="py-8 text-center">
                            <div className="text-red-500">
                              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-sm">{error}</p>
                              <button 
                                onClick={() => fetchFAQData(localStorage.getItem('authToken'))}
                                className="mt-2 text-orange-500 hover:text-orange-600 text-sm underline"
                              >
                                Try again
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : filteredFaqData.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-8 text-center text-gray-500">
                            <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-sm">No FAQ data found</p>
                            <p className="text-xs text-gray-400 mt-1">Add some FAQs to get started</p>
                          </td>
                        </tr>
                      ) : (
                        filteredFaqData.map((faq) => (
                          <tr key={faq.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                checked={selectedFiles.includes(faq.id)}
                                onChange={() => handleFileSelect(faq.id)}
                                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                              />
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900" title={faq.question}>
                              {faq.fileName}
                            </td>
                            <td className="py-3 px-4">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {faq.type}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900">{faq.characters.toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                {faq.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{faq.lastTrained}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button 
                                  className="text-gray-400 hover:text-gray-600"
                                  title="View FAQ"
                                  onClick={() => setViewedFaq(faq)}
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                                <button 
                                  className="text-gray-400 hover:text-gray-600"
                                  title="Refresh FAQ"
                                  onClick={() => fetchFAQData(localStorage.getItem('authToken'))}
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                </button>
                                <button 
                                  className="text-gray-400 hover:text-red-600"
                                  title="Delete FAQ"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </main>
      </div>

      {/* Add Operations Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsDrawerOpen(false)}
          ></div>
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-[600px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add Operations</h2>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {["FAQ", "Restaurant Settings", "Delivery"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-medium border-b-2 ${
                       activeTab === tab
                         ? "border-black text-black"
                         : "border-transparent text-gray-500 hover:text-gray-700"
                     }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto max-h-[calc(100vh-140px)] flex flex-col">
              {activeTab === "FAQ" && (
                <>
                  <p className="text-sm text-gray-600 mb-6">
                    You can add your FAQs or info page in different ways:
                  </p>

                  {/* Option 1 - Upload a File */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-900">Option 1 — Upload a File</span>
                    </div>

                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors cursor-pointer mb-4"
                      onClick={() => document.getElementById('file-upload').click()}
                    >
                      <div className="flex flex-col items-center text-center">
                        <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-600 font-medium text-sm mb-1">Upload your FAQ or information sheet</p>
                        <p className="text-xs text-gray-500">Supported formats: JPEG, PNG, DOCX, PDF (max 4MB)</p>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".jpeg,.jpg,.png,.docx,.pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setUploadedFile(file);
                          }
                        }}
                      />
                    </div>

                    {/* Display uploaded file and upload button */}
                    {uploadedFile && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                              <p className="text-xs text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleFileUpload(uploadedFile)}
                            disabled={isScrapingLoading}
                            className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {isScrapingLoading ? 'Uploading...' : 'Upload'}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 mb-20 mt-20">
                      <hr className="flex-1 border-gray-300" />
                      <span className="text-gray-400 text-sm">OR</span>
                      <hr className="flex-1 border-gray-300" />
                    </div>
                  </div>

                  {/* Option 2 - Use a Link */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-900">Option 2 — Use a Link</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      Paste a public link to your FAQs or info page — for example, from your website or Google Drive.
                    </p>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Get Url</label>
                      <input
                        type="url"
                        placeholder="Enter or paste the website URL here"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                        disabled={isScrapingLoading}
                      />
                      {scrapingError && (
                        <p className="text-red-600 text-sm mt-2">{scrapingError}</p>
                      )}
                    </div>

                    <button
                      onClick={handleUrlScraping}
                      disabled={isScrapingLoading || !urlInput.trim()}
                      className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isScrapingLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Scraping...
                        </>
                      ) : (
                        'OK'
                      )}
                    </button>

                    <div className="flex items-center gap-4 mb-20 mt-20">
                      <hr className="flex-1 border-gray-300" />
                      <span className="text-gray-400 text-sm">OR</span>
                      <hr className="flex-1 border-gray-300" />
                    </div>
                  </div>

                  {/* Option 3 - Type or Paste Text */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-900">Option 3 — Type or Paste Text</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      Add FAQs manually by typing or pasting them below.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">File Name</label>
                        <input
                          type="text"
                          placeholder="Enter file name (e.g., restaurant_info.txt)"
                          value={option3Filename}
                          onChange={(e) => setOption3Filename(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Data</label>
                        <textarea
                          placeholder="Enter your FAQ content or other information here..."
                          rows={6}
                          value={option3Data}
                          onChange={(e) => setOption3Data(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={handleSaveOption3Data}
                          disabled={isScrapingLoading || !option3Filename.trim() || !option3Data.trim()}
                          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {isScrapingLoading ? 'Saving...' : 'Save to FAQs'}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "Restaurant Settings" && (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Set Your Restaurant&apos;s Core Details</h3>
                  
                  {/* Error Display */}
                  {scrapingError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{scrapingError}</p>
                    </div>
                  )}
                  
                  {/* Logo Upload */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Restaurant Logo</label>
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors cursor-pointer mb-2"
                      onClick={() => document.getElementById('logo-upload').click()}
                    >
                      <div className="flex items-center gap-3">
                        {isUploadingLogo ? (
                          <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                          </div>
                        ) : restaurantSettings.restaurantLogo ? (
                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                            <img 
                              src={getProxiedImageUrl(restaurantSettings.restaurantLogo)} 
                              alt="Restaurant Logo" 
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                console.error('Logo image failed to load:', restaurantSettings.restaurantLogo);
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50" y="50" font-family="Arial" font-size="14" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3ELogo%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {isUploadingLogo ? 'Uploading...' : restaurantSettings.restaurantLogo ? 'Logo uploaded' : 'Click or drag to upload your logo'}
                          </p>
                          <p className="text-xs text-gray-500">Supported formats: JPEG, PNG (max 4MB)</p>
                          {restaurantSettings.restaurantLogo && !isUploadingLogo && (
                            <p className="text-xs text-green-600 mt-1">✓ Image URL saved</p>
                          )}
                        </div>
                        {restaurantSettings.restaurantLogo && !isUploadingLogo && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setRestaurantSettings(prev => ({ ...prev, restaurantLogo: '' }));
                              setLogoFile(null);
                            }}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <input
                        id="logo-upload"
                        type="file"
                        className="hidden"
                        accept=".jpeg,.jpg,.png"
                        onChange={handleLogoChange}
                        disabled={isUploadingLogo}
                      />
                    </div>
                  </div>

                  {/* Banner Image Upload */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Banner Image</label>
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors cursor-pointer mb-2"
                      onClick={() => document.getElementById('banner-upload').click()}
                    >
                      <div className="flex items-center gap-3">
                        {isUploadingBanner ? (
                          <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                          </div>
                        ) : restaurantSettings.restaurantBanner ? (
                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                            <img 
                              src={getProxiedImageUrl(restaurantSettings.restaurantBanner)} 
                              alt="Restaurant Banner" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Banner image failed to load:', restaurantSettings.restaurantBanner);
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50" y="50" font-family="Arial" font-size="14" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3EBanner%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {isUploadingBanner ? 'Uploading...' : restaurantSettings.restaurantBanner ? 'Banner uploaded' : 'Click or drag to upload your Banner Image'}
                          </p>
                          <p className="text-xs text-gray-500">Supported formats: JPEG, PNG (max 4 MB)</p>
                          {restaurantSettings.restaurantBanner && !isUploadingBanner && (
                            <p className="text-xs text-green-600 mt-1">✓ Image URL saved</p>
                          )}
                        </div>
                        {restaurantSettings.restaurantBanner && !isUploadingBanner && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setRestaurantSettings(prev => ({ ...prev, restaurantBanner: '' }));
                              setBannerFile(null);
                            }}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <input
                        id="banner-upload"
                        type="file"
                        className="hidden"
                        accept=".jpeg,.jpg,.png"
                        onChange={handleBannerChange}
                        disabled={isUploadingBanner}
                      />
                    </div>
                  </div>

                  {/* Restaurant Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Restaurant Name</label>
                    <input
                      type="text"
                      placeholder="Enter your restaurant name"
                      value={restaurantSettings.restaurantName}
                      onChange={(e) => handleSettingsChange('restaurantName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Website URL */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Website URL</label>
                    <input
                      type="url"
                      placeholder="https://yourrestaurant.com"
                      value={restaurantSettings.websiteUrl}
                      onChange={(e) => handleSettingsChange('websiteUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={restaurantSettings.emailAddress}
                      onChange={(e) => handleSettingsChange('emailAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Address */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Address</label>
                    <textarea
                      placeholder="Enter your restaurant address"
                      rows={3}
                      value={restaurantSettings.address}
                      onChange={(e) => handleSettingsChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none"
                    />
                  </div>

                  {/* Contact Number */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Contact Number</label>
                    <input
                      type="tel"
                      placeholder="+1234567890"
                      value={restaurantSettings.contactNumber}
                      onChange={(e) => handleSettingsChange('contactNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Restaurant Timing */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Restaurant Timing</h4>
                    <div className="space-y-3">
                      {restaurantTiming.map((timing, index) => (
                        <div key={timing.day} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-900 w-24">{timing.day}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={timing.status === 'Open'} 
                                onChange={(e) => handleTimingChange(index, 'status', e.target.checked ? 'Open' : 'Closed')}
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                            </label>
                            <span className="text-sm text-gray-600">{timing.status}</span>
                          </div>
                          {timing.status === 'Open' && (
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={timing.openTime}
                                onChange={(e) => handleTimingChange(index, 'openTime', e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                              />
                              <span className="text-gray-500">to</span>
                              <input
                                type="time"
                                value={timing.closeTime}
                                onChange={(e) => handleTimingChange(index, 'closeTime', e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notification Emails */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Notification Emails</h4>
                    <p className="text-xs text-gray-500 mb-4">Enter email addresses to receive important chat updates, alerts, and other service reports.</p>
                    
                    {/* Existing Emails */}
                    {notificationEmails.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {notificationEmails.map((email, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                            <span className="text-sm text-gray-900">{email}</span>
                            <button 
                              onClick={() => handleRemoveEmail(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddEmail();
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                      />
                    </div>

                    <button 
                      onClick={handleAddEmail}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-2 rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Email
                    </button>
                  </div>

                  {/* Save Button */}
                  <div className="mt-8">
                    <button
                      onClick={handleSaveRestaurantSettings}
                      disabled={isSavingSettings || isUploadingLogo || isUploadingBanner}
                      className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isSavingSettings ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        'Save Restaurant Settings'
                      )}
                    </button>
                  </div>
                </>
              )}

              {activeTab === "Delivery" && (
                <>
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Add Delivery Options and Conditions</h3>
                  </div>

                  {/* Basic Delivery Availability */}
                  <div className="mb-8">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Basic Delivery Availability</h4>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 mb-3">Do You Offer Delivery</p>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                              type="radio"
                              name="delivery_offer"
                              value="yes"
                              checked={deliveryOffer === "yes"}
                              onChange={(e) => setDeliveryOffer(e.target.value)}
                              className="w-4 h-4 text-black border-black focus:ring-black focus:ring-2 accent-black"
                            />
                          <span className="text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                              type="radio"
                              name="delivery_offer"
                              value="no"
                              checked={deliveryOffer === "no"}
                              onChange={(e) => setDeliveryOffer(e.target.value)}
                              className="w-4 h-4 text-black border-black focus:ring-black focus:ring-2 accent-black"
                            />
                          <span className="text-sm text-gray-700">No</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Conditional Delivery Form - Show when Yes is selected */}
                  {deliveryOffer === "yes" && (
                    <>
                      {/* Delivery Type */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Delivery Type</h4>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                 type="checkbox"
                                 name="delivery_type_in_house"
                                 checked={deliverySettings.deliveryType?.includes('In-house drivers')}
                                 onChange={() => handleDeliveryTypeToggle('In-house drivers')}
                                 className="w-4 h-4 text-black border-black rounded focus:ring-black focus:ring-2 accent-black"
                               />
                             <span className="text-sm text-gray-700">In-house drivers</span>
                           </label>
                           <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                 type="checkbox"
                                 name="delivery_type_third_party"
                                 checked={deliverySettings.deliveryType?.includes('Third-party services')}
                                 onChange={() => handleDeliveryTypeToggle('Third-party services')}
                                 className="w-4 h-4 text-black border-black rounded focus:ring-black focus:ring-2 accent-black"
                               />
                             <span className="text-sm text-gray-700">Third-party services</span>
                           </label>
                         </div>
                       </div>

                      {/* Delivery Range and Areas */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Delivery Range and Areas</h4>
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-2">Maximum delivery distance</label>
                          <input
                            type="text"
                            placeholder="e.g. 5 miles"
                            value={deliverySettings.deliveryDistance}
                            onChange={(e) => handleDeliverySettingsChange('deliveryDistance', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                          />
                        </div>
                      </div>

                      {/* Category */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Category</h4>
                        <select 
                          value={deliverySettings.category}
                          onChange={(e) => handleDeliverySettingsChange('category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm text-gray-500">
                          <option value="">Set Category</option>
                          <option value="Food & Beverage">Food & Beverage</option>
                          <option value="Retail">Retail</option>
                          <option value="Grocery">Grocery</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Delivery areas */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Delivery areas (e.g. zip codes, neighbourhoods)</h4>
                        <textarea
                          rows={4}
                          placeholder="e.g. 90210, Downtown"
                          value={deliverySettings.deliveryArea}
                          onChange={(e) => handleDeliverySettingsChange('deliveryArea', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none"
                        />
                      </div>

                      {/* Ordering Platforms and Methods */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Ordering Platforms and Methods</h4>
                        <p className="text-sm text-gray-700 mb-3">Which platforms do you use for online orders?</p>
                        
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 text-black border-black rounded focus:ring-black focus:ring-2 accent-black"
                              checked={deliverySettings.orderingPlatforms?.includes('Your own website')}
                              onChange={() => {
                                handlePlatformToggle('Your own website');
                                setOwnWebsiteChecked(!ownWebsiteChecked);
                              }}
                            />
                            <span className="text-sm text-gray-700">Your own website</span>
                          </label>
                          
                          {deliverySettings.orderingPlatforms?.includes('Your own website') && (
                            <div className="ml-6">
                              <input
                                type="url"
                                placeholder="https://yourwebsite.com/order"
                                value={deliverySettings.websiteUrl || ''}
                                onChange={(e) => handleDeliverySettingsChange('websiteUrl', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                              />
                            </div>
                          )}
                          
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={deliverySettings.orderingPlatforms?.includes('Uber Eats')}
                              onChange={() => handlePlatformToggle('Uber Eats')}
                              className="w-4 h-4 text-black border-black rounded focus:ring-black focus:ring-2 accent-black" 
                            />
                            <span className="text-sm text-gray-700">Uber Eats</span>
                          </label>
                          
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={deliverySettings.orderingPlatforms?.includes('DoorDash')}
                              onChange={() => handlePlatformToggle('DoorDash')}
                              className="w-4 h-4 text-black border-black rounded focus:ring-black focus:ring-2 accent-black" 
                            />
                            <span className="text-sm text-gray-700">DoorDash</span>
                          </label>
                          
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={deliverySettings.orderingPlatforms?.includes('CloudWaitress')}
                              onChange={() => handlePlatformToggle('CloudWaitress')}
                              className="w-4 h-4 text-black border-black rounded focus:ring-black focus:ring-2 accent-black" 
                            />
                            <span className="text-sm text-gray-700">CloudWaitress</span>
                          </label>
                          
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={deliverySettings.orderingPlatforms?.includes('Square Online')}
                              onChange={() => handlePlatformToggle('Square Online')}
                              className="w-4 h-4 text-black border-black rounded focus:ring-black focus:ring-2 accent-black" 
                            />
                            <span className="text-sm text-gray-700">Square Online</span>
                          </label>
                          
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={deliverySettings.orderingPlatforms?.includes('Other')}
                              onChange={() => handlePlatformToggle('Other')}
                              className="w-4 h-4 text-black border-black rounded focus:ring-black focus:ring-2 accent-black" 
                            />
                            <span className="text-sm text-gray-700">Other</span>
                          </label>
                        </div>
                        
                        <div className="mt-6">
                          <p className="text-sm text-gray-700 mb-3">What type of orders do you accept online?</p>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name="order_type" 
                                value="Pickup"
                                checked={deliverySettings.typeOfOrders === 'Pickup'}
                                onChange={(e) => handleDeliverySettingsChange('typeOfOrders', e.target.value)}
                                className="w-4 h-4 text-black border-black focus:ring-black focus:ring-2 accent-black" 
                              />
                              <span className="text-sm text-gray-700">Pickup</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name="order_type" 
                                value="Delivery"
                                checked={deliverySettings.typeOfOrders === 'Delivery'}
                                onChange={(e) => handleDeliverySettingsChange('typeOfOrders', e.target.value)}
                                className="w-4 h-4 text-black border-black focus:ring-black focus:ring-2 accent-black" 
                              />
                              <span className="text-sm text-gray-700">Delivery</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name="order_type" 
                                value="Both"
                                checked={deliverySettings.typeOfOrders === 'Both'}
                                onChange={(e) => handleDeliverySettingsChange('typeOfOrders', e.target.value)}
                                className="w-4 h-4 text-black border-black focus:ring-black focus:ring-2 accent-black" 
                              />
                              <span className="text-sm text-gray-700">Both</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Fees and Requirements */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Fees and Requirements</h4>
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-2">Delivery fee (e.g. flat or range)</label>
                          <input
                            type="text"
                            placeholder="e.g. $3.99 or $2-5"
                            value={deliverySettings.deliveryFee}
                            onChange={(e) => handleDeliverySettingsChange('deliveryFee', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-2">Minimum order amount for delivery</label>
                          <input
                            type="text"
                            placeholder="e.g. $15.00"
                            value={deliverySettings.minimumOrderAmount}
                            onChange={(e) => handleDeliverySettingsChange('minimumOrderAmount', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-2">Additional fees or surcharges</label>
                          <textarea
                            rows={4}
                            placeholder="e.g. Fuel surcharge during peak hours"
                            value={deliverySettings.additionalCharges}
                            onChange={(e) => handleDeliverySettingsChange('additionalCharges', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none"
                          />
                        </div>
                      </div>

                      {/* Timing and Availability */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Timing and Availability</h4>
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-2">Delivery hours (e.g. for each day)</label>
                          <textarea
                            rows={4}
                            placeholder="Mon-Fri: 11 AM - 10 PM and Sat-Sun: 12 PM - 9 PM"
                            value={deliverySettings.availability}
                            onChange={(e) => handleDeliverySettingsChange('availability', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-2">Estimated delivery time (e.g. in minutes)</label>
                          <input
                            type="text"
                            placeholder="e.g. 30-45 min"
                            value={deliverySettings.estimateDeliveryTime}
                            onChange={(e) => handleDeliverySettingsChange('estimateDeliveryTime', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                          />
                        </div>
                      </div>

                      {/* Other Details */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Other Details</h4>
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-2">Delivery notes or instructions</label>
                          <textarea
                            rows={3}
                            placeholder="e.g. Contact-free delivery available"
                            value={deliverySettings.deliveryNotes}
                            onChange={(e) => handleDeliverySettingsChange('deliveryNotes', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-2">Contact for delivery inquiries (phone)</label>
                          <input
                            type="tel"
                            placeholder="+1234567890"
                            value={deliverySettings.deliveryInquiriesPhone}
                            onChange={(e) => handleDeliverySettingsChange('deliveryInquiriesPhone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-2">Contact for delivery inquiries (email)</label>
                          <input
                            type="email"
                            placeholder="delivery@restaurant.com"
                            value={deliverySettings.deliveryInquiriesEmail}
                            onChange={(e) => handleDeliverySettingsChange('deliveryInquiriesEmail', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Save Button */}
                  <div className="mt-auto pt-4">
                    <button 
                      onClick={handleSaveDeliverySettings}
                      disabled={isSavingDelivery}
                      className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isSavingDelivery ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        'Save Delivery Settings'
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* Uploaded File Display */}
              {uploadedFile && (
                <div className="mb-6">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                        <p className="text-xs text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Uploaded ✓</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
