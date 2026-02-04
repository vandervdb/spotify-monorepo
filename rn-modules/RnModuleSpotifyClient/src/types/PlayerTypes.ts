export interface QueueTrack {
    trackName: string;
    artistName: string;
    trackUri: string;
}

export type CurrentTrack = QueueTrack & { coverUri: string };

