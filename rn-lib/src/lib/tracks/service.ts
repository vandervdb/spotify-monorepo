import TrackService from '@react-native-spotify/core-domain/src/lib/track/TrackService';
import { isOk, TrackClient, unwrap } from '@react-native-spotify/core-domain';

export class DefaultTrackService implements TrackService {
  constructor(private readonly client: TrackClient) {}

  async isFavorite(id: string): Promise<boolean> {
    const result = await this.client.fetchIsFavorite(id);
    if (isOk(result)) {
      return unwrap(result);
    }
    return false;
  }

  async toggleFavorite(id: string): Promise<void> {
    return Promise.resolve(undefined);
  }
}
