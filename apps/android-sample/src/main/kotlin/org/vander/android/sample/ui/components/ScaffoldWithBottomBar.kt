package org.vander.android.sample.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.height
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import org.vander.android.sample.R
import org.vander.android.sample.theme.SpotifyGreen
import org.vander.android.sample.ui.navigation.AppNavHost
import org.vander.android.sample.ui.navigation.NavItem

@OptIn(ExperimentalMaterial3Api::class)
@Suppress("FunctionNaming")
@Composable
fun ScaffoldWithBottomBar() {
    val navController = rememberNavController()

    var topBarContent by remember { mutableStateOf<@Composable () -> Unit>({}) }
    val setTopBar: (@Composable () -> Unit) -> Unit = { newTopBar ->
        topBarContent = newTopBar
    }

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
                                contentDescription = item.label,
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
                        },
                    )
                }
            }
        },
    ) { innerPadding ->
        AppNavHost(navController, innerPadding, setTopBar)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Suppress("FunctionNaming")
@Composable
fun SpotifyTopBar() {
    CenterAlignedTopAppBar(
        title = {
            Image(
                painter = painterResource(id = R.drawable.spotify_full_logo_black),
                contentDescription = "Spotify Logo",
                modifier =
                    Modifier
                        .height(32.dp),
                contentScale = ContentScale.Fit,
            )
        },
        colors =
            TopAppBarDefaults.topAppBarColors(
                containerColor = SpotifyGreen,
                titleContentColor = Color.Black,
            ),
    )
}
