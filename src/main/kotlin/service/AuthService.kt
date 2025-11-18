package service

import at.favre.lib.crypto.bcrypt.BCrypt
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import database.UserDetails
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.*

object AuthService {

    private const val JWT_SECRET = "super-secret-for-school-project"
    private const val JWT_ISSUER = "ktor-weather-app"
    private const val JWT_EXPIRATION = 24 * 60 * 60 * 1000 // 1 day in ms

    suspend fun register(email: String, password: String): Boolean = withContext(Dispatchers.IO) {
        val hash = BCrypt.withDefaults().hashToString(12, password.toCharArray())
        transaction {
            if (UserDetails.select { UserDetails.email eq email }.count() > 0) return@transaction false
            UserDetails.insert {
                it[UserDetails.email] = email
                it[UserDetails.passwordHash] = hash
                it[createdAt] = System.currentTimeMillis()
            }
            true
        }
    }

    suspend fun login(email: String, password: String): String? = withContext(Dispatchers.IO) {
        val user = transaction {
            UserDetails.select { UserDetails.email eq email }.singleOrNull()
        } ?: return@withContext null

        val hash = user[UserDetails.passwordHash]
        val result = BCrypt.verifyer().verify(password.toCharArray(), hash)
        if (!result.verified) return@withContext null

        generateToken(email)
    }

    private fun generateToken(email: String): String {
        val now = System.currentTimeMillis()
        return JWT.create()
            .withIssuer(JWT_ISSUER)
            .withSubject(email)
            .withExpiresAt(Date(now + JWT_EXPIRATION))
            .sign(Algorithm.HMAC256(JWT_SECRET))
    }

    fun getVerifier() = JWT
        .require(Algorithm.HMAC256(JWT_SECRET))
        .withIssuer(JWT_ISSUER)
        .build()!!
}
