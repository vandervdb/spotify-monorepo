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
    Arguments.createMap().apply {
        putInt("schema", 1)

        val typeMap =
            Arguments.createMap().apply {
                when (this@toWritableMap) {
                    is SessionState.Idle -> putBoolean("Idle", true)
                    is SessionState.Authorizing -> putBoolean("Authorizing", true)
                    is SessionState.ConnectingRemote -> putBoolean("ConnectingRemote", true)
                    is SessionState.Ready -> putBoolean("Ready", true)
                    is SessionState.IsPaused -> putBoolean("IsPaused", true)
                    is SessionState.Failed -> {
                        val failedMap =
                            Arguments.createMap().apply {
                                putString("exception", exception.message ?: "Unknown error")
                            }
                        putMap("Failed", failedMap)
                    }
                }
            }

        putMap("type", typeMap)
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
        putDouble("positionMs", positionMs.toDouble())
        putDouble("durationMs", durationMs.toDouble())
    }

fun DomainPlayerState.toWritableMap(): WritableMap =
    Arguments.createMap().apply {
        putInt("schema", 1)
        putMap("base", base.toWritableMap())
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
