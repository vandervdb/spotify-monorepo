// @flow strict-local
import {TurboModule, TurboModuleRegistry} from 'react-native';

export type AuthConfig = {
    clientId: string;
    redirectUrl: string;
    scopes: string[] | undefined;
    showDialog: boolean;
};

export type ConnectionStatus = 'idle' | 'connecting' | 'authorizing' | 'ready' | 'paused' | 'failed';

export type SessionState = {
    Idle?: boolean;
    Authorizing?: boolean;
    ConnectingRemote?: boolean;
    Ready?: boolean;
    IsPaused?: boolean;
    Failed?: {
        exception?: string;
    };
};
export type SessionEvent = {
    schema: string;
    type: SessionState;
};
export type PlayerState = {
    isPlaying: boolean;
    positionMs: number;
    durationMs: number;
    trackUri?: string;
    coverId?: string;
    trackName?: string;
    artistName?: string;
    albumName?: string;
    isTrackSaved?: boolean;
};
export type QueueState = {
    items: Array<TrackItem>;
};

export type TrackItem = {
    trackName?: string;
    artistName?: string;
    trackId?: string;
};

export type Reason = 'TIMEOUT' | 'SESSION_FAILED' | 'TOKEN_MISSING' | 'UNEXPECTED';

export type Failed = {
    reason: Reason;
    cause: string;
};

export type AuthResult = {
    accessToken?: string;
    failed?: Failed;
};

export interface Spec extends TurboModule {
    // SESSION
    startUp(config: AuthConfig): Promise<void>;
    startUpWithModuleActivityResult(config: AuthConfig): Promise<void>;
    startUpWithModuleActivityResultAndGetToken(config: AuthConfig, timeoutMs?: number): Promise<AuthResult>;
    startUpWithHostActivityResult(config: AuthConfig): Promise<void>;
    startUpWithHostActivityResultAndGetToken(config: AuthConfig, timeoutMs?: number): Promise<AuthResult>;
    getSessionState(): Promise<SessionState>;
    awaitTokenOrNull(maxWaitMs?: number): Promise<string>;
    disconnect(): Promise<void>;

    // PLAYER
    playUri(uri: string): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    seekTo(ms: number): Promise<void>;
    getPlayerState(): Promise<PlayerState>;
    getQueueState(): Promise<QueueState>;

    addListener(eventName: string): void;
    removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeSpotifyClientModule');
