package com.vander.android.sample.navigation

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.vander.android.sample.MainActivity
import com.vander.android.sample.navigation.NavItem.Spotify
import org.vander.androidapp.presentation.screen.HomeScreen
import org.vander.androidapp.presentation.screen.SpotifyScreenWrapper
import org.vander.androidapp.presentation.viewmodel.SpotifyViewModel

@Composable
fun AppNavHost(navController: NavHostController, innerPadding: PaddingValues) {

    NavHost(
        navController = navController,
        startDestination = NavItem.Home.route,
        modifier = Modifier.padding(innerPadding)
    ) {
        composable(NavItem.Home.route) { HomeScreen() }
        composable(Spotify.route) {
            val viewModel = hiltViewModel<SpotifyViewModel>()
            val activity = LocalContext.current as MainActivity
            val launcher = rememberLauncherForActivityResult(
                contract = ActivityResultContracts.StartActivityForResult(),
                onResult = { result ->
                    activity?.let {
                        viewModel.handleAuthResult(it, result)
                    }
                }
            )
            SpotifyScreenWrapper(
                navController = navController,
                spotifyViewModel = viewModel,
            )
        }
    }
}

fun initSpotifySession() {

}
