package service

import com.google.gson.annotations.SerializedName
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import model.*
import mu.KotlinLogging

private val logger = KotlinLogging.logger {}

class GeocodingService(private val client: HttpClient) {
    // Using both Nominatim (primary) and OpenMeteo (fallback) for best coverage
    private val nominatimBaseUrl = "https://nominatim.openstreetmap.org/search"
    private val openMeteoBaseUrl = "https://geocoding-api.open-meteo.com/v1/search"

    suspend fun searchCity(query: String, limit: Int = 5): List<GeocodingResult> {
        // Try Nominatim first (better global coverage)
        val nominatimResults = searchWithNominatim(query, limit)
        if (nominatimResults.isNotEmpty()) {
            logger.info { "Found ${nominatimResults.size} results from Nominatim for: $query" }
            return nominatimResults
        }

        // Fallback to OpenMeteo
        logger.info { "No Nominatim results, trying OpenMeteo for: $query" }
        return searchWithOpenMeteo(query, limit)
    }

    private suspend fun searchWithNominatim(query: String, limit: Int): List<GeocodingResult> {
        return try {
            val response: List<NominatimResult> = client.get(nominatimBaseUrl) {
                url {
                    parameters.append("q", query)
                    parameters.append("format", "json")
                    parameters.append("limit", limit.toString())
                    parameters.append("addressdetails", "1")
                }
                headers {
                    append("User-Agent", "WeatherDesk/1.0 (Weather Application)")
                }
            }.body()

            response.map { result ->
                GeocodingResult(
                    name = result.displayName.split(",").first().trim(),
                    latitude = result.lat.toDouble(),
                    longitude = result.lon.toDouble(),
                    country = result.address?.country ?: ""
                )
            }
        } catch (e: Exception) {
            logger.error(e) { "Failed to search with Nominatim: $query" }
            emptyList()
        }
    }

    private suspend fun searchWithOpenMeteo(query: String, limit: Int): List<GeocodingResult> {
        return try {
            val response: GeocodingResponse = client.get(openMeteoBaseUrl) {
                url {
                    parameters.append("name", query)
                    parameters.append("count", limit.toString())
                }
            }.body()
            response.results ?: emptyList()
        } catch (e: Exception) {
            logger.error(e) { "Failed to search with OpenMeteo: $query" }
            emptyList()
        }
    }

    fun close() = client.close()
}

// Nominatim API response models
data class NominatimResult(
    @SerializedName("display_name")
    val displayName: String,
    val lat: String,
    val lon: String,
    val type: String?,
    @SerializedName("addresstype")
    val addressType: String?,
    val address: NominatimAddress?
)

data class NominatimAddress(
    val city: String?,
    val town: String?,
    val village: String?,
    val hamlet: String?,
    val municipality: String?,
    val state: String?,
    val county: String?,
    val country: String?
)
