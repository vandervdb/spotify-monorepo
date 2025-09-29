package org.vander.spotifyclient.data.repository


import org.vander.core.domain.data.SpotifyPlaylistsResponse
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import org.vander.spotifyclient.data.playlist.mapper.toDomain
import org.vander.spotifyclient.domain.datasource.IRemotePlaylistDataSource
import org.vander.spotifyclient.domain.repository.SpotifyPlaylistRepository
import javax.inject.Inject

class SpotifyPlaylistRepositoryImpl @Inject constructor(
    private val api: IRemotePlaylistDataSource
) : SpotifyPlaylistRepository {

    private val _playlists = MutableStateFlow<SpotifyPlaylistsResponse?>(null)
    override val playlists: StateFlow<SpotifyPlaylistsResponse?> = _playlists

    override suspend fun getUserPlaylists(): Result<SpotifyPlaylistsResponse> {
        return try {
            val dto = api.fetchUserPlaylists().getOrThrow()
            val result = dto.toDomain()
            _playlists.update { result }
            Result.success(result)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
