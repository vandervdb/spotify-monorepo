package org.vander.spotifyclient.domain.state

import com.vander.core.domain.state.PlayerState
import com.vander.core.domain.state.copyWithBase
import com.vander.core.domain.state.copyWithSaved
import kotlinx.coroutines.flow.MutableStateFlow

/**
 * Atomically updates the state of this [MutableStateFlow] with the result of applying
 * the given [transform] function to the current state.
 *
 * This function provides a safe and concise way to modify the state of a [MutableStateFlow]
 * in a thread-safe manner. When multiple updates are attempted concurrently, they are processed
 * one after another, guaranteeing that each update operates on the latest value.
 *
 * @param transform a function that takes the current state of the [MutableStateFlow]
 *                  and returns the new state.
 */
inline fun MutableStateFlow<PlayerState>.update(
    transform: (PlayerState) -> PlayerState
) {
    value = transform(value)
}

/**
 * Atomically updates the value of the [MutableStateFlow] only if the given [predicate] is satisfied.
 *
 * The [predicate] function is called with the current value of the [MutableStateFlow]. If it returns `true`,
 * the [transform] function is applied to the current value, and the result is set as the new value of the flow.
 * If the [predicate] returns `false`, the value of the flow remains unchanged.
 *
 * This operation is atomic, meaning that the [predicate] check and the update (if performed) happen
 * as a single, uninterrupted operation, ensuring that the current value is not changed by
 * other threads between the check and the update.
 *
 * @param predicate A function that determines whether the update should occur based on the current value.
 * @param transform A function that transforms the current value into the new value if the predicate is true.
 */
inline fun MutableStateFlow<PlayerState>.updateIf(
    predicate: (PlayerState) -> Boolean,
    transform: (PlayerState) -> PlayerState
) {
    val current = value
    if (predicate(current)) {
        value = transform(current)
    }
}

fun MutableStateFlow<PlayerState>.togglePause() {
    update {
        val newBase = it.base.copy(isPaused = !it.base.isPaused)
        it.copyWithBase(newBase)
    }
}

fun MutableStateFlow<PlayerState>.setTrackSaved(isSaved: Boolean) {
    update { it.copyWithSaved(isSaved) }
}

fun MutableStateFlow<PlayerState>.setTrack(trackId: String) {
    update {
        val newBase = it.base.copy(trackId = trackId)
        it.copyWithBase(newBase)
    }
}


fun MutableStateFlow<PlayerState>.reset() {
    value = PlayerState.empty()
}
