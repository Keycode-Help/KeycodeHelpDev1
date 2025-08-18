// Utility to handle message channel errors and async operations
export class MessageChannelErrorHandler {
  static isMessageChannelError(error) {
    return error && 
           typeof error.message === 'string' && 
           error.message.includes('message channel closed');
  }

  static handleAsyncError(error, context = 'Unknown operation') {
    if (this.isMessageChannelError(error)) {
      // Log as warning since this is usually harmless
      console.warn(`Message channel error in ${context}:`, error.message);
      console.warn('This error is usually caused by browser extensions and can be safely ignored');
      return false; // Indicate this was handled
    }
    
    // Log other errors normally
    console.error(`Error in ${context}:`, error);
    return true; // Indicate this was not handled
  }

  static wrapAsyncOperation(operation, context = 'Unknown operation') {
    return async (...args) => {
      try {
        return await operation(...args);
      } catch (error) {
        this.handleAsyncError(error, context);
        throw error; // Re-throw for other error handlers
      }
    };
  }
}

// Global error handler for unhandled promise rejections
export const setupGlobalErrorHandling = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      
      if (MessageChannelErrorHandler.isMessageChannelError(error)) {
        // Prevent the error from showing in console
        event.preventDefault();
        console.warn('Suppressed message channel error from unhandled promise rejection');
      }
    });
  }
};

// Utility to safely execute async operations
export const safeAsync = async (operation, fallback = null, context = 'Unknown operation') => {
  try {
    return await operation();
  } catch (error) {
    if (MessageChannelErrorHandler.isMessageChannelError(error)) {
      console.warn(`Message channel error in ${context}, using fallback`);
      return fallback;
    }
    throw error;
  }
};
