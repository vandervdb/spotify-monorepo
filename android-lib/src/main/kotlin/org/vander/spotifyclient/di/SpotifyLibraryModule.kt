package org.vander.spotifyclient.di

import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import org.vander.spotifyclient.data.repository.SpotifyLibraryRepositoryImpl
import org.vander.spotifyclient.domain.repository.SpotifyLibraryRepository

@Module
@InstallIn(SingletonComponent::class)
abstract class SpotifyLibraryModule {

    @Binds
    abstract fun bindLibraryRepository(
        impl: SpotifyLibraryRepositoryImpl
    ): SpotifyLibraryRepository
}