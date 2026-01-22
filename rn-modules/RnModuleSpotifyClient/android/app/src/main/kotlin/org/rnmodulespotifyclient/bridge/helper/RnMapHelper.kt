package org.rnmodulespotifyclient.bridge.helper

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap

fun WritableMap.putNullableString(
    key: String,
    value: String?,
) {
    if (value == null) putNull(key) else putString(key, value)
}

fun WritableMap.putNullableBoolean(
    key: String,
    value: Boolean?,
) {
    if (value == null) putNull(key) else putBoolean(key, value)
}

fun WritableMap.putNullableDouble(
    key: String,
    value: Double?,
) {
    if (value == null) putNull(key) else putDouble(key, value)
}

fun <T> Iterable<T>.toWritableArray(mapper: (T) -> WritableMap): WritableArray =
    Arguments.createArray().also { arr -> for (e in this) arr.pushMap(mapper(e)) }
