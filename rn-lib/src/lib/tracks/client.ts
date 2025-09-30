import { API_CONSTANTS } from '@react-native-spotify/core-constants';
import {
  AuthService,
  Result,
  TrackClient,
} from '@react-native-spotify/core-domain';
import { log } from '@react-native-spotify/core-logger';
import {
  CreateGetApiFn,
  CreatePutApiFn,
} from '@react-native-spotify/http-client';

export class DefaultTrackClient implements TrackClient {
  constructor(
    private readonly auth: AuthService,
    private readonly createGetApi: CreateGetApiFn,
    private readonly createPutApi: CreatePutApiFn,
  ) {}

  async fetchIsFavorite(id: string): Promise<Result<boolean>> {
    log.debug('fetchIsFavorite');
    const isFavorite = this.createGetApi<boolean>(
      API_CONSTANTS.API_BASE_V1,
      `${API_CONSTANTS.TRACKS_CONTAINS}?id=${id}`,
      undefined,
      this.auth,
    );
    return await isFavorite.get();
  }

  async putFavorite(id: string): Promise<Result<void>> {
    const success = this.createPutApi<void>(
      API_CONSTANTS.API_BASE_V1,
      `${API_CONSTANTS.TRACKS}?id=${id}`,
      undefined,
      this.auth,
    );
    return await success.put();
  }
}
