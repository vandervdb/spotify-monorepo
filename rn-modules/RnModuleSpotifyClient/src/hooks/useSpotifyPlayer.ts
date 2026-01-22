import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {player} from './index';
import {log} from '@core/logger';
import {withCatch} from "../utils";

 export const useSpotifyPlayer = () => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = useMemo(
        () => ({backgroundColor: isDarkMode ? Colors.darker : Colors.lighter}),
        [isDarkMode],
    );

    const [uri, setUri] = useState<string>('spotify:track:11dFghVXANMlKmJXsNCbNl');
    const [positionMs, setPositionMs] = useState<string>('0');

    const [stateText, setStateText] = useState<string>('—');
    const eventsRef = useRef<Array<string>>([]);
    const [, setForceRerender] = useState(0);

    const play = useCallback(() => {
        withCatch(async () => {
            await player.playUri(uri.trim());
        }).then(r => {
            if (r!) log.error(r);
        });
    }, [uri, withCatch]);

    const pause = useCallback(() => withCatch(player.pause), [withCatch]);
    const resume = useCallback(() => withCatch(player.resume), [withCatch]);

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
    }, [positionMs, withCatch]);

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
    }, [withCatch]);

    // Player events
    useEffect(() => {
        const sub = player.addListener(e => {
            // Keep a short log of last 10 events
            eventsRef.current = [JSON.stringify(e)].concat(eventsRef.current).slice(0, 10);
            setForceRerender((x: number) => x + 1);
        });
        return () => sub.remove();
    }, []);

    return {
        isDarkMode,
        backgroundStyle,
        uri,
        setUri,
        positionMs,
        setPositionMs,
        stateText,
        events: eventsRef.current,
        play,
        pause,
        resume,
        seek,
        refreshState,
    }
}
