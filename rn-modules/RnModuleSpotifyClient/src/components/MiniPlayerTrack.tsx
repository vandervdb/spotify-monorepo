import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollingText} from './ScrollingText';
import {COLORS, SIZES, SPACING} from '../theme';
import {log} from '@core/logger';

export interface MiniPlayerTrackProps {
    trackName: string;
    artistName: string;
    width?: number;
}

const MiniPlayerTrack = React.memo(({trackName, artistName, width}: MiniPlayerTrackProps) => {
    log.debug(`Rendering MiniPlayerTrack: trackName="${trackName}", artistName="${artistName}"`);
    return (
        <View style={[styles.content, width ? {width} : {}]}>
            <View style={styles.trackTextContainer}>
                <ScrollingText text={trackName || ' '} variant="titleMedium" style={styles.title} />
                <ScrollingText text={artistName || ' '} variant="bodySmall" style={styles.artist} />
            </View>
        </View>
    );
});

export default MiniPlayerTrack;

const styles = StyleSheet.create({
    content: {
        width: SIZES.defaultTrackWidth, // Largeur par défaut si width n'est pas fourni
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.s,
    },
    trackTextContainer: {
        flex: 1,
        flexShrink: 1,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    title: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    artist: {
        color: COLORS.textSecondary,
    },
});
