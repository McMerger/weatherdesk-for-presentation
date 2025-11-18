package service

import database.Locations
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import model.Location
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update

object DatabaseLocationService {
    suspend fun saveLastLocation(userEmail: String, location: Location) = withContext(Dispatchers.IO) {
        transaction {
            // Mark all existing locations as not last
            Locations.update({ Locations.userEmail eq userEmail }) {
                it[isLastLocation] = false
            }

            // Insert new last location
            Locations.insert {
                it[Locations.userEmail] = userEmail
                it[latitude] = location.latitude
                it[longitude] = location.longitude
                it[name] = location.name
                it[timestamp] = location.timestamp
                it[isLastLocation] = true
            }
        }
    }

    suspend fun getLastLocation(userEmail: String): Location? = withContext(Dispatchers.IO) {
        transaction {
            Locations.select {
                (Locations.userEmail eq userEmail) and (Locations.isLastLocation eq true)
            }.firstNotNullOfOrNull {
                Location(
                    latitude = it[Locations.latitude],
                    longitude = it[Locations.longitude],
                    name = it[Locations.name],
                    timestamp = it[Locations.timestamp]
                )
            }
        }
    }

    suspend fun addToSavedLocations(userEmail: String, location: Location) = withContext(Dispatchers.IO) {
        transaction {
            // Avoid duplicates: if same name exists, skip
            val exists = Locations.select {
                (Locations.userEmail eq userEmail) and (Locations.name eq location.name)
            }.count() > 0
            if (!exists) {
                Locations.insert {
                    it[Locations.userEmail] = userEmail
                    it[latitude] = location.latitude
                    it[longitude] = location.longitude
                    it[name] = location.name
                    it[timestamp] = location.timestamp
                    it[isLastLocation] = false
                }
            }
        }
    }

    // Get all saved locations (excluding last)
    suspend fun getSavedLocations(userEmail: String): List<Location> = withContext(Dispatchers.IO) {
        transaction {
            Locations.select {
                (Locations.userEmail eq userEmail) and (Locations.isLastLocation eq false)
            }.orderBy(Locations.timestamp, SortOrder.DESC)
            .map {
                Location(
                    latitude = it[Locations.latitude],
                    longitude = it[Locations.longitude],
                    name = it[Locations.name],
                    timestamp = it[Locations.timestamp]
                )
            }
        }
    }

    // Remove a saved location by name
    suspend fun removeSavedLocation(userEmail: String, locationName: String) = withContext(Dispatchers.IO) {
        transaction {
            Locations.deleteWhere {
                (Locations.userEmail eq userEmail) and (Locations.name eq locationName)
            }
        }
    }
}