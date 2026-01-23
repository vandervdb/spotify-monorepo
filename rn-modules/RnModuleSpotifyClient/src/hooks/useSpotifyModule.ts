import { useSpotifySession } from "./useSpotifySession";
import { useSpotifyPlayer } from "./useSpotifyPlayer";
import { log } from '@core/logger';
import { useMemo } from "react";

export const useSpotifyModule = () => {
    const session = useSpotifySession();
    const player = useSpotifyPlayer();

    const authenticateUser = () => {
        if (!session.isConnected) {
            log.debug("Starting Spotify session");
            session.startWithHostActivityResult();
        }
    };

    const playerActions = useMemo(() => {
        const canUsePlayer = session.connectionStatus === 'ready' || session.connectionStatus === 'paused';
        if (!canUsePlayer) return null;

        return {
            play: player.play,
            pause: player.pause,
            resume: player.resume,
            seek: player.seek,
            refreshState: player.refreshState,
            stateText: player.stateText,
            uri: player.uri,
            setUri: player.setUri,
            positionMs: player.positionMs,
            setPositionMs: player.setPositionMs,
        };
    }, [session.connectionStatus, player]);

    return {
        isConnected: session.isConnected,
        connectionStatus: session.connectionStatus,
        lastSessionError: session.lastSessionError,
        authenticateUser,
        disconnect: session.disconnect,
        player: playerActions,
    };
};
