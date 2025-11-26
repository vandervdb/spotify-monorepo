package org.vander.android.sample.ui.screen

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier

@Suppress("FunctionNaming")
@Composable
fun HomeScreen(setTopBar: (@Composable () -> Unit) -> Unit) {
    LaunchedEffect(Unit) {
        setTopBar { }
    }
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("Home")
    }
}
