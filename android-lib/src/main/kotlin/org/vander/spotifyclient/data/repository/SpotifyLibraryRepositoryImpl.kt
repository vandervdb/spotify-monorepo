package org.vander.spotifyclient.data.repository

import org.vander.spotifyclient.domain.datasource.IRemoteLibraryDataSource
import org.vander.spotifyclient.domain.repository.SpotifyLibraryRepository
import javax.inject.Inject

class SpotifyLibraryRepositoryImpl @Inject constructor(
    private val api: IRemoteLibraryDataSource // ou ton client Spotify actuel
) : SpotifyLibraryRepository {

    override suspend fun isTrackSaved(trackId: String): Result<Boolean> {
        return api.fetchIsTrackSaved(trackId)
    }

    override suspend fun saveTrack(trackId: String): Result<Unit> {
        return api.saveTrack(trackId)
    }

    override suspend fun removeTrack(trackId: String): Result<Unit> {
        return api.removeTrack(trackId)
    }
}