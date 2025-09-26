package org.vander.androidapp.presentation

import androidx.activity.compose.LocalActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.lifecycleScope
import org.vander.androidapp.presentation.components.LifecycleObserverComponent
import org.vander.androidapp.presentation.components.ScaffoldWithBottomBar
import org.vander.androidapp.presentation.util.rememberSpotifySessionManager

@Composable
fun App() {
    val tag = "APP"

    val activity = LocalActivity.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val sessionManager = rememberSpotifySessionManager()
    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult(),
        onResult = { result ->
            activity?.let {
                sessionManager.handleAuthResult(it, result, lifecycleOwner.lifecycleScope)
            }
        }
    )

    LifecycleObserverComponent(tag, onStopCallback = { sessionManager::shutDown })

    LaunchedEffect(key1 = activity) {
        sessionManager.requestAuthorization(launcher)
        sessionManager.launchAuthorizationFlow(activity!!)
    }

    ScaffoldWithBottomBar()


}




