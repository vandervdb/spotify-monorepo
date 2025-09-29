package org.vander.spotifyclient.data.session

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.util.Log
import androidx.activity.result.ActivityResult
import androidx.activity.result.ActivityResultLauncher
import org.vander.core.domain.auth.IAuthRepository
import org.vander.core.domain.error.SessionError
import org.vander.core.domain.state.SessionState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.vander.spotifyclient.domain.appremote.ISpotifyAppRemoteProvider
import org.vander.spotifyclient.domain.auth.ISpotifyAuthClient
import org.vander.spotifyclient.domain.usecase.SpotifySessionManager
import javax.inject.Inject

class SpotifySessionManagerImpl @Inject constructor(
    private val authClient: ISpotifyAuthClient,
    private val remoteProvider: ISpotifyAppRemoteProvider,
    private val authRepository: IAuthRepository,
) : SpotifySessionManager {
    companion object {
        private const val TAG = "SpotifySessionManagerImpl"
    }

    val dispatcher = Dispatchers.Main

    private val _sessionState = MutableStateFlow<SessionState>(SessionState.Idle)
    override val sessionState: StateFlow<SessionState> = _sessionState

    private var launchAuthFlow: ActivityResultLauncher<Intent>? = null


    override fun requestAuthorization(launchAuth: ActivityResultLauncher<Intent>) {
        Log.d(TAG, "Requesting authorization...")
        launchAuthFlow = launchAuth
        _sessionState.update { SessionState.Authorizing }
    }

    override fun launchAuthorizationFlow(activity: Activity) {
        Log.d(TAG, "Launching authorization flow...")
        try {
            launchAuthFlow?.let {
                authClient.authorize(activity, it)
            } ?: run {
                _sessionState.update {
                    SessionState.Failed(
                        SessionError.UnknownError(Exception("Authorization flow not set"))
                    )
                }
            }
        } catch (e: Exception) {
            _sessionState.update { SessionState.Failed(SessionError.UnknownError(e)) }
        }
    }

    override fun handleAuthResult(
        context: Context,
        result: ActivityResult,
        coroutineScope: CoroutineScope
    ) {
        authClient.handleSpotifyAuthResult(result) { authResult ->
            if (authResult.isSuccess) {
                coroutineScope.launch {
                    val authCode = authResult.getOrElse { "" }
                    Log.d(TAG, "Launching auth token request...")
                    fetchAndStoreAuthToken(authCode)
                        .onFailure { error ->
                            Log.e(TAG, "Error storing access token", error)
                            _sessionState.update {
                                SessionState.Failed(
                                    SessionError.AuthFailed(error)
                                )
                            }
                        }
                        .onSuccess {
                            Log.d(TAG, "Access token stored, Connecting to remote...")
                            connectRemote(context, coroutineScope)

                        }
                }
            } else {
                _sessionState.update {
                    SessionState.Failed(
                        SessionError.AuthFailed(Exception("Authorization failed with unknown error"))
                    )
                }
            }
        }
    }

    override suspend fun shutDown() {
        remoteProvider.disconnect()
        _sessionState.update { SessionState.Idle }
        authRepository.clearAccessToken()
    }

    private fun connectRemote(
        context: Context,
        coroutineScope: CoroutineScope
    ) {
        _sessionState.update { SessionState.ConnectingRemote }
        coroutineScope.launch(dispatcher) {
            val result = remoteProvider.connect(context)
            if (result.isSuccess) {
                Log.d(TAG, "SessionState.Ready")
                _sessionState.update { SessionState.Ready }
            } else {
                Log.e(TAG, "Failed to connect to remote", result.exceptionOrNull())
                _sessionState.update {
                    SessionState.Failed(
                        SessionError.RemoteConnectionFailed(result.exceptionOrNull())
                    )
                }
            }
        }
    }

    private suspend fun fetchAndStoreAuthToken(authCode: String): Result<Unit> =
        authRepository.storeAccessToken(authCode)

}
