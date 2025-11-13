package org.vander.spotifyclient.data.player.mapper

import android.util.Log
import org.vander.core.domain.state.DomainPlayerState
import org.vander.spotifyclient.bridge.PlayerStateDto

fun DomainPlayerState.toPlayerStateDto(): PlayerStateDto {
    Log.d("DomainPlayerStateMapper", "Track uri: ${this.base.trackId}")
    return PlayerStateDto(
        isPlaying = base.playing,
        positionMs = base.positionMs,
        durationMs = base.durationMs,
        trackUri = base.trackId,
        coverId = base.coverId,
        trackName = base.trackName,
        artistName = base.artistName,
        albumName = base.albumName,
    )
}
