@echo off
cd /d D:\weatherdesk-for-presentation
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"
.\gradlew.bat run
