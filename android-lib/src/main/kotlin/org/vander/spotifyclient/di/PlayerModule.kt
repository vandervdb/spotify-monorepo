package org.vander.spotifyclient.di

import dagger.Binds
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.components.ViewModelComponent
import dagger.hilt.android.scopes.ViewModelScoped
import org.vander.spotifyclient.data.appremote.SpotifyAppRemoteProvider
import org.vander.spotifyclient.data.player.SpotifyPlayerClient
import org.vander.spotifyclient.domain.player.ISpotifyPlayerClient

@Module
@InstallIn(ViewModelComponent::class)
abstract class PlayerModule {

    @Binds
    @ViewModelScoped
    abstract fun bindSpotifyPlayerClient(
        spotifyPlayerClient: SpotifyPlayerClient
    ): ISpotifyPlayerClient

    companion object {
        @Provides
        @ViewModelScoped
        fun provideSpotifyPlayerClient(
            appRemoteProvider: SpotifyAppRemoteProvider,
        ): SpotifyPlayerClient {
            return SpotifyPlayerClient(appRemoteProvider)
        }
    }
}