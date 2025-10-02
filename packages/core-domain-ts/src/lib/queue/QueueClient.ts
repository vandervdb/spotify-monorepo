import { Result } from '../types/Result';
import { CurrentlyPlayingWithQueueDto } from 'core-dto';

export interface QueueClient {
  fetchCurrentQueue(): Promise<Result<CurrentlyPlayingWithQueueDto>>;
}
