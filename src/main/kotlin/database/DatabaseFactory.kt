package database

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.Database

object UserDetails : Table() {
    val id = integer("id").autoIncrement()
    val email = varchar("email", 255).uniqueIndex()
    val passwordHash = varchar("password_hash", 60)
    val createdAt = long("created_at")
    override val primaryKey = PrimaryKey(id)
}

object Locations : Table() {
    val id = integer("id").autoIncrement()
    val userEmail = varchar("user_email", 255).references(UserDetails.email)
    val latitude = double("latitude")
    val longitude = double("longitude")
    val name = varchar("name", 255)
    val timestamp = long("timestamp")
    val isLastLocation = bool("is_last_location").default(false)
    override val primaryKey = PrimaryKey(id)
}

object DatabaseFactory {
    fun init() {
        Database.connect("jdbc:sqlite:weather_app.db", driver = "org.sqlite.JDBC")
        transaction {
            SchemaUtils.create(UserDetails, Locations)
        }
    }
}