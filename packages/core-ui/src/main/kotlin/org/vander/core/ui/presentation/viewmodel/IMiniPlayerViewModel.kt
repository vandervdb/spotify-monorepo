package org.vander.core.ui.presentation.viewmodel

import android.app.Activity
import kotlinx.coroutines.flow.StateFlow
import org.vander.core.domain.state.DomainPlayerState
import org.vander.core.domain.state.SessionState
import org.vander.core.ui.state.UIQueueState

interface IMiniPlayerViewModel {
    val sessionState: StateFlow<SessionState>
    val uIQueueState: StateFlow<UIQueueState>
    val domainPlayerState: StateFlow<DomainPlayerState>
    fun startUp(activity: Activity)
    fun togglePlayPause()
    fun skipNext()
    fun skipPrevious()
    fun playTrack(trackId: String)
    fun checkIfTrackSaved(trackId: String)
    fun toggleSaveTrack(trackId: String)
    fun seekTo(position: Long)
}
