package org.vander.spotifyclient.data.repository

import android.util.Log
import org.vander.core.domain.auth.IAuthRepository
import org.vander.spotifyclient.data.remote.datasource.AuthRemoteDataSource
import org.vander.spotifyclient.domain.auth.IDataStoreManager
import javax.inject.Inject

class AuthRepository
    @Inject
    constructor(
        private val authRemoteDataSource: AuthRemoteDataSource,
        private val dataStoreManager: IDataStoreManager,
    ) : IAuthRepository {
        companion object Companion {
            private const val TAG = "AuthRepository"
        }

        override suspend fun storeAccessToken(authCode: String): Result<Unit> =
            authRemoteDataSource
                .fetchAccessToken(authCode)
                .onFailure { Log.e(TAG, "Error fetching access token", it) }
                .mapCatching { dto ->
                    Log.d(TAG, "Saving access token: ${dto.accessToken}")
                    dataStoreManager.saveAccessToken(dto.accessToken)
                }

        override suspend fun getAccessToken(): Result<String> = dataStoreManager.getAccessToken()

        override suspend fun clearAccessToken(): Result<Unit> = dataStoreManager.clearAccessToken()
    }
