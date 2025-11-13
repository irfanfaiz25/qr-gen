const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const qrController = require('./controllers/qrController');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from storage directory
app.use('/storage', express.static(path.join(__dirname, 'storage')));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'QR Code Generator API is running',
    version: '1.0.0',
    endpoints: {
      generate: '/api/qr/generate',
      stats: '/api/qr/stats',
      clean: '/api/qr/clean',
      health: '/health'
    },
    documentation: {
      method: 'GET',
      parameters: {
        data: 'Required - Data to encode in QR code (URL, text, etc)',
        logoUrl: 'Optional - URL to logo image (PNG, JPG, SVG)',
        color: 'Optional - QR code color (hex format, default: #000000)',
        bgColor: 'Optional - Background color (hex format, default: #FFFFFF)',
        size: 'Optional - QR code size in pixels (default: 512, max: 2048)',
        logoSize: 'Optional - Logo size percentage (default: 20, max: 40)',
        logoBgColor: 'Optional - Logo background color (default: #FFFFFF)',
        logoPadding: 'Optional - Padding around logo (default: 20)',
        errorCorrectionLevel: 'Optional - L, M, Q, H (default: H)'
      },
      example: `/api/qr/generate?data=https://example.com&logoUrl=https://example.com/logo.png`
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// QR Code endpoints
app.get('/api/qr/generate', qrController.generateQR);
app.get('/api/qr/stats', qrController.getStorageStats);
app.get('/api/qr/clean', qrController.cleanOldQRs);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 QR Code Generator API is running on port ${PORT}`);
  console.log(`📝 Documentation available at http://localhost:${PORT}`);
  console.log(`🔗 Generate QR: http://localhost:${PORT}/api/qr/generate?data=yourdata`);
});

module.exports = app;

