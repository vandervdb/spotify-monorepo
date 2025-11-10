package org.vander.core.ui.presentation.viewmodel

import kotlinx.coroutines.flow.StateFlow
import org.vander.core.domain.data.PlaylistCollection

interface IPlaylistViewModel {
    val playlists: StateFlow<PlaylistCollection>
    suspend fun refresh()
}
