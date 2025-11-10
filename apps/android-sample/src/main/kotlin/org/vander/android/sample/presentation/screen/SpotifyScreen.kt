package org.vander.android.sample.presentation.screen

import android.app.Activity
import android.util.Log
import androidx.activity.compose.LocalActivity
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import org.vander.android.sample.presentation.components.MiniPlayer
import org.vander.android.sample.presentation.components.PlaylistComponent
import org.vander.core.domain.state.SessionState
import org.vander.core.ui.presentation.viewmodel.IPlayerViewModel
import org.vander.core.ui.presentation.viewmodel.IPlaylistViewModel
import org.vander.fake.spotify.FakePlayerViewModel
import org.vander.fake.spotify.FakePlaylistViewModel


@Composable
fun SpotifyScreen(
    playerViewModel: IPlayerViewModel,
    playlistViewModel: IPlaylistViewModel,
    modifier: Modifier = Modifier,
    launchStartup: Boolean = true
) {

    val tag = "SpotifyScreen"
    val sessionState by playerViewModel.sessionState.collectAsState()
    val uIQueueState by playerViewModel.uIQueueState.collectAsState()

    if (launchStartup) {
        val activity = LocalActivity.current
        LaunchedEffect(key1 = activity) {
            playerViewModel.startUp(Activity())
            playlistViewModel.refresh()
        }
    }

    Column(
        modifier = modifier.padding(32.dp),
    ) {
        Log.d(tag, "Session state: $sessionState")
        when (sessionState) {
            is SessionState.Idle -> {
                Log.d(tag, "Idle...")
            }

            is SessionState.Authorizing -> {
                Log.d(tag, "Authorizing...")
            }

            is SessionState.ConnectingRemote -> {
                Log.d(tag, "Connecting to remote...")
                CircularProgressIndicator()
            }

            is SessionState.Ready -> {
                Text("✅ Connecté à Spotify Remote !")
                PlaylistComponent(playlistViewModel)
                MiniPlayer(playerViewModel)
            }

            is SessionState.Failed -> {
                Text(
                    text = "❌ Erreur: ${(sessionState as SessionState.Failed).exception.message}",
                    color = MaterialTheme.colorScheme.error
                )
            }

            SessionState.IsPaused -> TODO()
        }

    }

// TODO add button to relaunch authorization flow

}


@Preview(showBackground = true, name = "SpotifyScreen Preview")
@Composable
fun SpotifyScreenPreview() {
    // Use a fake ViewModel so the preview doesn't depend on runtime services
    val fakePlayerViewModel = FakePlayerViewModel()
    val fakePlaylistViewModel = FakePlaylistViewModel()
    org.vander.android.sample.theme.AndroidAppTheme {
        SpotifyScreen(
            playerViewModel = fakePlayerViewModel,
            playlistViewModel = fakePlaylistViewModel,
            modifier = Modifier,
            launchStartup = false // Avoid accessing Activity in preview
        )
    }
}
