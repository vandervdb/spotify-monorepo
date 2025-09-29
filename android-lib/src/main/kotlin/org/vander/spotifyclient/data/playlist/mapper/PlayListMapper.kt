package org.vander.spotifyclient.data.playlist.mapper

import org.vander.core.domain.data.Playlist
import org.vander.core.domain.data.SpotifyPlaylistsResponse
import org.vander.core.dto.SpotifyPlaylistDto
import org.vander.core.dto.SpotifyPlaylistsResponseDto


fun SpotifyPlaylistsResponseDto.toDomain(): SpotifyPlaylistsResponse {
    return SpotifyPlaylistsResponse(
        items = items.map { it.toDomain() }
    )
}

fun SpotifyPlaylistDto.toDomain(): Playlist {
    return Playlist(
        id = id,
        name = name,
        imageUrl = images.firstOrNull()?.url.orEmpty()
    )
}
