package org.vander.fake.spotify

import kotlinx.coroutines.flow.MutableStateFlow
import org.vander.core.domain.data.Playlist
import org.vander.core.domain.data.PlaylistCollection
import org.vander.core.ui.presentation.viewmodel.IPlaylistViewModel

class FakePlaylistViewModel : IPlaylistViewModel {
    override val playlists = MutableStateFlow<PlaylistCollection>(
        PlaylistCollection(
            items = List(80) { index ->
                Playlist(
                    id = "playlist_$index",
                    name = "Name*$index",
                    coverUrl = "https://picsum.photos/200?random=$index"
                )
            }
        )
    )

    override suspend fun refresh() {
        TODO("Not yet implemented")
    }
}
