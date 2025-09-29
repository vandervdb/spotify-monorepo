package org.vander.spotifyclient.data.auth

import android.app.Activity
import android.content.Intent
import android.util.Log
import androidx.activity.result.ActivityResult
import androidx.activity.result.ActivityResultLauncher
import com.spotify.sdk.android.auth.AuthorizationClient
import com.spotify.sdk.android.auth.AuthorizationClient.createLoginActivityIntent
import com.spotify.sdk.android.auth.AuthorizationRequest
import com.spotify.sdk.android.auth.AuthorizationResponse
import org.vander.spotifyclient.BuildConfig
import org.vander.spotifyclient.domain.auth.ISpotifyAuthClient
import org.vander.spotifyclient.utils.REDIRECT_URI
import org.vander.spotifyclient.utils.USER_LIBRARY_MODIFY
import org.vander.spotifyclient.utils.USER_LIBRARY_READ
import org.vander.spotifyclient.utils.USER_READ_CURRENTLY_PLAYING
import org.vander.spotifyclient.utils.USER_READ_PLAYBACK_STATE
import org.vander.spotifyclient.utils.USER_READ_PRIVATE
import javax.inject.Inject

class SpotifyAuthClient @Inject constructor() : ISpotifyAuthClient {
    companion object {
        private const val TAG = "SpotifyClient"
    }

    /**
     * Initiates the Spotify authorization flow.
     *
     * This function builds an [AuthorizationRequest] with the necessary client ID, redirect URI,
     * and required scopes. It then creates an [Intent] for the Spotify login activity
     * and launches it using the provided [ActivityResultLauncher].
     * The array of scopes used by the login request defines the permissions that the user
     * will be asked to grant to the app during the authorization process.
     *
     * @param contextActivity The current [Activity] context.
     * @param launcher The [ActivityResultLauncher] used to launch the Spotify login activity.
     */
    override fun authorize(contextActivity: Activity, launcher: ActivityResultLauncher<Intent>) {
        val request = AuthorizationRequest.Builder(
            BuildConfig.CLIENT_ID,
            AuthorizationResponse.Type.CODE,
            REDIRECT_URI,
        ).apply {
            setScopes(
                arrayOf(
                    "streaming",
                    USER_READ_PRIVATE,
                    USER_READ_CURRENTLY_PLAYING,
                    USER_READ_PLAYBACK_STATE,
                    USER_LIBRARY_MODIFY,
                    USER_LIBRARY_READ
                )
            )
            setShowDialog(true)
        }.build()
        val intent = createLoginActivityIntent(contextActivity, request)
        launcher.launch(intent)
    }

    override fun handleSpotifyAuthResult(
        result: ActivityResult,
        onResult: (Result<String>) -> Unit
    ) {
        Log.d(TAG, "handleSpotifyAuthResult: $result")

        return if (result.resultCode == Activity.RESULT_OK) {
            val data = result.data
            if (data == null) {
                Log.e(TAG, "Aucune donnée reçue dans le résultat d'activité")
                onResult(Result.failure<String>(Exception("Aucune donnée reçue")))
            }
            val token = data?.getStringExtra("token")
            Log.d(TAG, "Résultat OK")
            val response = AuthorizationClient.getResponse(result.resultCode, data)
            when (response.type) {
                AuthorizationResponse.Type.CODE -> {
                    Log.d(TAG, "Code d'autorisation reçu: ${response.code}")
                    onResult(Result.success(response.code))
                }

                else -> {
                    Log.e(TAG, "Erreur dans la réponse: ${response.error}")
                    onResult(Result.failure<String>(Exception(response.error)))
                }
            }
        } else {
            Log.e(TAG, "Erreur lors de la connexion à Spotify, code résultat: ${result.resultCode}")
            onResult(Result.failure<String>(Exception(result.resultCode.toString())))
        }
    }
}

