package org.vander.spotifyclient.domain.datasource

import com.vander.core.dto.CurrentlyPlayingWithQueueDto


fun interface IRemoteQueueDataSource {
    suspend fun fetchUserQueue(): Result<CurrentlyPlayingWithQueueDto>
}
