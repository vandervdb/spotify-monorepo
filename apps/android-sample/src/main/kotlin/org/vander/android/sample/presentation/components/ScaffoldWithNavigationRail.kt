package org.vander.android.sample.presentation.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.NavHostController
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import org.vander.android.sample.navigation.AppNavHost
import org.vander.android.sample.navigation.NavItem


@Composable
fun ScaffoldWithNavigationRail() {
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
        topBar = { topBarContent() }
    ) { innerPadding ->
        Row(
            modifier = Modifier.padding(innerPadding)
        ) {
            NavigationRailWithNav(navController = navController)
            AppNavHost(navController, innerPadding, setTopBar)
        }
    }
}

@Composable
fun NavigationRailWithNav(
    navController: NavHostController
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    NavigationRail(
        containerColor = MaterialTheme.colorScheme.surface,
        contentColor = MaterialTheme.colorScheme.onSurface
    ) {
        NavItem.all.forEach { item ->
            val selected = currentRoute == item.route
            NavigationRailItem(
                selected = selected,
                onClick = {
                    navController.navigate(item.route) {
                        popUpTo(navController.graph.startDestinationId) { saveState = true }
                        launchSingleTop = true
                        restoreState = true
                    }
                },
                icon = {
                    Icon(
                        imageVector = if (selected) item.selectedIcon else item.unselectedIcon,
                        contentDescription = item.label
                    )
                },
                label = { Text(item.label) }
            )
        }
    }
}

@Preview(showBackground = true, widthDp = 120, heightDp = 600)
@Composable
fun NavigationRailWithNavPreview() {
    // Utilisation d'un NavController fictif
    val navController = rememberNavController()

    // Optionnel : définir la destination actuelle simulée (ex. "home")

    NavigationRailWithNav(
        navController = navController
    )
}

