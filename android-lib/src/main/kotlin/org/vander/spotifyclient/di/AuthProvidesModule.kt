package org.vander.spotifyclient.di

import org.vander.core.domain.auth.IAuthRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import org.vander.spotifyclient.data.remote.datasource.AuthRemoteDataSource
import org.vander.spotifyclient.data.repository.AutRepository
import org.vander.spotifyclient.domain.auth.IDataStoreManager
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AuthProvidesModule {

    @Provides
    @Singleton
    fun provideAuthRepository(
        authRemoteDataSource: AuthRemoteDataSource,
        dataStoreManager: IDataStoreManager
    ): IAuthRepository {
        return AutRepository(authRemoteDataSource, dataStoreManager)
    }
}
