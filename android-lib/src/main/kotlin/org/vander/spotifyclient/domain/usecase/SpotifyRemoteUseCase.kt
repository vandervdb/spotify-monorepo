package org.vander.spotifyclient.domain.usecase

import android.util.Log
import com.vander.core.domain.data.CurrentlyPlaying
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import org.vander.spotifyclient.domain.repository.SpotifyQueueRepository
import javax.inject.Inject

class SpotifyRemoteUseCase @Inject constructor(
    private val queueRepository: SpotifyQueueRepository,
) {

    companion object {
        private const val TAG = "SpotifyRemoteUseCase"
    }

    private val _currentUserQueue = MutableStateFlow<CurrentlyPlaying?>(null)
    val currentUserQueue: StateFlow<CurrentlyPlaying?> = _currentUserQueue.asStateFlow()

    suspend fun getAndEmitUserQueueFlow() {
        queueRepository.getUserQueue().fold(
            onSuccess = { currentUserQueue ->
                Log.d(TAG, "Received user queue: $currentUserQueue")
                _currentUserQueue.update { currentUserQueue }
            },
            onFailure = { exception ->
                Log.e(TAG, "Error getting user queue", exception)
            }
        )
    }
}
