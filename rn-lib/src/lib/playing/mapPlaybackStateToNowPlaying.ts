import {
  SpotifyPlaybackStateDto,
  SpotifyRepeatState,
} from 'core-dto';
import type { NowPlaying, RepeatMode } from '@core/domain';

/**
 * Pick the "best" image (prefer >=300px width), fallback to the largest.
 */
function pickBestImage(
  images?:
    | { url: string; width?: number | null; height?: number | null }[]
    | null,
): string | null {
  if (!images || images.length === 0) return null;
  const sorted = [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  const target = sorted.find((img) => (img.width ?? 0) >= 300) ?? sorted[0];
  return target?.url ?? null;
}

function mapRepeat(repeat: SpotifyRepeatState): RepeatMode {
  switch (repeat) {
    case 'track':
      return 'one';
    case 'context':
      return 'all';
    default:
      return 'off';
  }
}

/**
 * Convert a full Spotify playback state into a small, UI-focused NowPlaying.
 * Returns undefined if no track item is present.
 */
export function mapPlaybackStateToNowPlaying(
  state: SpotifyPlaybackStateDto | null | undefined,
): NowPlaying | undefined {
  if (!state || !state.item) return undefined;

  const track = state.item;
  const album = track.album;
  const imageUrl = pickBestImage(album?.images ?? []);

  const artists = track.artists?.map((a) => a?.name).filter(Boolean) as
    | string[]
    | undefined;

  return {
    // identity
    trackId: track.id,
    uri: track.uri,

    // display
    title: track.name,
    artists,
    imageUrl,

    // timing
    durationMs: track.duration_ms ?? null,
    progressMs: state.progress_ms ?? 0,
    isPlaying: state.is_playing,

    // modes
    shuffle: state.shuffle_state,
    repeat: mapRepeat(state.repeat_state),

    // capabilities
    can: {
      pause: state.actions?.pausing ?? false,
      resume: state.actions?.resuming ?? false,
      seek: state.actions?.seeking ?? false,
      next: state.actions?.skipping_next ?? false,
      previous: state.actions?.skipping_prev ?? false,
    },

    // device
    deviceName: state.device?.name,
    deviceType: state.device?.type,
  };
}
