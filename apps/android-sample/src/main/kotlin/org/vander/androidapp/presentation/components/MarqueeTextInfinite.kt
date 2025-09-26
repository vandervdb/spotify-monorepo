package org.vander.androidapp.presentation.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.EaseInOutQuad
import androidx.compose.animation.core.tween
import androidx.compose.foundation.text.BasicText
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import org.vander.androidapp.presentation.util.drawFadeEdges
import kotlin.math.max
import kotlin.math.roundToInt

@Composable
fun MarqueeTextInfinite(
    text: String,
    modifier: Modifier = Modifier,
    textStyle: TextStyle = MaterialTheme.typography.bodyLarge,
    speedPxPerSecond: Float = 60f,
    spacer: Dp = 24.dp,
    fadeEdgeWidth: Dp = 16.dp,
    fadeColor: Color = MaterialTheme.colorScheme.surface
) {
    val density = LocalDensity.current
    val textMeasurer = rememberTextMeasurer()

    val measured = remember(text, textStyle) {
        textMeasurer.measure(text = text, style = textStyle)
    }

    val textWidthPx = measured.size.width
    val textHeightPx = measured.size.height
    val spacerPx = with(density) { spacer.toPx().roundToInt() }

    val totalLoopWidth = textWidthPx + spacerPx
    val offsetX = remember { Animatable(0f) }

    LaunchedEffect(totalLoopWidth) {
        while (true) {
            offsetX.snapTo(0f)
            offsetX.animateTo(
                targetValue = -totalLoopWidth.toFloat(),
                animationSpec = tween(
                    durationMillis = ((totalLoopWidth / speedPxPerSecond) * 1000).toInt(),
                    easing = EaseInOutQuad
                )
            )
        }
    }

    Layout(
        modifier = modifier
            .clipToBounds()
            .drawFadeEdges(edgeWidth = fadeEdgeWidth, fadeColor = fadeColor),
        content = {
            BasicText(
                text = text,
                style = textStyle.copy(color = MaterialTheme.colorScheme.onBackground),
                maxLines = 1,
                softWrap = false
            )
            BasicText(
                text = text,
                style = textStyle.copy(color = MaterialTheme.colorScheme.onBackground),
                maxLines = 1,
                softWrap = false
            )
        }
    ) { measurables, constraints ->
        val safeMaxWidth = max(totalLoopWidth, constraints.minWidth)

        val placeables = measurables.map {
            it.measure(constraints.copy(maxWidth = safeMaxWidth))
        }

        layout(width = constraints.maxWidth, height = textHeightPx) {
            val offset = offsetX.value.roundToInt()
            placeables[0].placeRelative(x = offset, y = 0)
            placeables[1].placeRelative(x = offset + totalLoopWidth, y = 0)
        }
    }
}
