package org.vander.spotifyclient.bridge

import android.app.Activity
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.StateFlow
import org.vander.core.domain.state.DomainPlayerState
import org.vander.core.domain.state.SessionState
import org.vander.core.ui.state.UIQueueState

interface SpotifyBridgeApi {
    val playerEvents: Flow<PlayerStateDto>
    val sessionState: StateFlow<SessionState>
    val uIQueueState: StateFlow<UIQueueState>
    val domainPlayerState: StateFlow<DomainPlayerState>

    fun getPlayerState(): PlayerStateDto

    suspend fun startUpWithModuleActivityResult(
        activity: Activity,
        config: AuthConfigK? = null,
    )

    suspend fun startUpWithHostActivityResult(
        activity: Activity,
        config: AuthConfigK? = null,
    )

    suspend fun disconnect()

    suspend fun playUri(uri: String)

    suspend fun pause()

    suspend fun resume()

    suspend fun seekTo(ms: Long)

    fun toggleSaveTrackState(trackId: String)

    suspend fun skipNext()

    suspend fun skipPrevious()
}
