package org.vander.android.sample.presentation.viewmodel

import android.util.Log
import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import org.vander.core.domain.data.PlaylistCollection
import org.vander.core.ui.presentation.viewmodel.IPlaylistViewModel
import org.vander.spotifyclient.domain.usecase.PlaylistUseCase
import javax.inject.Inject

@HiltViewModel
class PlayListViewModel @Inject constructor(
    private val useCase: PlaylistUseCase,
) : ViewModel(), IPlaylistViewModel {

    private val _playlists = MutableStateFlow(PlaylistCollection.empty())
    override val playlists: StateFlow<PlaylistCollection> = _playlists

    override suspend fun refresh() {
        useCase.getAndUpdatePlaylistsFlow()
        collectPlayListState()
    }

    private suspend fun collectPlayListState() {
        Log.d("PlayListViewModel", "Collecting playlists state...")
        useCase.playlists.collect { playlistState ->
            Log.d("PlayListViewModel", "Received playlists state: $playlistState")
            _playlists.value = playlistState
        }
    }
}
