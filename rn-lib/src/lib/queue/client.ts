import { CreateGetApiFn } from '@http/client';
import {
  AuthService,
  QueueClient,
  Result,
} from '@core/domain';
import { CurrentlyPlayingWithQueueDto } from '@core/dto';
import { API_CONSTANTS } from '@core/constants';

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
