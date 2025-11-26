package org.vander.spotifyclient.domain.usecase

import android.util.Log
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.vander.core.domain.data.CurrentlyPlaying
import org.vander.core.domain.player.PlayerStateRepository
import org.vander.core.domain.state.DomainPlayerState
import org.vander.core.domain.state.PlayerStateData
import org.vander.core.domain.state.SavedRemotelyChangedState
import org.vander.core.domain.state.SessionState
import org.vander.core.ui.domain.UIQueueItem
import org.vander.core.ui.state.UIQueueState
import org.vander.spotifyclient.domain.player.PlayerClient
import org.vander.spotifyclient.domain.repository.LibraryRepository
import org.vander.spotifyclient.domain.state.setTrackSaved
import org.vander.spotifyclient.domain.state.togglePause
import org.vander.spotifyclient.domain.state.update
import javax.inject.Inject

class PlayerUseCase
@Inject
constructor(
    val sessionUseCase: SpotifySessionManager,
    val remoteUseCase: SpotifyRemoteUseCase,
    val playerStateRepository: PlayerStateRepository,
    val libraryRepository: LibraryRepository,
    val playerRepository: PlayerStateRepository,
    val playerClient: PlayerClient,
) {
    private val _domainPlayerState =
        MutableStateFlow(DomainPlayerState.empty())
    val domainPlayerState: StateFlow<DomainPlayerState> = _domainPlayerState.asStateFlow()

    val currentUserQueue: StateFlow<CurrentlyPlaying?> = remoteUseCase.currentUserQueue

    private val _uIQueueState = MutableStateFlow<UIQueueState>(UIQueueState.empty())
    val uIQueueState: StateFlow<UIQueueState> = _uIQueueState.asStateFlow()

    val savedRemotelyChangedState: StateFlow<SavedRemotelyChangedState> =
        playerStateRepository.savedRemotelyChangedState

    private var hasReceivedUpdatedQueue = false

    suspend fun startUp() =
        coroutineScope {
            Log.d(TAG, "Starting up...")
            launch { updateSpotifyPlayerStateAndUIQueueState() }
            launch { collectSessionState() }
            launch { observeSavedRemotelyChangedState() }
        }

    suspend fun shutDown() = sessionUseCase.shutDown()

    suspend fun togglePlayPause() {
        _domainPlayerState.togglePause()
        if (playerClient.isPlaying()) {
            playerClient.pause()
        } else {
            playerClient.resume()
        }
        _domainPlayerState.togglePause()
    }

    suspend fun pause() = playerClient.pause()

    suspend fun resume() = playerClient.resume()

    suspend fun seekTo(ms: Long) = playerClient.seekTo(ms)

    fun toggleSaveTrackState(trackId: String) {
        val newSaveState = _domainPlayerState.value.isTrackSaved == false
        _domainPlayerState.setTrackSaved(newSaveState)
    }

    suspend fun skipNext() = playerClient.skipNext()

    suspend fun skipPrevious() = playerClient.skipPrevious()

    suspend fun playUri(uri: String) = playerClient.play("spotify:track:$uri")

    private suspend fun collectSessionState() {
        Log.d(TAG, "Collecting session state...")
        sessionUseCase.sessionState.collect { sessionState ->
            Log.d(TAG, "Received session state: $sessionState")
            when (sessionState) {
                is SessionState.Ready -> {
                    Log.d(TAG, "Session state: Ready")
                    remoteUseCase.getAndEmitUserQueueFlow()
                    playerRepository.startListening()
                }

                else -> {
                    Log.d(TAG, "Session state: $sessionState")
                }
            }
        }
    }

    private suspend fun observeSavedRemotelyChangedState() {
        Log.d(TAG, "Observing saved remotely changed state...")
        savedRemotelyChangedState.collect { state ->
            val isSaved = state.isSaved
            Log.d(TAG, "Received saved remotely changed state: $isSaved")
            if (isSaved) {
                Log.d(TAG, "Saved remotely changed state: true")
                val trackId = state.trackId
                updateSpotifyPlayerWithIsSavedState(playerStateData = null, trackId)
            }
        }
    }

    private suspend fun updateSpotifyPlayerStateAndUIQueueState() {
        combine(
            currentUserQueue,
            playerStateRepository.playerStateData,
        ) { queueData, playerStateData ->
            Pair(queueData, playerStateData)
        }.collect { (queueData, playerStateData) ->
            Log.d(TAG, "Received player state data: $playerStateData")
            Log.d(TAG, "Received queue data: $queueData")
            if (queueData != null && !hasReceivedUpdatedQueue) {
                val playerStateDataItem =
                    UIQueueItem(
                        trackName = playerStateData.trackName,
                        artistName = playerStateData.artistName,
                        trackId = playerStateData.trackId,
                    )
                val matchesCurrent = queueData.currentlyPlaying?.id == playerStateData.trackId
                if (!matchesCurrent) {
                    Log.d(
                        TAG,
                        "queueData's currentlyPlaying and playerStateData don't share same trackId",
                    )
                    remoteUseCase.getAndEmitUserQueueFlow()
                    return@collect
                }
                Log.d(TAG, "queueData's currentlyPlaying and playerStateData share same trackId")
                Log.d(TAG, "Updating UI queue state...")
                hasReceivedUpdatedQueue = true
                val queueListItems =
                    queueData.queue.tracks.map {
                        UIQueueItem(
                            trackName = it.name,
                            artistName = it.artists[0].name,
                            trackId = it.id,
                        )
                    }
                val parsedQueAndPlayerStateItems = listOf(playerStateDataItem) + queueListItems
                _uIQueueState.update { UIQueueState(parsedQueAndPlayerStateItems) }
            }

            if (hasReceivedUpdatedQueue && playerStateData != PlayerStateData.empty()) {
                if (!isTrackInQueue(playerStateData.trackId, _uIQueueState.value)) {
                    Log.d(TAG, "Queue is not updated, so we will request it again")
                    hasReceivedUpdatedQueue = false
                    remoteUseCase.getAndEmitUserQueueFlow()
                }
                updateSpotifyPlayerWithIsSavedState(playerStateData)
            }
        }
    }

    private suspend fun updateSpotifyPlayerWithIsSavedState(
        playerStateData: PlayerStateData? = null,
        trackId: String? = null,
    ) {
        Log.d(TAG, "Updating Spotify player state: $playerStateData")
        val currentTrackId = playerStateData?.trackId ?: trackId!!
        val isSaved = libraryRepository.isTrackSaved(currentTrackId).getOrDefault(false)
        val currentPlayerState = _domainPlayerState.value
        Log.d(TAG, "(Spotify player state: $currentPlayerState)")
        _domainPlayerState.update { currentPlayerState.copy(isTrackSaved = isSaved) }

        if (playerStateData != null) {
            _domainPlayerState.update { _domainPlayerState.value.copy(base = playerStateData) }
        }
    }

    fun isTrackInQueue(
        trackIdToFind: String,
        uIQueueState: UIQueueState,
    ): Boolean = uIQueueState.items.any { it.trackId == trackIdToFind }

    companion object Companion {
        private const val TAG = "PlayerUseCase"
    }
}
