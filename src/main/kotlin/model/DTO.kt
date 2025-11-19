// data transfer objects
package model

import java.time.LocalDate

// weather data models
data class WeatherData(val current: CurrentWeather, val forecast: List<DailyForecast>)
data class CurrentWeather(val city: String, val temperatureCelsius: Double, val feelsLikeCelsius: Double, val condition: String, val conditionDescription: String, val humidity: Int, val windSpeedMps: Double, val date: LocalDate, val latitude: Double?, val longitude: Double?, val isDay: Boolean)
data class DailyForecast(val date: LocalDate, val highTempCelsius: Double, val lowTempCelsius: Double, val condition: String, val conditionDescription: String)

// auth stuff
data class RegisterRequest(val email: String, val password: String)
data class LoginRequest(val email: String, val password: String)
data class LoginResponse(val token: String)

// rating
data class RatingRequest(val city: String, val rating: Int, val date: String? = null)

// user preferences
enum class TemperatureUnit { CELSIUS, FAHRENHEIT }
enum class WindSpeedUnit { KILOMETERS_PER_HOUR, METERS_PER_SECOND, MILES_PER_HOUR }
enum class ThemeMode { LIGHT, DARK, AUTO }
data class UserPreferences(val preferredTempUnit: TemperatureUnit = TemperatureUnit.CELSIUS, val preferredWindUnit: WindSpeedUnit = WindSpeedUnit.KILOMETERS_PER_HOUR, val theme: ThemeMode = ThemeMode.AUTO, val lastSearchedCity: String? = null, val lastSearchedLatitude: Double? = null, val lastSearchedLongitude: Double? = null)

// geocoding
data class GeocodingResponse(val results: List<GeocodingResult>?)
data class GeocodingResult(val name: String, val latitude: Double, val longitude: Double, val country: String? = null)