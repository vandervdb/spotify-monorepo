package org.vander.spotifyclient.bridge

import android.app.Activity
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.StateFlow
import org.vander.core.domain.state.DomainPlayerState
import org.vander.core.domain.state.PlayerStateData
import org.vander.core.domain.state.SessionState
import org.vander.core.ui.state.UIQueueState

interface SpotifyBridgeApi {

    suspend   fun startUp(activity: Activity)
    suspend fun disconnect()

    suspend fun playUri(uri: String)
    suspend fun pause()
    suspend fun resume()
    suspend fun seekTo(ms: Long)

    suspend fun getPlayerState(): PlayerStateData
    val playerEvents: Flow<PlayerStateDto>
    val sessionState: StateFlow<SessionState>
    val uIQueueState: StateFlow<UIQueueState>
    val domainPlayerState: StateFlow<DomainPlayerState>
    fun toggleSaveTrackState(trackId: String)
    suspend fun skipNext()
    suspend fun skipPrevious()
}
