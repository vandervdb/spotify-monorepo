package com.vander.android.sample.di

import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import org.vander.spotifyclient.domain.usecase.SpotifySessionManager

@EntryPoint
@InstallIn(SingletonComponent::class)
fun interface SpotifySessionEntryPoint {
    fun spotifySessionManager(): SpotifySessionManager
}
