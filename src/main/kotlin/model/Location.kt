// location data model
package model

import kotlinx.serialization.Serializable

@Serializable
data class Location(val latitude: Double, val longitude: Double, val name: String, val timestamp: Long = System.currentTimeMillis()) {
    fun toMap() = mapOf("latitude" to latitude, "longitude" to longitude, "name" to name, "timestamp" to timestamp)
    companion object {
        fun fromMap(map: Map<String, Any?>) = Location((map["latitude"] as Number).toDouble(), (map["longitude"] as Number).toDouble(), map["name"] as String, (map["timestamp"] as? Number)?.toLong() ?: System.currentTimeMillis())
    }
}