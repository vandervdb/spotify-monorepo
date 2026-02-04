import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollingText} from './ScrollingText';

export interface MiniPlayerTrackProps {
    trackName: string;
    artistName: string;
    width?: number;
}

const MiniPlayerTrack = ({trackName, artistName, width}: MiniPlayerTrackProps) => {
    return (
        <View style={[styles.content, width ? {width} : {}]}>
            <View style={styles.trackTextContainer}>
                <ScrollingText text={trackName} variant="titleMedium" style={styles.title} />
                <ScrollingText text={artistName} variant="bodySmall" style={styles.artist} />
            </View>
        </View>
    );
};

export default MiniPlayerTrack;

const styles = StyleSheet.create({
    content: {
        width: 250, // Largeur par défaut si width n'est pas fourni
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    trackTextContainer: {
        flex: 1,
        flexShrink: 1,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    title: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    artist: {
        color: '#B3B3B3',
    },
});
