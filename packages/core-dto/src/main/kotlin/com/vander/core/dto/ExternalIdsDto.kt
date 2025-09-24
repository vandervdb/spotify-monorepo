package org.vander.spotifyclient.data.remote.dto

import kotlinx.serialization.Serializable

@Serializable
data class ExternalIdsDto(
    val isrc: String? = null,
    val ean: String? = null,
    val upc: String? = null
)
