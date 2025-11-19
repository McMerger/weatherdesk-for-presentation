// database location service
package service

import database.Locations
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import model.Location
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction

// location db service
object DatabaseLocationService {
    suspend fun saveLastLocation(userEmail: String, location: Location) = withContext(Dispatchers.IO) {
        transaction {
            Locations.update({ Locations.userEmail eq userEmail }) { it[isLastLocation] = false }
            Locations.insert { it[Locations.userEmail] = userEmail; it[latitude] = location.latitude; it[longitude] = location.longitude; it[name] = location.name; it[timestamp] = location.timestamp; it[isLastLocation] = true }
        }
    }

    suspend fun getLastLocation(userEmail: String) = withContext(Dispatchers.IO) {
        transaction {
            Locations.select { (Locations.userEmail eq userEmail) and (Locations.isLastLocation eq true) }.firstNotNullOfOrNull {
                Location(it[Locations.latitude], it[Locations.longitude], it[Locations.name], it[Locations.timestamp])
            }
        }
    }

    suspend fun addToSavedLocations(userEmail: String, location: Location) = withContext(Dispatchers.IO) {
        transaction {
            val exists = Locations.select { (Locations.userEmail eq userEmail) and (Locations.name eq location.name) }.count() > 0
            if (!exists) Locations.insert { it[Locations.userEmail] = userEmail; it[latitude] = location.latitude; it[longitude] = location.longitude; it[name] = location.name; it[timestamp] = location.timestamp; it[isLastLocation] = false }
        }
    }

    suspend fun getSavedLocations(userEmail: String) = withContext(Dispatchers.IO) {
        transaction {
            Locations.select { (Locations.userEmail eq userEmail) and (Locations.isLastLocation eq false) }.orderBy(Locations.timestamp, SortOrder.DESC).map {
                Location(it[Locations.latitude], it[Locations.longitude], it[Locations.name], it[Locations.timestamp])
            }
        }
    }

    suspend fun removeSavedLocation(userEmail: String, locationName: String) = withContext(Dispatchers.IO) {
        transaction { Locations.deleteWhere { (Locations.userEmail eq userEmail) and (Locations.name eq locationName) } }
    }
}