const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Base URL for the API
const BASE_URL = 'http://localhost:3000';

// Create output directory if it doesn't exist
const OUTPUT_DIR = path.join(__dirname, 'test-storage-output');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Test cases for storage functionality
const tests = [
  {
    name: '01-lpa-activation-code-1',
    description: 'Test LPA QR code - First generation',
    data: 'LPA:1$SMDP$TEST_ACTIVATION_CODE_001'
  },
  {
    name: '02-lpa-activation-code-1-repeat',
    description: 'Test LPA QR code - Should load from cache',
    data: 'LPA:1$SMDP$TEST_ACTIVATION_CODE_001'
  },
  {
    name: '03-lpa-activation-code-2',
    description: 'Test different LPA activation code',
    data: 'LPA:1$SMDP$TEST_ACTIVATION_CODE_002'
  },
  {
    name: '04-general-qr-1',
    description: 'Test general QR code (non-LPA)',
    data: 'https://example.com/page1'
  },
  {
    name: '05-general-qr-2',
    description: 'Test another general QR code',
    data: 'https://example.com/page2'
  },
  {
    name: '06-lpa-with-logo',
    description: 'Test LPA QR code with logo',
    data: 'LPA:1$SMDP$WITH_LOGO_CODE',
    params: {
      logoUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
      logoBgColor: '#FFFFFF'
    }
  },
  {
    name: '07-lpa-with-logo-repeat',
    description: 'Test LPA with logo - Should load from cache',
    data: 'LPA:1$SMDP$WITH_LOGO_CODE',
    params: {
      logoUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
      logoBgColor: '#FFFFFF'
    }
  },
  {
    name: '08-lpa-complex-code',
    description: 'Test LPA with complex activation code',
    data: 'LPA:1$SMDP$ABC123-XYZ789-COMPLEX'
  }
];

// Function to run a single test
async function runTest(test) {
  try {
    console.log(`\n🧪 Testing: ${test.name}`);
    console.log(`   Description: ${test.description}`);
    console.log(`   Data: ${test.data}`);

    const params = new URLSearchParams({
      data: test.data,
      ...test.params
    });
    
    const url = `${BASE_URL}/api/qr/generate?${params.toString()}`;

    const startTime = Date.now();
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 15000
    });
    const duration = Date.now() - startTime;

    // Check response headers
    const fromCache = response.headers['x-qr-from-cache'];
    const activationCode = response.headers['x-qr-activation-code'];
    const filename = response.headers['x-qr-filename'];

    console.log(`   ⏱️  Duration: ${duration}ms`);
    console.log(`   📦 From Cache: ${fromCache}`);
    console.log(`   🔑 Activation Code: ${activationCode || 'N/A'}`);
    console.log(`   📄 Filename: ${filename || 'N/A'}`);

    const outputPath = path.join(OUTPUT_DIR, `${test.name}.png`);
    fs.writeFileSync(outputPath, response.data);

    console.log(`   ✅ Success! Saved to: ${outputPath}`);
    
    return { 
      success: true, 
      test: test.name, 
      fromCache: fromCache === 'true',
      duration,
      activationCode,
      filename
    };
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

// Function to test storage stats endpoint
async function testStorageStats() {
  try {
    console.log('\n📊 Testing storage stats endpoint...');
    const response = await axios.get(`${BASE_URL}/api/qr/stats`);
    console.log('   ✅ Storage stats retrieved:');
    console.log(`      Activation Codes: ${response.data.data.storage.activationCodes}`);
    console.log(`      General QR Codes: ${response.data.data.storage.general}`);
    console.log(`      Total: ${response.data.data.storage.total}`);
    return true;
  } catch (error) {
    console.error('   ❌ Storage stats failed:', error.message);
    return false;
  }
}

// Function to test clean endpoint
async function testCleanEndpoint() {
  try {
    console.log('\n🧹 Testing clean old QR codes endpoint...');
    const response = await axios.get(`${BASE_URL}/api/qr/clean?days=7`);
    console.log('   ✅ Clean operation completed:');
    console.log(`      Deleted: ${response.data.data.deletedCount} files`);
    console.log(`      Max age: ${response.data.data.maxAgeDays} days`);
    return true;
  } catch (error) {
    console.error('   ❌ Clean operation failed:', error.message);
    return false;
  }
}

// Function to verify storage structure
async function verifyStorageStructure() {
  console.log('\n📁 Verifying storage structure...');
  
  const storagePath = path.join(__dirname, 'storage');
  const activationPath = path.join(storagePath, 'activation_code');
  const generalPath = path.join(storagePath, 'general');
  
  const checks = [
    { path: storagePath, name: 'storage/' },
    { path: activationPath, name: 'storage/activation_code/' },
    { path: generalPath, name: 'storage/general/' }
  ];
  
  let allExist = true;
  for (const check of checks) {
    if (fs.existsSync(check.path)) {
      console.log(`   ✅ ${check.name} exists`);
    } else {
      console.log(`   ❌ ${check.name} does NOT exist`);
      allExist = false;
    }
  }
  
  return allExist;
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting QR Code Storage System Tests\n');
  console.log('='.repeat(60));

  // Verify storage structure
  const structureOk = await verifyStorageStructure();
  if (!structureOk) {
    console.log('\n⚠️  Storage structure incomplete. Creating directories...');
  }

  // Test health endpoint first
  try {
    console.log('\n🏥 Testing health endpoint...');
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('   ✅ Health check passed');
  } catch (error) {
    console.log('\n❌ Server is not running or not healthy!');
    console.log('Please start the server with: npm start or npm run dev');
    process.exit(1);
  }

  // Run all QR generation tests
  console.log('\n📸 Running QR generation tests with storage...');
  console.log('='.repeat(60));

  const results = [];
  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Test storage stats
  await testStorageStats();

  // Test clean endpoint
  await testCleanEndpoint();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary\n');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const fromCache = results.filter(r => r.success && r.fromCache).length;
  const generated = results.filter(r => r.success && !r.fromCache).length;

  console.log(`Total tests: ${results.length}`);
  console.log(`✅ Passed: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📦 From Cache: ${fromCache}`);
  console.log(`🔨 Newly Generated: ${generated}`);

  if (failed > 0) {
    console.log('\nFailed tests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.test}: ${r.error}`);
    });
  }

  // Show which tests were cached
  console.log('\n📦 Cached QR Codes:');
  results.filter(r => r.success && r.fromCache).forEach(r => {
    console.log(`  - ${r.test} (${r.duration}ms)`);
  });

  console.log(`\n📁 Test output directory: ${OUTPUT_DIR}`);
  console.log(`📁 Storage directory: ${path.join(__dirname, 'storage')}`);
  console.log('\n✨ Storage tests completed!');
  
  // Final stats
  await testStorageStats();
}

// Run tests
runAllTests().catch(error => {
  console.error('\n💥 Test runner error:', error);
  process.exit(1);
});

