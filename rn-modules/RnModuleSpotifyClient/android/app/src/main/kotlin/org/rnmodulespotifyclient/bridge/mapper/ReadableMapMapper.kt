package org.rnmodulespotifyclient.bridge.mapper

import android.util.Log
import com.facebook.react.bridge.ReadableMap
import org.vander.spotifyclient.bridge.AuthConfigK

private const val TAG = "ReadableMap.toAuthConfig"

fun ReadableMap.toAuthConfig(): AuthConfigK? {
    Log.d(
        TAG,
        "Parsing AuthConfig from ReadableMap (keys: clientId=${hasKey("clientId")}, " +
            "redirectUrl=${hasKey("redirectUrl")}, scopes=${
                hasKey("scopes")
            }, showDialog=${hasKey("showDialog")})",
    )

    val clientId = if (hasKey("clientId")) getString("clientId") else null
    val redirectUrl = if (hasKey("redirectUrl")) getString("redirectUrl") else null
    val scopes =
        if (hasKey("scopes")) {
            val array = getArray("scopes")
            val list = mutableListOf<String>()
            if (array != null) {
                for (i in 0 until array.size()) {
                    array.getString(i)?.let { list.add(it) }
                }
            } else {
                Log.w(TAG, "scopes key present but array is null")
            }
            list.toTypedArray()
        } else {
            emptyArray()
        }
    val showDialog = if (hasKey("showDialog")) getBoolean("showDialog") else true

    if (clientId.isNullOrBlank() || redirectUrl.isNullOrBlank()) {
        Log.w(
            TAG,
            "Invalid AuthConfig: missing/blank required fields (clientIdPresent=${!clientId.isNullOrBlank()}, " +
                "redirectUrlPresent=${!redirectUrl.isNullOrBlank()})",
        )
        return null
    }

    Log.d(
        TAG,
        "AuthConfig parsed OK (clientIdLength=${clientId.length}, redirectUrlLength=${redirectUrl.length}, " +
            "scopesCount=${scopes.size}, showDialog=$showDialog)",
    )

    return AuthConfigK(
        clientId = clientId,
        redirectUrl = redirectUrl,
        scopes = scopes,
        showDialog = showDialog,
    )
}
