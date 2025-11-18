#!/bin/bash

# WeatherDesk Backend Startup Script
# This script builds and runs the Kotlin backend server

echo "🚀 WeatherDesk Backend Startup"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "build.gradle.kts" ]; then
    echo "❌ Error: build.gradle.kts not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo "📦 Building Kotlin backend..."
echo "This may take a few minutes on first run (downloading dependencies)"
echo ""

# Check if system gradle is available
if command -v gradle &> /dev/null; then
    BUILD_CMD="gradle"
    echo "Using system Gradle: $(gradle --version | head -3 | tail -1)"
elif [ -x "./gradlew" ]; then
    BUILD_CMD="./gradlew"
    echo "Using Gradle wrapper"
else
    echo "❌ Error: Gradle not found"
    echo "Please install Gradle or ensure ./gradlew is executable"
    exit 1
fi

echo ""

# Build the project
$BUILD_CMD clean build --no-daemon

# Check if build was successful
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build failed!"
    echo ""
    echo "Common issues:"
    echo "1. No internet connection (needed to download dependencies)"
    echo "2. Java JDK not installed or wrong version"
    echo "3. Gradle not properly configured"
    echo ""
    echo "Required: Java 17 or higher"
    echo "Check Java version: java -version"
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""

# Find the jar file
JAR_FILE=$(find build/libs -name "*.jar" -type f | grep -v "plain" | head -1)

if [ -z "$JAR_FILE" ]; then
    echo "❌ Error: Could not find built JAR file"
    exit 1
fi

echo "🎯 Starting WeatherDesk backend server..."
echo "Server will run on: http://localhost:8080"
echo ""
echo "Available endpoints:"
echo "  GET  /weather?city=<city_name>  - Get weather data"
echo "  POST /weather/rating            - Submit rating"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================"
echo ""

# Run the server
java -jar "$JAR_FILE"
