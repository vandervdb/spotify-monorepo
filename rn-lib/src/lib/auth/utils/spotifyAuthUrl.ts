import { API_CONSTANTS } from '@core/constants';
import { getEnv } from '@core/config';
import { AuthConfiguration } from 'react-native-app-auth';
import valuesIn from 'lodash/valuesIn';

export function buildAuthConfig(): AuthConfiguration {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } = getEnv();
  return {
    clientId: SPOTIFY_CLIENT_ID,
    redirectUrl: SPOTIFY_REDIRECT_URI,
    scopes: valuesIn(API_CONSTANTS.SCOPES),
    serviceConfiguration: {
      authorizationEndpoint: API_CONSTANTS.AUTHORIZE_URL,
      tokenEndpoint: API_CONSTANTS.TOKEN_ENDPOINT,
    },
  };
}
