package org.vander.spotifyclient.di

import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import org.vander.spotifyclient.data.appremote.SpotifyAppRemoteProvider
import org.vander.spotifyclient.domain.appremote.ISpotifyAppRemoteProvider
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RemoteModule {

    @Binds
    @Singleton
    abstract fun bindSpotifyRemoteClient(
        spotifyAppRemoteProvider: SpotifyAppRemoteProvider
    ): ISpotifyAppRemoteProvider

}