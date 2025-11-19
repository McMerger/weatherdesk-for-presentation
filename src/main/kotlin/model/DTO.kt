package model

import java.time.LocalDate

// Weather DTOs (match frontend shapes)
data class WeatherData(
    val current: CurrentWeather,
    val forecast: List<DailyForecast>
)

data class CurrentWeather(
    val city: String,
    val temperatureCelsius: Double,
    val feelsLikeCelsius: Double,
    val condition: String,
    val conditionDescription: String,
    val humidity: Int,
    val windSpeedMps: Double,
    val date: LocalDate,
    val latitude: Double?,
    val longitude: Double?,
    val isDay: Boolean
)

data class DailyForecast(
    val date: LocalDate,
    val highTempCelsius: Double,
    val lowTempCelsius: Double,
    val condition: String,
    val conditionDescription: String
)

// Auth / requests
data class RegisterRequest(val email: String, val password: String)
data class LoginRequest(val email: String, val password: String)
data class LoginResponse(val token: String)

// Rating
data class RatingRequest(val city: String, val rating: Int, val date: String? = null)

// Preferences
enum class TemperatureUnit { CELSIUS, FAHRENHEIT }
enum class WindSpeedUnit { KILOMETERS_PER_HOUR, METERS_PER_SECOND, MILES_PER_HOUR }
enum class ThemeMode { LIGHT, DARK, AUTO }

data class UserPreferences(
    val preferredTempUnit: TemperatureUnit = TemperatureUnit.CELSIUS,
    val preferredWindUnit: WindSpeedUnit = WindSpeedUnit.KILOMETERS_PER_HOUR,
    val theme: ThemeMode = ThemeMode.AUTO,
    val lastSearchedCity: String? = null,
    val lastSearchedLatitude: Double? = null,
    val lastSearchedLongitude: Double? = null
)

// Geocoding
data class GeocodingResponse(
    val results: List<GeocodingResult>?
)

data class GeocodingResult(
    val name: String,
    val latitude: Double,
    val longitude: Double,
    val country: String? = null
)