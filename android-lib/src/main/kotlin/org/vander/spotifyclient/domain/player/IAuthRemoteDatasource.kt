package org.vander.spotifyclient.domain.player

import com.vander.core.dto.TokenResponseDto


fun interface IAuthRemoteDatasource {
    suspend fun fetchAccessToken(code: String): Result<TokenResponseDto>
}
