package org.rnmodulespotifyclient.bridge

import android.app.Activity
import androidx.activity.ComponentActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import org.rnmodulespotifyclient.NativeSpotifyClientModuleSpec
import org.rnmodulespotifyclient.bridge.mapper.toWritableMap
import org.vander.spotifyclient.bridge.SpotifyBridgeApi
import org.vander.spotifyclient.bridge.di.obtainBridgeFromHilt

sealed interface WireFormat {
    object Json : WireFormat

    object Map : WireFormat
}

class NativeSpotifyClientModule(
    private val reactContext: ReactApplicationContext,
) : NativeSpotifyClientModuleSpec(reactContext),
    TurboModule {
    private var job = SupervisorJob()
    private val scope = CoroutineScope(Dispatchers.Main.immediate + job)

    private val bridge: SpotifyBridgeApi by lazy { obtainBridgeFromHilt(reactContext) }

    override fun getName() = NAME

    override fun initialize() {
        super.initialize()
        scope.launch {
            bridge.sessionState.collect {
                sendEvent(
                    "spotify/sessionState",
                    it.toWritableMap(),
                )
            }
        }
        scope.launch {
            bridge.domainPlayerState.collect {
                sendEvent(
                    "spotify/playerState",
                    it.toWritableMap(),
                )
            }
        }
        scope.launch {
            bridge.uIQueueState.collect {
                sendEvent(
                    "spotify/uiQueue",
                    it.toWritableMap(),
                )
            }
        }
    }

    override fun startUpWithHostActivityResult(
        config: ReadableMap?,
        promise: Promise?,
    ) {
        if (promise == null) return
        internalStartUp(promise) { activity ->
            if (activity == null) return@internalStartUp
            scope.launch {
                bridge.startUpWithHostActivityResult(activity)
            }
        }
    }

    override fun startUpWithModuleActivityResult(
        config: ReadableMap?,
        promise: Promise?,
    ) {
        if (promise == null) return
        internalStartUp(promise) { activity ->
            if (activity == null) return@internalStartUp
            scope.launch {
                bridge.startUpWithModuleActivityResult(activity)
            }
        }
    }

    private fun internalStartUp(
        promise: Promise,
        startAction: (activity: Activity?) -> Unit,
    ) {
        val activity = currentActivity
        when {
            activity == null -> {
                promise.reject("NO_ACTIVITY", "No current Activity")
                return
            }

            activity !is ComponentActivity -> {
                promise.reject("BAD_ACTIVITY", "Host Activity must extend ComponentActivity")
                return
            }
        }

        scope.launch {
            try {
                startAction(activity)
                promise.resolve(null)
            } catch (t: Throwable) {
                promise.reject("START_FAIL", t)
            }
        }
    }

    fun startUp(
        config: ReadableMap?,
        promise: Promise,
    ) {
        val activity: Activity =
            currentActivity ?: return promise.reject("NO_ACTIVITY", "No current Activity")
        val isComponent = activity is ComponentActivity
        if (!isComponent) {
            return promise.reject(
                "BAD_ACTIVITY",
                "Host Activity must extend ComponentActivity",
            )
        }

        scope.launch {
            try {
                bridge.startUpWithHostActivityResult(activity)
                promise.resolve(null)
            } catch (t: Throwable) {
                promise.reject("START_FAIL", t)
            }
        }
    }

    override fun disconnect(promise: Promise) {
        scope.launch {
            try {
                bridge.disconnect()
                promise.resolve(null)
            } catch (t: Throwable) {
                promise.reject("PLAYER_DISCONNECT", t)
            }
        }
    }

    override fun playUri(
        uri: String,
        promise: Promise,
    ) {
        scope.launch {
            runCatching { bridge.playUri(uri) }
                .onSuccess { promise.resolve(null) }
                .onFailure { promise.reject("PLAY_FAIL", it) }
        }
    }

    override fun pause(promise: Promise) {
        scope.launch {
            runCatching { bridge.pause() }
                .onSuccess { promise.resolve(null) }
                .onFailure { promise.reject("PAUSE_FAIL", it) }
        }
    }

    override fun resume(promise: Promise) {
        scope.launch {
            runCatching { bridge.resume() }
                .onSuccess { promise.resolve(null) }
                .onFailure { promise.reject("RESUME_FAIL", it) }
        }
    }

    override fun seekTo(
        ms: Double,
        promise: Promise,
    ) { // RN JS number -> Double -> Long
        scope.launch {
            runCatching { bridge.seekTo(ms.toLong()) }
                .onSuccess { promise.resolve(null) }
                .onFailure { promise.reject("SEEK_FAIL", it) }
        }
    }

    override fun getPlayerState(promise: Promise) {
        scope.launch {
            runCatching { bridge.getPlayerState() }
                .onSuccess { state -> promise.resolve(state.toWritableMap()) }
                .onFailure { t -> promise.reject("GET_STATE_FAIL", t) }
        }
    }

    override fun startPlayerEvents(promise: Promise?) {
        promise?.resolve(null)
    }

    private fun sendEvent(
        name: String,
        payload: WritableMap,
    ) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(name, payload)
    }

    override fun stopPlayerEvents(promise: Promise) {
        job.cancel()
        promise.resolve(null)
    }

    override fun addListener(eventName: String?) {
        // Required for NativeEventEmitter
    }

    override fun removeListeners(count: Double) {
        // Required for NativeEventEmitter
    }

    override fun invalidate() {
        super.invalidate()
        job.cancel()
    }

    companion object {
        const val NAME = "NativeSpotifyClientModule"
    }
}
