package org.vander.spotifyclient.data.remote.datasource


import org.vander.core.domain.auth.ITokenProvider
import org.vander.core.dto.SpotifyPlaylistsResponseDto
import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.client.request.headers
import io.ktor.http.HttpHeaders
import org.vander.spotifyclient.domain.datasource.IRemotePlaylistDataSource
import org.vander.spotifyclient.utils.parseSpotifyResult
import javax.inject.Inject
import javax.inject.Named

class RemotePlaylistDataSource @Inject constructor(
    @Named("SpotifyRemotePlaylistHttpClient") private val httpClient: HttpClient,
    private val tokenProvider: ITokenProvider
) : IRemotePlaylistDataSource {

    override suspend fun fetchUserPlaylists(): Result<SpotifyPlaylistsResponseDto> {
        val token = tokenProvider.getAccessToken() ?: ""
        return try {
            val response = httpClient.get("playlists") {
                headers {
                    append(HttpHeaders.Authorization, "Bearer $token")
                }
            }
            return response.parseSpotifyResult<SpotifyPlaylistsResponseDto>("SpotifyRemoteDataSource")

        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
