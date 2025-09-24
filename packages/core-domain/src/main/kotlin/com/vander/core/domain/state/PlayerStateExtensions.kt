package com.vander.core.domain.state

val PlayerState.trackName get() = base.trackName
val PlayerState.artistName get() = base.artistName
val PlayerState.coverId get() = base.coverId
val PlayerState.trackId get() = base.trackId

val PlayerState.isPaused get() = base.isPaused
val PlayerState.playing get() = base.playing
val PlayerState.paused get() = base.paused
val PlayerState.stopped get() = base.stopped
val PlayerState.shuffling get() = base.shuffling
val PlayerState.repeating get() = base.repeating
val PlayerState.seeking get() = base.seeking
val PlayerState.skippingNext get() = base.skippingNext
val PlayerState.skippingPrevious get() = base.skippingPrevious

fun PlayerState.copyWithSaved(isSaved: Boolean): PlayerState {
    return this.copy(isTrackSaved = isSaved)
}

fun PlayerState.copyWithBase(base: PlayerStateData): PlayerState {
    return this.copy(base = base)
}
