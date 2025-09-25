package org.vander.spotifyclient.domain.repository

import com.vander.core.domain.data.SpotifyPlaylistsResponse
import kotlinx.coroutines.flow.StateFlow

interface SpotifyPlaylistRepository {
    val playlists: StateFlow<SpotifyPlaylistsResponse?>
    suspend fun getUserPlaylists(): Result<SpotifyPlaylistsResponse>
}
