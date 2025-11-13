const QRCode = require('qrcode');
const sharp = require('sharp');
const axios = require('axios');

/**
 * Generate QR Code with optional logo overlay
 * @param {Object} params - QR code generation parameters
 * @returns {Promise<Buffer>} - PNG image buffer
 */
const generateQRCode = async (params) => {
  const {
    data,
    logoUrl,
    color,
    bgColor,
    size,
    logoSize,
    errorCorrectionLevel,
    logoBgColor,
    logoPadding
  } = params;

  try {
    // Generate base QR code
    const qrOptions = {
      errorCorrectionLevel: errorCorrectionLevel || 'H',
      type: 'png',
      quality: 1,
      margin: 1,
      width: size,
      color: {
        dark: color,
        light: bgColor
      }
    };

    // Generate QR code as buffer
    const qrBuffer = await QRCode.toBuffer(data, qrOptions);

    // If no logo URL provided, return plain QR code
    if (!logoUrl) {
      return qrBuffer;
    }

    // Calculate logo dimensions
    const logoSizePercent = Math.min(logoSize, 40) / 100;
    const logoPixelSize = Math.floor(size * logoSizePercent);

    // Load and resize logo from URL
    const logoBuffer = await loadAndResizeLogo(logoUrl, logoPixelSize, logoPadding);

    // Create a rounded rectangle background for the logo
    const logoWithBg = await createLogoWithBackground(logoBuffer, logoPixelSize, logoBgColor);

    // Calculate position to center the logo
    const position = Math.floor((size - logoPixelSize) / 2);

    // Composite logo onto QR code
    const finalImage = await sharp(qrBuffer)
      .composite([{
        input: logoWithBg,
        top: position,
        left: position
      }])
      .png()
      .toBuffer();

    return finalImage;
  } catch (error) {
    console.error('Error in generateQRCode:', error);
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
};

/**
 * Load logo from URL and resize it
 * @param {string} logoUrl - URL to logo image
 * @param {number} targetSize - Target size for the logo
 * @param {number} padding - Padding around the logo
 * @returns {Promise<Buffer>} - Resized logo buffer
 */
const loadAndResizeLogo = async (logoUrl, targetSize, padding) => {
  try {
    let logoBuffer;

    // Check if it's a URL
    if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
      const response = await axios.get(logoUrl, {
        responseType: 'arraybuffer',
        timeout: 10000,
        maxContentLength: 5 * 1024 * 1024, // 5MB max
        headers: {
          'User-Agent': 'QR-Generator-API/1.0'
        }
      });
      logoBuffer = Buffer.from(response.data);
    } else {
      throw new Error('logoUrl must be a valid HTTP/HTTPS URL');
    }

    // Calculate actual logo size with padding
    const actualLogoSize = targetSize - (padding * 2);

    // Resize and process logo with padding
    return await sharp(logoBuffer)
      .resize(actualLogoSize, actualLogoSize, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toBuffer();
  } catch (error) {
    throw new Error(`Failed to load logo from URL: ${error.message}`);
  }
};

/**
 * Create logo with rounded background
 * @param {Buffer} logoBuffer - Logo image buffer
 * @param {number} size - Size of the background
 * @param {string} bgColor - Background color
 * @returns {Promise<Buffer>} - Logo with background buffer
 */
const createLogoWithBackground = async (logoBuffer, size, bgColor) => {
  try {
    // Parse background color
    const colorMatch = bgColor.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    const rgb = colorMatch ? {
      r: parseInt(colorMatch[1], 16),
      g: parseInt(colorMatch[2], 16),
      b: parseInt(colorMatch[3], 16)
    } : { r: 74, g: 144, b: 226 }; // Default blue

    // Create rounded rectangle background
    const roundedRect = Buffer.from(`
      <svg width="${size}" height="${size}">
        <rect width="${size}" height="${size}" fill="rgb(${rgb.r},${rgb.g},${rgb.b})" rx="15" ry="15"/>
      </svg>
    `);

    // Composite logo on background
    return await sharp(roundedRect)
      .composite([{
        input: logoBuffer,
        gravity: 'center'
      }])
      .png()
      .toBuffer();
  } catch (error) {
    throw new Error(`Failed to create logo background: ${error.message}`);
  }
};

module.exports = {
  generateQRCode
};

