import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {useSpotifyModule} from '../hooks';
import {log} from "@core/logger";
import {Track} from "../types";
import MiniPlayerDisconnected from "./MiniPlayerDisconnected";
import MiniPlayerConnected from "./MiniPlayerConnected";

const mapQueueToTracks = (queueItems: any[] = []): Track[] => {
    return queueItems
        .filter(track => track.trackName && track.artistName && track.trackId)
        .map(track => ({
            trackName: track.trackName,
            artistName: track.artistName,
            coverId: track.trackId,
        }));
};

const MiniPlayer = () => {
    const {player, session} = useSpotifyModule();

    const isPlaying = player?.playerState?.isPlaying ?? false;
    const progress = player?.playerState?.durationMs
        ? player.playerState.positionMs / player.playerState.durationMs
        : 0;

    const queueTracks = useMemo(
        () => mapQueueToTracks(player?.queueState?.items),
        [player?.queueState?.items]
    );

    if (!session?.isConnected) return <MiniPlayerDisconnected authenticate={session?.authenticateUser}/>;


    log.debug(`MiniPlayer: isPlaying=${isPlaying}, progress=${progress}, queueLength=${queueTracks.length}`);

    return <MiniPlayerConnected
        isPlaying={isPlaying}
        progress={progress}
        queueTracks={queueTracks}
        setUri={player?.setUri}
        pause={player?.pause}
        resume={player?.resume}
    />

};

export default MiniPlayer;

