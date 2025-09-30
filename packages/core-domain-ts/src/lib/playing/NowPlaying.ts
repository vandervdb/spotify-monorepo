export type RepeatMode = 'off' | 'one' | 'all';

export type NowPlayingCapabilities = Partial<{
  pause: boolean;
  resume: boolean;
  seek: boolean;
  next: boolean;
  previous: boolean;
}>;

export interface NowPlaying {
  // identity
  trackId?: string;
  uri?: string;

  // display
  title?: string;
  artists?: string[];
  imageUrl?: string | null;

  // timing
  durationMs?: number | null;
  progressMs?: number | null;
  isPlaying: boolean;

  // modes
  shuffle?: boolean;
  repeat?: RepeatMode;

  // capabilities for UI buttons
  can?: NowPlayingCapabilities;

  // optional device info for UX
  deviceName?: string;
  deviceType?: string;
}
