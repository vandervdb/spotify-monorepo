import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, NativeEventEmitter} from 'react-native';
import {log} from '@core/logger';
import {createNativeModuleEmitter, mapSpotifyPlayerState, withCatch} from "../utils";
import SpotifyModuleSpec from '../../specs/NativeSpotifyClientModule';
import {PlayerState, QueueState} from "../../specs";

export const useSpotifyPlayer = () => {

    const emitterRef = useRef<NativeEventEmitter | null>(null);
    emitterRef.current ??= createNativeModuleEmitter(SpotifyModuleSpec);

    const player = useMemo(() => ({
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
                }
            };
        },
        addQueueListener: (cb: (e: any) => void) => {
            const sub = emitterRef.current!.addListener('spotify/uiQueue', cb);
            return {
                remove: () => {
                    sub.remove();
                }
            };
        },
    }), []);

    const [uri, setUri] = useState<string>('spotify:track:11dFghVXANMlKmJXsNCbNl');
    const [positionMs, setPositionMs] = useState<string>('0');
    const [stateText] = useState<string>('—');
    const [playerState, setPlayerState] = useState<PlayerState | null>(null);
    const [queueState, setQueueState] = useState<QueueState | null>(null);
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
    }, [uri, withCatch, player]);

    const pause = useCallback(() => withCatch(player.pause), [withCatch, player]);
    const resume = useCallback(() => withCatch(player.resume), [withCatch, player]);

    const seek = useCallback(() => {
        const ms = Number(positionMs);
        if (Number.isNaN(ms)) {
            Alert.alert('Invalid position', 'Enter milliseconds as a number');
            return;
        }
        withCatch(async () => {
            await player.seekTo(ms);
        }).then(r => {
            if (r!) log.error(r);
        });
    }, [positionMs, withCatch, player]);


    return useMemo(() => ({
        playerState,
        queueState,
        uri,
        setUri,
        positionMs,
        setPositionMs,
        stateText,
        play,
        pause,
        resume,
        seek,
    }), [uri, positionMs, stateText, playerState, play, pause, resume, seek]);
}
