import {Card, IconButton, MD3Colors, ProgressBar} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import TracksList from './TracksList';
import SpotifyTrackCover from './SpotifyTrackCover';
import React from 'react';
import {log} from '@core/logger';
import {PlayerState} from '../../specs';
import {QueueTrack} from '../types';

export interface MiniplayerConnectedProps {
    currentlyPlaying: PlayerState | undefined;
    queueTracks: QueueTrack[];
    setUri?: React.Dispatch<React.SetStateAction<string>>;
    pause?: () => void;
    resume?: () => void;
}

const MiniPlayerConnected = ({currentlyPlaying, queueTracks, setUri, pause, resume}: MiniplayerConnectedProps) => {
    const {isPlaying, positionMs} = currentlyPlaying || {isPlaying: false, positionMs: 0};
    log.debug(
        `Currently Playing: ${currentlyPlaying?.trackName} / ${currentlyPlaying?.artistName} / ${currentlyPlaying?.trackUri} }`,
    );

    return (
        <Card style={styles.container} elevation={4}>
            <View style={styles.content}>
                <View style={styles.coverContainer}>
                    <SpotifyTrackCover uri={currentlyPlaying?.coverId} />
                </View>
                <View style={styles.tracksWrapper}>
                    <TracksList
                        trackList={queueTracks}
                        currentlyPlaying={currentlyPlaying}
                        onCurrentTrackChange={uri => setUri?.(uri)}
                    />
                </View>
                <View style={styles.controls}>
                    <IconButton
                        icon={isPlaying ? 'pause' : 'play'}
                        mode="contained"
                        size={30}
                        iconColor={'#FFFFFF'}
                        containerColor={'#282828'}
                        onPress={() => (isPlaying ? pause?.() : resume?.())}
                    />
                </View>
            </View>
            <ProgressBar progress={positionMs / 1000} color={MD3Colors.primary50} style={styles.progress} />
        </Card>
    );
};

export default MiniPlayerConnected;

const styles = StyleSheet.create({
    container: {
        margin: 8,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#282828',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    coverContainer: {
        marginRight: 12,
    },
    tracksWrapper: {
        flex: 1,
        height: 60,
        overflow: 'hidden',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progress: {
        height: 2,
    },
});
