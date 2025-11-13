/**
 * QR Code Generator API - Integration Examples
 * 
 * This file contains various integration examples for using the QR Code Generator API
 * with logo images from URLs.
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, 'generated-qr');

// Sample logo URLs
const LOGOS = {
  github: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  nodejs: 'https://nodejs.org/static/images/logo.svg',
  react: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png',
  vue: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/vue/vue.png',
  python: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/python/python.png'
};

/**
 * Example 1: Simple QR Code (No Logo)
 */
async function example1_SimpleQR() {
    console.log('\n📝 Example 1: Simple QR Code (No Logo)');
    
    const params = new URLSearchParams({
        data: 'https://example.com'
    });
    
    const url = `${API_BASE_URL}/api/qr/generate?${params}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    
    await saveQR('example1-simple.png', response.data);
    console.log('✅ Simple QR code generated');
}

/**
 * Example 2: QR Code with GitHub Logo
 */
async function example2_GitHubLogo() {
    console.log('\n📝 Example 2: QR Code with GitHub Logo');
    
    const params = new URLSearchParams({
        data: 'https://github.com',
        logoUrl: LOGOS.github,
        logoBgColor: '#FFFFFF',
        size: 600
    });
    
    const url = `${API_BASE_URL}/api/qr/generate?${params}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    
    await saveQR('example2-github-logo.png', response.data);
    console.log('✅ QR code with GitHub logo generated');
}

/**
 * Example 3: Colored QR Code with Logo
 */
async function example3_ColoredQR() {
    console.log('\n📝 Example 3: Colored QR Code with Logo');
    
    const params = new URLSearchParams({
        data: 'https://nodejs.org',
        logoUrl: LOGOS.nodejs,
        color: '#339933',
        bgColor: '#FFFFFF',
        logoBgColor: '#FFFFFF',
        size: 512
    });
    
    const url = `${API_BASE_URL}/api/qr/generate?${params}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    
    await saveQR('example3-colored.png', response.data);
    console.log('✅ Colored QR code generated');
}

/**
 * Example 4: Batch QR Code Generation
 */
async function example4_BatchGeneration() {
    console.log('\n📝 Example 4: Batch QR Code Generation');
    
    const items = [
        { id: 'product-001', url: 'https://shop.com/product/001', logo: LOGOS.github },
        { id: 'product-002', url: 'https://shop.com/product/002', logo: LOGOS.react },
        { id: 'product-003', url: 'https://shop.com/product/003', logo: LOGOS.vue }
    ];
    
    for (const item of items) {
        const params = new URLSearchParams({
            data: item.url,
            logoUrl: item.logo,
            logoBgColor: '#FFFFFF',
            size: 400
        });
        
        const url = `${API_BASE_URL}/api/qr/generate?${params}`;
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        
        await saveQR(`batch-${item.id}.png`, response.data);
        console.log(`  ✅ Generated QR for ${item.id}`);
    }
}

/**
 * Example 5: Dynamic QR with Different Styles
 */
async function example5_DifferentStyles() {
    console.log('\n📝 Example 5: QR Codes with Different Logo Styles');
    
    const styles = [
        { name: 'minimal-padding', logoPadding: 10, logoBgColor: '#FFFFFF' },
        { name: 'medium-padding', logoPadding: 20, logoBgColor: '#F0F0F0' },
        { name: 'large-padding', logoPadding: 30, logoBgColor: '#E0E0E0' }
    ];
    
    for (const style of styles) {
        const params = new URLSearchParams({
            data: 'https://example.com/style-test',
            logoUrl: LOGOS.react,
            logoPadding: style.logoPadding,
            logoBgColor: style.logoBgColor,
            size: 500
        });
        
        const url = `${API_BASE_URL}/api/qr/generate?${params}`;
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        
        await saveQR(`style-${style.name}.png`, response.data);
        console.log(`  ✅ Generated ${style.name}`);
    }
}

/**
 * Example 6: QR Code for Business Card (vCard)
 */
async function example6_BusinessCard() {
    console.log('\n📝 Example 6: Business Card QR (vCard)');
    
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:John Doe
ORG:Example Corp
TITLE:Software Engineer
TEL:+1234567890
EMAIL:john@example.com
URL:https://johndoe.com
END:VCARD`;
    
    const params = new URLSearchParams({
        data: vcard,
        logoUrl: LOGOS.github,
        logoBgColor: '#009688',
        size: 600
    });
    
    const url = `${API_BASE_URL}/api/qr/generate?${params}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    
    await saveQR('example6-business-card.png', response.data);
    console.log('✅ Business card QR generated');
}

/**
 * Example 7: WiFi QR Code
 */
async function example7_WiFiQR() {
    console.log('\n📝 Example 7: WiFi QR Code');
    
    const wifiConfig = `WIFI:T:WPA;S:MyNetworkName;P:MyPassword123;H:false;;`;
    
    const params = new URLSearchParams({
        data: wifiConfig,
        logoUrl: LOGOS.nodejs,
        logoBgColor: '#FF9800',
        size: 512
    });
    
    const url = `${API_BASE_URL}/api/qr/generate?${params}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    
    await saveQR('example7-wifi.png', response.data);
    console.log('✅ WiFi QR code generated');
}

/**
 * Example 8: Event Ticket QR Code
 */
