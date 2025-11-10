package org.vander.android.sample.presentation.screen

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import org.vander.android.sample.R
import org.vander.android.sample.theme.SpotifyGreen
import org.vander.core.ui.presentation.viewmodel.IPlayerViewModel
import org.vander.core.ui.presentation.viewmodel.IPlaylistViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SpotifyScreenWrapper(
    navController: NavController,
    playerViewModel: IPlayerViewModel,
    playlistViewModel: IPlaylistViewModel,
    launchStartup: Boolean = true,
) {
    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Image(
                        painter = painterResource(id = R.drawable.spotify_full_logo_black),
                        contentDescription = "Spotify Logo",
                        modifier = Modifier
                            .height(32.dp),
                        contentScale = ContentScale.Fit
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = SpotifyGreen,
                    titleContentColor = Color.Black
                )
            )
        }
    ) { innerPadding ->
        SpotifyScreen(
            playerViewModel = playerViewModel,
            playlistViewModel = playlistViewModel,
            modifier = Modifier.padding(innerPadding),
            launchStartup = launchStartup
        )
    }
}

@Preview(showBackground = true, name = "SpotifyScreenWrapper Preview")
@Composable
fun SpotifyScreenWrapperPreview() {
    val navController = rememberNavController()
    val fakePlayerViewModel = org.vander.fake.spotify.FakePlayerViewModel()
    val fakePlaylistViewModel = org.vander.fake.spotify.FakePlaylistViewModel()
    org.vander.android.sample.theme.AndroidAppTheme {
        SpotifyScreenWrapper(
            navController = navController,
            playerViewModel = fakePlayerViewModel,
            playlistViewModel = fakePlaylistViewModel,
            launchStartup = false
        )
    }
}
