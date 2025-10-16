package org.vander.spotifyclient.domain.usecase

import android.app.Activity
import android.content.Context
import android.content.Intent
import androidx.activity.result.ActivityResult
import androidx.activity.result.ActivityResultLauncher
import kotlinx.coroutines.CoroutineDispatcher
import org.vander.core.domain.state.SessionState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.StateFlow

interface SpotifySessionManager {
    val sessionState: StateFlow<SessionState>

    fun requestAuthorization(launchAuth: ActivityResultLauncher<Intent>)
    fun launchAuthorizationFlow(activity: Activity)
    fun handleAuthResult(
        context: Context,
        result: ActivityResult,
        coroutineScope: CoroutineScope,
        dispatcher: CoroutineDispatcher = Dispatchers.Main
    )

    suspend fun shutDown()
}
