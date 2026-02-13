import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollingText} from './index';
import {COLORS, SIZES, SPACING} from '../theme';
import {log} from '@core/logger';

export interface MiniPlayerTrackProps {
    trackName: string;
    artistName: string;
    width?: number;
}

const MiniPlayerTrack = ({trackName = '', artistName = '', width}: MiniPlayerTrackProps) => {
    const safeTrackName = useMemo(() => {
        if (!trackName || trackName.trim() === '') {
            return 'No track playing';
        }
        return trackName;
    }, [trackName]);

    const safeArtistName = useMemo(() => {
        if (!artistName || artistName.trim() === '') {
            return 'Unknown artist';
        }
        return artistName;
    }, [artistName]);

    log.debug(`Rendering MiniPlayerTrack: trackName="${safeTrackName}", artistName="${safeArtistName}"`);

    return (
        <View style={[styles.content, width ? {width} : {}]}>
            <View style={styles.trackTextContainer}>
                <ScrollingText text={safeTrackName} variant="titleMedium" style={styles.title} />
                <ScrollingText text={safeArtistName} variant="bodySmall" style={styles.artist} />
            </View>
        </View>
    );
};

export default MiniPlayerTrack;

const styles = StyleSheet.create({
    content: {
        width: SIZES.defaultTrackWidth,
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
