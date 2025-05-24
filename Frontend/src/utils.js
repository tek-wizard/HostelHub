// Utility functions for HostelHub
// Just some helper functions I needed while building this

// Format phone number for display
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{5})(\d{5})/, '$1 $2');
  }
  
  return phone;
};

// Validate phone number (Indian format)
export const isValidPhoneNumber = (phone) => {
  if (!phone) return false;
  
  const cleaned = phone.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
};

// Format duration in minutes to readable string
export const formatDuration = (minutes) => {
  if (!minutes) return '0 minutes';
  
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  
  if (remainingMins === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours}h ${remainingMins}m`;
};

// Calculate time remaining from start time and duration
export const getTimeRemaining = (startTime, durationMinutes) => {
  if (!startTime || !durationMinutes) return null;
  
  try {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + (durationMinutes * 60 * 1000));
    const now = new Date();
    
    const remainingMs = end.getTime() - now.getTime();
    
    if (remainingMs <= 0) {
      return { isExpired: true, remaining: 0, message: 'Time up!' };
    }
    
    const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
    
    return {
      isExpired: false,
      remaining: remainingMinutes,
      message: formatDuration(remainingMinutes) + ' left'
    };
  } catch (error) {
    console.error('Error calculating time remaining:', error);
    return { isExpired: true, remaining: 0, message: 'Time error' };
  }
};

// Simple debounce function for search inputs etc
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Copy text to clipboard (with fallback)
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

// Check if device is mobile
export const isMobile = () => {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Generate a simple unique ID (not cryptographically secure)
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Format date/time for display
export const formatDateTime = (date) => {
  try {
    return new Date(date).toLocaleString();
  } catch {
    return 'Invalid date';
  }
};

// Simple localStorage wrapper with error handling
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
      return false;
    }
  }
}; 