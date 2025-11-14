package org.vander.spotifyclient.domain.repository

import kotlinx.coroutines.flow.Flow
import org.vander.core.domain.data.User

interface UserRepository {
    fun observeCurrentUser(): Flow<User?>
    suspend fun fetchCurrentUser()
}
