package org.vander.spotifyclient.domain.appremote

import android.content.Context
import com.spotify.android.appremote.api.SpotifyAppRemote
import com.vander.core.domain.state.RemoteClientState
import kotlinx.coroutines.flow.StateFlow

interface ISpotifyAppRemoteProvider {
    val remoteState: StateFlow<RemoteClientState>
    suspend fun connect(context: Context): Result<Unit>
    fun get(): SpotifyAppRemote?
    fun disconnect()
}
