// geocoding api routes
package routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import service.GeocodingService

// geocoding endpoint
fun Application.geocodingRoutes(geocodingService: GeocodingService) {
    routing {
        get("/geocode") {
            val query = call.request.queryParameters["q"]
            if (query.isNullOrBlank()) return@get call.respond(HttpStatusCode.BadRequest, "Missing query")
            call.respond(geocodingService.searchCity(query))
        }
    }
}