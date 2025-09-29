package org.vander.fake.spotify

import android.app.Activity
import kotlinx.coroutines.flow.MutableStateFlow
import org.vander.core.domain.state.PlayerState
import org.vander.core.domain.state.PlayerStateData
import org.vander.core.domain.state.SessionState
import org.vander.core.ui.presentation.viewmodel.IMiniPlayerViewModel
import org.vander.core.ui.state.UIQueueState

class FakeMiniPlayerViewModel : IMiniPlayerViewModel {
    override val sessionState = MutableStateFlow<SessionState>(SessionState.Ready)
    override val uIQueueState = MutableStateFlow<UIQueueState>(UIQueueState.Companion.empty())
    override val playerState = MutableStateFlow<PlayerState>(
        PlayerState(
            base = PlayerStateData(
                trackName = "Zelda's Theme",
                artistName = "Koji Kondo",
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
                skippingPrevious = false
            ),
            isTrackSaved = false
        )
    )


    override fun startUp(activity: Activity) {
        TODO("Not yet implemented")
    }

    override fun togglePlayPause() {
        TODO("Not yet implemented")
//        playerState.togglePause()
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
}
