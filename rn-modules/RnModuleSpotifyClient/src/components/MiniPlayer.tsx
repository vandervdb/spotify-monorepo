import React, {useMemo} from 'react';
import {useSpotifyModule} from '../hooks';
import {log} from "@core/logger";
import MiniPlayerDisconnected from "./MiniPlayerDisconnected";
import MiniPlayerConnected from "./MiniPlayerConnected";
import {TrackItem} from "../../specs";
import {QueueTrack} from "../types";

const mapQueueToTracks = (queueItems: TrackItem[] | undefined): QueueTrack[] => {
    log.debug(`MiniPlayer: mapQueueToTracks -> ${JSON.stringify(queueItems)}`);
    if (queueItems === undefined) return [];
    return queueItems
        .filter(track => track.trackName && track.artistName && track.trackId)
        .map((track) => ({
            trackName: track.trackName ?? "",
            artistName: track.artistName ?? "",
            trackUri: track.trackId ??"",
        }));
};

const MiniPlayer = () => {

    const {player, session} = useSpotifyModule();
    const playerState = player?.playerState;
    const queueItems = player?.queueState?.items;
    const queueTracks = useMemo(
        () => mapQueueToTracks(queueItems),
        [queueItems]
    );


    if (!session?.isConnected || !player ) return <MiniPlayerDisconnected authenticate={session?.authenticateUser}/>;

    log.debug(`MiniPlayer: PLAYER STATE -> ${JSON.stringify(playerState)}`);
    log.debug(`MiniPlayer: QUEUE -> ${JSON.stringify(queueTracks)}`);
    log.debug(`MiniPlayer: CURRENTLY PLAYING -> ${JSON.stringify(playerState)}`);

    return <MiniPlayerConnected
        currentlyPlaying={playerState ?? undefined}
        queueTracks={queueTracks}
        setUri={player?.setUri}
        pause={player?.pause}
        resume={player?.resume}
    />

};

export default MiniPlayer;

