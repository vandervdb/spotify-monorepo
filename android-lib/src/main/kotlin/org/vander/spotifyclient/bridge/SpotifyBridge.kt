package org.vander.spotifyclient.bridge

import android.app.Activity
import android.content.Intent
import androidx.activity.result.ActivityResult
import androidx.activity.result.ActivityResultLauncher
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.suspendCancellableCoroutine
import org.vander.core.domain.state.PlayerStateData
import org.vander.spotifyclient.bridge.util.ActivityResultFactory
import org.vander.spotifyclient.domain.appremote.ISpotifyAppRemoteProvider
import org.vander.spotifyclient.domain.auth.ISpotifyAuthClient
import org.vander.spotifyclient.domain.player.ISpotifyPlayerClient
import javax.inject.Inject
import kotlin.coroutines.resume

class SpotifyBridge  @Inject constructor(
    private val authClient: ISpotifyAuthClient,
    private val playerClient: ISpotifyPlayerClient,
    private val appRemoteProvider: ISpotifyAppRemoteProvider,
) : SpotifyBridgeApi {

    private val lastState = MutableStateFlow(
        PlayerStateDto(
            isPlaying = false,
            positionMs = 0,
            durationMs = 0,
            trackUri = null,
            trackName = null,
            artistName = null,
            albumName = null,
        )
    )

    override val playerEvents: Flow<PlayerStateDto> = callbackFlow {
        playerClient.subscribeToPlayerState { s ->
            val dto = PlayerStateDto(
                isPlaying = s.playing,
                positionMs = s.positionMs,
                durationMs = s.durationMs,
                trackUri = s.trackId,
                trackName = s.trackName,
                artistName = s.artistName,
                albumName = s.albumName,
            )
            lastState.value = dto
            trySend(dto)
        }
        awaitClose { playerClient.unsubscribeFromPlayerState() }
    }

    override suspend fun authorize(
        activity: Activity,
        config: AuthConfigK
    ): AuthorizeResultK {
        return suspendCancellableCoroutine { cont ->
            val launcher: ActivityResultLauncher<Intent> =
                ActivityResultFactory.register(activity) { result: ActivityResult ->
                    authClient.handleSpotifyAuthResult(result) { r ->
                        r.onSuccess { value ->
                            val type = if (value.length > 30)
                                AuthorizeResultK.Type.Token else AuthorizeResultK.Type.Code
                            cont.resume(AuthorizeResultK(type = type, value = value))
                        }.onFailure { e ->
                            cont.resume(AuthorizeResultK(
                                type = AuthorizeResultK.Type.Error, error = e.message)
                            )
                        }
                    }
                }
            authClient.authorize(activity, launcher, null)
        }
    }

    override suspend fun refreshToken(refreshToken: String): String {
        TODO("Not yet implemented")
    }

    override suspend fun connect(activity: Activity, clientId: String, redirectUri: String) {
        TODO("Not yet implemented")
    }

    override suspend fun disconnect() {
        TODO("Not yet implemented")
    }

    override suspend fun playUri(uri: String) {
        playerClient.play(uri)
    }

    override suspend fun pause() {
        playerClient.pause()
    }

    override suspend fun resume() {
        playerClient.resume()
    }

    override suspend fun seekTo(ms: Long) {
        playerClient.seekTo(ms)
    }

    override suspend fun getPlayerState(): PlayerStateData {
//        playerClient.lastState.collect {
//            lastState.value = it
//        }
//        return lastState.value
        TODO("Not yet implemented")
    }

}
