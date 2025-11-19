// weather service - handles api calls
package service

import com.google.gson.annotations.SerializedName
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.gson.*
import model.CurrentWeather
import model.DailyForecast
import model.GeocodingResult
import model.WeatherData
import mu.KotlinLogging
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import kotlin.math.exp

private val logger = KotlinLogging.logger {}

class WeatherService(private val client: HttpClient) {
    private val geocodingService = GeocodingService(client)
    private val forecastBaseUrl = "https://api.open-meteo.com/v1/forecast"

    // simple cache to avoid hitting api too much
    private data class CachedWeather(
        val data: WeatherData,
        val timestamp: Long
    )
    private val cache = mutableMapOf<String, CachedWeather>()
    private val cacheExpiryMs = 5 * 60 * 1000 // 5 mins

    // get weather by city name
    suspend fun getWeatherByCity(city: String): WeatherData? {
        // check cache first
        val cityKey = city.lowercase().trim()
        val cached = cache[cityKey]
        if (cached != null && System.currentTimeMillis() - cached.timestamp < cacheExpiryMs) {
            logger.info { "Returning cached weather for $city" }
            return cached.data
        }
        return try {
            val results: List<GeocodingResult> = geocodingService.searchCity(city)
            val location = results.firstOrNull()
            if (location == null) {
                logger.warn { "City not found: $city" }
                return null
            }
            logger.info { "Getting weather for $city using coordinates: lat=${location.latitude}, lon=${location.longitude}" }
            val weatherData = getWeatherByCoordinates(location.latitude, location.longitude, location.name)
            // save to cache
            cache[cityKey] = CachedWeather(weatherData, System.currentTimeMillis())
            weatherData
        } catch (e: Exception) {
            logger.error(e) { "Error fetching weather for city: $city" }
            null
        }
    }

    // get weather using lat/lon coordinates
    suspend fun getWeatherByCoordinates(lat: Double, lon: Double, cityName: String? = null): WeatherData {
        logger.info { "Fetching weather for coordinates: $lat, $lon" }

        // build api url with all the params we need
        val url = "$forecastBaseUrl?latitude=$lat&longitude=$lon" +
                "&current_weather=true&hourly=relativehumidity_2m" +
                "&daily=temperature_2m_max,temperature_2m_min,weathercode" +
                "&timezone=auto&forecast_days=7"

        val response: OpenMeteoResponse = try {
            val res: OpenMeteoResponse = client.get(url).body()
            logger.info { "OpenMeteo raw response: $res" }
            res
        } catch (e: Exception) {
            logger.error(e) { "Failed to fetch OpenMeteo data" }
            // just return empty data if api fails
            return WeatherData(
                current = CurrentWeather(
                    city = cityName ?: "$lat,$lon",
                    temperatureCelsius = 0.0,
                    feelsLikeCelsius = calculateFeelsLike(
                        tempC = 0.0,
                        windMps = 0.0,
                        humidity = 0
                    ),
                    condition = "UNKNOWN",
                    conditionDescription = "No data",
                    humidity = 0,
                    windSpeedMps = 0.0,
                    date = LocalDate.now(),
                    latitude = lat,
                    longitude = lon,
                    isDay = true
                ),
                forecast = emptyList()
            )
        }

        // extract current weather data
        val currentData = response.current
        val dailyData = response.daily

        // if data is missing just return empty stuff
        if (currentData == null || dailyData == null) {
            logger.warn { "Incomplete weather data: current=$currentData, daily=$dailyData" }
            return WeatherData(
                current = CurrentWeather(
                    city = cityName ?: "$lat,$lon",
                    temperatureCelsius = currentData?.temperature ?: 0.0,
                    feelsLikeCelsius = calculateFeelsLike(
                        tempC = 0.0,
                        windMps = 0.0,
                        humidity = 0
                    ),
                    condition = currentData?.weatherCode?.let { weatherCodeToCondition(it) } ?: "UNKNOWN",
                    conditionDescription = currentData?.weatherCode?.let { weatherCodeToDescription(it) } ?: "No data",
                    humidity = 0,
                    windSpeedMps = currentData?.windSpeed10m?.div(3.6) ?: 0.0,
                    date = currentData?.time?.let { parseDate(it) } ?: LocalDate.now(),
                    latitude = response.latitude,
                    longitude = response.longitude,
                    isDay = currentData?.isDay == 1
                ),
                forecast = emptyList()
            )
        }

        // get humidity from hourly data
        val humidity = response.hourly?.let { hourly ->
            val index = hourly.time.indexOf(currentData.time)
            if (index != -1 && index < hourly.humidity.size) hourly.humidity[index] else 0
        } ?: 0

        // map the daily forecast data
        val forecast = dailyData.time.mapIndexed { i, dateStr ->
            DailyForecast(
                date = try { LocalDate.parse(dateStr) } catch (e: Exception) { logger.info(e) {"Giving local date instead to daily forecast"}; LocalDate.now() },
                highTempCelsius = dailyData.temperature2mMax.getOrNull(i) ?: 0.0,
                lowTempCelsius = dailyData.temperature2mMin.getOrNull(i) ?: 0.0,
                condition = dailyData.weatherCode.getOrNull(i)?.let { weatherCodeToCondition(it) } ?: "UNKNOWN",
                conditionDescription = dailyData.weatherCode.getOrNull(i)?.let { weatherCodeToDescription(it) } ?: "No data"
            )
        }

        // put it all together
        return WeatherData(
            current = CurrentWeather(
                city = cityName ?: "${response.latitude},${response.longitude}",
                temperatureCelsius = currentData.temperature,
                feelsLikeCelsius = calculateFeelsLike(
                    tempC = currentData.temperature,
                    windMps = currentData.windSpeed10m / 3.6,
                    humidity = humidity
                ),
                condition = weatherCodeToCondition(currentData.weatherCode),
                conditionDescription = weatherCodeToDescription(currentData.weatherCode),
                humidity = humidity,
                windSpeedMps = currentData.windSpeed10m / 3.6,
                date = parseDate(currentData.time),
                latitude = response.latitude,
                longitude = response.longitude,
                isDay = currentData.isDay == 1
            ),
            forecast = forecast
        )
    }

