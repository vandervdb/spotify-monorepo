package org.vander.spotifyclient.data.local.mapper

import org.vander.core.domain.state.PlayerState
import org.vander.core.domain.state.PlayerStateData


fun PlayerStateData.toAppPlayerState(isSaved: Boolean): PlayerState {
    return PlayerState(this, isSaved)
}
