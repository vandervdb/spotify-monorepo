import {useCallback, useEffect, useMemo, useState} from 'react';
import { session} from './index';
import type {SessionState} from '../../specs/NativeSpotifyClientModule';
import {log} from '@core/logger';
import { withCatch} from '../utils';

export const useSpotifySession = () => {
    const [showDialog, setShowDialog] = useState<boolean>(true);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    // Synchronize session state with native events
    useEffect(() => {
        log.debug('useSpotifySession: Initializing session listener');
        const sub = session.addListener((e: SessionState) => {
            log.debug('useSpotifySession: Session state changed:', JSON.stringify(e));
            if (e.Ready) {
                log.debug('useSpotifySession: Session is Ready');
                setIsConnected(true);
            } else if (e.Idle || e.Failed) {
                log.warn('useSpotifySession: Session is Idle or Failed:', e.Idle ? 'Idle' : 'Failed');
                setIsConnected(false);
            }
        });

        // Initial check
        log.debug('useSpotifySession: Checking initial session state');
        session.getSessionState().then(state => {
            log.debug('useSpotifySession: Initial session state:', JSON.stringify(state));
            if (state.Ready) {
                log.debug('useSpotifySession: Setting connected to true');
                setIsConnected(true);
            }
        }).catch(err => {
            log.error('useSpotifySession: Failed to get initial session state', err);
        });

        return () => {
            log.debug('useSpotifySession: Cleaning up session listener');
            sub.remove();
        };
    }, []);



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
    }, [withCatch, showDialog]);

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
    }, [withCatch, showDialog]);

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
    }, [withCatch]);

    return {
        showDialog,
        setShowDialog,
        startWithModuleActivityResult,
        startWithHostActivityResult,
        isConnected,
        disconnect,
    }
};
