package org.vander.android.sample.presentation.components

import android.util.Log
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.PagerDefaults
import androidx.compose.foundation.pager.PagerState
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddCircle
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay
import org.vander.android.sample.presentation.components.preview.PreviewMiniPlayerWithLocalCover
import org.vander.core.domain.state.*
import org.vander.core.ui.domain.UIQueueItem
import org.vander.core.ui.presentation.viewmodel.IPlayerViewModel

data class TrackParams(
    val tracksQueue: List<UIQueueItem>,
    val trackId: String = "",
    val isSaved: Boolean = false,
    val isPaused: Boolean,
    val positionMS: Long,
    val durationMS: Long,
)

@Composable
fun MiniPlayer(viewModel: IPlayerViewModel) {
    val sessionState by viewModel.sessionState.collectAsState()
    val playerState by viewModel.domainPlayerState.collectAsState()
    val uIQueueState by viewModel.uIQueueState.collectAsState()

    if (sessionState is SessionState.Ready) {
        Log.d("MiniPlayer", "Session is ready")
        Log.d("MiniPlayer", "Player state: $playerState")
        Log.d("MiniPlayer", "Queue state: $uIQueueState")
        MiniPlayerContent(
            trackParams = TrackParams(
                tracksQueue = uIQueueState.items,
                trackId = playerState.trackId,
                isSaved = playerState.isTrackSaved == true,
                isPaused = playerState.isPaused,
                positionMS = playerState.positionMs,
                durationMS = playerState.durationMs
            ),
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
            onSeekTo = { targetMs -> viewModel.seekTo(targetMs) },
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
    trackParams: TrackParams,
    onPlayPause: () -> Unit,
    saveTrack: (String) -> Unit,
    skipNext: () -> Unit,
    skipPrevious: () -> Unit,
    onSeekTo: (Long) -> Unit,
    cover: @Composable () -> Unit
) {

    val pagerState = rememberPagerState(pageCount = { trackParams.tracksQueue.size })
    val currentTrackId = trackParams.trackId
    val currentTrackIndex = trackParams.tracksQueue.indexOfFirst { it.trackId == currentTrackId }

    var miniplayerSize by remember { mutableIntStateOf(0) }

    /* Workaround to prevent the swipe gesture callback (playTrack(newTrackId)) to be triggered */
    var suppressSwipeCallback by remember { mutableStateOf(false) }

    LaunchedEffect(currentTrackId) {
        val index = trackParams.tracksQueue.indexOfFirst { it.trackId == currentTrackId }
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
            val newTrackId = trackParams.tracksQueue.getOrNull(pagerState.currentPage)?.trackId
            if (newTrackId != null && newTrackId != currentTrackId) {
                Log.d("MiniPlayer", "Swiped to trackId=$newTrackId")
                val newTrackIndex = trackParams.tracksQueue.indexOfFirst { it.trackId == newTrackId }
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
            .fillMaxWidth(),

        ) {
        Column(modifier = Modifier.fillMaxWidth()) {
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
                    TracksQueue(pagerState, trackParams.tracksQueue)
                }

                IconButton(onClick = { saveTrack(trackParams.trackId) }) {
                    Icon(
                        imageVector = if (trackParams.isSaved) Icons.Default.CheckCircle else Icons.Default.AddCircle,
                        contentDescription = if (trackParams.isSaved) "Remove from saved library" else "Save to library"
                    )
                }

                IconButton(onClick = onPlayPause) {
                    Icon(
                        imageVector = if (trackParams.isPaused) Icons.Default.PlayArrow else Icons.Default.Pause,
                        contentDescription = if (trackParams.isPaused) "Plat" else "Pause"
                    )
                }
            }

            val progress = run {
                val dur = trackParams.durationMS
                val pos = trackParams.positionMS
                if (dur > 0L) (pos.toFloat() / dur.toFloat()).coerceIn(0f, 1f) else 0f
            }
            var barWidthPx by remember { mutableFloatStateOf(0F) }

            LinearProgressIndicator(
                progress = { progress },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp)
                    .onGloballyPositioned { coords ->
                        barWidthPx = coords.size.width.toFloat()
                    }
                    .pointerInput(trackParams.durationMS) {
                        detectTapGestures { offset ->
                            val dur = trackParams.durationMS
                            if (dur <= 0L || barWidthPx <= 0f) return@detectTapGestures
                            val fraction = (offset.x / barWidthPx).coerceIn(0f, 1f)
                            val targetMs = (dur * fraction).toLong()
                            onSeekTo(targetMs)
                        }
                    },
                color = MaterialTheme.colorScheme.primary,
                trackColor = MaterialTheme.colorScheme.surfaceVariant,
            )
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
    viewModel: IPlayerViewModel,
    coverPainter: Painter
) {
    val sessionState by viewModel.sessionState.collectAsState()
    val playerState by viewModel.domainPlayerState.collectAsState()
    val uIQueueState by viewModel.uIQueueState.collectAsState()

    if (sessionState is SessionState.Ready) {
        MiniPlayerContent(
            trackParams = TrackParams(
                tracksQueue = uIQueueState.items,
                trackId = playerState.trackId,
                isSaved = playerState.isTrackSaved == true,
                isPaused = playerState.isPaused,
                positionMS = playerState.positionMs,
                durationMS = playerState.durationMs
            ),
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
            onSeekTo = { targetMs -> viewModel.seekTo(targetMs) },
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
