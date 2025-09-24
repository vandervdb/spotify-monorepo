package com.vander.core.ui.presentation.viewmodel

import android.app.Activity
import com.vander.core.domain.state.PlayerState
import com.vander.core.domain.state.SessionState
import com.vander.core.ui.state.UIQueueState
import kotlinx.coroutines.flow.StateFlow

interface IMiniPlayerViewModel {
    val sessionState: StateFlow<SessionState>
    val uIQueueState: StateFlow<UIQueueState>
    val playerState: StateFlow<PlayerState>
    fun startUp(activity: Activity)
    fun togglePlayPause()
    fun skipNext()
    fun skipPrevious()
    fun playTrack(trackId: String)
    fun checkIfTrackSaved(trackId: String)
    fun toggleSaveTrack(trackId: String)
}
