/**
 * File utility functions for validation and compression
 */

// File size limits
export const FILE_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_TOTAL_SIZE: 25 * 1024 * 1024, // 25MB
  MAX_IMAGE_WIDTH: 1200, // Max width for image compression
};

// Accepted file types
export const ACCEPTED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png'],
  PDFS: ['application/pdf'],
  ALL: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
};

/**
 * Validate file type
 */
export const isValidFileType = (file) => {
  return ACCEPTED_FILE_TYPES.ALL.includes(file.type);
};

/**
 * Validate file size
 */
export const isValidFileSize = (file) => {
  return file.size <= FILE_LIMITS.MAX_FILE_SIZE;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Compress image file
 */
export const compressImage = (file, maxWidth = FILE_LIMITS.MAX_IMAGE_WIDTH, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    // Only compress image files
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create new file with compressed data
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validate and compress file
 */
export const processFile = async (file) => {
  // Validate file type
  if (!isValidFileType(file)) {
    throw new Error(`Invalid file type. Only JPG, PNG, and PDF files are allowed.`);
  }

  // Validate file size
  if (!isValidFileSize(file)) {
    throw new Error(`File size (${formatFileSize(file.size)}) exceeds the 5MB limit.`);
  }

  // Compress if it's an image
  if (file.type.startsWith('image/')) {
    try {
      return await compressImage(file);
    } catch (error) {
      console.warn('Failed to compress image, using original:', error);
      return file;
    }
  }

  return file;
};

/**
 * Calculate total size of files
 */
export const calculateTotalSize = (files) => {
  return files.reduce((total, file) => total + file.size, 0);
};

/**
 * Validate total file size
 */
export const isValidTotalSize = (files) => {
  const totalSize = calculateTotalSize(files);
  return totalSize <= FILE_LIMITS.MAX_TOTAL_SIZE;
};
