# 🚀 Backend Setup Guide

## Quick Start

### Option 1: Using the Startup Script (Recommended)

```bash
./run-backend.sh
```

This script will automatically build and run the backend.

---

### Option 2: Manual Commands

#### 1. Build the Backend

```bash
# Using Gradle wrapper (recommended)
./gradlew clean build

# OR using system Gradle
gradle clean build
```

#### 2. Run the Backend

```bash
java -jar build/libs/WeatherDesk-1.0-SNAPSHOT.jar
```

---

## Prerequisites

### Required

- **Java JDK 17 or higher**
  ```bash
  # Check your Java version
  java -version

  # Should show: openjdk version "17" or higher
  ```

- **Internet connection** (for first build only)
  - Gradle needs to download dependencies on first run
  - After initial build, can work offline

---

## Troubleshooting

### ❌ Error: "Could not find or load main class org.gradle.wrapper.GradleWrapperMain"

**Cause**: You're not in the project root directory

**Solution**:
```bash
# Make sure you're in the weatherdesk-for-presentation directory
cd /home/user/weatherdesk-for-presentation

# Then run the build command
./gradlew clean build
```

---

### ❌ Error: "Plugin was not found" or "UnknownHostException"

**Cause**: No internet connection or firewall blocking Gradle

**Solutions**:
1. Check internet connection
2. If behind a proxy, configure Gradle proxy settings:
   ```bash
   # Create/edit ~/.gradle/gradle.properties
   systemProp.http.proxyHost=your.proxy.host
   systemProp.http.proxyPort=8080
   systemProp.https.proxyHost=your.proxy.host
   systemProp.https.proxyPort=8080
   ```
3. Disable VPN if it's interfering

---

### ❌ Error: "Unable to access jarfile"

**Cause**: Build hasn't completed successfully yet

**Solution**:
```bash
# First build the project
./gradlew clean build

# Then run it
java -jar build/libs/WeatherDesk-1.0-SNAPSHOT.jar
```

---

### ❌ Error: Java version issues

**Cause**: Java version is too old

**Solution**:
```bash
# Check Java version
java -version

# Install Java 17 or higher if needed
# On Ubuntu/Debian:
sudo apt install openjdk-17-jdk

# On macOS (using Homebrew):
brew install openjdk@17

# On Windows:
# Download from https://adoptium.net/
```

---

## VS Code Specific Instructions

### In VS Code Terminal

1. **Open integrated terminal** (Ctrl+` or View → Terminal)

2. **Navigate to project root**:
   ```bash
   cd /home/user/weatherdesk-for-presentation
   ```

3. **Run the startup script**:
   ```bash
   ./run-backend.sh
   ```

   OR manually:
   ```bash
   ./gradlew clean build
   java -jar build/libs/WeatherDesk-1.0-SNAPSHOT.jar
   ```

---

## Verifying Backend is Running

### 1. Check Server Logs

You should see:
```
Application started in 0.123 seconds.
[main] INFO  ktor.application - Responding at http://0.0.0.0:8080
```

### 2. Test with curl

**In a new terminal**:
```bash
# Test weather endpoint
curl "http://localhost:8080/weather?city=London"

# Should return JSON with weather data
```

### 3. Test in Browser

Open: `http://localhost:8080/weather?city=London`

Should see JSON response like:
```json
{
  "current": {
    "city": "London",
    "temperatureCelsius": 15.5,
    "windSpeedMps": 5.2,
    ...
  },
  "forecast": [...]
}
```

---

## Running Frontend + Backend Together

### Terminal 1 (Backend):
```bash
cd /home/user/weatherdesk-for-presentation
./run-backend.sh
```

### Terminal 2 (Frontend):
```bash
cd /home/user/weatherdesk-for-presentation
npm install  # First time only
npm run dev
```

### Open Browser:
- **Frontend**: http://localhost:9002
- **Backend**: http://localhost:8080

---

## Port Already in Use

If you see: `Address already in use`

**Find process using port 8080**:
```bash
# On Linux/Mac:
lsof -i :8080

# On Windows:
netstat -ano | findstr :8080
```

**Kill the process**:
```bash
# Linux/Mac:
kill -9 <PID>

# Windows:
taskkill /F /PID <PID>
```

---

## Build Configuration

### Project Structure
```
weatherdesk-for-presentation/
├── build.gradle.kts       # Build configuration
├── settings.gradle.kts    # Project settings
├── gradlew               # Gradle wrapper (Unix)
├── gradlew.bat           # Gradle wrapper (Windows)
├── src/
│   └── main/
│       └── kotlin/       # Kotlin backend source
│           ├── Main.kt   # Application entry point
│           ├── routes/   # API routes
│           ├── service/  # Business logic
│           └── model/    # Data models
└── build/
    └── libs/             # Built JAR files (after build)
```

### Dependencies

The backend uses:
- **Ktor 3.1.1** - Web framework
- **Kotlin 2.2.20** - Programming language
- **Exposed** - Database ORM
- **SQLite** - Database
- **Logback** - Logging

All dependencies are automatically downloaded during first build.

---

## Environment Variables (Optional)

```bash
# Backend port (default: 8080)
export PORT=8080

# Database location (default: ./weatherdesk.db)
export DB_PATH=./weatherdesk.db

# Log level (default: INFO)
export LOG_LEVEL=DEBUG
```

---

## Next Steps

1. ✅ Build and run backend (this guide)
2. ✅ Run frontend (`npm run dev`)
3. ✅ Test in browser (http://localhost:9002)
4. ✅ Check `COMPREHENSIVE_STATUS_AUDIT.md` for system status

---

## Support

### Documentation Files
- `COMPREHENSIVE_STATUS_AUDIT.md` - System status and type fixes
- `API_VERIFICATION.md` - API testing guide
- `QUICK_START.md` - Quick start guide
- `INTEGRATION_README.md` - Integration documentation

### Common Issues Already Fixed
✅ Type mismatches between frontend and backend
✅ CORS configuration
✅ Rating endpoint authentication
✅ API endpoint connectivity

All critical issues have been resolved in the latest commit.
