package org.vander.spotifyclient.data.remote.mapper

import org.vander.core.domain.data.Album
import org.vander.core.domain.data.Artist
import org.vander.core.domain.data.CurrentlyPlaying
import org.vander.core.domain.data.Image
import org.vander.core.domain.data.Queue
import org.vander.core.domain.data.Track
import org.vander.core.dto.AlbumDto
import org.vander.core.dto.ArtistDto
import org.vander.core.dto.CurrentlyPlayingWithQueueDto
import org.vander.core.dto.ImageDto
import org.vander.core.dto.TrackDto


fun CurrentlyPlayingWithQueueDto.toDomain(): CurrentlyPlaying {
    return CurrentlyPlaying(
        currentlyPlaying = currentlyPlaying?.toDomain(),
        queue = Queue(
            tracks = queue.map { it?.toDomain() ?: Track.empty() }
        )
    )
}

fun TrackDto.toDomain(): Track {
    return Track(
        album = album.toDomain(),
        artists = artists.map { it.toDomain() },
        availableMarkets = availableMarkets,
        discNumber = discNumber,
        durationMs = durationMs,
        explicit = explicit,
        externalIds = externalIds.isrc ?: "",
        externalUrls = externalUrls.spotify,
        href = href,
        id = id,
        isPlayable = isPlayable,
        name = name,
        trackNumber = trackNumber,
        type = type,
        uri = uri
    )
}

fun AlbumDto.toDomain(): Album {
    return Album(
        albumType = albumType,
        totalTracks = totalTracks,
        availableMarkets = availableMarkets,
        externalUrls = externalUrls.spotify,
        href = href,
        id = id,
        images = images.map { it.toDomain() },
        name = name,
        releaseDate = releaseDate,
        type = type,
        uri = uri,
        artists = artists.map { it.toDomain() }
    )
}

fun ArtistDto.toDomain(): Artist {
    return Artist(
        externalUrls = externalUrls.spotify,
        href = href,
        id = id,
        name = name,
        type = type,
        uri = uri
    )
}

fun ImageDto.toDomain(): Image {
    return Image(
        url = url,
        height = height,
        width = width
    )
}
