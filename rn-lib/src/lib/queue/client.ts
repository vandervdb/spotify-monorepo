import { CreateGetApiFn } from '@react-native-spotify/http-client';
import {
  AuthService,
  QueueClient,
  Result,
} from '@react-native-spotify/core-domain';
import { CurrentlyPlayingWithQueueDto } from '@react-native-spotify/core-dto';
import { API_CONSTANTS } from '@react-native-spotify/core-constants';

export class DefaultQueueClient implements QueueClient {
  constructor(
    private readonly auth: AuthService,
    private readonly createGetApi: CreateGetApiFn,
  ) {}

  async fetchCurrentQueue(): Promise<Result<CurrentlyPlayingWithQueueDto>> {
    const getCurrentUserQueue = this.createGetApi<CurrentlyPlayingWithQueueDto>(
      API_CONSTANTS.ME,
      API_CONSTANTS.QUEUE,
      undefined,
      this.auth,
    );
    return await getCurrentUserQueue.get();
  }
}