    // parse date string to LocalDate
    private fun parseDate(dateTimeStr: String): LocalDate {
        return try {
            LocalDateTime.parse(dateTimeStr, DateTimeFormatter.ISO_DATE_TIME)
                .toLocalDate()
        } catch (e: Exception) {
            logger.warn(e) { "Failed to parse date: $dateTimeStr" }
            LocalDate.now()
        }
    }

    // convert weather codes to readable conditions
    private fun weatherCodeToCondition(code: Int): String =
        when (code) {
            0 -> "CLEAR"
            1 -> "FEW_CLOUDS"
            2 -> "SCATTERED_CLOUDS"
            3 -> "BROKEN_CLOUDS"
            45, 48 -> "MIST"
            51,53,55,56,57,61,63,65,66,67 -> "RAIN"
            71,73,75,77,85,86 -> "SNOW"
            80,81,82 -> "SHOWER_RAIN"
            95,96,99 -> "THUNDERSTORM"
            else -> "UNKNOWN"
        }

    private fun weatherCodeToDescription(code: Int): String = when (code) {
        0 -> "Clear sky"
        1 -> "Mainly clear"
        2 -> "Partly cloudy"
        3 -> "Overcast"
        45 -> "Foggy"
        48 -> "Depositing rime fog"
        51 -> "Light drizzle"
        53 -> "Moderate drizzle"
        55 -> "Dense drizzle"
        56 -> "Light freezing drizzle"
        57 -> "Dense freezing drizzle"
        61 -> "Slight rain"
        63 -> "Moderate rain"
        65 -> "Heavy rain"
        66 -> "Light freezing rain"
        67 -> "Heavy freezing rain"
        71 -> "Slight snow"
        73 -> "Moderate snow"
        75 -> "Heavy snow"
        77 -> "Snow grains"
        80 -> "Slight rain showers"
        81 -> "Moderate rain showers"
        82 -> "Violent rain showers"
        85 -> "Slight snow showers"
        86 -> "Heavy snow showers"
        95 -> "Thunderstorm"
        96 -> "Thunderstorm with slight hail"
        99 -> "Thunderstorm with heavy hail"
        else -> "Unknown"
    }

    fun close() {
        client.close()
    }

    // calculate feels like temp using steadman formula
    private fun calculateFeelsLike(tempC: Double, windMps: Double, humidity: Int): Double {
        val e = (humidity / 100.0) * 6.105 * exp((17.27 * tempC) / (237.7 + tempC))
        return tempC + 0.33 * e - 0.70 * windMps - 4.0
    }

    companion object {
        fun defaultClient(): HttpClient = HttpClient {
            install(ContentNegotiation) {
                gson()
            }
        }
    }

    data class OpenMeteoResponse(
        val latitude: Double,
        val longitude: Double,
        @SerializedName("current_weather")
        val current: CurrentData?,
        val daily: DailyData?,
        val hourly: HourlyData?
    )

    data class CurrentData(
        val time: String,
        @SerializedName("temperature")
        val temperature: Double,
        @SerializedName("weathercode")
        val weatherCode: Int,
        @SerializedName("windspeed")
        val windSpeed10m: Double,
        @SerializedName("winddirection")
        val windDirection: Int,
        @SerializedName("is_day")
        val isDay: Int
    )

    data class DailyData(
        val time: List<String>,
        @SerializedName("temperature_2m_max")
        val temperature2mMax: List<Double>,
        @SerializedName("temperature_2m_min")
        val temperature2mMin: List<Double>,
        @SerializedName("weathercode")
        val weatherCode: List<Int>
    )

    data class HourlyData(
        @SerializedName("time")
        val time: List<String>,
        @SerializedName("relativehumidity_2m")
        val humidity: List<Int>,
    )
}
