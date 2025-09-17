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
  IMAGES: ["image/jpeg", "image/jpg", "image/png"],
  PDFS: ["application/pdf"],
  ALL: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
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
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Compress image file
 */
export const compressImage = (
  file,
  maxWidth = FILE_LIMITS.MAX_IMAGE_WIDTH,
  quality = 0.8
) => {
  return new Promise((resolve, reject) => {
    // Only compress image files
    if (!file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
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
            reject(new Error("Failed to compress image"));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validate and compress file
 */
export const processFile = async (file) => {
  // Validate file type
  if (!isValidFileType(file)) {
    throw new Error(
      `Invalid file type. Only JPG, PNG, and PDF files are allowed.`
    );
  }

  // Validate file size
  if (!isValidFileSize(file)) {
    throw new Error(
      `File size (${formatFileSize(file.size)}) exceeds the 5MB limit.`
    );
  }

  // Compress if it's an image
  if (file.type.startsWith("image/")) {
    try {
      return await compressImage(file);
    } catch (error) {
      console.warn("Failed to compress image, using original:", error);
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

/**
 * Convert base64 string to blob URL for large images
 * This prevents "Request Header Fields Too Large" errors for large base64 images
 */
export const base64ToBlobUrl = (base64String, mimeType = "image/jpeg") => {
  if (!base64String) {
    return null;
  }

  try {
    // Check if it's already a data URL
    if (base64String.startsWith("data:")) {
      // Extract the base64 part and mime type
      const matches = base64String.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        mimeType = matches[1];
        base64String = matches[2];
      } else {
        throw new Error("Invalid data URL format");
      }
    }

    // Decode base64 string
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error converting base64 to blob URL:", error);
    return null;
  }
};

/**
 * Get optimized image URL for display
 * Uses blob URL for large base64 images to prevent URL length issues
 */
export const getOptimizedImageUrl = (imageData, maxBase64Length = 100000) => {
  if (!imageData) {
    return null;
  }

  // If it's already a regular URL (not base64), return as is
  if (imageData.startsWith("http")) {
    return imageData;
  }

  // Check if it's a relative path (not base64)
  if (
    imageData.startsWith("/") &&
    !imageData.startsWith("/9j/") &&
    !imageData.startsWith("/iVBORw0KGgo") &&
    !imageData.startsWith("/R0lGOD")
  ) {
    return imageData;
  }

  // Handle different base64 formats
  let base64String = imageData;
  let mimeType = "image/jpeg"; // Default to JPEG

  // Check if it's already a data URL
  if (imageData.startsWith("data:")) {
    const matches = imageData.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      mimeType = matches[1];
      base64String = matches[2];
    } else {
      // Invalid data URL format, treat as raw base64
      base64String = imageData;
    }
  } else {
    // Raw base64 string - determine mime type from base64 header
    if (imageData.startsWith("/9j/")) {
      mimeType = "image/jpeg";
    } else if (imageData.startsWith("iVBORw0KGgo")) {
      mimeType = "image/png";
    } else if (imageData.startsWith("R0lGOD")) {
      mimeType = "image/gif";
    }
  }

  // For large base64 strings, convert to blob URL
  if (base64String.length > maxBase64Length) {
    return base64ToBlobUrl(base64String, mimeType);
  } else {
    // For smaller base64 strings, create data URL
    return `data:${mimeType};base64,${base64String}`;
  }
};

/**
 * Clean up blob URLs to prevent memory leaks
 */
export const revokeBlobUrl = (url) => {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};
