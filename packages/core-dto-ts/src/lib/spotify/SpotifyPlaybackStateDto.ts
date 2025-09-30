import type { SpotifyDeviceDto } from './SpotifyDeviceDto';
import type { SpotifyContextDto } from './SpotifyContextDto';
import type { SpotifyTrackDto } from './SpotifyTrackDto';
import type { SpotifyPlaybackActionsDto } from './SpotifyPlaybackActionsDto';

export type SpotifyRepeatState = 'off' | 'track' | 'context';

export type SpotifyCurrentlyPlayingType =
  | 'ad'
  | 'track'
  | 'episode'
  | 'unknown';

/**
 * Mirrors the response of GET https://api.spotify.com/v1/me/player
 */
export interface SpotifyPlaybackStateDto {
  device: SpotifyDeviceDto;
  repeat_state: SpotifyRepeatState;
  shuffle_state: boolean;
  context: SpotifyContextDto | null;
  timestamp: number;
  progress_ms: number | null;
  is_playing: boolean;
  item: SpotifyTrackDto | null;
  currently_playing_type: SpotifyCurrentlyPlayingType;
  actions: SpotifyPlaybackActionsDto;
}
