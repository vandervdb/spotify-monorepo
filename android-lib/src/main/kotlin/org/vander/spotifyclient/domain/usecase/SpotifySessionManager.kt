package org.vander.spotifyclient.domain.usecase

import android.app.Activity
import android.content.Context
import android.content.Intent
import androidx.activity.result.ActivityResult
import androidx.activity.result.ActivityResultLauncher
import com.vander.core.domain.state.SessionState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.StateFlow
import org.vander.spotifyclient.domain.state.SessionState

interface SpotifySessionManager {
    val sessionState: StateFlow<SessionState>

    fun requestAuthorization(launchAuth: ActivityResultLauncher<Intent>)
    fun launchAuthorizationFlow(activity: Activity)
    fun handleAuthResult(
        context: Context,
        result: ActivityResult,
        coroutineScope: CoroutineScope
    )

    suspend fun shutDown()
}
