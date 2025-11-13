const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Base URL for the API
const BASE_URL = 'http://localhost:3000';

// Create output directory if it doesn't exist
const OUTPUT_DIR = path.join(__dirname, 'test-output');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Sample logo URLs for testing
const SAMPLE_LOGOS = {
  github: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  nodejs: 'https://nodejs.org/static/images/logo.svg',
  react: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png',
  vue: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/vue/vue.png',
  python: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/python/python.png'
};

// Test cases
const tests = [
  {
    name: '01-simple-qr-no-logo',
    description: 'Simple QR code without logo',
    params: {
      data: 'https://example.com'
    }
  },
  {
    name: '02-qr-with-github-logo',
    description: 'QR code with GitHub logo',
    params: {
      data: 'https://github.com',
      logoUrl: SAMPLE_LOGOS.github,
      logoBgColor: '#FFFFFF',
      size: 600
    }
  },
  {
    name: '03-colored-qr-blue',
    description: 'Blue QR code with logo',
    params: {
      data: 'https://nodejs.org',
      logoUrl: SAMPLE_LOGOS.nodejs,
      color: '#00BCD4',
      bgColor: '#FFFFFF',
      logoBgColor: '#FFFFFF'
    }
  },
  {
    name: '04-purple-qr',
    description: 'Purple QR code with React logo',
    params: {
      data: 'https://react.dev',
      logoUrl: SAMPLE_LOGOS.react,
      color: '#9C27B0',
      logoBgColor: '#282C34',
      size: 512
    }
  },
  {
    name: '05-large-qr',
    description: 'Large QR code (1024px)',
    params: {
      data: 'https://largeqrcode.com/with/long/path/to/test/scaling',
      logoUrl: SAMPLE_LOGOS.vue,
      size: 1024,
      logoSize: 25,
      logoBgColor: '#41B883'
    }
  },
  {
    name: '06-small-logo',
    description: 'QR with small logo (15%)',
    params: {
      data: 'https://example.com',
      logoUrl: SAMPLE_LOGOS.python,
      logoSize: 15,
      logoBgColor: '#FFD43B'
    }
  },
  {
    name: '07-red-qr',
    description: 'Red QR code with logo',
    params: {
      data: 'https://redqr.com',
      logoUrl: SAMPLE_LOGOS.github,
      color: '#F44336',
      logoBgColor: '#FFFFFF'
    }
  },
  {
    name: '08-black-white',
    description: 'Classic black and white QR with logo',
    params: {
      data: 'https://classic.qr',
      logoUrl: SAMPLE_LOGOS.github,
      color: '#000000',
      bgColor: '#FFFFFF',
      logoBgColor: '#FFFFFF'
    }
  },
  {
    name: '09-minimal-padding',
    description: 'QR with minimal logo padding',
    params: {
      data: 'https://example.com/minimal',
      logoUrl: SAMPLE_LOGOS.react,
      logoPadding: 10,
      logoBgColor: '#61DAFB'
    }
  },
  {
    name: '10-large-padding',
    description: 'QR with large logo padding',
    params: {
      data: 'https://example.com/padded',
      logoUrl: SAMPLE_LOGOS.nodejs,
      logoPadding: 30,
      logoBgColor: '#339933'
    }
  }
];

// Function to run a single test
async function runTest(test) {
  try {
    console.log(`\n🧪 Testing: ${test.name}`);
    console.log(`   Description: ${test.description}`);

    const params = new URLSearchParams(test.params);
    const url = `${BASE_URL}/api/qr/generate?${params.toString()}`;

    console.log(`   Params:`, test.params);

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 15000
    });

    const outputPath = path.join(OUTPUT_DIR, `${test.name}.png`);
    fs.writeFileSync(outputPath, response.data);

    console.log(`   ✅ Success! Saved to: ${outputPath}`);
    return { success: true, test: test.name };
  } catch (error) {
    console.error(`   ❌ Failed: ${error.message}`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      if (error.response.data) {
        try {
          const errorData = JSON.parse(error.response.data.toString());
          console.error(`   Error: ${errorData.message}`);
        } catch (e) {
          // Not JSON
        }
      }
    }
    return { success: false, test: test.name, error: error.message };
  }
}

// Function to test health endpoint
async function testHealth() {
  try {
    console.log('\n🏥 Testing health endpoint...');
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('   ✅ Health check passed');
    console.log('   Response:', response.data);
    return true;
  } catch (error) {
    console.error('   ❌ Health check failed:', error.message);
    return false;
  }
}

// Function to test error handling
async function testErrorHandling() {
  console.log('\n⚠️  Testing error handling...');

  const errorTests = [
    {
      name: 'Missing data parameter',
      params: {}
    },
    {
      name: 'Invalid color format',
      params: { data: 'test', color: 'invalid' }
    },
    {
      name: 'Invalid size',
      params: { data: 'test', size: 5000 }
    },
    {
      name: 'Invalid logoUrl (not HTTP)',
      params: { data: 'test', logoUrl: 'ftp://invalid.com/logo.png' }
    }
  ];

  for (const errorTest of errorTests) {
    try {
      const params = new URLSearchParams(errorTest.params);
      const url = `${BASE_URL}/api/qr/generate?${params.toString()}`;
      await axios.get(url);
      console.log(`   ❌ ${errorTest.name}: Should have failed but didn't`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(`   ✅ ${errorTest.name}: Correctly returned 400 error`);
      } else {
        console.log(`   ⚠️  ${errorTest.name}: Unexpected error (${error.message})`);
      }
    }
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting QR Code Generator API Tests\n');
  console.log('='.repeat(60));

  // Test health endpoint first
  const healthOk = await testHealth();
  if (!healthOk) {
    console.log('\n❌ Server is not running or not healthy!');
    console.log('Please start the server with: npm start or npm run dev');
    process.exit(1);
  }

  // Test error handling
  await testErrorHandling();

  // Run all QR generation tests
  console.log('\n📸 Running QR generation tests...');
  console.log('='.repeat(60));

  const results = [];
  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary\n');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`Total tests: ${results.length}`);
  console.log(`✅ Passed: ${successful}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\nFailed tests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.test}: ${r.error}`);
    });
  }

  console.log(`\n📁 Output directory: ${OUTPUT_DIR}`);
  console.log('\n✨ Tests completed!');
  console.log('\n💡 Note: Some tests may fail if external logo URLs are unreachable.');
}

// Run tests
runAllTests().catch(error => {
  console.error('\n💥 Test runner error:', error);
  process.exit(1);
});
