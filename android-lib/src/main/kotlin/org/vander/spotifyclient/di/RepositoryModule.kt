package org.vander.spotifyclient.di

import org.vander.core.domain.player.IPlayerStateRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.android.components.ViewModelComponent
import dagger.hilt.android.scopes.ViewModelScoped
import org.vander.spotifyclient.data.repository.DefaultPlayerStateRepository

@Module
@InstallIn(ViewModelComponent::class)
abstract class RepositoryModule {

    @Binds
    @ViewModelScoped
    abstract fun bindPlayerStateRepository(
        impl: DefaultPlayerStateRepository
    ): IPlayerStateRepository

}
