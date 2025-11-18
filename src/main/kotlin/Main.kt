import routes.*
import service.*
import database.DatabaseFactory

import mu.KotlinLogging
import com.google.gson.*
import io.ktor.serialization.gson.gson
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.plugins.cors.routing.CORS
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import java.lang.reflect.Type
import java.time.LocalDate
import java.time.format.DateTimeFormatter

val logger = KotlinLogging.logger {}
val localDateAdapter: JsonSerializer<LocalDate> = object : JsonSerializer<LocalDate>, JsonDeserializer<LocalDate> {
    private val formatter = DateTimeFormatter.ISO_LOCAL_DATE

    override fun serialize(src: LocalDate, typeOfSrc: Type?, context: JsonSerializationContext?): JsonElement {
        return JsonPrimitive(src.format(formatter))
    }

    override fun deserialize(json: JsonElement, typeOfT: Type?, context: JsonDeserializationContext?): LocalDate {
        return LocalDate.parse(json.asString, formatter)
    }
}

fun main() {
    DatabaseFactory.init()
    logger.info("Starting server on port 8080...")

    embeddedServer(
        Netty, port = 8080, module = Application::module
    ).start(wait = true)
}

fun Application.module() {
    install(CORS) {
        allowHost("localhost:9002", schemes = listOf("http", "https"))
        allowHost("localhost:3000", schemes = listOf("http", "https"))
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowHeader(HttpHeaders.Authorization)
        allowHeader(HttpHeaders.ContentType)
        allowCredentials = true
    }

    install(ContentNegotiation) {
        gson {
            setPrettyPrinting()
            registerTypeAdapter(
                LocalDate::class.java,
                localDateAdapter
            )
        }
    }

    val httpClient = WeatherService.defaultClient()
    val weatherService = WeatherService(httpClient)
    val geocodingService = GeocodingService(httpClient)
    val ratingService = SqliteRatingService("jdbc:sqlite:weather_app.db")
    val preferencesService = SqlitePreferencesService("jdbc:sqlite:weather_app.db")

    confSecurity()
    weatherRoutes(weatherService, ratingService)
    preferencesRoutes(preferencesService)
    geocodingRoutes(geocodingService)
    apiRoutes()
}
