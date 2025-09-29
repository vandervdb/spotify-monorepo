package org.vander.android.sample.presentation.components.preview

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import org.vander.fake.spotify.FakeMiniPlayerViewModel
import com.vander.android.sample.R
import org.vander.android.sample.presentation.components.MiniPlayerWithPainter

@Preview(showBackground = true)
@Composable
fun PreviewMiniPlayerWithLocalCover() {
    val fakeViewModel = remember { FakeMiniPlayerViewModel() }

    MiniPlayerWithPainter(
        viewModel = fakeViewModel,
        coverPainter = painterResource(id = R.drawable.mr_scurff_test_cover)
    )
}
