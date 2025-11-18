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

fun Application.preferencesRoutes(preferencesService: PreferencesService) {
    routing {
        authenticate("auth-jwt") {
            get("/user/preferences") {
                val principal = call.principal<JWTPrincipal>()!!
                val email = principal.payload.subject!!
                val prefs = preferencesService.getPreferences(email)
                call.respond(HttpStatusCode.OK, prefs ?: UserPreferences())
            }

            post("/user/preferences") {
                val principal = call.principal<JWTPrincipal>()!!
                val email = principal.payload.subject!!
                val prefs = call.receive<UserPreferences>()
                preferencesService.savePreferences(email, prefs)
                call.respond(HttpStatusCode.OK, "Preferences saved")
            }
        }
    }
}
