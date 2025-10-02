import { API_CONSTANTS } from '@core/constants';
import {
  AuthService,
  NowPlayingClient,
} from '@core/domain';
import { SpotifyPlaybackStateDto } from 'core-dto';
import { log } from '@core/logger';
import { CreateGetApiFn } from 'http-client';

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
