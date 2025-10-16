package org.vander.spotifyclient.bridge

import android.app.Activity
import kotlinx.coroutines.flow.Flow
import org.vander.core.domain.state.PlayerStateData

interface SpotifyBridgeApi {
    suspend fun authorize(activity: Activity, config: AuthConfigK): AuthorizeResultK
    suspend fun refreshToken(refreshToken: String): String

    suspend fun connect(activity: Activity, clientId: String, redirectUri: String)
    suspend fun disconnect()

    suspend fun playUri(uri: String)
    suspend fun pause()
    suspend fun resume()
    suspend fun seekTo(ms: Long)

    suspend fun getPlayerState(): PlayerStateData
    val playerEvents: Flow<PlayerStateDto>
}
