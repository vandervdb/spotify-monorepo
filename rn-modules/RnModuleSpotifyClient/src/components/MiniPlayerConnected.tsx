import {Card, IconButton} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import MiniPlayerTrack from './MiniPlayerTrack';
import TracksList from './TracksList';
import SpotifyTrackCover from './SpotifyTrackCover';
import React from 'react';
import {log} from '@core/logger';
import {PlayerState} from '../../specs';
import {QueueTrack} from '../types';
import {BORDER_RADIUS, COLORS, SIZES, SPACING} from '../theme';
import {TrackProgress} from './TrackProgress';

export interface MiniplayerConnectedProps {
    currentlyPlaying: PlayerState | undefined;
    queueTracks: QueueTrack[];
    setUri?: React.Dispatch<React.SetStateAction<string>>;
    onSeek?: (positionMs: number) => void;
    pause?: () => void;
    resume?: () => void;
}

const MiniPlayerConnected = ({
    currentlyPlaying,
    queueTracks,
    setUri,
    onSeek,
    pause,
    resume,
}: MiniplayerConnectedProps) => {
    const {isPlaying, durationMs, positionMs} = currentlyPlaying || {isPlaying: false};
    log.debug(
        `Currently Playing: ${currentlyPlaying?.trackName} / ${currentlyPlaying?.artistName} / ${positionMs} () is playing: ${isPlaying}`,
    );

    return (
        <Card style={styles.container} elevation={4}>
            <View style={styles.content}>
                <View style={styles.coverContainer}>
                    <SpotifyTrackCover uri={currentlyPlaying?.coverId} />
                </View>
                <View style={styles.tracksWrapper}>
                    {queueTracks.length > 0 ? (
                        <TracksList
                            trackList={queueTracks}
                            currentlyPlaying={currentlyPlaying}
                            onCurrentTrackChange={uri => setUri?.(uri)}
                        />
                    ) : (
                        <MiniPlayerTrack
                            trackName={currentlyPlaying?.trackName || ' '}
                            artistName={currentlyPlaying?.artistName || ' '}
                        />
                    )}
                </View>
                <View style={styles.controls}>
                    <IconButton
                        icon={isPlaying ? 'pause' : 'play'}
                        mode="contained"
                        size={SIZES.iconButtonSize}
                        iconColor={COLORS.white}
                        containerColor={COLORS.cardBackground}
                        onPress={() => (isPlaying ? pause?.() : resume?.())}
                    />
                </View>
            </View>
            <TrackProgress
                durationMs={durationMs}
                positionMs={positionMs}
                onSeek={onSeek}
                isPlaying={isPlaying}
                style={styles.progress}
            />
        </Card>
    );
};

export default MiniPlayerConnected;

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.s,
        borderRadius: BORDER_RADIUS.l,
        overflow: 'hidden',
        backgroundColor: COLORS.cardBackground,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.s,
    },
    coverContainer: {
        marginRight: SPACING.m,
    },
    tracksWrapper: {
        flex: 1,
        height: SIZES.miniPlayerTrackHeight,
        overflow: 'hidden',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progress: {
        height: SIZES.progressBarHeight,
        marginBottom: SPACING.xs,
    },
});
