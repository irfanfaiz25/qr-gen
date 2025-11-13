const fs = require('fs').promises;
const path = require('path');

// Storage directories
const STORAGE_DIR = path.join(__dirname, '../storage');
const ACTIVATION_CODE_DIR = path.join(STORAGE_DIR, 'activation_code');
const GENERAL_DIR = path.join(STORAGE_DIR, 'general');

/**
 * Parse LPA data and extract activation code
 * Format: LPA:1$SMDP$ACTIVATION_CODE
 * @param {string} data - QR data string
 * @returns {Object|null} - { isLPA: boolean, activationCode: string|null }
 */
const parseLPAData = (data) => {
  if (!data || typeof data !== 'string') {
    return { isLPA: false, activationCode: null };
  }

  // Check if data contains LPA
  if (data.toUpperCase().includes('LPA')) {
    // Extract activation code from format: LPA:1$SMDP$ACTIVATION_CODE
    const parts = data.split('$');
    
    if (parts.length >= 3) {
      // The activation code is the last part after the last $
      const activationCode = parts[parts.length - 1].trim();
      
      if (activationCode) {
        // Clean activation code: remove special characters for filename
        const cleanCode = activationCode.replace(/[^a-zA-Z0-9_-]/g, '_');
        return { isLPA: true, activationCode: cleanCode };
      }
    }
  }

  return { isLPA: false, activationCode: null };
};

/**
 * Generate filename for QR code storage
 * @param {boolean} isLPA - Whether this is LPA data
 * @param {string|null} activationCode - Activation code if LPA
 * @returns {Object} - { filename, directory }
 */
const generateFilename = (isLPA, activationCode) => {
  if (isLPA && activationCode) {
    return {
      filename: `${activationCode}.png`,
      directory: ACTIVATION_CODE_DIR
    };
  }
  
  // For general QR codes, use timestamp
  const timestamp = Date.now();
  return {
    filename: `qr_${timestamp}.png`,
    directory: GENERAL_DIR
  };
};

/**
 * Check if QR code already exists in storage
 * @param {string} data - QR data to check
 * @returns {Promise<Object>} - { exists: boolean, filepath: string|null }
 */
const checkQRExists = async (data) => {
  try {
    const { isLPA, activationCode } = parseLPAData(data);
    
    // Only check for LPA codes, general codes are always generated new
    if (isLPA && activationCode) {
      const filepath = path.join(ACTIVATION_CODE_DIR, `${activationCode}.png`);
      
      try {
        await fs.access(filepath);
        return { exists: true, filepath, activationCode };
      } catch (error) {
        return { exists: false, filepath: null, activationCode };
      }
    }
    
    return { exists: false, filepath: null, activationCode: null };
  } catch (error) {
    console.error('Error checking QR existence:', error);
    return { exists: false, filepath: null, activationCode: null };
  }
};

/**
 * Save QR code to storage
 * @param {Buffer} qrBuffer - QR code image buffer
 * @param {string} data - Original data used to generate QR
 * @returns {Promise<Object>} - { success: boolean, filepath: string, filename: string }
 */
const saveQRToStorage = async (qrBuffer, data) => {
  try {
    // Ensure storage directories exist
    await fs.mkdir(ACTIVATION_CODE_DIR, { recursive: true });
    await fs.mkdir(GENERAL_DIR, { recursive: true });

    const { isLPA, activationCode } = parseLPAData(data);
    const { filename, directory } = generateFilename(isLPA, activationCode);
    
    const filepath = path.join(directory, filename);
    
    // Save the QR code
    await fs.writeFile(filepath, qrBuffer);
    
    console.log(`✅ QR code saved: ${filepath}`);
    
    return {
      success: true,
      filepath,
      filename,
      isLPA,
      activationCode
    };
  } catch (error) {
    console.error('Error saving QR code:', error);
    throw new Error(`Failed to save QR code: ${error.message}`);
  }
};

/**
 * Get QR code from storage
 * @param {string} filepath - Path to QR code file
 * @returns {Promise<Buffer>} - QR code buffer
 */
const getQRFromStorage = async (filepath) => {
  try {
    const buffer = await fs.readFile(filepath);
    console.log(`✅ QR code retrieved from storage: ${filepath}`);
    return buffer;
  } catch (error) {
    console.error('Error reading QR from storage:', error);
    throw new Error(`Failed to read QR code: ${error.message}`);
  }
};

/**
 * Get relative URL for QR code
 * @param {string} filepath - Full filepath
 * @returns {string} - Relative URL path
 */
const getQRUrl = (filepath) => {
  const relativePath = path.relative(path.join(__dirname, '..'), filepath);
  return `/${relativePath.replace(/\\/g, '/')}`;
};

/**
 * Clean old general QR codes (optional, for maintenance)
 * @param {number} maxAgeMs - Maximum age in milliseconds
 * @returns {Promise<number>} - Number of files deleted
 */
const cleanOldGeneralQRs = async (maxAgeMs = 7 * 24 * 60 * 60 * 1000) => {
  try {
    const files = await fs.readdir(GENERAL_DIR);
    const now = Date.now();
    let deletedCount = 0;
    
    for (const file of files) {
      if (file.startsWith('qr_') && file.endsWith('.png')) {
        const filepath = path.join(GENERAL_DIR, file);
        const stats = await fs.stat(filepath);
        const age = now - stats.mtimeMs;
        
        if (age > maxAgeMs) {
          await fs.unlink(filepath);
          deletedCount++;
          console.log(`🗑️  Deleted old QR: ${file}`);
        }
      }
    }
    
    return deletedCount;
  } catch (error) {
    console.error('Error cleaning old QRs:', error);
    return 0;
  }
};

/**
 * Get statistics about stored QR codes
 * @returns {Promise<Object>} - Statistics object
 */
const getStorageStats = async () => {
  try {
    const activationFiles = await fs.readdir(ACTIVATION_CODE_DIR);
    const generalFiles = await fs.readdir(GENERAL_DIR);
    
    const activationCount = activationFiles.filter(f => f.endsWith('.png')).length;
    const generalCount = generalFiles.filter(f => f.endsWith('.png')).length;
    
    return {
      activationCodes: activationCount,
      general: generalCount,
      total: activationCount + generalCount
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return { activationCodes: 0, general: 0, total: 0 };
  }
};

module.exports = {
  parseLPAData,
  generateFilename,
  checkQRExists,
  saveQRToStorage,
  getQRFromStorage,
  getQRUrl,
  cleanOldGeneralQRs,
  getStorageStats
};

