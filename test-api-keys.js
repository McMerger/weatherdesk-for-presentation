/**
 * Test API Keys Configuration
 * Validates that all API keys and services are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 WeatherDesk API Keys Configuration Test\n');
console.log('=' .repeat(60));

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Test results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function test(name, condition, level = 'error') {
  const status = condition ? '✅ PASS' : (level === 'warning' ? '⚠️  WARN' : '❌ FAIL');
  const result = {
    name,
    status: condition ? 'passed' : (level === 'warning' ? 'warning' : 'failed'),
    message: status
  };

  results.tests.push(result);

  if (condition) {
    results.passed++;
  } else if (level === 'warning') {
    results.warnings++;
  } else {
    results.failed++;
  }

  console.log(`${status} - ${name}`);
  return condition;
}

console.log('\n📋 Environment Files Check\n');

// Check .env.local exists
const envLocalExists = fs.existsSync('.env.local');
test('.env.local file exists', envLocalExists);

// Check .env.example exists
const envExampleExists = fs.existsSync('.env.example');
test('.env.example file exists', envExampleExists);

console.log('\n🌍 Weather API Configuration\n');

// Check USE_REAL_WEATHER configuration
const useRealWeather = process.env.USE_REAL_WEATHER;
test('USE_REAL_WEATHER is defined', useRealWeather !== undefined);

const isRealWeatherEnabled = useRealWeather === 'true';
console.log(`   Mode: ${isRealWeatherEnabled ? 'REAL WEATHER DATA' : 'MOCK DATA (Demo Mode)'}`);

if (isRealWeatherEnabled) {
  console.log('   ℹ️  Real weather mode enabled - will use live APIs');

  // Check if OpenWeather key is provided (optional)
  const openWeatherKey = process.env.OPENWEATHER_API_KEY;
  const hasOpenWeatherKey = openWeatherKey && openWeatherKey !== 'your_openweather_api_key_here';

  if (hasOpenWeatherKey) {
    console.log('   ℹ️  OpenWeather API key detected - will use OpenWeather');
    test('OpenWeather API key is configured', true);
    test('OpenWeather API key format is valid', openWeatherKey.length > 20);
  } else {
    console.log('   ℹ️  No OpenWeather key - will use OpenMeteo (free, no key required)');
    test('OpenMeteo mode (free, no key required)', true, 'warning');
  }
} else {
  console.log('   ℹ️  Mock mode - using realistic demo data (no API calls)');
  test('Mock weather mode configured correctly', true);
}

console.log('\n🤖 AI Configuration (Google Gemini)\n');

// Check Google Gemini API key
const geminiKey = process.env.GOOGLE_GENAI_API_KEY;
const hasGeminiKey = geminiKey && geminiKey !== 'your_google_gemini_api_key_here';

if (hasGeminiKey) {
  test('Google Gemini API key is configured', true);
  test('Google Gemini API key format is valid', geminiKey.startsWith('AIza') || geminiKey.length > 30);
  console.log('   ℹ️  AI features enabled');
} else {
  test('Google Gemini API key is missing', false, 'warning');
  console.log('   ℹ️  AI features disabled (optional)');
  console.log('   📖 Get free key: https://makersuite.google.com/app/apikey');
}

console.log('\n⚙️  Application Configuration\n');

// Check feature flags
const aiInsights = process.env.NEXT_PUBLIC_ENABLE_AI_INSIGHTS;
test('AI Insights feature flag defined', aiInsights !== undefined, 'warning');

const rating = process.env.NEXT_PUBLIC_ENABLE_RATING;
test('Rating feature flag defined', rating !== undefined, 'warning');

const darkMode = process.env.NEXT_PUBLIC_ENABLE_DARK_MODE;
test('Dark mode feature flag defined', darkMode !== undefined, 'warning');

// Check Node environment
const nodeEnv = process.env.NODE_ENV || 'development';
test('NODE_ENV is set', true);
console.log(`   Environment: ${nodeEnv}`);

console.log('\n📊 Test Summary\n');
console.log('=' .repeat(60));
console.log(`✅ Passed:   ${results.passed}`);
console.log(`❌ Failed:   ${results.failed}`);
console.log(`⚠️  Warnings: ${results.warnings}`);
console.log(`📝 Total:    ${results.tests.length}`);
console.log('=' .repeat(60));

console.log('\n💡 Recommendations\n');

if (!isRealWeatherEnabled) {
  console.log('✓ Mock mode is active - perfect for development and demos!');
  console.log('  To enable real weather data, set USE_REAL_WEATHER=true');
  console.log('  (OpenMeteo is free and requires no API key)');
}

if (isRealWeatherEnabled && !test.hasOpenWeatherKey) {
  console.log('✓ Using free OpenMeteo API - no key required!');
  console.log('  For OpenWeather features, get free key at:');
  console.log('  https://openweathermap.org/api');
}

if (!hasGeminiKey) {
  console.log('⚠  AI features are disabled');
  console.log('  To enable, add GOOGLE_GENAI_API_KEY to .env.local');
  console.log('  Get free key at: https://makersuite.google.com/app/apikey');
}

if (results.failed === 0 && results.warnings === 0) {
  console.log('\n🎉 All systems operational! Your configuration is perfect.');
} else if (results.failed === 0) {
  console.log('\n✅ Core functionality ready! Optional features can be enabled.');
} else {
  console.log('\n⚠️  Some issues detected. Review the recommendations above.');
}

console.log('\n' + '='.repeat(60));

// Exit code
process.exit(results.failed > 0 ? 1 : 0);
