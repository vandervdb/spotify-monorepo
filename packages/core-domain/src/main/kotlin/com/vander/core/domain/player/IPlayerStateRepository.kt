package com.vander.core.domain.player

import com.vander.core.domain.state.PlayerStateData
import com.vander.core.domain.state.SavedRemotelyChangedState
import kotlinx.coroutines.flow.StateFlow

interface IPlayerStateRepository {
    val playerStateData: StateFlow<PlayerStateData>
    val savedRemotelyChangedState: StateFlow<SavedRemotelyChangedState>
    suspend fun startListening()
    suspend fun stopListening()
}
