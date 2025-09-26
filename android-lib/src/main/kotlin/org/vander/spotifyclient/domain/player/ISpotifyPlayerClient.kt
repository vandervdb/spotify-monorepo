package org.vander.spotifyclient.domain.player

import com.vander.core.domain.state.PlayerConnectionState
import com.vander.core.domain.state.PlayerStateData
import kotlinx.coroutines.flow.StateFlow

interface ISpotifyPlayerClient {
    val playerConnectionState: StateFlow<PlayerConnectionState>
    suspend fun subscribeToPlayerState(function: (PlayerStateData) -> Unit)
    suspend fun play(trackUri: String)
    suspend fun pause()
    suspend fun resume()
    suspend fun skipNext()
    suspend fun skipPrevious()
    fun seek(position: Int)
    fun setVolume(volume: Int)
    fun setShuffle(shuffle: Boolean)
    fun setRepeat(repeat: Boolean)
    fun isPlaying(): Boolean
}
