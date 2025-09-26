package org.vander.androidapp.presentation.screen

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
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.vander.android.sample.theme.SpotifyGreen
import com.vander.android.sample.R
import org.vander.androidapp.presentation.viewmodel.SpotifyViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SpotifyScreenWrapper(
    navController: NavController,
    spotifyViewModel: SpotifyViewModel,
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
            viewModel = spotifyViewModel,
            modifier = Modifier.padding(innerPadding)
        )
    }
}
