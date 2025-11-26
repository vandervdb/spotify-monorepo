package org.vander.android.sample.ui.navigation

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import org.vander.android.sample.presentation.PlayListViewModelImpl
import org.vander.android.sample.presentation.PlayerViewModelImpl
import org.vander.android.sample.presentation.UserViewModelImpl
import org.vander.android.sample.ui.screen.HomeScreen
import org.vander.android.sample.ui.screen.SpotifyScreen
import org.vander.core.logger.KermitLoggerImpl
import org.vander.core.logger.Logger

@Suppress("FunctionNaming")
@Composable
fun AppNavHost(
    navController: NavHostController,
    innerPadding: PaddingValues,
    setTopBar: (@Composable () -> Unit) -> Unit,
) {
    NavHost(
        navController = navController,
        startDestination = NavItem.Home.route,
        modifier = Modifier.padding(innerPadding),
    ) {
        composable(NavItem.Home.route) { HomeScreen(setTopBar) }
        composable(NavItem.Spotify.route) {
            val playerViewModel = hiltViewModel<PlayerViewModelImpl>()
            val playlistViewModel = hiltViewModel<PlayListViewModelImpl>()
            val userViewModel = hiltViewModel<UserViewModelImpl>()
            val logger: Logger = KermitLoggerImpl("SpotifyApp")

            SpotifyScreen(
                playerViewModel = playerViewModel,
                playlistViewModel = playlistViewModel,
                userViewModel = userViewModel,
                setTopBar,
                launchStartup = true,
                logger,
                navController = navController,
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
