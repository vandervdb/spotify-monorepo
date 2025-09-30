import { Result } from '../types/Result';

export interface TrackClient {
  fetchIsFavorite(id: string): Promise<Result<boolean>>;

  putFavorite(id: string): Promise<Result<void>>;
}
