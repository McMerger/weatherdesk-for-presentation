# WeatherDesk API Keys Setup Guide

## Overview

WeatherDesk supports multiple API configurations to provide flexibility for different use cases:

1. **Mock Data Mode** (Default) - No API keys required
2. **Real Weather Data** - Free OpenMeteo API (no key required)
3. **OpenWeather API** - Optional paid/free tier (requires API key)
4. **AI Features** - Google Gemini API (free tier available)

---

## 🚀 Quick Start (No API Keys Needed!)

The app works **out of the box** with realistic mock weather data. Just run:

```bash
npm install
npm run dev
```

Visit http://localhost:9002 and start searching for cities!

---

## 🌍 API Configuration Options

### Option 1: Mock Data Mode (Default)

**Cost:** FREE
**Setup:** NONE
**API Keys:** NONE REQUIRED

**Perfect for:**
- Development
- Presentations
- Testing
- Demos

**Features:**
- ✅ 45+ cities worldwide
- ✅ Realistic weather patterns
- ✅ Seasonal variations
- ✅ 7-day forecasts
- ✅ Instant responses
- ✅ No rate limits

**Configuration:**
```env
USE_REAL_WEATHER=false
```

---

### Option 2: Real Weather with OpenMeteo (Free)

**Cost:** FREE
**API Key:** NOT REQUIRED
**Rate Limit:** 10,000 requests/day (free tier)
**Website:** https://open-meteo.com/

**Perfect for:**
- Production apps (small scale)
- Real-time weather data
- Any city worldwide
- No registration needed

**Features:**
- ✅ Real-time weather data
- ✅ No API key required
- ✅ Unlimited cities
- ✅ 7-day forecasts
- ✅ Free forever
- ✅ No credit card required

**Configuration:**
```env
USE_REAL_WEATHER=true
# No API key needed!
```

**How it works:**
1. App geocodes city name using OpenMeteo Geocoding API (free)
2. Fetches weather data using OpenMeteo Weather API (free)
3. No registration, no API key, just works!

---

### Option 3: Real Weather with OpenWeather (Optional)

**Cost:** FREE tier available (60 calls/minute)
**API Key:** REQUIRED
**Website:** https://openweathermap.org/api

**Perfect for:**
- Apps needing more detailed weather data
- Higher rate limits
- Additional weather parameters

**Get Your API Key:**
1. Visit https://openweathermap.org/api
2. Click "Sign Up" (free)
3. Verify your email
4. Go to API Keys section
5. Copy your API key

**Configuration:**
```env
USE_REAL_WEATHER=true
OPENWEATHER_API_KEY=your_api_key_here
```

**Free Tier Limits:**
- 60 calls/minute
- 1,000,000 calls/month
- Current weather + 7-day forecast
- Worldwide coverage

---

### Option 4: AI Features with Google Gemini

**Cost:** FREE tier available
**API Key:** REQUIRED
**Website:** https://makersuite.google.com/app/apikey

**Perfect for:**
- AI-powered weather insights
- Smart recommendations
- Natural language weather queries

**Get Your API Key:**
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy your API key

**Configuration:**
```env
GOOGLE_GENAI_API_KEY=your_google_api_key_here
```

**Free Tier Limits:**
- 60 requests/minute
- 1,500 requests/day
- Gemini 2.0 Flash model

**Features When Enabled:**
- ✅ AI-powered weather insights
- ✅ Smart activity recommendations
- ✅ Personalized weather advice
- ✅ Natural language processing

---

## 📋 Complete Configuration Examples

### Example 1: Demo Mode (No Keys)
```env
# .env.local
USE_REAL_WEATHER=false
NEXT_PUBLIC_ENABLE_AI_INSIGHTS=false
NODE_ENV=development
```

### Example 2: Real Weather (Free, No Keys)
```env
# .env.local
USE_REAL_WEATHER=true
# Uses OpenMeteo automatically (free, no key required)
NEXT_PUBLIC_ENABLE_AI_INSIGHTS=false
NODE_ENV=development
```

### Example 3: Real Weather + AI
```env
# .env.local
USE_REAL_WEATHER=true
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_ENABLE_AI_INSIGHTS=true
NODE_ENV=development
```

### Example 4: OpenWeather + AI (Full Setup)
```env
# .env.local
USE_REAL_WEATHER=true
OPENWEATHER_API_KEY=your_openweather_api_key_here
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_ENABLE_AI_INSIGHTS=true
NEXT_PUBLIC_ENABLE_RATING=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NODE_ENV=development
```

---

## 🔧 Setup Instructions

### Step 1: Copy Environment File

