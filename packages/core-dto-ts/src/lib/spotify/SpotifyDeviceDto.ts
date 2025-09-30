// DTO for the Web API "device" object used in playback endpoints
export type SpotifyDeviceType =
  | 'computer'
  | 'tablet'
  | 'smartphone'
  | 'speaker'
  | 'tv'
  | 'avr'
  | 'stb'
  | 'audiodongle'
  | 'gameconsole'
  | 'castvideo'
  | 'castaudio'
  | 'automobile'
  | 'unknown';

export interface SpotifyDeviceDto {
  id: string | null;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: SpotifyDeviceType;
  volume_percent: number | null;
  /** @deprecated Per Spotify docs. Prefer `volume_percent`. */
  supports_volume?: boolean;
}
