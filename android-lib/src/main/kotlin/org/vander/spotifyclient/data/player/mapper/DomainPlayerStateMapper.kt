package org.vander.spotifyclient.data.player.mapper

import android.util.Log
import org.vander.core.domain.state.DomainPlayerState
import org.vander.core.domain.state.albumName
import org.vander.core.domain.state.artistName
import org.vander.core.domain.state.coverId
import org.vander.core.domain.state.durationMs
import org.vander.core.domain.state.playing
import org.vander.core.domain.state.positionMs
import org.vander.core.domain.state.trackId
import org.vander.core.domain.state.trackName
import org.vander.spotifyclient.bridge.PlayerStateDto

fun DomainPlayerState.toPlayerStateDto(): PlayerStateDto {
    Log.d("DomainPlayerStateMapper", "Track uri: ${this.trackId}")
    return PlayerStateDto(
        isPlaying = playing,
        positionMs = positionMs,
        durationMs = durationMs,
        trackUri = trackId,
        coverId = coverId,
        trackName = trackName,
        artistName = artistName,
        albumName = albumName,
    )
}
