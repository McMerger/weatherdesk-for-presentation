package routes

import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import service.AuthService

fun Application.confSecurity() {
    install(Authentication) {
        jwt("auth-jwt") {
            verifier(AuthService.getVerifier())
            validate { credential ->
                if (credential.payload.subject != null) JWTPrincipal(credential.payload) else null
            }
        }
    }
}
