import { AuthClient, Result } from 'packages/core-domain-ts';
import { buildAuthConfig } from './utils/spotifyAuthUrl';
import { log } from '@core/logger';
import { authorize, AuthorizeResult } from 'react-native-app-auth';
import { SpotifyTokenResponseDto } from '@core/dto';
import { API_CONSTANTS } from '@core/constants';
import { CreatePostApiFn } from '@http/client';

export class DefaultAuthClient implements AuthClient {
  constructor(private readonly createApi: CreatePostApiFn) {}

  async getAuthorization(): Promise<AuthorizeResult | undefined> {
    log.debug('startAuthorization');
    const config = buildAuthConfig();
    try {
      log.debug('startAuthorization::config:', JSON.stringify(config));
      return await authorize(config);
    } catch (e) {
      log.error(
        'startAuthorization::Une erreur est survenue en chargeant le token Spotify',
        e,
      );
      return undefined;
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
