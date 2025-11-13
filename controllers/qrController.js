const qrService = require('../services/qrService');
const { validateQRParams } = require('../utils/validators');
const storageHelper = require('../utils/storageHelper');
const path = require('path');

/**
 * QR Code Generation Controller
 */
const generateQR = async (req, res, next) => {
  try {
    // Extract and validate parameters
    const params = {
      data: req.query.data,
      logoUrl: req.query.logoUrl,
      color: req.query.color || '#000000',
      bgColor: req.query.bgColor || '#FFFFFF',
      size: parseInt(req.query.size) || 512,
      logoSize: parseInt(req.query.logoSize) || 20,
      errorCorrectionLevel: req.query.errorCorrectionLevel || 'H',
      logoBgColor: req.query.logoBgColor || '#FFFFFF',
      logoPadding: parseInt(req.query.logoPadding) || 20
    };

    // Validate parameters
    const validation = validateQRParams(params);
    if (!validation.valid) {
      return res.status(400).json({
        status: 'error',
        message: validation.error
      });
    }

    // Check if QR code already exists in storage (for LPA codes)
    const existingQR = await storageHelper.checkQRExists(params.data);
    
    let qrBuffer;
    let fromCache = false;
    let savedInfo = null;

    if (existingQR.exists) {
      // QR code already exists, load from storage
      console.log(`📦 Loading QR from cache: ${existingQR.activationCode}`);
      qrBuffer = await storageHelper.getQRFromStorage(existingQR.filepath);
      fromCache = true;
    } else {
      // Generate new QR code
      console.log('🔨 Generating new QR code...');
      qrBuffer = await qrService.generateQRCode(params);
      
      // Save to storage
      savedInfo = await storageHelper.saveQRToStorage(qrBuffer, params.data);
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'inline; filename="qrcode.png"');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('X-QR-From-Cache', fromCache ? 'true' : 'false');
    
    if (savedInfo) {
      res.setHeader('X-QR-Activation-Code', savedInfo.activationCode || 'general');
      res.setHeader('X-QR-Filename', savedInfo.filename);
    }
    
    // Send the image buffer
    res.send(qrBuffer);
  } catch (error) {
    console.error('Error generating QR code:', error);
    next(error);
  }
};

/**
 * Get storage statistics
 */
const getStorageStats = async (req, res, next) => {
  try {
    const stats = await storageHelper.getStorageStats();
    
    res.json({
      status: 'success',
      data: {
        storage: stats,
        message: 'Storage statistics retrieved successfully'
      }
    });
  } catch (error) {
    console.error('Error getting storage stats:', error);
    next(error);
  }
};

/**
 * Clean old general QR codes
 */
const cleanOldQRs = async (req, res, next) => {
  try {
    const maxAgeDays = parseInt(req.query.days) || 7;
    const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
    
    const deletedCount = await storageHelper.cleanOldGeneralQRs(maxAgeMs);
    
    res.json({
      status: 'success',
      data: {
        deletedCount,
        maxAgeDays,
        message: `Cleaned ${deletedCount} old QR codes`
      }
    });
  } catch (error) {
    console.error('Error cleaning old QRs:', error);
    next(error);
  }
};

module.exports = {
  generateQR,
  getStorageStats,
  cleanOldQRs
};

