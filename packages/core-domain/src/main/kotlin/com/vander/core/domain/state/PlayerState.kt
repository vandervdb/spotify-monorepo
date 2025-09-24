package com.vander.core.domain.state

data class PlayerState(
    val base: PlayerStateData,
    val isTrackSaved: Boolean? = null,
) {
    companion object {
        fun empty(): PlayerState {
            return PlayerState(PlayerStateData.Companion.empty(), null)
        }
    }
}
