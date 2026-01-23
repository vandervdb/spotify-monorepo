import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, NativeEventEmitter} from 'react-native';
import {log} from '@core/logger';
import {withCatch} from "../utils";
import SpotifyModuleSpec, {PlayerState, QueueState} from '../../specs/NativeSpotifyClientModule';

export const useSpotifyPlayer = () => {
    const emitterRef = useRef<NativeEventEmitter | null>(null);
    if (emitterRef.current == null) {
        emitterRef.current = new NativeEventEmitter(SpotifyModuleSpec as any);
    }

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

    const [stateText, setStateText] = useState<string>('—');

    useEffect(() => {
        log.debug('useSpotifyPlayer: Initializing player listener');
        const sub = player.addPlayerListener((e: PlayerState) => {
            log.debug('useSpotifyPlayer: Player state changed', JSON.stringify(e));
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

    const refreshState = useCallback(() => {
        withCatch(async () => {
            const st = await player.getPlayerState();
            setStateText(
                `Playing: ${st.isPlaying} | pos=${st.positionMs}/${st.durationMs} | ` +
                `${st.trackName ?? '—'} — ${st.artistName ?? '—'}`,
            );
        }).then(r => {
            if (r!) log.error(r);
        });
    }, [withCatch, player]);

    return useMemo(() => ({
        uri,
        setUri,
        positionMs,
        setPositionMs,
        stateText,
        play,
        pause,
        resume,
        seek,
        refreshState,
    }), [uri, positionMs, stateText, play, pause, resume, seek, refreshState]);
}
