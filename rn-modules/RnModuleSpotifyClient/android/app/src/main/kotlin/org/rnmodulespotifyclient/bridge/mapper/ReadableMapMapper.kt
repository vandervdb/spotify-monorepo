package org.rnmodulespotifyclient.bridge.mapper

import com.facebook.react.bridge.ReadableMap
import org.vander.spotifyclient.bridge.AuthConfigK

fun ReadableMap.toAuthConfig(): AuthConfigK? {
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
            }
            list.toTypedArray()
        } else {
            emptyArray()
        }
    val showDialog = if (hasKey("showDialog")) getBoolean("showDialog") else true

    if (clientId == null || redirectUrl == null) return null

    return AuthConfigK(
        clientId = clientId,
        redirectUrl = redirectUrl,
        scopes = scopes,
        showDialog = showDialog,
    )
}
