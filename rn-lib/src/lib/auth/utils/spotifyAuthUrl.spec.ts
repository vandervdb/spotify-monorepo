jest.mock('@react-native-spotify/core-constants', () => ({
  API_CONSTANTS: {
    SCOPES: {
      PLAYLIST_READ: 'playlist-read',
      PLAYLIST_WRITE: 'playlist-write',
    },
    AUTHORIZE_URL: 'https://accounts.spotify.com/authorize',
    TOKEN_ENDPOINT: 'https://accounts.spotify.com/api/token',
  },
}));

describe('buildAuthConfig', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('should build the correct AuthConfiguration object', () => {
    jest.doMock('@react-native-spotify/core-config', () => ({
      getEnv: () => ({
        SPOTIFY_CLIENT_ID: 'test-client-id',
        SPOTIFY_REDIRECT_URI: 'test-redirect-uri',
      }),
    }));

    const { buildAuthConfig } = require('./spotifyAuthUrl');
    const config = buildAuthConfig();

    expect(config).toEqual({
      clientId: 'test-client-id',
      redirectUrl: 'test-redirect-uri',
      scopes: ['playlist-read', 'playlist-write'],
      serviceConfiguration: {
        authorizationEndpoint: 'https://accounts.spotify.com/authorize',
        tokenEndpoint: 'https://accounts.spotify.com/api/token',
      },
    });
  });

  it('throws when env vars are missing', () => {
    jest.doMock('@react-native-spotify/core-config', () => ({
      getEnv: () => {
        throw new Error('❌ Missing environment variables in .env file');
      },
    }));

    const { buildAuthConfig } = require('./spotifyAuthUrl');

    expect(() => buildAuthConfig()).toThrow('❌ Missing environment variables');
  });
});
