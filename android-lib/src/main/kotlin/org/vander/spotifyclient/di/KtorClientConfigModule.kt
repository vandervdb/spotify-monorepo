package org.vander.spotifyclient.di

import org.vander.core.domain.auth.ITokenProvider
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import io.ktor.client.HttpClient
import io.ktor.client.plugins.logging.LogLevel
import org.vander.spotifyclient.network.KtorClientConfig
import org.vander.spotifyclient.utils.HTTPS_API_SPOTIFY_COM_V_1_ME
import javax.inject.Named
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object KtorClientConfigModule {

    @Provides
    @Singleton
    @Named("SpotifyRemoteHttpClientConfig")
    fun provideSpotifyRemoteHttpClientConfig(): KtorClientConfig {
        return KtorClientConfig(
            baseUrl = HTTPS_API_SPOTIFY_COM_V_1_ME,
            enableAuthPlugin = true,
            logLevel = LogLevel.HEADERS
        )
    }

    @Provides
    @Singleton
    @Named("SpotifyRemotePlaylistHttpClientConfig")
    fun provideSpotifyRemotePlaylistHttpClientConfig(): KtorClientConfig {
        return KtorClientConfig(
            baseUrl = HTTPS_API_SPOTIFY_COM_V_1_ME,
            enableAuthPlugin = true,
            logLevel = LogLevel.HEADERS
        )
    }


    @Provides
    @Singleton
    @Named("SpotifyRemoteQueueHttpClientConfig")
    fun provideSpotifyRemoteQueueHttpClientConfig(): KtorClientConfig {
        return KtorClientConfig(
            baseUrl = HTTPS_API_SPOTIFY_COM_V_1_ME,
            enableAuthPlugin = true,
            logLevel = LogLevel.HEADERS
        )
    }

    @Provides
    @Singleton
    @Named("SpotifyRemoteLibraryHttpClientConfig")
    fun provideSpotifyRemoteLibraryHttpClientConfig(): KtorClientConfig {
        return KtorClientConfig(
            baseUrl = HTTPS_API_SPOTIFY_COM_V_1_ME,
            enableAuthPlugin = true,
            logLevel = LogLevel.HEADERS
        )
    }

    @Provides
    @Singleton
    @Named("SpotifyRemoteHttpClient")
    fun provideSpotifyRemoteHttpClient(
        tokenProvider: ITokenProvider,
        @Named("SpotifyRemoteHttpClientConfig") config: KtorClientConfig
    ): HttpClient {
        return NetworkModule.provideKtorClient(tokenProvider, config)
    }

    @Provides
    @Singleton
    @Named("SpotifyRemotePlaylistHttpClient")
    fun provideSpotifyRemotePlaylistHttpClient(
        tokenProvider: ITokenProvider,
        @Named("SpotifyRemotePlaylistHttpClientConfig") config: KtorClientConfig
    ): HttpClient {
        return NetworkModule.provideKtorClient(tokenProvider, config)
    }

    @Provides
    @Singleton
    @Named("SpotifyRemoteQueueHttpClient")
    fun provideSpotifyRemoteQueueHttpClient(
        tokenProvider: ITokenProvider,
        @Named("SpotifyRemoteQueueHttpClientConfig") config: KtorClientConfig
    ): HttpClient {
        return NetworkModule.provideKtorClient(tokenProvider, config)
    }

    @Provides
    @Singleton
    @Named("SpotifyRemoteLibraryHttpClient")
    fun provideSpotifyRemoteLibraryHttpClient(
        tokenProvider: ITokenProvider,
        @Named("SpotifyRemoteLibraryHttpClientConfig") config: KtorClientConfig
    ): HttpClient {
        return NetworkModule.provideKtorClient(tokenProvider, config)
    }


}
