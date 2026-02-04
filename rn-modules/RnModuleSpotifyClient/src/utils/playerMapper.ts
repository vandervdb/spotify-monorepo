import {PlayerState} from '../../specs';
import {log} from '@core/logger';

export const mapSpotifyPlayerState = (count: number, data: any): PlayerState => {
    log.debug(`[mapSpotifyPlayerState] input data ${count}:`);
    const base = data?.base || {};
    return {
        isPlaying: base.playing ?? false,
        positionMs: base.positionMs ?? 0,
        durationMs: base.durationMs ?? 0,
        trackUri: base.trackId ? base.trackId : undefined,
        coverId: base.coverId,
        trackName: base.trackName,
        artistName: base.artistName,
        albumName: base.albumName,
        isTrackSaved: data.isTrackSaved ?? false,
    };
};
