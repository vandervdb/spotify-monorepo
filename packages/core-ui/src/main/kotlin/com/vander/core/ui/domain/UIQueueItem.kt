package com.vander.core.ui.domain

data class UIQueueItem(
    val trackName: String,
    val artistName: String,
    val trackId: String,
) {
    companion object {
        fun empty(): UIQueueItem {
            return UIQueueItem(
                trackName = "",
                artistName = "",
                trackId = ""
            )
        }
    }
}
