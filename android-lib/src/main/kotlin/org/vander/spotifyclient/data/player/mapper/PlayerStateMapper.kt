package org.vander.spotifyclient.data.player.mapper

import com.spotify.protocol.types.PlayerState
import org.vander.core.domain.state.PlayerStateData
import org.vander.core.logger.Logger

private const val REPEAT_CONTEXT = 1
private const val REPEAT_TRACK = 2


fun PlayerState.toPlayerStateData(logger: Logger? = null): PlayerStateData {
    val track = this.track

    logger?.d("PlayerStateMapper", "Track uri=${track?.uri}, name=${track?.name}")

    return PlayerStateData(
        trackName = track?.name ?: "Unknown Track",
        artistName = track?.artist?.name ?: "Unknown Artist",
        albumName = track?.album?.name ?: "Unknown Album",
        coverId = track?.imageUri?.toString()
            ?.extractSpotifyCoverIdOrNull()
            ?: "",
        trackId = track?.uri?.toString()
            ?.extractSpotifyTrackIdOrNull()
            ?: "",
        isPaused = isPaused,
        playing = !isPaused,
        paused = isPaused,
        stopped = false,
        shuffling = playbackOptions?.isShuffling == true,
        repeating = playbackOptions?.repeatMode == REPEAT_CONTEXT ||
                playbackOptions?.repeatMode == REPEAT_TRACK, // true si repeat actif
        seeking = false,
        // attention: "skippingNext/Previous" dans Domain sonnent comme "en cours de skip".
        // Ici, on expose la RESTRICTION : canSkip==false -> on ne PEUT PAS skipper.
        // Si Domain veut "isSkipping", laisse false par défaut ou renomme le champ côté Domain.
        skippingNext = playbackRestrictions?.canSkipNext == false,
        skippingPrevious = playbackRestrictions?.canSkipPrev == false,
        positionMs = playbackPosition,
        durationMs = track?.duration ?: 0
    )
}

fun String.extractSpotifyCoverIdOrNull(): String? =
    if (startsWith("ImageId{spotify:image:")) {
        substringAfter("ImageId{spotify:image:").substringBefore("'}")
    } else null

fun String.extractSpotifyTrackIdOrNull(): String? =
    if (startsWith("spotify:track:")) substringAfter("spotify:track:") else null
