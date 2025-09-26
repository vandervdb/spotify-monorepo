package org.vander.androidapp.presentation.components

import android.util.Log
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner

@Composable
fun LifecycleObserverComponent(
    tag: String? = null,
    onStartCallback: (() -> Unit)? = null,
    onStopCallback: (() -> Unit)? = null,
) {
    val lifecycleOwner = LocalLifecycleOwner.current

    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_START -> {
                    tag?.let { Log.d(tag, "Visible à l'écran") }
                    onStartCallback?.invoke()
                }

                Lifecycle.Event.ON_STOP -> {
                    tag?.let { Log.d(tag, "Masqué (mais pas encore détruit)") }
                    onStopCallback?.invoke()
                }

                Lifecycle.Event.ON_DESTROY -> {
                    tag?.let { Log.d(tag, "Détruit") }
                    onStopCallback?.invoke()
                }

                else -> {
                    //ne dos pas arriver
                }
            }
        }

        lifecycleOwner.lifecycle.addObserver(observer)

        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }
    }
}