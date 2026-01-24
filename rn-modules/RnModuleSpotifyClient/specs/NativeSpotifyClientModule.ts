// @flow strict-local
import {TurboModule, TurboModuleRegistry} from 'react-native';

export type AuthConfig = {
    clientId: string,
    redirectUrl: string,
    scopes: string[] | undefined,
    showDialog: boolean,
};
export type SessionState = {
    Idle?: boolean,
    Authorizing?: boolean,
    ConnectingRemote?: boolean,
    Ready?: boolean,
    IsPaused?: boolean,
    Failed?: {
        exception?: string,
    },
};
export type SessionEvent = {
    schema: string,
    type: SessionState,
}
export type PlayerState = {
    isPlaying: boolean,
    positionMs: number,
    durationMs: number,
    trackUri?: string,
    coverId?: string,
    trackName?: string,
    artistName?: string,
    albumName?: string,
    isTrackSaved?: boolean,
}
export type ConnectionStatus = 'idle' | 'connecting' | 'authorizing' | 'ready' | 'paused' | 'failed';
export type QueueState = {
    items: Array<{
        trackName?: string,
        artistName?: string,
        trackUri?: string,
    }>
}


export interface Spec extends TurboModule {
    // PLAYER (sync session)
    startUp(config: AuthConfig): Promise<void>;
    startUpWithModuleActivityResult(config: AuthConfig): Promise<void>;
    startUpWithHostActivityResult(config: AuthConfig): Promise<void>;
    disconnect(): Promise<void>;
    playUri(uri: string): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    seekTo(ms: number): Promise<void>;

    // PLAYER
    getPlayerState(): Promise<PlayerState>;
    getQueueState(): Promise<QueueState>;

    // SESSION
    getSessionState(): Promise<SessionState>;

    addListener(eventName: string): void;
    removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeSpotifyClientModule');
