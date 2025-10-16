package org.vander.spotifyclient.di

import dagger.Binds
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.scopes.ViewModelScoped
import dagger.hilt.components.SingletonComponent
import org.vander.spotifyclient.data.appremote.SpotifyAppRemoteProvider
import org.vander.spotifyclient.data.player.SpotifyPlayerClient
import org.vander.spotifyclient.domain.player.ISpotifyPlayerClient
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class PlayerModule {

    @Binds
    @Singleton
    abstract fun bindSpotifyPlayerClient(
        spotifyPlayerClient: SpotifyPlayerClient
    ): ISpotifyPlayerClient

    companion object {
        @Provides
        @Singleton
        fun provideSpotifyPlayerClient(
            appRemoteProvider: SpotifyAppRemoteProvider,
        ): SpotifyPlayerClient {
            return SpotifyPlayerClient(appRemoteProvider)
        }
    }
}
