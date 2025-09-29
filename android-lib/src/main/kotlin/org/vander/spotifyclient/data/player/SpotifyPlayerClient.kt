package org.vander.spotifyclient.data.player

import android.util.Log
import com.spotify.android.appremote.api.PlayerApi
import com.spotify.protocol.types.Track
import org.vander.core.domain.state.PlayerConnectionState
import org.vander.core.domain.state.PlayerStateData
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import org.vander.spotifyclient.data.player.mapper.toPlayerStateData
import org.vander.spotifyclient.domain.appremote.ISpotifyAppRemoteProvider
import org.vander.spotifyclient.domain.player.ISpotifyPlayerClient
import javax.inject.Inject

/**
 * A client for interacting with the Spotify player.
 *
 * This class provides methods for controlling playback, subscribing to player state updates,
 * and managing the connection to the Spotify app.
 *
 * @property appRemoteProvider An [ISpotifyAppRemoteProvider] instance used to access the Spotify App Remote.
 */
class SpotifyPlayerClient @Inject constructor(
    private val appRemoteProvider: ISpotifyAppRemoteProvider,
) : ISpotifyPlayerClient {

    companion object {
        const val TAG = "SpotifyPlayerClient"
    }

    private var isPlaying = false
    private val playerApi: PlayerApi?
        get() = appRemoteProvider.get()?.playerApi


    private val _playerConnectionState =
        MutableStateFlow<PlayerConnectionState>(PlayerConnectionState.NotConnected)
    override val playerConnectionState: StateFlow<PlayerConnectionState> =
        _playerConnectionState.asStateFlow()


    override suspend fun subscribeToPlayerState(function: (PlayerStateData) -> Unit) {
        playerApi?.let { it ->
            it.subscribeToPlayerState().setEventCallback {
                val track: Track = it.track
                Log.d(
                    TAG,
                    "PlayerClient received new data: " + track.name + " by " + track.artist.name +
                            "(paused: " + it.isPaused + " / coverUri: " + track.imageUri + ")"
                )
                isPlaying = !it.isPaused
                function(it.toPlayerStateData())
            }
        } ?: run {
            Log.e(TAG, "spotifyPlayerApi is null")
            _playerConnectionState.update { PlayerConnectionState.NotConnected }
        }
    }

    override suspend fun play(trackUri: String) {
        Log.d(TAG, "play trackUri: $trackUri")
        playerApi?.play(trackUri)
    }

    override suspend fun pause() {
        playerApi?.pause()
    }

    override suspend fun resume() {
        Log.d(TAG, "resume: ")
        playerApi?.resume()
    }

    override suspend fun skipNext() {
        playerApi?.skipNext()
    }

    override suspend fun skipPrevious() {
        playerApi?.skipPrevious()
    }

    override fun seek(position: Int) {
        TODO("Not yet implemented")
    }

    override fun setVolume(volume: Int) {
        TODO("Not yet implemented")
    }

    override fun setShuffle(shuffle: Boolean) {
        TODO("Not yet implemented")
    }

    override fun setRepeat(repeat: Boolean) {
        TODO("Not yet implemented")
    }

    override fun isPlaying(): Boolean {
        return isPlaying
    }

}
