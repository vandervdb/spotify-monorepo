package org.vander.spotifyclient.domain.datasource

import com.vander.core.dto.SpotifyPlaylistsResponseDto


fun interface IRemotePlaylistDataSource {
    suspend fun fetchUserPlaylists(): Result<SpotifyPlaylistsResponseDto>
}
