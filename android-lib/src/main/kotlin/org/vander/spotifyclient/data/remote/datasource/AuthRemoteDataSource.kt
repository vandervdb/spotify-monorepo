package org.vander.spotifyclient.data.remote.datasource


import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.serialization.json.Json
import org.vander.core.dto.TokenResponseDto
import org.vander.core.logger.Logger
import org.vander.spotifyclient.BuildConfig.CLIENT_ID
import org.vander.spotifyclient.BuildConfig.CLIENT_SECRET
import org.vander.spotifyclient.domain.auth.IAuthRemoteDatasource
import org.vander.spotifyclient.utils.REDIRECT_URI
import org.vander.spotifyclient.utils.parseSpotifyResult
import javax.inject.Inject
import javax.inject.Named
import kotlin.io.encoding.ExperimentalEncodingApi

class AuthRemoteDataSource @Inject constructor(
    @param:Named("AuthHttpClient") val httpClient: HttpClient,
    private val logger: Logger
) : IAuthRemoteDatasource {
    @OptIn(ExperimentalEncodingApi::class)
    override suspend fun fetchAccessToken(code: String): Result<TokenResponseDto> {
        return try {
            val credentials = "$CLIENT_ID:$CLIENT_SECRET"
            val encodedCredentials = kotlin.io.encoding.Base64.encode(credentials.toByteArray())
            val response = httpClient.submitForm(
                url = "token",
                formParameters = Parameters.build {
                    append("grant_type", "authorization_code")
                    append("code", code)
                    append("redirect_uri", REDIRECT_URI)
                }
            ) {
                headers {
                    append("Content-Type", "application/x-www-form-urlencoded")
                    append("Authorization", "Basic $encodedCredentials")
                }
            }

            val rawBody = response.bodyAsText()
            logger.d("AuthRemoteDataSource", "Raw body: $rawBody")
            val json = Json { ignoreUnknownKeys = true }

            return response.parseSpotifyResult<TokenResponseDto>("AuthRemoteDataSource")

        } catch (e: Exception) {
            logger.e("AuthRemoteDataSource", "Error fetching token", e)
            Result.failure(e)
        }
    }
}
