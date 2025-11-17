package org.vander.spotifyclient.bridge

import android.app.Activity
import android.content.Context
import android.content.Intent
import androidx.activity.ComponentActivity
import androidx.activity.result.ActivityResult
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.callbackFlow
import org.vander.core.domain.state.DomainPlayerState
import org.vander.core.domain.state.SessionState
import org.vander.core.ui.state.UIQueueState
import org.vander.spotifyclient.bridge.util.ActivityResultFactory
import org.vander.spotifyclient.data.player.mapper.toPlayerStateDto
import org.vander.spotifyclient.domain.usecase.PlayerUseCase
import org.vander.spotifyclient.domain.usecase.SpotifySessionManager
import javax.inject.Inject

class SpotifyBridge @Inject constructor(
    private val sessionManager: SpotifySessionManager,
    private val useCase: PlayerUseCase,
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
            val dto = state.toPlayerStateDto(null)
            lastState.value = dto
            trySend(dto)
        }
    }

    override fun getPlayerState(): PlayerStateDto {
        return lastState.value
    }

    override suspend fun startUpWithModuleActivityResult(activity: Activity, config: AuthConfigK?) {
        val launcher = ActivityResultFactory.register(activity, createAuthCallback())
        startUp(launcher, activity, config)
    }

    override suspend fun startUpWithHostActivityResult(activity: Activity, config: AuthConfigK?) {
        val componentActivity = activity as? ComponentActivity
            ?: error("Host activity must be a ComponentActivity")
        val launcher = componentActivity.activityResultRegistry.register(
            "spotify-auth",
            ActivityResultContracts.StartActivityForResult(),
            createAuthCallback()
        )
        startUp(launcher, activity, config)
    }

    override suspend fun disconnect() {
        sessionManager.shutDown()
        onDestroy()
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


    fun onDestroy() {
        authLauncher?.unregister()
        authLauncher = null
        job.cancel()
    }

    suspend fun startUp(launcher: ActivityResultLauncher<Intent>, activity: Activity, config: AuthConfigK?) {
        if (authLauncher == null) {
            authLauncher = launcher
        }
        sessionManager.requestAuthorization(authLauncher!!)
        sessionManager.launchAuthorizationFlow(activity, config)
    }

    private fun createAuthCallback(): (ActivityResult) -> Unit {
        return { result ->
            sessionManager.handleAuthResult(appContext, result, scope)
        }
    }


}
