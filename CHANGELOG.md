# Changelog - QR Code Generator API

## Version 1.0.0 - Image Logo Implementation

### 🎯 Major Changes

**Logo Implementation Change:**
- **BEFORE**: Logo menggunakan text-based dengan parameter `logoText`
- **AFTER**: Logo menggunakan image dari URL dengan parameter `logoUrl`

### ✨ New Features

1. **Image Logo Support**
   - Load logo dari URL (HTTP/HTTPS)
   - Support PNG, JPG, SVG formats
   - Auto-resize dan optimize logo
   - Rounded background untuk logo
   - Configurable padding

2. **Enhanced Parameters**
   - `logoUrl` - URL ke logo image
   - `logoBgColor` - Warna background logo (default: #FFFFFF)
   - `logoPadding` - Padding di sekitar logo (default: 20px)
   - Removed: `logoText`, `logoTextColor`, `logoTextSize`

### 📝 API Changes

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `data` | string | ✅ Yes | - | Data to encode in QR |
| `logoUrl` | string | ❌ No | - | URL to logo image |
| `color` | string | ❌ No | `#000000` | QR code color |
| `bgColor` | string | ❌ No | `#FFFFFF` | Background color |
| `size` | integer | ❌ No | `512` | QR size (100-2048px) |
| `logoSize` | integer | ❌ No | `20` | Logo size (10-40%) |
| `logoBgColor` | string | ❌ No | `#FFFFFF` | Logo background color |
| `logoPadding` | integer | ❌ No | `20` | Logo padding |
| `errorCorrectionLevel` | string | ❌ No | `H` | Error correction (L/M/Q/H) |

### 📦 Updated Files

#### Core Files
- `server.js` - Updated documentation
- `controllers/qrController.js` - Changed parameters to use logoUrl
- `services/qrService.js` - Removed text logo generation, focus on image logo
- `utils/validators.js` - Added logoUrl validation

#### Documentation
- `README.md` - Updated with logoUrl examples
- `QUICKSTART.md` - Updated quick start guide
- `USAGE_EXAMPLES.md` - New comprehensive usage guide
- `CHANGELOG.md` - This file

#### Examples & Tests
- `test.js` - Updated all tests to use logoUrl
- `examples/integration.js` - Updated all 10 examples
- `examples/simple-usage.html` - Updated interactive demo

#### Deployment
- `package.json` - Added `examples` script
- `Dockerfile` - Ready for production
- `docker-compose.yml` - Easy deployment
- `vercel.json` - Vercel deployment config

### 🔧 Migration Guide

If you were using the old text-based logo:

**OLD:**
```
/api/qr/generate?data=https://example.com&logoText=DINGS&logoTextColor=%23FFFFFF&logoBgColor=%234A90E2
```

**NEW:**
```
/api/qr/generate?data=https://example.com&logoUrl=https://yourserver.com/logo.png&logoBgColor=%234A90E2
```

### 📊 Performance Improvements

- Removed unnecessary text rendering
- Direct image processing with Sharp
- Better logo caching potential
- Optimized padding implementation

### 🐛 Bug Fixes

- Fixed logo positioning calculation
- Improved error handling for invalid URLs
- Better validation for logo parameters

### 🎨 Design Improvements

- Cleaner rounded logo backgrounds
- Better padding control
- Support for transparent logos
- Professional appearance

### 📚 Documentation

- Comprehensive README with examples
- Quick start guide
- Usage examples with 20+ scenarios
- Integration examples in JavaScript
- React and Vue component examples
- HTML demo page

### 🚀 How to Use

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start server:**
   ```bash
   npm run dev  # Development
   npm start    # Production
   ```

3. **Generate QR with logo:**
   ```
   http://localhost:3000/api/qr/generate?data=https://example.com&logoUrl=https://example.com/logo.png
   ```

### 🧪 Testing

- Run tests: `npm test`
- Run examples: `npm run examples`
- Open demo: `open examples/simple-usage.html`

### 📝 Notes

- Logo URL must be publicly accessible
- Recommended logo size: 512x512px or larger
- PNG with transparent background works best
- Maximum logo file size: 5MB
- Use error correction level H (default) for best results

---

**Date:** November 13, 2024  
**Version:** 1.0.0  
**Node Version Required:** >=22.0.0

