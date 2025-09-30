import { defaultSpotifyTrackDto, SpotifyTrackDto } from './SpotifyTrackDto';

export interface CurrentlyPlayingWithQueueDto {
  currently_playing?: SpotifyTrackDto | null;
  queue: (SpotifyTrackDto | null)[];
}

export const defaultCurrentlyPlayingWithQueueDto: CurrentlyPlayingWithQueueDto =
  {
    currently_playing: defaultSpotifyTrackDto,
    queue: [],
  };
