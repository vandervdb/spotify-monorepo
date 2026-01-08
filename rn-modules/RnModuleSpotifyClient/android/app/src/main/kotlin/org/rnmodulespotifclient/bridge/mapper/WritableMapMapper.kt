package org.rnmodulespotifyclient.bridge.mapper

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import org.rnmodulespotifyclient.bridge.helper.putNullableBoolean
import org.rnmodulespotifyclient.bridge.helper.putNullableString
import org.rnmodulespotifyclient.bridge.helper.toWritableArray
import org.vander.core.domain.state.DomainPlayerState
import org.vander.core.domain.state.PlayerStateData
import org.vander.core.domain.state.SessionState
import org.vander.core.ui.domain.UIQueueItem
import org.vander.core.ui.state.UIQueueState
import org.vander.spotifyclient.bridge.PlayerStateDto

fun SessionState.toWritableMap(): WritableMap =
    when (this) {
        is SessionState.Idle ->
            Arguments.createMap().apply {
                putInt("schema", 1)
                putString("type", "Idle")
            }

        is SessionState.Authorizing ->
            Arguments.createMap().apply {
                putInt("schema", 1)
                putString("type", "Authorizing")
            }

        is SessionState.ConnectingRemote ->
            Arguments.createMap().apply {
                putInt("schema", 1)
                putString("type", "ConnectingRemote")
            }

        is SessionState.Ready ->
            Arguments.createMap().apply {
                putInt("schema", 1)
                putString("type", "Ready")
            }

        is SessionState.IsPaused ->
            Arguments.createMap().apply {
                putInt("schema", 1)
                putString("type", "IsPaused")
            }

        is SessionState.Failed ->
            Arguments.createMap().apply {
                putInt("schema", 1)
                putString("type", "Failed")
                val err =
                    Arguments.createMap().apply {
                        putNullableString("message", exception.message)
                        putString("exceptionType", exception::class.java.name)
                        // Option A (compact): single string stack
                        putNullableString("stack", exception.stackTrace?.joinToString("\n"))
                        // Option B (verbose): array (uncomment if you prefer array)
                        // val arr = Arguments.createArray().apply {
                        //     exception.stackTrace?.forEach { pushString(it.toString()) }
                        // }
                        // putArray("stack", arr)
                    }
                putMap("error", err)
            }
    }

fun PlayerStateData.toWritableMap(): WritableMap =
    Arguments.createMap().apply {
        putInt("schema", 1)
        putNullableString("trackName", trackName)
        putNullableString("artistName", artistName)
        putNullableString("albumName", albumName)
        putNullableString("coverId", coverId)
        putNullableString("trackId", trackId)
        putBoolean("isPaused", isPaused)
        putBoolean("playing", playing)
        putBoolean("paused", paused)
        putBoolean("stopped", stopped)
        putBoolean("shuffling", shuffling)
        putBoolean("repeating", repeating)
        putBoolean("seeking", seeking)
        putBoolean("skippingNext", skippingNext)
        putBoolean("skippingPrevious", skippingPrevious)
        // RN uses Double for numbers
        putDouble("positionMs", positionMs.toDouble())
        putDouble("durationMs", durationMs.toDouble())
    }

fun DomainPlayerState.toWritableMap(): WritableMap =
    Arguments.createMap().apply {
        putInt("schema", 1)
        putMap("base", base.toWritableMap())
        // Decide: omit vs null — here we keep explicit null for clarity
        putNullableBoolean("isTrackSaved", isTrackSaved)
    }

fun UIQueueItem.toWritableMap(): WritableMap =
    Arguments.createMap().apply {
        putNullableString("trackName", trackName)
        putNullableString("artistName", artistName)
        putNullableString("trackId", trackId)
    }

fun UIQueueState.toWritableMap(): WritableMap =
    Arguments.createMap().apply {
        putInt("schema", 1)
        putArray("items", items.toWritableArray { it.toWritableMap() })
    }

fun PlayerStateDto.toWritableMap(): WritableMap =
    Arguments.createMap().apply {
        putInt("schema", 1)
        putBoolean("isPlaying", isPlaying)
        putDouble("positionMs", positionMs.toDouble())
        putDouble("durationMs", durationMs.toDouble())
        putNullableString("trackUri", trackUri)
        putNullableString("trackName", trackName)
        putNullableString("artistName", artistName)
        putNullableString("albumName", albumName)
    }
