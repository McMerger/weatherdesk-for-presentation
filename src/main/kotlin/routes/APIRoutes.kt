// auth and location api routes
package routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import model.*
import service.*

// auth and location routes
fun Application.apiRoutes() {
    routing {
        route("/auth") {
            post("/register") {
                val req = call.receive<RegisterRequest>()
                val success = AuthService.register(req.email, req.password)
                if (success) call.respond(HttpStatusCode.OK, "Registered successfully")
                else call.respond(HttpStatusCode.Conflict, "Email already exists")
            }
            post("/login") {
                val req = call.receive<LoginRequest>()
                val token = AuthService.login(req.email, req.password)
                if (token != null) call.respond(LoginResponse(token))
                else call.respond(HttpStatusCode.Unauthorized, "Invalid credentials")
            }
        }
        // protected routes
        authenticate("auth-jwt") {
            post("/location") {
                val email = call.principal<JWTPrincipal>()!!.payload.subject!!
                DatabaseLocationService.saveLastLocation(email, call.receive<Location>())
                call.respond(HttpStatusCode.OK, "Location saved")
            }
            get("/location") {
                val email = call.principal<JWTPrincipal>()!!.payload.subject!!
                val location = DatabaseLocationService.getLastLocation(email)
                if (location != null) call.respond(location)
                else call.respond(HttpStatusCode.NotFound, "No location found")
            }
            post("/locations/saved") {
                val email = call.principal<JWTPrincipal>()!!.payload.subject!!
                DatabaseLocationService.addToSavedLocations(email, call.receive<Location>())
                call.respond(HttpStatusCode.OK, "Saved location added")
            }
            get("/locations/saved") {
                val email = call.principal<JWTPrincipal>()!!.payload.subject!!
                call.respond(DatabaseLocationService.getSavedLocations(email))
            }
            delete("/locations/saved/{name}") {
                val email = call.principal<JWTPrincipal>()!!.payload.subject!!
                val name = call.parameters["name"] ?: return@delete call.respond(HttpStatusCode.BadRequest)
                DatabaseLocationService.removeSavedLocation(email, name)
                call.respond(HttpStatusCode.OK, "Saved location removed")
            }
        }
    }
}