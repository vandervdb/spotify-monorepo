package org.vander.android.sample.presentation.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.height
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import org.vander.android.sample.R
import org.vander.android.sample.navigation.AppNavHost
import org.vander.android.sample.navigation.NavItem
import org.vander.android.sample.theme.SpotifyGreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ScaffoldWithBottomBar() {
    val navController = rememberNavController()

    var topBarContent by remember { mutableStateOf<@Composable () -> Unit>({}) }
    val setTopBar: (@Composable () -> Unit) -> Unit = { newTopBar ->
        topBarContent = newTopBar
    }

    // Defensive: clear top bar when Home is the active route (covers restored state cases)
    val navBackEntryTopBar by navController.currentBackStackEntryAsState()
    val currentRouteForTopBar = navBackEntryTopBar?.destination?.route
    LaunchedEffect(currentRouteForTopBar) {
        if (currentRouteForTopBar == NavItem.Home.route) {
            setTopBar { }
        }
    }

    Scaffold(
        topBar = { topBarContent() },
        bottomBar = {
            NavigationBar {
                val navBackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackEntry?.destination?.route
                NavItem.all.forEach { item ->
                    val selected = currentRoute == item.route
                    NavigationBarItem(
                        icon = {
                            Icon(
                                imageVector = if (selected) item.selectedIcon else item.unselectedIcon,
                                contentDescription = item.label
                            )
                        },
                        label = { Text(item.label) },
                        selected = currentRoute == item.route,
                        onClick = {
                            navController.navigate(item.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        AppNavHost(navController, innerPadding, setTopBar)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SpotifyTopBar() {
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
