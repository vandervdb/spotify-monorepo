import { API_CONSTANTS } from '@react-native-spotify/core-constants';
import {
  AuthService,
  NowPlayingClient,
} from '@react-native-spotify/core-domain';
import { SpotifyPlaybackStateDto } from '@react-native-spotify/core-dto';
import { log } from '@react-native-spotify/core-logger';
import { CreateGetApiFn } from '@react-native-spotify/http-client';

export class DefaultNowPlayingClient implements NowPlayingClient {
  constructor(
    private readonly auth: AuthService,
    private readonly createApi: CreateGetApiFn,
  ) {}

  async fetchNowPlaying() {
    log.debug('fetchNowPlaying');
    const getNowPlaying = this.createApi<SpotifyPlaybackStateDto>(
      API_CONSTANTS.API_BASE_V1,
      API_CONSTANTS.PLAYING_CURRENTLY,
      undefined,
      this.auth,
    );
    return await getNowPlaying.get();
  }
}
