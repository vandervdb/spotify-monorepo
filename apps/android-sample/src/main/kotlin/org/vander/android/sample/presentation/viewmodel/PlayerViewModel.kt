package org.vander.android.sample.presentation.viewmodel

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import org.vander.core.domain.state.DomainPlayerState
import org.vander.core.ui.presentation.viewmodel.IPlayerViewModel
import org.vander.spotifyclient.domain.repository.SpotifyLibraryRepository
import org.vander.spotifyclient.domain.usecase.PlayerUseCase
import org.vander.spotifyclient.domain.usecase.SpotifySessionManager
import javax.inject.Inject

@HiltViewModel
open class PlayerViewModel @Inject constructor(
    private val playerUseCase: PlayerUseCase,

    private val spotifyLibraryRepository: SpotifyLibraryRepository,
    sessionManager: SpotifySessionManager
) : ViewModel(), IPlayerViewModel {

    companion object Companion {
        private const val TAG = "PlayerViewModel"
    }

    override val domainPlayerState: StateFlow<DomainPlayerState> =
        playerUseCase.domainPlayerState

    override val sessionState = sessionManager.sessionState

    override val uIQueueState = playerUseCase.uIQueueState

    override fun startUp() {
        viewModelScope.launch {
            playerUseCase.startUp()
        }
    }


    override fun checkIfTrackSaved(trackId: String) {
        viewModelScope.launch {
            val result = spotifyLibraryRepository.isTrackSaved(trackId)
            val isSaved = result.getOrElse { false }
        }
    }

    override fun toggleSaveTrack(trackId: String) {
        val isSaved = domainPlayerState.value.isTrackSaved
        val action = if (isSaved == true) ::removeTrackFromSaved else ::saveTrack
        Log.d(TAG, "toggleSaveTrack: $isSaved")
        action(trackId)
    }

    override fun togglePlayPause() {
        viewModelScope.launch {
            playerUseCase.togglePlayPause()
        }
    }

    override fun skipNext() {
        viewModelScope.launch {
            playerUseCase.skipNext()
        }
    }

    override fun skipPrevious() {
        viewModelScope.launch {
            playerUseCase.skipPrevious()
        }
    }

    override fun playTrack(trackId: String) {
        viewModelScope.launch {
            playerUseCase.playUri(trackId)
        }
    }

    override fun seekTo(position: Long) {
        viewModelScope.launch {
            playerUseCase.seekTo(position)
        }
    }

    fun saveTrack(trackId: String) {
        viewModelScope.launch {
            spotifyLibraryRepository.saveTrack(trackId).onSuccess {
                playerUseCase.toggleSaveTrackState(trackId)
            }
                .onFailure {
                    Log.e(TAG, "Error saving track", it)
                }
        }
    }

    fun removeTrackFromSaved(trackId: String) {
        viewModelScope.launch {
            spotifyLibraryRepository.removeTrack(trackId).onSuccess {
                playerUseCase.toggleSaveTrackState(trackId)
            }
                .onFailure {
                    Log.e(TAG, "Error removing track", it)
                }
        }
    }

}
