package org.vander.spotifyclient.bridge.di

import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import org.vander.spotifyclient.bridge.SpotifyBridgeApi

@EntryPoint
@InstallIn(SingletonComponent::class)
interface SpotifyEntryPoint {
    fun spotifyBridge(): SpotifyBridgeApi
}
