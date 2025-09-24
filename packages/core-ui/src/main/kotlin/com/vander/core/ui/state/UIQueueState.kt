package com.vander.core.ui.state

import com.vander.core.ui.domain.UIQueueItem


data class UIQueueState(
    val items: List<UIQueueItem>
) {
    companion object {
        fun empty(): UIQueueState {
            return UIQueueState(List(0) { UIQueueItem.empty() })
        }
    }
}
