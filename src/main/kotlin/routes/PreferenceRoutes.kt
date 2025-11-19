// user preferences routes
package routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import model.UserPreferences
import service.PreferencesService

// user preferences routes
fun Application.preferencesRoutes(preferencesService: PreferencesService) {
    routing {
        authenticate("auth-jwt") {
            get("/user/preferences") {
                val email = call.principal<JWTPrincipal>()!!.payload.subject!!
                call.respond(HttpStatusCode.OK, preferencesService.getPreferences(email) ?: UserPreferences())
            }
            post("/user/preferences") {
                val email = call.principal<JWTPrincipal>()!!.payload.subject!!
                preferencesService.savePreferences(email, call.receive<UserPreferences>())
                call.respond(HttpStatusCode.OK, "Preferences saved")
            }
        }
    }
}
