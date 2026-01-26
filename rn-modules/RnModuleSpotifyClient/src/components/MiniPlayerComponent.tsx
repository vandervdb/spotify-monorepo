import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import SpotifyTrackCover from "./SpotifyTrackCover";

export interface MiniPlayerComponentProps {
    trackName: string;
    artistName: string;
    coverUri: string;
}

const ScrollingText = ({ text, style, variant }: { text: string, style?: any, variant: any }) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const [textWidth, setTextWidth] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        scrollX.setValue(0);
        if (textWidth > containerWidth && containerWidth > 0) {
            const scrollDistance = textWidth - containerWidth + 40;

            const animation = Animated.loop(
                Animated.sequence([
                    Animated.delay(2000),
                    Animated.timing(scrollX, {
                        toValue: -scrollDistance,
                        duration: scrollDistance * 40,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.delay(2000),
                    Animated.timing(scrollX, {
                        toValue: 0,
                        duration: 0, // Retour instantané pour éviter le glitch visuel
                        useNativeDriver: true,
                    }),
                ])
            );
            animation.start();
            return () => animation.stop();
        }
    }, [textWidth, containerWidth, text]);

    return (
        <View
            style={styles.scrollingTextContainer}
            onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
            <Animated.View
                style={{
                    flexDirection: 'row',
                    transform: [{ translateX: scrollX }],
                    width: textWidth > 0 ? textWidth : undefined,
                    minWidth: textWidth > 0 ? textWidth : undefined,
                }}
            >
                <Text
                    variant={variant}
                    style={[style, { flexShrink: 0, width: textWidth > 0 ? textWidth : undefined }]}
                    numberOfLines={1}
                    ellipsizeMode="clip"
                >
                    {text}
                </Text>
            </Animated.View>

            <ScrollView
                horizontal
                style={{ position: 'absolute', opacity: 0, height: 0 }}
                contentContainerStyle={{ alignItems: 'flex-start' }}
                pointerEvents="none"
            >
                <Text
                    variant={variant}
                    style={[style, { flexShrink: 0, width: undefined }]}
                    onLayout={(e) => {
                        const w = e.nativeEvent.layout.width;
                        if (w > 0) setTextWidth(w);
                    }}
                >
                    {text}
                </Text>
            </ScrollView>
        </View>
    );
};

const MiniPlayerComponent = ({ trackName, artistName, coverUri }: MiniPlayerComponentProps) => {
    return (
        <View style={styles.content}>
            <View style={styles.trackInfo}>
                <SpotifyTrackCover uri={coverUri}/>
            </View>

            <View style={styles.trackTextContainer}>
                <ScrollingText
                    text={trackName}
                    variant="titleMedium"
                    style={styles.title}
                />
                <ScrollingText
                    text={artistName}
                    variant="bodySmall"
                    style={styles.artist}
                />
            </View>
        </View>
    );
}

export default MiniPlayerComponent;

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    trackInfo: {
        marginRight: 12,
    },
    trackTextContainer: {
        flex: 1,
        flexShrink: 1,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    scrollingTextContainer: {
        overflow: 'hidden',
        width: '100%',
        marginVertical: 1, // Petite marge pour éviter que les glyphes hauts ne soient coupés par l'overflow
    },
    title: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    artist: {
        color: '#B3B3B3',
    },
});
