package org.vander.spotifyclient.domain.repository

import org.vander.core.domain.data.CurrentlyPlaying
import kotlinx.coroutines.flow.StateFlow

interface SpotifyQueueRepository {
    val currentQueue: StateFlow<CurrentlyPlaying?>
    suspend fun getUserQueue(): Result<CurrentlyPlaying>
}
