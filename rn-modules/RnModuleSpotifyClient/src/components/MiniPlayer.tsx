import React from 'react';
import {useSpotifySession} from '../hooks';
import {MiniPlayerDisconnected, MiniPlayerConnected} from './index';

const MiniPlayer = () => {
    const {isConnected} = useSpotifySession();

    if (!isConnected) return <MiniPlayerDisconnected />;

    return <MiniPlayerConnected />;
};

export default React.memo(MiniPlayer);
