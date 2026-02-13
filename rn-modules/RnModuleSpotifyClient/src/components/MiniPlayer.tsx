import React from 'react';
import {useSpotifySession} from '../hooks';
import MiniPlayerDisconnected from './MiniPlayerDisconnected';
import MiniPlayerConnected from './MiniPlayerConnected';

const MiniPlayer = () => {
    const {isConnected, authenticateUser} = useSpotifySession();

    if (!isConnected) return <MiniPlayerDisconnected authenticate={authenticateUser} />;

    return <MiniPlayerConnected />;
};

export default MiniPlayer;
