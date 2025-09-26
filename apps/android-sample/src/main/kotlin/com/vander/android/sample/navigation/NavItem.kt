package com.vander.android.sample.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LibraryMusic
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.LibraryMusic
import androidx.compose.ui.graphics.vector.ImageVector

sealed class NavItem(
    val route: String,
    val label: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {
    companion object {
        val all = listOf(Home, Spotify)
    }

    object Home : NavItem("home", "Home", Icons.Filled.Home, Icons.Outlined.Home)
    object Spotify :
        NavItem("spotify", "Spotify", Icons.Filled.LibraryMusic, Icons.Outlined.LibraryMusic)
}

