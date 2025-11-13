/**
 * Validate QR code generation parameters
 * @param {Object} params - Parameters to validate
 * @returns {Object} - Validation result
 */
const validateQRParams = (params) => {
  const { data, size, logoSize, errorCorrectionLevel, color, bgColor, logoUrl } = params;

  // Check if data is provided
  if (!data || data.trim() === '') {
    return {
      valid: false,
      error: 'Parameter "data" is required and cannot be empty'
    };
  }

  // Validate size
  if (size) {
    if (isNaN(size) || size < 100 || size > 2048) {
      return {
        valid: false,
        error: 'Parameter "size" must be a number between 100 and 2048'
      };
    }
  }

  // Validate logo size
  if (logoSize) {
    if (isNaN(logoSize) || logoSize < 10 || logoSize > 40) {
      return {
        valid: false,
        error: 'Parameter "logoSize" must be a number between 10 and 40 (percentage)'
      };
    }
  }

  // Validate error correction level
  if (errorCorrectionLevel) {
    const validLevels = ['L', 'M', 'Q', 'H'];
    if (!validLevels.includes(errorCorrectionLevel.toUpperCase())) {
      return {
        valid: false,
        error: 'Parameter "errorCorrectionLevel" must be one of: L, M, Q, H'
      };
    }
  }

  // Validate color format
  if (color && !isValidHexColor(color)) {
    return {
      valid: false,
      error: 'Parameter "color" must be a valid hex color (e.g., #000000 or 000000)'
    };
  }

  // Validate background color format
  if (bgColor && !isValidHexColor(bgColor)) {
    return {
      valid: false,
      error: 'Parameter "bgColor" must be a valid hex color (e.g., #FFFFFF or FFFFFF)'
    };
  }

  // Validate logo URL format
  if (logoUrl) {
    if (!logoUrl.startsWith('http://') && !logoUrl.startsWith('https://')) {
      return {
        valid: false,
        error: 'Parameter "logoUrl" must be a valid HTTP/HTTPS URL'
      };
    }
  }

  return {
    valid: true
  };
};

/**
 * Check if a string is a valid hex color
 * @param {string} color - Color string to validate
 * @returns {boolean} - True if valid
 */
const isValidHexColor = (color) => {
  return /^#?[0-9A-F]{6}$/i.test(color);
};

/**
 * Normalize hex color (add # if missing)
 * @param {string} color - Color string
 * @returns {string} - Normalized color
 */
const normalizeHexColor = (color) => {
  return color.startsWith('#') ? color : `#${color}`;
};

module.exports = {
  validateQRParams,
  isValidHexColor,
  normalizeHexColor
};

