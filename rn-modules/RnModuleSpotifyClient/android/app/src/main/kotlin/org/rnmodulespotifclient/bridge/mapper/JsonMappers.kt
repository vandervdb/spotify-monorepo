package org.rnmodulespotifyclient.bridge.mapper

import org.json.JSONArray
import org.json.JSONObject
import org.vander.core.domain.state.DomainPlayerState
import org.vander.core.domain.state.PlayerStateData
import org.vander.core.domain.state.SessionState
import org.vander.core.ui.domain.UIQueueItem
import org.vander.core.ui.state.UIQueueState
import org.vander.spotifyclient.bridge.PlayerStateDto

// ————————————— SessionState —————————————
fun SessionState.toJsonObject(): JSONObject =
    when (this) {
        is SessionState.Idle -> JSONObject().put("type", "Idle")
        is SessionState.Authorizing -> JSONObject().put("type", "Authorizing")
        is SessionState.ConnectingRemote -> JSONObject().put("type", "ConnectingRemote")
        is SessionState.Ready -> JSONObject().put("type", "Ready")
        is SessionState.IsPaused -> JSONObject().put("type", "IsPaused")
        is SessionState.Failed ->
            JSONObject()
                .put("type", "Failed")
                .put(
                    "error",
                    JSONObject()
                        .put("message", exception.message ?: "")
                        .put("exceptionType", exception::class.java.name)
                        .put("stack", JSONArray((exception.stackTrace ?: emptyArray()).map { it.toString() })),
                )
    }

fun SessionState.toJsonString(): String = toJsonObject().toString()

// ————————————— PlayerStateData —————————————
fun PlayerStateData.toJsonObject(): JSONObject =
    JSONObject()
        .put("trackName", trackName)
        .put("artistName", artistName)
        .put("albumName", albumName)
        .put("coverId", coverId)
        .put("trackId", trackId)
        .put("isPaused", isPaused)
        .put("playing", playing)
        .put("paused", paused)
        .put("stopped", stopped)
        .put("shuffling", shuffling)
        .put("repeating", repeating)
        .put("seeking", seeking)
        .put("skippingNext", skippingNext)
        .put("skippingPrevious", skippingPrevious)
        .put("positionMs", positionMs)
        .put("durationMs", durationMs)

fun PlayerStateData.toJsonString(): String = toJsonObject().toString()

// ————————————— PlayerState —————————————
fun DomainPlayerState.toJsonObject(): JSONObject =
    JSONObject()
        .put("base", base.toJsonObject())
        .put("isTrackSaved", isTrackSaved)

fun DomainPlayerState.toJsonString(): String = toJsonObject().toString()

// ————————————— UIQueueItem / UIQueueState —————————————
fun UIQueueItem.toJsonObject(): JSONObject =
    JSONObject()
        .put("trackName", trackName)
        .put("artistName", artistName)
        .put("trackId", trackId)

fun UIQueueState.toJsonObject(): JSONObject =
    JSONObject()
        .put("items", JSONArray(items.map { it.toJsonObject() }))

fun UIQueueState.toJsonString(): String = toJsonObject().toString()

// ————————————— PlayerStateDto (si vous en émettez côté bridge) —————————————
fun PlayerStateDto.toJsonObject(): JSONObject =
    JSONObject()
        .put("isPlaying", isPlaying)
        .put("positionMs", positionMs)
        .put("durationMs", durationMs)
        .put("trackUri", trackUri)
        .put("trackName", trackName)
        .put("artistName", artistName)
        .put("albumName", albumName)

fun PlayerStateDto.toJsonString(): String = toJsonObject().toString()
