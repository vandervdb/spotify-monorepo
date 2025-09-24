package org.vander.spotifyclient.data.remote.dto

import kotlinx.serialization.Serializable

@Serializable
data class ExternalUrlDto(
    val spotify: String
)
