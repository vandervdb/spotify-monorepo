package org.vander.spotifyclient.di

import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import org.vander.spotifyclient.data.remote.datasource.RemoteLibraryDataSource
import org.vander.spotifyclient.domain.datasource.IRemoteLibraryDataSource

@Module
@InstallIn(SingletonComponent::class)
abstract class SpotifyLibraryRemoteModule {
    @Binds
    abstract fun bindLibraryRemoteDataSource(
        impl: RemoteLibraryDataSource
    ): IRemoteLibraryDataSource
}