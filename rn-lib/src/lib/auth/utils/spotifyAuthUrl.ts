import { getEnv } from '@core/config';
import { API_CONSTANTS } from '@core/constants';
import valuesIn from 'lodash/valuesIn';
import { AuthConfig } from 'rn-module-spotify-client/specs/NativeSpotifyClientModule';

export function buildAuthConfig(showDialog: boolean = false): AuthConfig {
    const { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } = getEnv();
    return {
        clientId: SPOTIFY_CLIENT_ID,
        redirectUrl: SPOTIFY_REDIRECT_URI,
        scopes: valuesIn(API_CONSTANTS.SCOPES),
        showDialog: showDialog,
    };
}
