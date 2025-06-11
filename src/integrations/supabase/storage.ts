import { supabase } from './client';

export const initializeStorage = async () => {
  try {
    // Check if the bucket exists
    const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('media_uploads');
    
    if (bucketError) {
      if (bucketError.message.includes('does not exist')) {
        // Try to create the bucket
        const { error: createError } = await supabase.storage.createBucket('media_uploads', {
          public: false,
          fileSizeLimit: 52428800 // 50MB in bytes
        });
        
        if (createError) throw createError;
      } else {
        throw bucketError;
      }
    }

    return true;
  } catch (error) {
    console.error('Storage initialization error:', error);
    return false;
  }
};
