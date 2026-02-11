export interface QueueTrack {
    id: string;
    trackName: string;
    artistName: string;
    trackUri: string;
}

export type CurrentTrack = QueueTrack & {coverUri: string};
