import { API_CONSTANTS } from '@core/constants';
import { AuthClient, AuthResult, Result } from '@core/domain';
import { SpotifyTokenResponseDto } from '@core/dto';
import { log } from '@core/logger';
import { CreatePostApiFn } from '@http/client';
import SpotifyModuleSpec from 'rn-module-spotify-client/specs/NativeSpotifyClientModule';

import { buildAuthConfig } from './utils/spotifyAuthUrl';

export class DefaultAuthClient implements AuthClient {
    constructor(private readonly createApi: CreatePostApiFn) {}

    async getAuthorization(): Promise<Result<AuthResult>> {
        log.debug('startAuthorization');
        const config = buildAuthConfig();
        try {
            log.debug('startAuthorization::config:', JSON.stringify(config));
            const tokenResponse =
                await SpotifyModuleSpec.startUpWithModuleActivityResultAndGetToken(
                    config,
                );
            return { ok: true, value: tokenResponse };
        } catch (e) {
            log.error(
                'startAuthorization::Une erreur est survenue en chargeant le token Spotify',
                e,
            );
            return { ok: false, error: e as Error };
        }
    }

    async fetchRefreshToken(): Promise<Result<SpotifyTokenResponseDto>> {
        log.debug('getRefreshToken');
        const getRefreshToken = this.createApi<SpotifyTokenResponseDto>(
            API_CONSTANTS.API_BASE_V1,
            API_CONSTANTS.TOKEN,
            {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        );
        return await getRefreshToken.post();
    }
}
