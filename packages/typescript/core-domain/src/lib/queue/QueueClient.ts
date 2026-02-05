import { CurrentlyPlayingWithQueueDto } from '@core/dto';

import { Result } from '../types/Result';

export interface QueueClient {
    fetchCurrentQueue(): Promise<Result<CurrentlyPlayingWithQueueDto>>;
}
