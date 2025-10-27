import FAQ from '@/models/FAQ';
import connectDB from '@/lib/mongodb';

/**
 * Creates default FAQ entries for a new user
 * @param {string} userId - The user's MongoDB ObjectId
 * @param {string} brandId - The brand ID (defaults to 'brand_123')
 * @returns {Promise<Array>} Array of created FAQ documents
 */
export async function createDefaultFAQs(userId, brandId = 'brand_123') {
  try {
    // Ensure database connection
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');
    
    const currentDate = new Date().toISOString();
    console.log('Creating default FAQs with:', { userId, brandId, currentDate });
    
    const defaultFAQs = [
      {
        userId,
        brandId,
        uploadType: 'url',
        filename: 'Faq Default',
        date: currentDate,
        data: { source: 'https://example.com/faq' }
      },
      {
        userId,
        brandId,
        uploadType: 'url',
        filename: 'restuarant setting',
        date: currentDate,
        data: { source: 'https://example.com/faq' }
      },
      {
        userId,
        brandId,
        uploadType: 'url',
        filename: 'delivery',
        date: currentDate,
        data: { source: 'https://example.com/faq' }
      }
    ];

    // Create all FAQ entries at once
    console.log('Attempting to insert FAQs...');
    const createdFAQs = await FAQ.insertMany(defaultFAQs);
    console.log(`Created ${createdFAQs.length} default FAQs for user ${userId}, brand ${brandId}`);
    console.log('Created FAQs:', createdFAQs.map(faq => faq._id));
    return createdFAQs;
  } catch (error) {
    console.error('Error creating default FAQs:', error);
    throw error;
  }
}