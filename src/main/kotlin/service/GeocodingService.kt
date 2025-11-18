package service

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import model.*
import mu.KotlinLogging

private val logger = KotlinLogging.logger {}

class GeocodingService(private val client: HttpClient) {
    private val geocodingBaseUrl = "https://geocoding-api.open-meteo.com/v1/search"

    suspend fun searchCity(query: String, limit: Int = 5): List<GeocodingResult> {
        return try {
            val response: GeocodingResponse = client.get("$geocodingBaseUrl?name=$query&count=$limit").body()
            response.results ?: emptyList()
        } catch (e: Exception) {
            logger.error(e) { "Failed to search city: $query" }
            emptyList()
        }
    }

    fun close() = client.close()
}
