package org.vander.android.sample.presentation.components

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.PagerDefaults
import androidx.compose.foundation.pager.PagerState
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddCircle
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import org.vander.core.domain.state.SessionState
import org.vander.core.domain.state.coverId
import org.vander.core.domain.state.isPaused
import org.vander.core.domain.state.trackId
import org.vander.core.ui.domain.UIQueueItem
import org.vander.core.ui.presentation.viewmodel.IMiniPlayerViewModel
import kotlinx.coroutines.delay
import org.vander.android.sample.presentation.components.preview.PreviewMiniPlayerWithLocalCover

@Composable
fun MiniPlayer(viewModel: IMiniPlayerViewModel) {
    val sessionState by viewModel.sessionState.collectAsState()
    val playerState by viewModel.playerState.collectAsState()
    val uIQueueState by viewModel.uIQueueState.collectAsState()

    if (sessionState is SessionState.Ready) {
        Log.d("MiniPlayer", "Session is ready")
        Log.d("MiniPlayer", "Player state: $playerState")
        Log.d("MiniPlayer", "Queue state: $uIQueueState")
        MiniPlayerContent(
            tracksQueue = uIQueueState.items,
            trackId = playerState.trackId,
            isSaved = playerState.isTrackSaved == true,
            isPaused = playerState.isPaused,
            saveTrack = {
                Log.d("MiniPlayer", "Saving track: $it")
                viewModel.toggleSaveTrack(it)
            },
            skipNext = {
                Log.d("MiniPlayer", "Skipping next track")
                viewModel.skipNext()
            },
            skipPrevious = {
                Log.d("MiniPlayer", "Skipping previous track")
                viewModel.skipPrevious()
            },
            onPlayPause = { viewModel.togglePlayPause() },
            cover = {
                SpotifyTrackCover(
                    imageUri = playerState.coverId,
                    modifier = Modifier.size(48.dp)
                )
            }
        )
    }
}

@Composable
private fun MiniPlayerContent(
    tracksQueue: List<UIQueueItem>,
    trackId: String = "",
    isSaved: Boolean = false,
    isPaused: Boolean,
    onPlayPause: () -> Unit,
    saveTrack: (String) -> Unit,
    skipNext: () -> Unit,
    skipPrevious: () -> Unit,
    cover: @Composable () -> Unit
) {

    val pagerState = rememberPagerState(pageCount = { tracksQueue.size })
    val currentTrackId = trackId
    val currentTrackIndex = tracksQueue.indexOfFirst { it.trackId == currentTrackId }

    var miniplayerSize by remember { mutableIntStateOf(0) }

    /* Workaround to prevent the swipe gesture callback (playTrack(newTrackId)) to be triggered */
    var suppressSwipeCallback by remember { mutableStateOf(false) }

    LaunchedEffect(currentTrackId) {
        val index = tracksQueue.indexOfFirst { it.trackId == currentTrackId }
        if (index >= 0 && index != pagerState.currentPage) {
            suppressSwipeCallback = true
            pagerState.animateScrollToPage(index)
            delay(300)
            suppressSwipeCallback = false
        }
    }
    Log.d("MiniPlayer", "MiniPlayer size: $miniplayerSize")
    LaunchedEffect(pagerState.currentPage) {
        if (!suppressSwipeCallback) {
            val newTrackId = tracksQueue.getOrNull(pagerState.currentPage)?.trackId
            if (newTrackId != null && newTrackId != currentTrackId) {
                Log.d("MiniPlayer", "Swiped to trackId=$newTrackId")
                val newTrackIndex = tracksQueue.indexOfFirst { it.trackId == newTrackId }
                if (currentTrackIndex > newTrackIndex) {
                    skipPrevious()
                    skipPrevious()
                } else {
                    skipNext()
                }

            }
        }
    }

    Surface(
        tonalElevation = 4.dp,
        color = MaterialTheme.colorScheme.surface,
        modifier = Modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.surface)
    ) {
        Row(
            modifier = Modifier
                .padding(8.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Start
        ) {
            cover()

            Spacer(modifier = Modifier.padding(horizontal = 8.dp))

            Box(modifier = Modifier.weight(1f)) {
                TracksQueue(pagerState, tracksQueue)
            }

            IconButton(onClick = { saveTrack(trackId) }) {
                Icon(
                    imageVector = if (isSaved) Icons.Default.CheckCircle else Icons.Default.AddCircle,
                    contentDescription = if (isSaved) "Remove from saved library" else "Save to library"
                )
            }

            IconButton(onClick = onPlayPause) {
                Icon(
                    imageVector = if (isPaused) Icons.Default.PlayArrow else Icons.Default.Pause,
                    contentDescription = if (isPaused) "Plat" else "Pause"
                )
            }
        }
    }
}

@Composable
private fun TracksQueue(pagerState: PagerState, tracksQueue: List<UIQueueItem>) {
    HorizontalPager(
        state = pagerState,
        modifier = Modifier.fillMaxWidth(),
        flingBehavior = PagerDefaults.flingBehavior(state = pagerState),
        pageSpacing = 8.dp
    ) { index ->
        val item = tracksQueue[index]
        TrackItem(
            trackName = item.trackName,
            artistName = item.artistName
        )
    }
}

@Composable
private fun TrackItem(trackName: String, artistName: String) {
    Column(
        modifier = Modifier.padding(8.dp),
        verticalArrangement = Arrangement.Center
    ) {
        MarqueeTextInfinite(
            text = trackName,
            modifier = Modifier.width(120.dp),
        )
        Text(
            text = artistName,
            style = MaterialTheme.typography.bodySmall,
            maxLines = 1
        )
    }
}


@Composable
fun MiniPlayerWithPainter(
    viewModel: IMiniPlayerViewModel,
    coverPainter: Painter
) {
    val sessionState by viewModel.sessionState.collectAsState()
    val playerState by viewModel.playerState.collectAsState()
    val uIQueueState by viewModel.uIQueueState.collectAsState()

    if (sessionState is SessionState.Ready) {
        MiniPlayerContent(
            tracksQueue = uIQueueState.items,
            trackId = playerState.trackId,
            isSaved = playerState.isTrackSaved == true,
            isPaused = playerState.isPaused,
            saveTrack = {
                Log.d("MiniPlayer", "Saving track: $it")
                viewModel.toggleSaveTrack(it)
            },
            skipNext = {
                Log.d("MiniPlayer", "Skipping next track")
                viewModel.skipNext()
            },
            skipPrevious = {
                Log.d("MiniPlayer", "Skipping previous track")
                viewModel.skipPrevious()
            },
            onPlayPause = { viewModel.togglePlayPause() },
            cover = {
                SpotifyTrackCover(
                    painter = coverPainter,
                    modifier = Modifier.size(48.dp)
                )
            }
        )
    }
}


@Preview(showBackground = true)
@Composable
fun MiniPlayerPreview() {
    PreviewMiniPlayerWithLocalCover()
}
