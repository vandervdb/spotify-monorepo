import React, {useMemo} from 'react';
import {useSpotifyPlayer, useSpotifySession} from '../hooks';
import {log} from '@core/logger';
import MiniPlayerDisconnected from './MiniPlayerDisconnected';
import MiniPlayerConnected from './MiniPlayerConnected';
import {TrackItem} from '../../specs';
import {QueueTrack} from '../types';

const mapQueueToTracks = (queueItems: TrackItem[] | undefined): QueueTrack[] => {
    log.debug(`MiniPlayer: mapQueueToTracks -> ${JSON.stringify(queueItems)}`);
    if (queueItems === undefined) return [];
    return queueItems
        .filter(track => track.trackName && track.artistName && track.trackId)
        .map(track => ({
            trackName: track.trackName ?? '',
            artistName: track.artistName ?? '',
            trackUri: track.trackId ?? '',
        }));
};

const MiniPlayer = () => {
    const {isConnected, authenticateUser} = useSpotifySession();
    const {setUri, pause, resume, playerState, queueState} = useSpotifyPlayer();
    const queueItems = queueState?.items;
    const queueTracks = useMemo(() => mapQueueToTracks(queueItems), [queueItems]);

    if (!isConnected) return <MiniPlayerDisconnected authenticate={authenticateUser} />;

    log.debug(`MiniPlayer: PLAYER STATE -> ${JSON.stringify(playerState)}`);
    log.debug(`MiniPlayer: QUEUE -> ${JSON.stringify(queueTracks)}`);
    log.debug(`MiniPlayer: CURRENTLY PLAYING -> ${JSON.stringify(playerState)}`);

    return (
        <MiniPlayerConnected
            currentlyPlaying={playerState ?? undefined}
            queueTracks={queueTracks}
            setUri={setUri}
            pause={pause}
            resume={resume}
        />
    );
};

export default MiniPlayer;
