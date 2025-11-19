// rating service for forecast ratings
package service

import model.RatingRequest
import mu.KotlinLogging
import org.intellij.lang.annotations.Language
import java.sql.DriverManager

private val logger = KotlinLogging.logger {}

interface RatingService {
    suspend fun saveRating(userEmail: String, req: RatingRequest)
    suspend fun getAverageRating(city: String): Double?
}

// sqlite rating service
class SqliteRatingService(private val jdbcUrl: String = "jdbc:sqlite:weather_app.db") : RatingService {
    init {
        DriverManager.getConnection(jdbcUrl).use { conn ->
            @Language("SQLite")
            val createTableSql = "CREATE TABLE IF NOT EXISTS ratings (id INTEGER PRIMARY KEY AUTOINCREMENT, city TEXT NOT NULL, rating INTEGER NOT NULL, userEmail TEXT, date TEXT, createdAt INTEGER);"
            conn.createStatement().use { it.execute(createTableSql) }
        }
    }

    override suspend fun saveRating(userEmail: String, req: RatingRequest) {
        DriverManager.getConnection(jdbcUrl).use { conn ->
            @Language("SQLite")
            val sql = "INSERT INTO ratings (city, rating, userEmail, date, createdAt) VALUES (?,?,?,?,?)"
            conn.prepareStatement(sql).use { ps ->
                ps.setString(1, req.city)
                ps.setInt(2, req.rating)
                ps.setString(3, userEmail)
                ps.setString(4, req.date ?: java.time.LocalDate.now().toString())
                ps.setLong(5, System.currentTimeMillis())
                ps.executeUpdate()
            }
        }
    }

    override suspend fun getAverageRating(city: String): Double? {
        DriverManager.getConnection(jdbcUrl).use { conn ->
            @Language("SQLite")
            val sql = "SELECT AVG(rating) as avgRating FROM ratings WHERE city = ?"
            conn.prepareStatement(sql).use { ps ->
                ps.setString(1, city)
                val rs = ps.executeQuery()
                if (rs.next()) {
                    val avg = rs.getDouble("avgRating")
                    return if (rs.wasNull()) null else avg
                }
            }
        }
        return null
    }
}