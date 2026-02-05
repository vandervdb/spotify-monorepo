import { SpotifyPlaybackStateDto } from '@core/dto';

import { Result } from '../types/Result';

export interface NowPlayingClient {
    fetchNowPlaying(): Promise<Result<SpotifyPlaybackStateDto>>;
}
