import { Result } from '../types/Result';
import { SpotifyPlaybackStateDto } from '@react-native-spotify/core-dto';

export interface NowPlayingClient {
  fetchNowPlaying(): Promise<Result<SpotifyPlaybackStateDto>>;
}
