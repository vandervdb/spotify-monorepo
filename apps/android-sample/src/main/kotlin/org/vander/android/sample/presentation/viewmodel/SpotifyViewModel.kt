package org.vander.android.sample.presentation.viewmodel

import android.app.Activity
import android.content.Context
import android.util.Log
import androidx.activity.result.ActivityResult
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import org.vander.core.domain.data.SpotifyPlaylistsResponse
import org.vander.core.domain.state.PlayerState
import org.vander.core.ui.presentation.viewmodel.IMiniPlayerViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.vander.spotifyclient.domain.repository.SpotifyLibraryRepository
import org.vander.spotifyclient.domain.usecase.SpotifySessionManager
import org.vander.spotifyclient.domain.usecase.SpotifyUseCase
import javax.inject.Inject

@HiltViewModel
open class SpotifyViewModel @Inject constructor(
    private val spotifyUseCase: SpotifyUseCase,
    private val spotifyLibraryRepository: SpotifyLibraryRepository,
    private val sessionManager: SpotifySessionManager
) : ViewModel(), IMiniPlayerViewModel {

    companion object {
        private const val TAG = "SpotifyViewModel"
    }

    override val playerState: StateFlow<PlayerState> =
        spotifyUseCase.playerState

    override val sessionState = sessionManager.sessionState

    override val uIQueueState = spotifyUseCase.uIQueueState

    private val _playlists = MutableStateFlow<Result<SpotifyPlaylistsResponse>?>(null)
    val playlists: StateFlow<Result<SpotifyPlaylistsResponse>?> = _playlists.asStateFlow()

    override fun startUp(activity: Activity) {
        viewModelScope.launch {
            spotifyUseCase.startUp(activity)
        }
    }


    override fun checkIfTrackSaved(trackId: String) {
        viewModelScope.launch {
            val result = spotifyLibraryRepository.isTrackSaved(trackId)
            val isSaved = result.getOrElse { false }
        }
    }

    override fun toggleSaveTrack(trackId: String) {
        val isSaved = playerState.value.isTrackSaved
        val action = if (isSaved == true) ::removeTrackFromSaved else ::saveTrack
        Log.d(TAG, "toggleSaveTrack: $isSaved")
        action(trackId)
    }

    override fun togglePlayPause() {
        viewModelScope.launch {
            spotifyUseCase.togglePlayPause()
        }
    }

    override fun skipNext() {
        viewModelScope.launch {
            spotifyUseCase.skipNext()
        }
    }

    override fun skipPrevious() {
        viewModelScope.launch {
            spotifyUseCase.skipPrevious()
        }
    }

    override fun playTrack(trackId: String) {
        viewModelScope.launch {
            spotifyUseCase.playTrack(trackId)
        }
    }

    fun saveTrack(trackId: String) {
        viewModelScope.launch {
            spotifyLibraryRepository.saveTrack(trackId).onSuccess {
                spotifyUseCase.toggleSaveTrackState(trackId)
            }
                .onFailure {
                    Log.e(TAG, "Error saving track", it)
                }
        }
    }

    fun removeTrackFromSaved(trackId: String) {
        viewModelScope.launch {
            spotifyLibraryRepository.removeTrack(trackId).onSuccess {
                spotifyUseCase.toggleSaveTrackState(trackId)
            }
                .onFailure {
                    Log.e(TAG, "Error removing track", it)
                }
        }
    }

    fun handleAuthResult(context: Context, result: ActivityResult) {
        spotifyUseCase.handleAuthResult(context, result, viewModelScope)
    }


}