```bash
cp .env.example .env.local
```

### Step 2: Choose Your Configuration

Edit `.env.local` based on your needs (see examples above)

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start Development Server

```bash
npm run dev
```

### Step 5: Test Your Setup

Visit http://localhost:9002 and search for a city!

---

## 🧪 Testing API Functionality

### Test Mock Data (Default)
```bash
# No configuration needed
npm run dev
# Search for "London" in the app
```

### Test OpenMeteo (Real Data, Free)
```bash
# In .env.local:
# USE_REAL_WEATHER=true

npm run dev
# Search for "Paris" - should fetch real weather data
# Check console for "[REAL API]" messages
```

### Test OpenWeather
```bash
# In .env.local:
# USE_REAL_WEATHER=true
# OPENWEATHER_API_KEY=your_key_here

npm run dev
# Search for "Tokyo" - should use OpenWeather API
# Check console for "[REAL API] Using OpenWeather API"
```

### Test AI Features
```bash
# In .env.local:
# GOOGLE_GENAI_API_KEY=your_key_here

npm run dev
# Look for AI-powered insights in the UI
```

---

## 🔍 Debugging

### Check Console Logs

The app logs which API it's using:

```
[MOCK API] Fetching weather for "London" using mock service...
[MOCK API] Successfully generated mock weather for London, UK
```

or

```
[REAL API] Fetching weather for "Paris" using OpenMeteo...
[REAL API] Using OpenMeteo API (free, no key required)
[REAL API] Successfully fetched weather for Paris, France
```

or

```
[REAL API] Fetching weather for "Tokyo" using OpenMeteo...
[REAL API] Using OpenWeather API (with key)
[REAL API] Successfully fetched weather for Tokyo, Japan
```

### Common Issues

**Issue: "City not found" error**
- **Mock Mode:** City not in our database (45 cities). Try: London, New York, Tokyo, Paris, Sydney
- **Real Mode:** Check spelling, try different city name format

**Issue: API request fails**
- Check internet connection
- Verify API key is correct (no extra spaces)
- Check API rate limits
- Review console for error messages

**Issue: AI features not working**
- Verify `GOOGLE_GENAI_API_KEY` is set
- Check API key is valid
- Ensure you're within free tier limits (60 req/min, 1500 req/day)

**Issue: OpenWeather not being used**
- Verify `USE_REAL_WEATHER=true`
- Check `OPENWEATHER_API_KEY` is set correctly
- App defaults to OpenMeteo if key is missing (this is fine!)

---

## 📊 API Comparison

| Feature | Mock Data | OpenMeteo | OpenWeather |
|---------|-----------|-----------|-------------|
| **Cost** | FREE | FREE | FREE tier available |
| **API Key** | ❌ Not needed | ❌ Not needed | ✅ Required |
| **Cities** | 45 predefined | Unlimited | Unlimited |
| **Real Data** | ❌ Simulated | ✅ Real-time | ✅ Real-time |
| **Rate Limit** | Unlimited | 10K req/day | 60 req/min |
| **Setup** | None | None | Sign up required |
| **Best For** | Demo/Dev | Production | Advanced features |

---

## 🚀 Production Deployment

### Environment Variables for Production

```env
# Production .env.local
USE_REAL_WEATHER=true
GOOGLE_GENAI_API_KEY=your_production_api_key
NODE_ENV=production
NEXT_PUBLIC_BACKEND_URL=https://your-production-domain.com
```

### Deployment Checklist

- [ ] Never commit `.env.local` to version control
- [ ] Set environment variables in your deployment platform (Vercel, Netlify, etc.)
- [ ] Use production API keys (not development keys)
- [ ] Enable rate limiting if using real APIs
- [ ] Monitor API usage and costs
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure caching to reduce API calls
- [ ] Test all features before going live

---

## 📚 Additional Resources

### API Documentation
- **OpenMeteo:** https://open-meteo.com/en/docs
- **OpenWeather:** https://openweathermap.org/api
- **Google Gemini:** https://ai.google.dev/docs

### Getting Help
- Check console logs for error messages
- Review this documentation
- Check API provider documentation
- Open an issue on GitHub

---

## 🎯 Summary

**For Development/Demo:**
- Use default mock data (no setup required)

**For Real Weather (Free):**
- Set `USE_REAL_WEATHER=true`
- Uses OpenMeteo automatically

**For Advanced Features:**
- Add API keys for OpenWeather and/or Google Gemini
- Follow setup instructions above

**Questions?**
- Check the console logs
- Review error messages
- Consult API provider docs

---

**Last Updated:** November 2025
**Version:** 1.0.0
