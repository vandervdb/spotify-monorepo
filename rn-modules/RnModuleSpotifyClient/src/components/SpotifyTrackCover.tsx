import React, {useRef} from 'react';
import { Image } from 'react-native';
import {log} from "@core/logger";
import {SPOTIFY_CONSTANTS} from '../utils'

export const SpotifyTrackCover = ({uri}: {uri: string}) => {
    log.debug(`Rendering SpotifyTrackCover with uri: ${uri}`);

    return (
        <Image
            source={{ uri: `${SPOTIFY_CONSTANTS.SPOTIFY_COVER_UI}${uri}` }}
            style={{ width: 50, height: 50, borderRadius: 3 }}
        />
    );
}

export default SpotifyTrackCover;
