import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import SpotifyModuleSpec, {SessionEvent, SessionState} from '../../specs/NativeSpotifyClientModule';
import {NativeEventEmitter} from 'react-native';
import {log} from '@core/logger';
import {withCatch} from '../utils';

type ConnectionStatus = 'idle' | 'connecting' | 'authorizing' | 'ready' | 'paused' | 'failed';

export const useSpotifySession = () => {

    const emitterRef = useRef<NativeEventEmitter | null>(null);
    if (emitterRef.current == null) {
        emitterRef.current = new NativeEventEmitter(SpotifyModuleSpec as any);
    }

    const session = useMemo(() => ({
        startUpWithHostActivityResult: SpotifyModuleSpec.startUpWithHostActivityResult,
        startUpWithModuleActivityResult: SpotifyModuleSpec.startUpWithModuleActivityResult,
        disconnect: SpotifyModuleSpec.disconnect,
        getSessionState: SpotifyModuleSpec.getSessionState,

        addListener: (cb: (e: any) => void) => {
            const sub1 = emitterRef.current!.addListener('spotify/sessionState', cb);
            return {
                remove: () => {
                    sub1.remove();
                }
            };
        }
    }), []);

    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [lastSessionError, setLastSessionError] = useState<string | null>(null);

    const applySessionState = useCallback((state: SessionState | null | undefined, origin: string) => {
        if (!state || Object.keys(state).length === 0) {
            log.warn(`useSpotifySession: Empty session state (${origin})`);
            setLastSessionError(null);
            setConnectionStatus('idle');
            setIsConnected(false);
            return;
        }

        if (state.Failed) {
            const exceptionMessage = state.Failed.exception ?? 'Unknown error';
            log.warn(`useSpotifySession: Session Failed (${origin}): ${exceptionMessage}`);
            setLastSessionError(exceptionMessage);
            setConnectionStatus('failed');
            setIsConnected(false);
            return;
        }

        if (state.Ready) {
            log.debug(`useSpotifySession: Session Ready (${origin})`);
            setLastSessionError(null);
            setConnectionStatus('ready');
            setIsConnected(true);
            return;
        }

        if (state.IsPaused) {
            log.debug(`useSpotifySession: Session Paused (${origin})`);
            setLastSessionError(null);
            setConnectionStatus('paused');
            setIsConnected(true);
            return;
        }

        if (state.ConnectingRemote) {
            log.info(`useSpotifySession: Session ConnectingRemote (${origin})`);
            setLastSessionError(null);
            setConnectionStatus('connecting');
            setIsConnected(false);
            return;
        }

        if (state.Authorizing) {
            log.info(`useSpotifySession: Session Authorizing (${origin})`);
            setLastSessionError(null);
            setConnectionStatus('authorizing');
            setIsConnected(false);
            return;
        }

        if (state.Idle) {
            log.debug(`useSpotifySession: Session Idle (${origin})`);
            setLastSessionError(null);
            setConnectionStatus('idle');
            setIsConnected(false);
            return;
        }

        log.warn(`useSpotifySession: Unrecognized session state (${origin}): ${JSON.stringify(state)}`);
        setLastSessionError(null);
        setConnectionStatus('idle');
        setIsConnected(false);
    }, []);

    useEffect(() => {
        log.debug('useSpotifySession: Initializing session listener');
        const sub = session.addListener((e: SessionEvent) => {
            log.debug('useSpotifySession: Session state changed:', JSON.stringify(e));
            applySessionState(e?.type, 'event');
        });

        log.debug('useSpotifySession: Checking initial session state');
        session.getSessionState()
            .then(state => {
                log.debug('useSpotifySession: Initial session state:', JSON.stringify(state));
                applySessionState(state, 'initial');
            })
            .catch(err => {
                log.error('useSpotifySession: Failed to get initial session state', err);
            });

        return () => {
            log.debug('useSpotifySession: Cleaning up session listener');
            sub.remove();
        };
    }, [applySessionState, session]);


    const startWithModuleActivityResult = useCallback(() => {
        log.debug('useSpotifySession: Starting with ModuleActivityResult');
        withCatch(async () => {
            log.debug('useSpotifySession: Calling session.startUpWithModuleActivityResult');
            await session.startUpWithModuleActivityResult({
                clientId: '405a313dfc804286bf3cb0d61b9ec2d3',
                redirectUrl: 'org-vander-androidapp://callback',
                scopes: [
                    'streaming',
                    'user-read-private',
                    'user-read-email',
                    'user-read-currently-playing',
                    'user-read-playback-state',
                    'user-library-modify',
                    'user-library-read'
                ],
                showDialog: showDialog,
            });
            log.debug('useSpotifySession: startUpWithModuleActivityResult completed');
        }).then(r => {
            if (r!) {
                log.error('useSpotifySession: Error in startUpWithModuleActivityResult', r);
            } else {
                log.debug('useSpotifySession: startUpWithModuleActivityResult succeeded');
            }
        });
    }, [withCatch, showDialog, session]);

    const startWithHostActivityResult = useCallback(() => {
        log.debug('useSpotifySession: Starting with HostActivityResult');
        withCatch(async () => {
            log.debug('useSpotifySession: Calling session.startUpWithHostActivityResult');
            await session.startUpWithHostActivityResult({
                clientId: '405a313dfc804286bf3cb0d61b9ec2d3',
                redirectUrl: 'org-vander-androidapp://callback',
                scopes: [
                    'streaming',
                    'user-read-private',
                    'user-read-email',
                    'user-read-currently-playing',
                    'user-read-playback-state',
                    'user-library-modify',
                    'user-library-read'
                ],
                showDialog: showDialog,
            });
            log.debug('useSpotifySession: startUpWithHostActivityResult completed');
        }).then(r => {
            if (r!) {
                log.error('useSpotifySession: Error in startUpWithHostActivityResult', r);
            } else {
                log.debug('useSpotifySession: startUpWithHostActivityResult succeeded');
            }
        });
    }, [withCatch, showDialog, session]);

    const disconnect = useCallback(() => {
        log.debug('useSpotifySession: Disconnecting');
        withCatch(async () => {
            log.debug('useSpotifySession: Calling session.disconnect');
            await session.disconnect();
            log.debug('useSpotifySession: disconnect completed');
        }).then(r => {
            if (r!) {
                log.error('useSpotifySession: Error in disconnect', r);
            } else {
                log.debug('useSpotifySession: disconnect succeeded');
            }
        });
    }, [withCatch, session]);

    return useMemo(() => ({
        showDialog,
        setShowDialog,
        startWithModuleActivityResult,
        startWithHostActivityResult,
        connectionStatus,
        isConnected,
        disconnect,
        lastSessionError,
    }), [
        showDialog,
        startWithModuleActivityResult,
        startWithHostActivityResult,
        connectionStatus,
        isConnected,
        disconnect,
        lastSessionError,
    ]);
};
