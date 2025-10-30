package org.vander.spotifyclient.di

import org.vander.core.domain.player.IPlayerStateRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton
import org.vander.spotifyclient.data.repository.DefaultPlayerStateRepository

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindPlayerStateRepository(
        impl: DefaultPlayerStateRepository
    ): IPlayerStateRepository

}
