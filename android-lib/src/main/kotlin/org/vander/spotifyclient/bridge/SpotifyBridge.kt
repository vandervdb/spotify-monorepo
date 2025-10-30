package org.vander.spotifyclient.bridge

import android.app.Activity
import android.content.Context
import android.content.Intent
import androidx.activity.ComponentActivity
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.callbackFlow
import org.vander.core.domain.state.DomainPlayerState
import org.vander.core.domain.state.PlayerStateData
import org.vander.core.domain.state.SessionState
import org.vander.core.ui.state.UIQueueState
import org.vander.spotifyclient.domain.usecase.SpotifySessionManager
import org.vander.spotifyclient.domain.usecase.SpotifyUseCase
import javax.inject.Inject
import org.vander.spotifyclient.data.player.mapper.*

class SpotifyBridge @Inject constructor(
    private val sessionManager: SpotifySessionManager,
    private val useCase: SpotifyUseCase,
    private val appContext: Context,
) : SpotifyBridgeApi {


    private val job = SupervisorJob()
    private val scope = CoroutineScope(Dispatchers.Main.immediate + job)

    private var authLauncher: ActivityResultLauncher<Intent>? = null

    private val lastState = MutableStateFlow(
        PlayerStateDto(
            isPlaying = false,
            positionMs = 0,
            durationMs = 0,
            trackUri = null,
            coverId = null,
            trackName = null,
            artistName = null,
            albumName = null,
        )
    )

    override val sessionState: StateFlow<SessionState> = sessionManager.sessionState
    override val domainPlayerState: StateFlow<DomainPlayerState> = useCase.domainPlayerState
    override val uIQueueState: StateFlow<UIQueueState> = useCase.uIQueueState

    override val playerEvents: Flow<PlayerStateDto> = callbackFlow {
        domainPlayerState.collect { state ->
            val dto = state.toPlayerStateDto()
            lastState.value = dto
            trySend(dto)
        }
    }

    override suspend fun startUp(activity: Activity) {
        val componentActivity = activity as? ComponentActivity ?: error("Host activity must be a ComponentActivity")
        if (authLauncher == null) {
            authLauncher = componentActivity.activityResultRegistry.register(
                "spotify-auth",
                ActivityResultContracts.StartActivityForResult()
            ) { result ->
                sessionManager.handleAuthResult(appContext, result, scope)
            }
        }
        sessionManager.requestAuthorization(authLauncher!!)
        sessionManager.launchAuthorizationFlow(activity)

    }


    override suspend fun disconnect() {
        sessionManager.shutDown()
    }

    override suspend fun playUri(uri: String) {
        useCase.playUri(uri)
    }

    override suspend fun pause() {
        useCase.pause()
    }

    override suspend fun resume() {
        useCase.resume()
    }

    override suspend fun seekTo(ms: Long) {
        useCase.seekTo(ms)
    }

    override suspend fun skipNext() {
        useCase.skipNext()
    }

    override suspend fun skipPrevious() {
        useCase.skipPrevious()
    }

    override fun toggleSaveTrackState(trackId: String) {
        useCase.toggleSaveTrackState(trackId)
    }

    override suspend fun getPlayerState(): PlayerStateData {
//        playerClient.lastState.collect {
//            lastState.value = it
//        }
//        return lastState.value
        TODO("Not yet implemented")
    }

    fun onDestroy() {
        authLauncher?.unregister()
        authLauncher = null
        job.cancel()
    }

}
