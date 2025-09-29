package org.vander.spotifyclient.di

import org.vander.core.domain.auth.ITokenProvider
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import org.vander.spotifyclient.data.local.DataStoreTokenProvider
import org.vander.spotifyclient.domain.auth.IDataStoreManager
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object TokenProviderModule {

    @Provides
    @Singleton
    fun provideDataStoreTokenProvider(
        dataStoreManager: IDataStoreManager
    ): ITokenProvider {
        return DataStoreTokenProvider(dataStoreManager)
    }
}
