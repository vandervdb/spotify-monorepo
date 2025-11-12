package org.vander.android.sample.presentation.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Audiotrack
import androidx.compose.material.icons.filled.Error
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.graphics.vector.rememberVectorPainter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter
import org.vander.android.sample.R
import org.vander.androidapp.data.util.SPOTIFY_COVER_UI

@Composable
fun SpotifyTrackCover(
    modifier: Modifier = Modifier,
    imageUri: String? = null,
    painter: Painter? = null
) {

    val finalPainter = painter ?: rememberAsyncImagePainter(
        model = "$SPOTIFY_COVER_UI$imageUri",
        placeholder = rememberVectorPainter(Icons.Default.Audiotrack),
        error = rememberVectorPainter(Icons.Default.Error)
    )


    Image(
        painter = finalPainter,
        contentDescription = null,
        modifier = modifier.clip(
            RoundedCornerShape(
                topEnd = 4.dp, topStart = 4.dp, bottomEnd = 4.dp, bottomStart = 4.dp
            )
        ),
        contentScale = ContentScale.Crop
    )
}

@Preview(showBackground = true)
@Composable
fun SpotifyTrackCoverPreview() {
    val painter = painterResource(id = R.drawable.mr_scurff_test_cover)
    val modifier = Modifier.size(48.dp)
    SpotifyTrackCover(modifier, null, painter)
}
