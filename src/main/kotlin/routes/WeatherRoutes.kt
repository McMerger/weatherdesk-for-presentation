// weather api routes
package routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import model.RatingRequest
import service.RatingService
import service.WeatherService

// main weather api routes
fun Application.weatherRoutes(weatherService: WeatherService, ratingService: RatingService) {
    routing {
        // get weather by city or coordinates
        get("/weather") {
            val city = call.request.queryParameters["city"]
            val lat = call.request.queryParameters["lat"]?.toDoubleOrNull()
            val lon = call.request.queryParameters["lon"]?.toDoubleOrNull()

            try {
                // either city name or lat/lon
                val data = when {
                    !city.isNullOrBlank() -> weatherService.getWeatherByCity(city)
                    lat != null && lon != null -> weatherService.getWeatherByCoordinates(lat, lon)
                    else -> return@get call.respond(HttpStatusCode.BadRequest, "Provide city or lat & lon")
                }

                if (data != null) {
                    call.respond(HttpStatusCode.OK, data)
                } else {
                    call.respond(HttpStatusCode.NotFound, "Weather data not available for the requested location")
                }
            } catch (e: Exception) {
                call.application.environment.log.error("Failed to fetch weather", e)
                call.respond(HttpStatusCode.InternalServerError, "Failed to fetch weather: ${e.message}")
            }
        }

        // rating endpoint - no auth required
        post("/weather/rating") {
            val principal = call.principal<JWTPrincipal>()
            val email = principal?.payload?.subject ?: "anonymous"
            val req = call.receive<RatingRequest>()
            ratingService.saveRating(email, req)
            call.respond(HttpStatusCode.OK, mapOf("message" to "Rating saved", "city" to req.city))
        }

        // get avg rating for a city
        get("/weather/rating") {
            val city = call.request.queryParameters["city"] ?: return@get call.respond(HttpStatusCode.BadRequest, "City parameter required")
            val avg = ratingService.getAverageRating(city)
            call.respond(HttpStatusCode.OK, mapOf("city" to city, "average" to avg))
        }

        // auth protected stuff
        authenticate("auth-jwt") {
            get("/weather/my-ratings") {
                val principal = call.principal<JWTPrincipal>()!!
                val email = principal.payload.subject!!
                // TODO: actually implement this
                call.respond(HttpStatusCode.OK, mapOf("email" to email, "message" to "User ratings endpoint"))
            }
        }
    }
}