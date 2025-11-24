package org.vander.android.sample.presentation.screen

import androidx.activity.compose.LocalActivity
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import org.vander.android.sample.R
import org.vander.android.sample.presentation.components.MiniPlayer
import org.vander.android.sample.presentation.components.PlaylistComponent
import org.vander.android.sample.theme.SpotifyGreen
import org.vander.core.domain.data.User
import org.vander.core.domain.state.SessionState
import org.vander.core.logger.Logger
import org.vander.core.logger.test.FakeLogger
import org.vander.core.ui.presentation.viewmodel.PlayerViewModel
import org.vander.core.ui.presentation.viewmodel.PlaylistViewModel
import org.vander.core.ui.presentation.viewmodel.UserViewModel
import org.vander.fake.spotify.FakePlayerViewModel
import org.vander.fake.spotify.FakePlaylistViewModel
import org.vander.fake.spotify.FakeUserViewModel


@Composable
fun SpotifyScreen(
    playerViewModel: PlayerViewModel,
    playlistViewModel: PlaylistViewModel,
    userViewModel: UserViewModel,
    setTopBar: (@Composable () -> Unit) -> Unit,
    launchStartup: Boolean = true,
    logger: Logger,
    navController: NavController? = null
) {

    val tag = "SpotifyScreen"
    val sessionState by playerViewModel.sessionState.collectAsState()
    val uIQueueState by playerViewModel.uIQueueState.collectAsState()
    val user by userViewModel.currentUser.collectAsState(User.empty)

    if (launchStartup) {
        val activity = LocalActivity.current
        LaunchedEffect(key1 = activity) {
            playerViewModel.startUp()
            playlistViewModel.refresh()
        }
    }

    LaunchedEffect(user) {
        userViewModel.refresh()
    }

    LaunchedEffect(Unit) {
        setTopBar { SpotifyTopBar(user?.name) }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 32.dp, vertical = 10.dp),
    ) {
        logger.d(tag, "Session state: $sessionState")
        when (sessionState) {
            is SessionState.Idle -> {
                logger.d(tag, "Idle...")
            }

            is SessionState.Authorizing -> {
                logger.d(tag, "Authorizing...")
            }

            is SessionState.ConnectingRemote -> {
                logger.d(tag, "Connecting to remote...")
                CircularProgressIndicator()
            }

            is SessionState.Ready -> {
                Text(
                    text = "Playlists",
                    textAlign = TextAlign.Center,
                    fontSize = MaterialTheme.typography.headlineSmall.fontSize,
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                )
                Spacer(modifier = Modifier.padding(vertical = 8.dp))
                PlaylistComponent(playlistViewModel, Modifier.weight(1f))
                Spacer(modifier = Modifier.padding(vertical = 8.dp))
                MiniPlayer(playerViewModel, logger)
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

}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SpotifyTopBar(displayName: String?) {
    CenterAlignedTopAppBar(
        title = {
            Column {
                Image(
                    painter = painterResource(id = R.drawable.spotify_full_logo_black),
                    contentDescription = "Spotify Logo",
                    modifier = Modifier
                        .height(32.dp),
                    contentScale = ContentScale.Fit
                )
                Row(modifier = Modifier.padding(start = 32.dp)) {
                    Text(
                        text = "by ",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontStyle = FontStyle.Italic,
                            fontSize = MaterialTheme.typography.bodySmall.fontSize
                        ),
                        color = Color.Black,

                        )
                    Text(
                        text = displayName.takeUnless { it.isNullOrBlank() } ?: "You",
                        style = MaterialTheme.typography.labelMedium.copy(
                            fontWeight = FontWeight.ExtraBold,
                        ),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = SpotifyGreen,
            titleContentColor = Color.Black
        )
    )
}

@Preview(showBackground = true, name = "SpotifyScreen Preview")
@Composable
fun SpotifyScreenPreview() {
    val fakePlayerViewModel = FakePlayerViewModel()
    val fakePlaylistViewModel = FakePlaylistViewModel()
    val fakeUserViewModel = FakeUserViewModel()
    val logger: Logger = FakeLogger()
    org.vander.android.sample.theme.AndroidAppTheme {
        SpotifyScreen(
            playerViewModel = fakePlayerViewModel,
            playlistViewModel = fakePlaylistViewModel,
            userViewModel = fakeUserViewModel,
            setTopBar = { },
            launchStartup = false, // Avoid accessing Activity in preview
            logger,
        )
    }
}
