import { Result } from '../types/Result';
import { CurrentlyPlayingWithQueueDto } from '@react-native-spotify/core-dto';

export interface QueueClient {
  fetchCurrentQueue(): Promise<Result<CurrentlyPlayingWithQueueDto>>;
}
