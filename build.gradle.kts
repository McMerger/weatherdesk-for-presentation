plugins {
    kotlin("jvm") version "2.2.20"
    application
    id("org.jetbrains.kotlin.plugin.serialization") version "2.2.20"
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation("io.ktor:ktor-server-core:3.1.1")
    implementation("io.ktor:ktor-server-netty:3.1.1")
    implementation("io.ktor:ktor-server-content-negotiation:3.1.1")
    implementation("io.ktor:ktor-serialization-kotlinx-json:3.1.1")

    // Client-side
    implementation("io.ktor:ktor-client-core:3.1.1")
    implementation("io.ktor:ktor-client-cio:3.1.1")
    implementation("io.ktor:ktor-client-content-negotiation:3.1.1")
    implementation("io.ktor:ktor-serialization-gson:3.1.1")


    // Logging
    implementation("ch.qos.logback:logback-classic:1.5.13")
    implementation("io.github.microutils:kotlin-logging-jvm:3.0.5")

    // SQLite
    implementation("org.jetbrains.exposed:exposed-core:0.41.1")
    implementation("org.jetbrains.exposed:exposed-dao:0.41.1")
    implementation("org.jetbrains.exposed:exposed-jdbc:0.41.1")
    implementation("org.xerial:sqlite-jdbc:3.42.0.0")

    // Password hashing
    implementation("at.favre.lib:bcrypt:0.9.0")

    // JWT
    implementation("io.ktor:ktor-server-auth:3.1.1")
    implementation("io.ktor:ktor-server-auth-jwt:3.1.1")

    // CORS
    implementation("io.ktor:ktor-server-cors:3.1.1")

    testImplementation(kotlin("test"))
}

application {
    mainClass.set("MainKt")
}