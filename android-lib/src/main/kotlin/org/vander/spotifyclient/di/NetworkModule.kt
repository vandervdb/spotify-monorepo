package org.vander.spotifyclient.di

import android.util.Log
import org.vander.core.domain.auth.ITokenProvider
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import io.ktor.client.HttpClient
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.defaultRequest
import io.ktor.client.plugins.logging.Logger
import io.ktor.client.plugins.logging.Logging
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json
import org.vander.spotifyclient.network.AuthHeaderPlugin
import org.vander.spotifyclient.network.KtorClientConfig
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideKtorClient(
        tokenProvider: ITokenProvider,
        config: KtorClientConfig
    ): HttpClient {
        return HttpClient(OkHttp) {
            install(ContentNegotiation) {
                json(Json {
                    ignoreUnknownKeys = true
                    prettyPrint = true
                    isLenient = true
                })
            }

            if (config.enableAuthPlugin) {
                install(AuthHeaderPlugin) {
                    this.tokenProvider = tokenProvider
                }
            }

            install(Logging) {
                logger = object : Logger {
                    override fun log(message: String) {
                        Log.d("KtorLogger", message)
                    }
                }
                Log.d("KtorLogger", "Ktor logger installed")
                level = config.logLevel
            }

            defaultRequest {
                url(config.baseUrl)
            }
        }
    }
}