async function example8_EventTicket() {
    console.log('\n📝 Example 8: Event Ticket QR Code');
    
    const ticketData = {
        eventId: 'EVT-2024-001',
        eventName: 'Tech Conference 2024',
        attendeeName: 'Jane Smith',
        ticketNumber: 'TKT-123456',
        seatNumber: 'A-15',
        validUntil: '2024-12-31'
    };
    
    const params = new URLSearchParams({
        data: JSON.stringify(ticketData),
        logoUrl: LOGOS.python,
        logoBgColor: '#E91E63',
        size: 700,
        logoSize: 25
    });
    
    const url = `${API_BASE_URL}/api/qr/generate?${params}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    
    await saveQR('example8-ticket.png', response.data);
    console.log('✅ Event ticket QR generated');
}

/**
 * Example 9: Multiple QR Codes with Color Themes
 */
async function example9_ColorThemes() {
    console.log('\n📝 Example 9: QR Codes with Different Color Themes');
    
    const themes = [
        { name: 'classic', color: '#000000', bgColor: '#FFFFFF', logoBg: '#000000' },
        { name: 'blue-theme', color: '#1976D2', bgColor: '#E3F2FD', logoBg: '#1976D2' },
        { name: 'green-theme', color: '#4CAF50', bgColor: '#E8F5E9', logoBg: '#4CAF50' },
        { name: 'purple-theme', color: '#9C27B0', bgColor: '#F3E5F5', logoBg: '#9C27B0' }
    ];
    
    for (const theme of themes) {
        const params = new URLSearchParams({
            data: 'https://example.com/theme-test',
            logoUrl: LOGOS.vue,
            color: theme.color,
            bgColor: theme.bgColor,
            logoBgColor: theme.logoBg,
            size: 500
        });
        
        const url = `${API_BASE_URL}/api/qr/generate?${params}`;
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        
        await saveQR(`theme-${theme.name}.png`, response.data);
        console.log(`  ✅ Generated ${theme.name}`);
    }
}

/**
 * Example 10: QR Code with Error Handling
 */
async function example10_ErrorHandling() {
    console.log('\n📝 Example 10: QR Code with Error Handling');
    
    try {
        // Valid request
        const validParams = new URLSearchParams({
            data: 'https://example.com',
            logoUrl: LOGOS.github
        });
        
        const validUrl = `${API_BASE_URL}/api/qr/generate?${validParams}`;
        await axios.get(validUrl, { responseType: 'arraybuffer' });
        console.log('  ✅ Valid request succeeded');
        
        // Invalid request (missing data)
        try {
            const invalidUrl = `${API_BASE_URL}/api/qr/generate`;
            await axios.get(invalidUrl);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('  ✅ Invalid request properly rejected (400)');
            }
        }
        
        // Invalid logoUrl (not HTTP)
        try {
            const invalidLogoParams = new URLSearchParams({
                data: 'test',
                logoUrl: 'ftp://invalid.com/logo.png'
            });
            const invalidLogoUrl = `${API_BASE_URL}/api/qr/generate?${invalidLogoParams}`;
            await axios.get(invalidLogoUrl);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('  ✅ Invalid logoUrl properly rejected (400)');
            }
        }
        
    } catch (error) {
        console.error('  ❌ Error handling test failed:', error.message);
    }
}

/**
 * Helper function to save QR code
 */
async function saveQR(filename, buffer) {
    try {
        // Create output directory if it doesn't exist
        await fs.mkdir(OUTPUT_DIR, { recursive: true });
        
        const filepath = path.join(OUTPUT_DIR, filename);
        await fs.writeFile(filepath, buffer);
        console.log(`  💾 Saved to: ${filepath}`);
    } catch (error) {
        console.error(`  ❌ Error saving file: ${error.message}`);
    }
}

/**
 * Main function to run all examples
 */
async function runAllExamples() {
    console.log('🚀 QR Code Generator API - Integration Examples\n');
    console.log('='.repeat(60));
    
    try {
        // Check if server is running
        await axios.get(`${API_BASE_URL}/health`);
        console.log('✅ Server is running\n');
        
        // Run examples
        await example1_SimpleQR();
        await example2_GitHubLogo();
        await example3_ColoredQR();
        await example4_BatchGeneration();
        await example5_DifferentStyles();
        await example6_BusinessCard();
        await example7_WiFiQR();
        await example8_EventTicket();
        await example9_ColorThemes();
        await example10_ErrorHandling();
        
        console.log('\n' + '='.repeat(60));
        console.log('✨ All examples completed successfully!');
        console.log(`📁 Check output directory: ${OUTPUT_DIR}`);
        
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('\n❌ Cannot connect to server!');
            console.error('Please make sure the server is running:');
            console.error('  npm start  (or)  npm run dev\n');
        } else {
            console.error('\n❌ Error:', error.message);
        }
        process.exit(1);
    }
}

// Run examples if this file is executed directly
if (require.main === module) {
    runAllExamples().catch(console.error);
}

// Export functions for use in other modules
module.exports = {
    example1_SimpleQR,
    example2_GitHubLogo,
    example3_ColoredQR,
    example4_BatchGeneration,
    example5_DifferentStyles,
    example6_BusinessCard,
    example7_WiFiQR,
    example8_EventTicket,
    example9_ColorThemes,
    example10_ErrorHandling
};
