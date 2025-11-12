package org.vander.fake.spotify

import kotlinx.coroutines.flow.MutableStateFlow
import org.vander.core.domain.state.DomainPlayerState
import org.vander.core.domain.state.PlayerStateData
import org.vander.core.domain.state.SessionState
import org.vander.core.ui.presentation.viewmodel.IPlayerViewModel
import org.vander.core.ui.state.UIQueueState

class FakePlayerViewModel : IPlayerViewModel {
    override val sessionState = MutableStateFlow<SessionState>(SessionState.Ready)
    override val uIQueueState = MutableStateFlow<UIQueueState>(UIQueueState.Companion.empty())
    override val domainPlayerState = MutableStateFlow<DomainPlayerState>(
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


    override fun startUp() {
        TODO("Not yet implemented")
    }

    override fun togglePlayPause() {
        TODO("Not yet implemented")
//        domainPlayerState.togglePause()
    }

    override fun skipNext() {
        TODO("Not yet implemented")
    }

    override fun skipPrevious() {
        TODO("Not yet implemented")
    }

    override fun playTrack(trackId: String) {
        TODO("Not yet implemented")
    }

    override fun checkIfTrackSaved(trackId: String) {
        // Nothing to do
    }

    override fun toggleSaveTrack(trackId: String) {
        // Nothing to do
    }

    override fun seekTo(position: Long) {
        // Nothing to do
    }
}
