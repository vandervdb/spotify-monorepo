package org.vander.spotifyclient.model.api

class SpotifyService {
//    fun authorize(scopes: List<String>): Result<AuthToken> {
// TODO plug SDK Spotify
//        return Result.success(AuthToken(accessToken = "dev-token", expiresAt = System.currentTimeMillis() + 3600_000))
//    }


    fun play(uri: String): Result<Unit> {
// TODO plug SDK Spotify
        return Result.success(Unit)
    }


    fun pause(): Result<Unit> {
// TODO plug SDK Spotify
        return Result.success(Unit)
    }


    fun nowPlaying(): Result<NowPlaying> {
// TODO plug SDK Spotify
        return Result.success(NowPlaying(title = "Dev Track", isPlaying = true))
    }
}
