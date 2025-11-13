package org.vander.fake.spotify

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import org.vander.core.domain.state.DomainPlayerState
import org.vander.core.domain.state.PlayerStateData
import org.vander.core.domain.state.SessionState
import org.vander.core.ui.presentation.viewmodel.PlayerViewModel
import org.vander.core.ui.state.UIQueueState

class FakePlayerViewModel : PlayerViewModel {

    // Backing properties
    private val _sessionState = MutableStateFlow<SessionState>(SessionState.Ready)
    private val _uiQueueState = MutableStateFlow(UIQueueState.empty())
    private val _domainPlayerState = MutableStateFlow(
        DomainPlayerState(
            base = PlayerStateData(
                trackName = "Zelda's Theme",
                artistName = "Koji Kondo",
                albumName = "Zelda",
                coverId = "",
                trackId = "",
                isPaused = true,
                playing = false,
                paused = true,
                stopped = false,
                shuffling = false,
                repeating = true,
                seeking = false,
                skippingNext = false,
                skippingPrevious = false,
                positionMs = 1234567890L,
                durationMs = 1234567890L
            ),
            isTrackSaved = false
        )
    )

    override val sessionState: StateFlow<SessionState> = _sessionState.asStateFlow()
    override val uIQueueState: StateFlow<UIQueueState> = _uiQueueState.asStateFlow()
    override val domainPlayerState: StateFlow<DomainPlayerState> = _domainPlayerState.asStateFlow()

    override fun startUp() {
        // TODO: initialise si besoin (_sessionState.value = SessionState.Ready, etc.)
    }

    override fun togglePlayPause() {
        // TODO: ex. _domainPlayerState.update { it.togglePause() }
    }

    override fun skipNext() {
        // TODO
    }

    override fun skipPrevious() {
        // TODO
    }

    override fun playTrack(trackId: String) {
        // TODO
    }

    override fun checkIfTrackSaved(trackId: String) {
        // Nothing to do (fake)
    }

    override fun toggleSaveTrack(trackId: String) {
        // Nothing to do (fake)
    }

    override fun seekTo(position: Long) {
        // Nothing to do (fake)
    }
}
