package org.vander.spotifyclient.domain.repository

interface SpotifyLibraryRepository {
    suspend fun isTrackSaved(trackId: String): Result<Boolean>
    suspend fun saveTrack(trackId: String): Result<Unit>
    suspend fun removeTrack(trackId: String): Result<Unit>
}