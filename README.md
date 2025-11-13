# QR Code Generator API with Logo

API yang powerful dan mudah digunakan untuk generate QR code dengan logo image. Dibuat menggunakan Node.js, Express, dan Sharp untuk manipulasi gambar berkualitas tinggi.

## ✨ Features

- 🎨 Generate QR code dengan custom colors
- 🖼️ Support logo image dari URL
- 🎯 High error correction level untuk reliability
- 🚀 Fast dan efficient processing
- 💾 **Automatic storage & caching untuk LPA activation codes**
- 📦 RESTful API dengan GET method
- 🔧 Fully customizable parameters
- 💫 Rounded logo background yang modern
- 🌐 Works di local dan production
- 📊 Storage statistics & management

## 🚀 Quick Start

### Installation

```bash
# Clone repository (atau init di project baru)
cd qr-gen

# Install dependencies
npm install

# Start development server
npm run dev

# Atau start production server
npm start
```

Server akan berjalan di `http://localhost:3000`

### 💾 Storage System

API ini memiliki **automatic caching** untuk QR code activation codes (LPA):

- **LPA Format**: `LPA:1$SMDP$ACTIVATION_CODE`
- Pertama kali generate: Save ke `storage/activation_code/`
- Request berikutnya: Load dari cache (10-20x lebih cepat!)
- General QR codes: Save ke `storage/general/`

**Contoh:**
```bash
# First request - generates and saves
curl "http://localhost:3000/api/qr/generate?data=LPA:1\$SMDP\$MY_CODE" -o qr1.png

# Second request - loads from cache (much faster!)
curl "http://localhost:3000/api/qr/generate?data=LPA:1\$SMDP\$MY_CODE" -o qr2.png
```

📚 **[Read full Storage documentation →](STORAGE.md)**

## 📖 API Documentation

### Base URL

- **Local**: `http://localhost:3000`
- **Production**: Your deployed URL

### Endpoints

#### 1. Generate QR Code

```
GET /api/qr/generate
```

#### 2. Get Storage Statistics

```
GET /api/qr/stats
```

Returns statistics about stored QR codes.

#### 3. Clean Old QR Codes

```
GET /api/qr/clean?days=7
```

Cleans general QR codes older than specified days.

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `data` | string | ✅ Yes | - | Data yang akan di-encode di QR code (URL, text, dll) |
| `logoUrl` | string | ❌ No | - | URL ke logo image (PNG, JPG, SVG) |
| `color` | string | ❌ No | `#000000` | Warna QR code (hex format) |
| `bgColor` | string | ❌ No | `#FFFFFF` | Warna background (hex format) |
| `size` | integer | ❌ No | `512` | Ukuran QR code dalam pixels (100-2048) |
| `logoSize` | integer | ❌ No | `20` | Ukuran logo dalam percentage (10-40) |
| `logoBgColor` | string | ❌ No | `#FFFFFF` | Warna background logo (hex format) |
| `logoPadding` | integer | ❌ No | `20` | Padding di dalam logo |
| `errorCorrectionLevel` | string | ❌ No | `H` | Level error correction: L, M, Q, H |

### Response

Returns PNG image binary data with appropriate headers:
- `Content-Type: image/png`
- `Content-Disposition: inline; filename="qrcode.png"`
- `Cache-Control: public, max-age=31536000`

## 📝 Usage Examples

### 1. Simple QR Code (No Logo)

```bash
curl "http://localhost:3000/api/qr/generate?data=https://example.com" --output qrcode.png
```

atau di browser:
```
http://localhost:3000/api/qr/generate?data=https://example.com
```

### 2. QR Code with Logo Image

```bash
curl "http://localhost:3000/api/qr/generate?data=https://example.com&logoUrl=https://example.com/logo.png&logoBgColor=%234A90E2" --output qrcode-logo.png
```

atau di browser:
```
http://localhost:3000/api/qr/generate?data=https://example.com&logoUrl=https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png
```

### 3. QR Code with Custom Colors

