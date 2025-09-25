package org.vander.spotifyclient.domain.auth

import com.vander.core.dto.TokenResponseDto


interface IAuthRemoteDatasource {
    suspend fun fetchAccessToken(code: String): Result<TokenResponseDto>
}
