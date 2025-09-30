import { NowPlaying } from './NowPlaying';

export interface NowPlayingService {
  getNowPlaying(): Promise<NowPlaying | undefined>;
}