```bash
# QR code biru dengan background putih dan logo
curl "http://localhost:3000/api/qr/generate?data=Hello+World&color=%234A90E2&bgColor=%23FFFFFF&logoUrl=https://example.com/logo.png&logoBgColor=%23FF5722" --output qrcode-colored.png
```

### 4. Large QR Code with Custom Settings

```bash
curl "http://localhost:3000/api/qr/generate?data=https://yourdomain.com&logoUrl=https://example.com/logo.png&size=1024&logoSize=25&color=%23000000&logoBgColor=%23FFFFFF" --output qrcode-large.png
```

### 5. QR Code with Different Logo Styles

```bash
# With minimal padding
curl "http://localhost:3000/api/qr/generate?data=https://example.com&logoUrl=https://example.com/logo.png&logoPadding=10" --output qr-minimal.png

# With large padding
curl "http://localhost:3000/api/qr/generate?data=https://example.com&logoUrl=https://example.com/logo.png&logoPadding=30" --output qr-padded.png
```

## 🔧 Advanced Usage

### Menggunakan di HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>QR Code Generator</title>
</head>
<body>
    <h1>QR Code Generator</h1>
    
    <!-- Embed QR code as image -->
    <img src="http://localhost:3000/api/qr/generate?data=https://example.com&logoUrl=https://example.com/logo.png" 
         alt="QR Code" 
         width="300">
    
    <!-- Dynamic QR code with JavaScript -->
    <script>
        function generateQR(data, logoUrl) {
            const params = new URLSearchParams({
                data: data,
                logoUrl: logoUrl,
                logoBgColor: '#FFFFFF',
                size: 512
            });
            
            return `http://localhost:3000/api/qr/generate?${params.toString()}`;
        }
        
        // Usage
        const qrUrl = generateQR('https://mywebsite.com', 'https://mywebsite.com/logo.png');
        console.log(qrUrl);
    </script>
</body>
</html>
```

### Menggunakan di JavaScript/Node.js

```javascript
const axios = require('axios');
const fs = require('fs');

async function downloadQRCode() {
    const params = {
        data: 'https://example.com',
        logoUrl: 'https://example.com/logo.png',
        logoBgColor: '#FFFFFF',
        size: 1024
    };
    
    const queryString = new URLSearchParams(params).toString();
    const url = `http://localhost:3000/api/qr/generate?${queryString}`;
    
    const response = await axios.get(url, {
        responseType: 'arraybuffer'
    });
    
    fs.writeFileSync('qrcode.png', response.data);
    console.log('QR Code saved as qrcode.png');
}

downloadQRCode();
```

### Menggunakan di React

```jsx
import React, { useState } from 'react';

function QRCodeGenerator() {
    const [qrData, setQrData] = useState('https://example.com');
    const [logoUrl, setLogoUrl] = useState('https://example.com/logo.png');
    
    const generateQRUrl = () => {
        const params = new URLSearchParams({
            data: qrData,
            logoUrl: logoUrl,
            logoBgColor: '#FFFFFF',
            size: 512
        });
        
        return `http://localhost:3000/api/qr/generate?${params.toString()}`;
    };
    
    return (
        <div>
            <h2>QR Code Generator</h2>
            <input 
                type="text" 
                value={qrData} 
                onChange={(e) => setQrData(e.target.value)}
                placeholder="Enter data"
            />
            <input 
                type="url" 
                value={logoUrl} 
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="Logo URL"
            />
            <img 
                src={generateQRUrl()} 
                alt="QR Code"
                style={{ width: 300, height: 300 }}
            />
        </div>
    );
}

export default QRCodeGenerator;
```

## 🎨 Color Customization

Hex color format harus menggunakan format `#RRGGBB` atau `RRGGBB`. 

**Note**: Di URL, `#` harus di-encode sebagai `%23`

### Contoh Warna

| Color | Hex Code | URL Encoded |
|-------|----------|-------------|
| Black | `#000000` | `%23000000` |
| White | `#FFFFFF` | `%23FFFFFF` |
| Blue | `#4A90E2` | `%234A90E2` |
| Red | `#FF5722` | `%23FF5722` |
| Green | `#4CAF50` | `%234CAF50` |
| Purple | `#9C27B0` | `%239C27B0` |
| Orange | `#FF9800` | `%23FF9800` |

