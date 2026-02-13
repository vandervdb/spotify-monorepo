import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, NativeEventEmitter} from 'react-native';
import {log} from '@core/logger';
import {createNativeModuleEmitter, mapSpotifyPlayerState, withCatch} from '../utils';
import SpotifyModuleSpec, {TrackItem} from '../../specs/NativeSpotifyClientModule';
import {PlayerState, QueueState} from '../../specs';
import {QueueTrack} from '../types';

export const useSpotifyPlayer = () => {
    const emitterRef = useRef<NativeEventEmitter | null>(null);
    emitterRef.current ??= createNativeModuleEmitter(SpotifyModuleSpec);

    const isFirstRender = useRef(true);

    const player = useMemo(
        () => ({
            playUri: SpotifyModuleSpec.playUri,
            pause: SpotifyModuleSpec.pause,
            resume: SpotifyModuleSpec.resume,
            seekTo: SpotifyModuleSpec.seekTo,
            getPlayerState: SpotifyModuleSpec.getPlayerState,

            addPlayerListener: (cb: (e: any) => void) => {
                const sub = emitterRef.current!.addListener('spotify/playerState', cb);
                return {
                    remove: () => {
                        sub.remove();
                    },
                };
            },
            addQueueListener: (cb: (e: any) => void) => {
                const sub = emitterRef.current!.addListener('spotify/uiQueue', cb);
                return {
                    remove: () => {
                        sub.remove();
                    },
                };
            },
        }),
        [],
    );

    const mapQueueToTracks = (queueItems: TrackItem[] | undefined): QueueTrack[] => {
        if (queueItems === undefined) return [];
        return queueItems
            .filter(track => track.trackName && track.artistName && track.trackId)
            .map((track, index) => ({
                id: index.toString(),
                trackName: track.trackName ?? '',
                artistName: track.artistName ?? '',
                trackUri: track.trackId ?? '',
            }));
    };

    const [uri, setUri] = useState<string>('spotify:track:11dFghVXANMlKmJXsNCbNl');
    const [playerState, setPlayerState] = useState<PlayerState | null>(null);
    const [queueState, setQueueState] = useState<QueueState | null>(null);
    const queueItems = queueState?.items;
    const queueTracks = useMemo(() => mapQueueToTracks(queueItems), [queueItems]);

    const {durationMs} = playerState ?? {durationMs: 0};
    const {positionMs} = playerState ?? {positionMs: 0};
    const {isPlaying} = playerState ?? {isPlaying: false};
    const {trackUri} = playerState ?? {trackUri: ''};
    const {coverId} = playerState ?? {coverId: ''};
    const {trackName} = playerState ?? {trackName: ''};
    const {artistName} = playerState ?? {artistName: ''};
    const {albumName} = playerState ?? {albumName: ''};
    const {isTrackSaved} = playerState ?? {isTrackSaved: false};

    const lastRawStateRef = useRef<string>('');
    const counter = useRef<number>(0);

    useEffect(() => {
        log.debug('useSpotifyPlayer: Initializing player listener');
        const sub = player.addPlayerListener((e: any) => {
            const rawString = JSON.stringify(e);
            if (rawString === lastRawStateRef.current) {
                return;
            }
            lastRawStateRef.current = rawString;
            counter.current += 1;

            log.debug('useSpotifyPlayer: Player state changed', rawString);
            setPlayerState(mapSpotifyPlayerState(counter.current, e));
        });

        return () => {
            log.debug('useSpotifyPlayer: Cleaning up player listener');
            sub.remove();
        };
    }, [player]);

    useEffect(() => {
        log.debug('useSpotifyPlayer: Initializing queue listener');
        const sub = player.addQueueListener((e: QueueState) => {
            log.debug('useSpotifyPlayer: Queue state changed', JSON.stringify(e));
            setQueueState(e);
        });

        return () => {
            log.debug('useSpotifyPlayer: Cleaning up queue listener');
            sub.remove();
        };
    }, [player]);

    const play = useCallback(() => {
        withCatch(async () => {
            await player.playUri(uri.trim());
        }).then(r => {
            if (r!) log.error(r);
        });
    }, [uri, player]);

    const pause = useCallback(() => withCatch(player.pause), [player]);
    const resume = useCallback(() => withCatch(player.resume), [player]);

    const seek = useCallback(
        (positionMs: number) => {
            if (Number.isNaN(positionMs)) {
                Alert.alert('Invalid position', 'Enter milliseconds as a number');
                return;
            }
            withCatch(async () => {
                await player.seekTo(positionMs);
            }).then(r => {
                if (r!) log.error(r);
            });
        },
        [player],
    );

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        play();
    }, [uri]);

    return useMemo(
        () => ({
            playerState,
            queueState,
            queueItems,
            queueTracks,
            uri,
            setUri,
            positionMs,
            durationMs,
            isPlaying,
            trackUri,
            coverId,
            trackName,
            artistName,
            albumName,
            isTrackSaved,
            play,
            pause,
            resume,
            seek,
        }),
        [
            playerState,
            queueState,
            queueItems,
            queueTracks,
            uri,
            positionMs,
            durationMs,
            isPlaying,
            trackUri,
            coverId,
            trackName,
            artistName,
            albumName,
            isTrackSaved,
            play,
            pause,
            resume,
            seek,
        ],
    );
};
