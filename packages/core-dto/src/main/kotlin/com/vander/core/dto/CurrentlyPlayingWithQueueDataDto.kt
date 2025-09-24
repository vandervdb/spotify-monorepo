package org.vander.spotifyclient.data.remote.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class CurrentlyPlayingWithQueueDto(
    @SerialName("currently_playing") val currentlyPlaying: TrackDto? = null,
    val queue: List<TrackDto?> = emptyList()
)
