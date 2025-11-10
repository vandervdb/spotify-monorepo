package org.vander.android.sample.presentation.components

import android.util.Log
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Audiotrack
import androidx.compose.material.icons.filled.Error
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.rememberVectorPainter
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter
import org.vander.core.domain.data.Playlist
import org.vander.core.ui.presentation.viewmodel.IPlaylistViewModel

@Composable
fun PlaylistComponent(viewModel: IPlaylistViewModel) {
    val playlistCollection by viewModel.playlists.collectAsState()

    LazyVerticalGrid(
        columns = GridCells.Adaptive(50.dp),
        contentPadding = PaddingValues(3.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(
            items = playlistCollection.items,
            key = { it.id }
        ) { playlist ->
            PlaylistCoverItem(playlist)
        }
    }
}

@Composable
fun PlaylistCoverItem(playlist: Playlist) {
    val id = playlist.id
    val name = playlist.name
    val coverUrl = playlist.coverUrl
    val painter = rememberAsyncImagePainter(
        model = coverUrl,
        placeholder = rememberVectorPainter(Icons.Default.Audiotrack),
        error = rememberVectorPainter(Icons.Default.Error)
    )
    val modifier = Modifier
        .pointerInput(id) {
            detectTapGestures { _ ->
                run {
                    //TODO: Implement on click to play playlist
                    Log.d("PlaylistCoverItem", "Clicked on playlist: $id, $name, $coverUrl")
                }
            }
        }
    Surface {
        SpotifyTrackCover(coverUrl, painter, modifier)
    }
}
