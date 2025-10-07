import { AuthorizeResult } from 'react-native-app-auth';
import { SpotifyTokenResponseDto } from '@core/dto';
import { TokenData } from '@core/domain';
import { API_CONSTANTS } from '@core/constants';

export function mapAuthorizeResultToTokenData(
  auth: AuthorizeResult,
): TokenData {
  return {
    token: auth.accessToken,
    refreshToken: auth.refreshToken,
    expiresAt: Date.now() + API_CONSTANTS.TOKEN_EXPIRATION_DURATION * 1000,
  };
}

export function mapSpotifyTokenResponseToTokenData(
  dto: SpotifyTokenResponseDto,
): TokenData {
  return {
    token: dto.access_token,
    refreshToken: dto.refresh_token ?? '',
    expiresAt: Date.now() + dto.expires_in * 1000,
  };
}