### Contoh dengan Custom Colors

```bash
# Teal QR code dengan orange logo
http://localhost:3000/api/qr/generate?data=Test&color=%2300BCD4&logoText=TEST&logoBgColor=%23FF9800

# Purple QR code dengan green logo
http://localhost:3000/api/qr/generate?data=Test&color=%239C27B0&logoText=HI&logoBgColor=%234CAF50
```

## 🌐 Deployment

### Deploy ke Production

#### 1. Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Buat file `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

#### 2. Heroku

```bash
# Login ke Heroku
heroku login

# Create app
heroku create your-qr-api

# Deploy
git push heroku main
```

Tambahkan `Procfile`:
```
web: node server.js
```

#### 3. Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway login
railway init
railway up
```

#### 4. Docker

Buat `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

Build dan run:
```bash
docker build -t qr-generator-api .
docker run -p 3000:3000 qr-generator-api
```

## 🔍 Error Handling

API mengembalikan error response dalam format JSON:

```json
{
  "status": "error",
  "message": "Error description here"
}
```

### Common Errors

| Status Code | Message | Solution |
|-------------|---------|----------|
| 400 | Parameter "data" is required | Tambahkan parameter `data` |
| 400 | Invalid hex color | Gunakan format hex yang valid (#RRGGBB) |
| 400 | Size must be between 100-2048 | Adjust parameter `size` |
| 500 | Failed to generate QR code | Check server logs |

## 📊 Performance Tips

1. **Caching**: Response memiliki cache header, gunakan CDN untuk better performance
2. **Size**: Gunakan size yang reasonable (512-1024px optimal untuk web)
3. **Logo Size**: Jangan gunakan logo terlalu besar (max 40%) untuk maintain scannability
4. **Error Correction**: Level `H` memberikan best reliability dengan logo

## 🧪 Testing

### Basic Tests

Run basic QR generation tests:

```javascript
const axios = require('axios');
const fs = require('fs');

const tests = [
    {
        name: 'simple-qr',
        params: { data: 'https://example.com' }
    },
    {
        name: 'qr-with-text-logo',
        params: {
            data: 'https://example.com',
            logoText: 'DINGS',
            logoBgColor: '#4A90E2'
        }
    },
    {
        name: 'colored-qr',
        params: {
            data: 'Hello World',
            color: '#FF5722',
            logoText: 'HI',
            logoBgColor: '#4CAF50'
        }
    }
];

async function runTests() {
    for (const test of tests) {
        try {
            const params = new URLSearchParams(test.params);
            const url = `http://localhost:3000/api/qr/generate?${params}`;
            
            const response = await axios.get(url, {
                responseType: 'arraybuffer'
            });
            
            fs.writeFileSync(`${test.name}.png`, response.data);
            console.log(`✅ ${test.name} - Success`);
        } catch (error) {
            console.error(`❌ ${test.name} - Failed:`, error.message);
        }
    }
}

runTests();
```

```bash
npm test
```

### Storage System Tests

Test the storage & caching functionality:

```bash
npm run test:storage
```

This will test:
- LPA activation code generation
- Cache hit/miss scenarios
- General QR code generation
- Storage statistics
- Cleanup functionality

## 📚 Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **QRCode** - QR code generation
- **Sharp** - High-performance image processing
- **Axios** - HTTP client untuk fetch logo dari URL
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for any purpose.

## 🆘 Support

Jika ada pertanyaan atau issue, silakan:
1. Check dokumentasi ini terlebih dahulu
2. Check existing issues di repository
3. Create new issue dengan detail lengkap

## 🎯 Roadmap

- [ ] Add batch QR code generation
- [ ] Support for multiple image formats (JPG, WebP, SVG)
- [ ] QR code analytics tracking
- [ ] Custom patterns and shapes
- [ ] Database storage option
- [ ] Rate limiting
- [ ] Authentication/API keys

---

**Made with ❤️ using Node.js and Sharp**

