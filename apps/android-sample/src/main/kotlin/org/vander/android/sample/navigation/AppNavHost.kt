package org.vander.android.sample.navigation

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import org.vander.android.sample.MainActivity
import org.vander.android.sample.presentation.screen.HomeScreen
import org.vander.android.sample.presentation.screen.SpotifyScreenWrapper
import org.vander.android.sample.presentation.viewmodel.PlayListViewModel
import org.vander.android.sample.presentation.viewmodel.PlayerViewModel


@Composable
fun AppNavHost(navController: NavHostController, innerPadding: PaddingValues) {

    NavHost(
        navController = navController,
        startDestination = NavItem.Home.route,
        modifier = Modifier.padding(innerPadding)
    ) {
        composable(NavItem.Home.route) { HomeScreen() }
        composable(NavItem.Spotify.route) {
            val playerViewModel = hiltViewModel<PlayerViewModel>()
            val playlistViewModel = hiltViewModel<PlayListViewModel>()
            val context = LocalContext.current
            val activity = remember(context) {
                context.findActivity() as? MainActivity
            }

            val launcher = rememberLauncherForActivityResult(
                contract = ActivityResultContracts.StartActivityForResult(),
                onResult = { result ->
                    activity?.let {
                        playerViewModel.handleAuthResult(it, result)
                    }
                }
            )
            SpotifyScreenWrapper(
                navController = navController,
                playerViewModel = playerViewModel,
                playlistViewModel = playlistViewModel
            )
        }
    }
}

// Fonction d'extension pour trouver l'activité de manière sûre
private fun Context.findActivity(): Activity? {
    var context = this
    while (context is ContextWrapper) {
        if (context is Activity) return context
        context = context.baseContext
    }
    return null
}
