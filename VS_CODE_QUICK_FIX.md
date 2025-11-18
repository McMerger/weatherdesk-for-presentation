# VS Code Instructions - Run Backend

## The Problem
The Gradle wrapper (`./gradlew`) is not working properly. You need to regenerate it.

## Quick Fix (Run these in VS Code terminal)

```bash
# 1. Navigate to project directory
cd /path/to/weatherdesk-for-presentation

# 2. Regenerate Gradle wrapper using system Gradle
gradle wrapper

# 3. Now the wrapper should work - build the project
./gradlew clean build

# 4. Run the backend
java -jar build/libs/WeatherDesk-1.0-SNAPSHOT.jar
```

## Alternative: Use System Gradle (Even Easier)

Just skip the wrapper and use system Gradle directly:

```bash
# Build
gradle clean build

# Run
java -jar build/libs/WeatherDesk-1.0-SNAPSHOT.jar
```

## Or Use the Script (After fixing wrapper)

```bash
# After running 'gradle wrapper' above
./run-backend.sh
```

## What You Should See

When the server starts successfully:
```
Application started in 0.XXX seconds.
[main] INFO  ktor.application - Responding at http://0.0.0.0:8080
```

## Test It Works

In another terminal:
```bash
curl "http://localhost:8080/weather?city=London"
```

You should get JSON weather data!
