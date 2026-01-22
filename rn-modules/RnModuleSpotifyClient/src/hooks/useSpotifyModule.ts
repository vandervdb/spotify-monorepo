import { useSpotifySession } from "./useSpotifySession";
import { useSpotifyPlayer } from "./useSpotifyPlayer";
import { log } from '@core/logger';
import { useMemo } from "react";

export const useSpotifyModule = () => {
    const session = useSpotifySession();
    const player = useSpotifyPlayer();

    // On prépare un objet "player" propre qui ne sera exposé que si connecté
    const playerActions = useMemo(() => {
        if (!session.isConnected) return null;

        return {
            play: player.play,
            pause: player.pause,
            resume: player.resume,
            seek: player.seek,
            refreshState: player.refreshState,
            stateText: player.stateText,
            events: player.events,
            uri: player.uri,
            setUri: player.setUri,
            positionMs: player.positionMs,
            setPositionMs: player.setPositionMs,
        };
    }, [session.isConnected, player]);

    const authenticateUser = () => {
        if (!session.isConnected) {
            log.debug("Starting Spotify session");
            // session.startWithModuleActivityResult();
            session.startWithHostActivityResult();
        }
    };

    return {
        // État de la session
        isConnected: session.isConnected,
        authenticateUser,
        disconnect: session.disconnect,

        // Configuration (toujours nécessaire pour le login)
        authConfig: {
            clientId: session.clientId,
            setClientId: session.setClientId,
            redirectUrl: session.redirectUrl,
            setRedirectUrl: session.setRedirectUrl,
            scopes: session.scopes,
            setScopes: session.setScopes,
            showDialog: session.showDialog,
            setShowDialog: session.setShowDialog,
        },

        // Actions du player (null si non connecté)
        player: playerActions,

        // UI Helpers
        isDarkMode: player.isDarkMode,
        backgroundStyle: player.backgroundStyle,
    };
};
