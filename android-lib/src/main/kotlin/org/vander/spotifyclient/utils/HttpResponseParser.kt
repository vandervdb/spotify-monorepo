package org.vander.spotifyclient.utils

import android.util.Log
import com.vander.core.dto.ErrorResponseDto
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject

inline fun <reified T> parseSpotifyResultFromBody(
    rawBody: String,
    tag: String = "SpotifyApi"
): Result<T> {
    val json = Json { ignoreUnknownKeys = true }
    return try {
        val root = json.parseToJsonElement(rawBody).jsonObject
        if ("error" in root) {
            val errorDto = json.decodeFromString<ErrorResponseDto>(rawBody)
            Log.e(tag, "Spotify error ${errorDto.error.status} : ${errorDto.error.message}")
            Result.failure(Exception("Spotify error ${errorDto.error.status}: ${errorDto.error.message}"))
        } else {
            val result = json.decodeFromString<T>(rawBody)
            Result.success(result)
        }
    } catch (e: Exception) {
        Log.e(tag, "JSON parsing error", e)
        Result.failure(e)
    }
}
