package org.vander.spotifyclient.data.remote.datasource

import org.vander.core.domain.auth.ITokenProvider
import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.client.request.headers
import io.ktor.http.HttpHeaders
import org.vander.spotifyclient.domain.datasource.IRemoteQueueDataSource
import org.vander.spotifyclient.utils.parseSpotifyResult
import javax.inject.Inject
import javax.inject.Named
import org.vander.core.dto.CurrentlyPlayingWithQueueDto


class RemoteQueueDataSource @Inject constructor(
    @Named("SpotifyRemoteQueueHttpClient") private val httpClient: HttpClient,
    private val tokenProvider: ITokenProvider
) : IRemoteQueueDataSource {

    override suspend fun fetchUserQueue(): Result<CurrentlyPlayingWithQueueDto> {
        val token = tokenProvider.getAccessToken() ?: ""
        return try {
            val response = httpClient.get("player/queue") {
                headers {
                    append(HttpHeaders.Authorization, "Bearer $token")
                }
            }
            return response.parseSpotifyResult<CurrentlyPlayingWithQueueDto>("SpotifyRemoteDataSource")

        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
