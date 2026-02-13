import {useSpotifySession} from './useSpotifySession';
import {useSpotifyPlayer} from './useSpotifyPlayer';
import {log} from '@core/logger';
import {useMemo} from 'react';

export const useSpotifyModule = () => {
    const session = useSpotifySession();
    const player = useSpotifyPlayer();

    const authenticateUser = () => {
        if (!session.isConnected) {
            log.debug('Starting Spotify session');
            session.startWithHostActivityResult();
        }
    };

    const SessionState = useMemo(() => {
        return {
            isConnected: session.isConnected,
            connectionStatus: session.connectionStatus,
            lastSessionError: session.lastSessionError,
            authenticateUser,
            getAuthToken: session.getAuthToken,
            disconnect: session.disconnect,
        };
    }, [session.isConnected, session.connectionStatus, session.lastSessionError]);

    const playerUiState = useMemo(() => {
        const canUsePlayer = session.connectionStatus === 'ready' || session.connectionStatus === 'paused';
        if (!canUsePlayer) return null;

        return {
            playerState: player.playerState,
            queueState: player.queueState,
            play: player.play,
            pause: player.pause,
            resume: player.resume,
            seek: player.seek,
            uri: player.uri,
            setUri: player.setUri,
            positionMs: player.positionMs,
        };
    }, [session.connectionStatus, player]);

    return {
        session: SessionState,
        player: playerUiState,
    };
};
