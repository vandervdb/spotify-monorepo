import { Result } from '../types/Result';
import { SpotifyPlaybackStateDto } from 'core-dto';

export interface NowPlayingClient {
  fetchNowPlaying(): Promise<Result<SpotifyPlaybackStateDto>>;
}
