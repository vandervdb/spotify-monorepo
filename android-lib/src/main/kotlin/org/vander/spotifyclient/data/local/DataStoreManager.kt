package org.vander.spotifyclient.data.local

import android.content.Context
import android.util.Log
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import org.vander.spotifyclient.domain.auth.IDataStoreManager
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore by preferencesDataStore(name = "spotify_prefs")

@Singleton
class DataStoreManager @Inject constructor(
    @ApplicationContext private val context: Context
) : IDataStoreManager {

    companion object {
        private const val TAG = "DataStoreManager"
        private const val DATASTORE_NAME = "spotify_prefs"
        private val ACCESS_TOKEN_KEY = stringPreferencesKey("access_token")
    }

    private val Context.dataStore by preferencesDataStore(name = DATASTORE_NAME)

    override val accessTokenFlow: Flow<String?> = context.dataStore.data
        .map { preferences -> preferences[ACCESS_TOKEN_KEY] }

    override suspend fun saveAccessToken(token: String): Result<Unit> {
        return try {
            context.dataStore.edit { preferences ->
                Log.d(TAG, "Saving access token: $token")
                preferences[ACCESS_TOKEN_KEY] = token
            }
            Result.success(Unit)
        } catch (e: IOException) {
            Result.failure(e)
        }
    }

    override suspend fun getAccessToken(): Result<String> {
        return try {
            val token = context.dataStore.data.map { preferences ->
                preferences[ACCESS_TOKEN_KEY] ?: ""
            }.first()
            Result.success(token)
        } catch (e: IOException) {
            Result.failure(e)
        }
    }

    override suspend fun clearAccessToken(): Result<Unit> {
        return try {
            context.dataStore.edit { preferences ->
                Log.d(TAG, "Clearing access token")
                preferences.remove(ACCESS_TOKEN_KEY)
            }
            Result.success(Unit)
        } catch (e: IOException) {
            Result.failure(e)
        }
    }
}