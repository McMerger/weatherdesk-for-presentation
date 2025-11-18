package service

import model.UserPreferences
import model.TemperatureUnit
import model.WindSpeedUnit
import model.ThemeMode
import org.intellij.lang.annotations.Language
import java.sql.DriverManager

interface PreferencesService {
    suspend fun getPreferences(userEmail: String): UserPreferences?
    suspend fun savePreferences(userEmail: String, prefs: UserPreferences)
}

class SqlitePreferencesService(private val jdbcUrl: String = "jdbc:sqlite:weather_app.db") : PreferencesService {
    init {
        DriverManager.getConnection(jdbcUrl).use { conn ->
            @Language("SQLite")
            val createTableSql = """
                CREATE TABLE IF NOT EXISTS preferences (
                  email TEXT PRIMARY KEY,
                  preferredTempUnit TEXT,
                  preferredWindUnit TEXT,
                  theme TEXT,
                  lastSearchedCity TEXT,
                  lastSearchedLatitude REAL,
                  lastSearchedLongitude REAL,
                  updatedAt INTEGER
                );
            """.trimIndent()
            conn.createStatement().use { stmt ->
                stmt.execute(createTableSql)
            }
        }
    }

    override suspend fun getPreferences(userEmail: String): UserPreferences? {
        DriverManager.getConnection(jdbcUrl).use { conn ->
            @Language("SQLite")
            val sql = "SELECT * FROM preferences WHERE email = ?"
            conn.prepareStatement(sql).use { ps ->
                ps.setString(1, userEmail)
                val rs = ps.executeQuery()
                if (rs.next()) {
                    return UserPreferences(
                        preferredTempUnit = try { TemperatureUnit.valueOf(rs.getString("preferredTempUnit")) } catch(e: Exception){ TemperatureUnit.CELSIUS },
                        preferredWindUnit = try { WindSpeedUnit.valueOf(rs.getString("preferredWindUnit")) } catch(e: Exception) { WindSpeedUnit.KILOMETERS_PER_HOUR },
                        theme = try { ThemeMode.valueOf(rs.getString("theme")) } catch(e:Exception){ ThemeMode.AUTO },
                        lastSearchedCity = rs.getString("lastSearchedCity"),
                        lastSearchedLatitude = rs.getDouble("lastSearchedLatitude").takeIf { !rs.wasNull() },
                        lastSearchedLongitude = rs.getDouble("lastSearchedLongitude").takeIf { !rs.wasNull() }
                    )
                }
            }
        }
        return null
    }

    override suspend fun savePreferences(userEmail: String, prefs: UserPreferences) {
        DriverManager.getConnection(jdbcUrl).use { conn ->
            @Language("SQLite")
            val sql = """
                INSERT INTO preferences (email, preferredTempUnit, preferredWindUnit, theme, lastSearchedCity, lastSearchedLatitude, lastSearchedLongitude, updatedAt)
                VALUES (?,?,?,?,?,?,?,?)
                ON CONFLICT(email) DO UPDATE SET
                 preferredTempUnit = excluded.preferredTempUnit,
                 preferredWindUnit = excluded.preferredWindUnit,
                 theme = excluded.theme,
                 lastSearchedCity = excluded.lastSearchedCity,
                 lastSearchedLatitude = excluded.lastSearchedLatitude,
                 lastSearchedLongitude = excluded.lastSearchedLongitude,
                 updatedAt = excluded.updatedAt
            """.trimIndent()
            conn.prepareStatement(sql).use { ps ->
                ps.setString(1, userEmail)
                ps.setString(2, prefs.preferredTempUnit.name)
                ps.setString(3, prefs.preferredWindUnit.name)
                ps.setString(4, prefs.theme.name)
                ps.setString(5, prefs.lastSearchedCity)
                if (prefs.lastSearchedLatitude != null) ps.setDouble(6, prefs.lastSearchedLatitude) else ps.setNull(6, java.sql.Types.REAL)
                if (prefs.lastSearchedLongitude != null) ps.setDouble(7, prefs.lastSearchedLongitude) else ps.setNull(7, java.sql.Types.REAL)
                ps.setLong(8, System.currentTimeMillis())
                ps.executeUpdate()
            }
        }
    }
}