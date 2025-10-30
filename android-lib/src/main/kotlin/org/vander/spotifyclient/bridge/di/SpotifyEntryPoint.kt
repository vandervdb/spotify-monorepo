package org.vander.spotifyclient.bridge.di

import android.app.Application
import android.content.Context
import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.android.EntryPointAccessors
import dagger.hilt.components.SingletonComponent
import org.vander.spotifyclient.bridge.SpotifyBridge
import org.vander.spotifyclient.bridge.SpotifyBridgeApi
import org.vander.spotifyclient.domain.usecase.SpotifySessionManager
import org.vander.spotifyclient.domain.usecase.SpotifyUseCase

@EntryPoint
@InstallIn(SingletonComponent::class)
interface SpotifyEntryPoint {
    fun spotifySessionManager(): SpotifySessionManager
    fun spotifyUseCase(): SpotifyUseCase
}

fun obtainBridgeFromHilt(context: Context): SpotifyBridgeApi {
    val app = context.applicationContext as Application
    val entryPoint = EntryPointAccessors.fromApplication(app, SpotifyEntryPoint::class.java)
    return SpotifyBridge(
        sessionManager = entryPoint.spotifySessionManager(),
        useCase = entryPoint.spotifyUseCase(),
        appContext = context.applicationContext
    )
}
