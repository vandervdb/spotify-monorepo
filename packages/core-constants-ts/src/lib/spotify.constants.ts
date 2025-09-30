const TOKEN_EXPIRATION_DURATION = 3600;
const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
const ACCOUNTS_API_BASE = 'https://accounts.spotify.com/api';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const API_BASE_V1 = 'https://api.spotify.com/v1';
const ENDPOINT_ME = `me`;
const ENDPOINT_QUEUE = 'queue';
const ENDPOINT_TOKEN = 'token';
const ENDPOINT_TRACKS = 'tracks';
const ENDPOINT_PLAYER = 'player';

export const API_CONSTANTS = {
  REQUEST_CODE: 22114458,
  REDIRECT_URI: 'org-vander-myspotifyapp://callback',

  // URLs
  TOKEN_EXPIRATION_DURATION,
  ACCOUNTS_API_BASE,
  AUTHORIZE_URL,
  TOKEN_ENDPOINT,
  API_BASE_V1,
  ME: ENDPOINT_ME,
  TOKEN: ENDPOINT_TOKEN,
  PLAYING_CURRENTLY: `${ENDPOINT_ME}/${ENDPOINT_PLAYER}/currently-playing`,
  QUEUE: ENDPOINT_QUEUE,
  TRACKS: `${ENDPOINT_ME}/${ENDPOINT_TRACKS}`,
  TRACKS_CONTAINS: `${ENDPOINT_ME}/${ENDPOINT_TRACKS}/contains`,

  // Scopes
  SCOPES: {
    USER_READ_PRIVATE: 'user-read-private',
    USER_READ_PLAYBACK_STATE: 'user-read-playback-state',
    USER_READ_CURRENTLY_PLAYING: 'user-read-currently-playing',
    USER_LIBRARY_MODIFY: 'user-library-modify',
  } as const,
} as const;

export type SpotifyScopeKey = keyof typeof API_CONSTANTS.SCOPES;
