package org.vander.android.sample.presentation.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationRail
import androidx.compose.material3.NavigationRailItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
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

    Scaffold { innerPadding ->

        Row(
            modifier = Modifier.padding(innerPadding)
        ) {
            NavigationRailWithNav(navController = navController)
            AppNavHost(navController, innerPadding)
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

