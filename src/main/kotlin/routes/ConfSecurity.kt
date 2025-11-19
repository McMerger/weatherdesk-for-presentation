// security config for jwt auth
package routes

import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import service.AuthService

// jwt security config
fun Application.confSecurity() {
    install(Authentication) {
        jwt("auth-jwt") {
            verifier(AuthService.getVerifier())
            validate { if (it.payload.subject != null) JWTPrincipal(it.payload) else null }
        }
    }
}
