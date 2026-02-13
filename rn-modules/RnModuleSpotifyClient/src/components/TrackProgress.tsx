import React, {useEffect, useMemo, useState} from 'react';
import {LayoutChangeEvent, StyleProp, TouchableWithoutFeedback, View, ViewStyle} from 'react-native';
import {MD3Colors, ProgressBar} from 'react-native-paper';
import {SPACING} from '../theme';
import {useSpotifyPlayer} from '../hooks';

export interface TrackProgressProps {
    increment?: number;
    style?: StyleProp<ViewStyle>;
}

export const TrackProgress = ({increment = 500, style}: TrackProgressProps) => {
    const {isPlaying, positionMs, durationMs, seek} = useSpotifyPlayer();

    const [position, setPosition] = useState(positionMs ?? 0);
    const [containerWidth, setContainerWidth] = useState(0);

    const onLayout = (event: LayoutChangeEvent) => {
        setContainerWidth(event.nativeEvent.layout.width);
    };

    useEffect(() => {
        if (positionMs !== undefined && positionMs !== position) {
            setPosition(positionMs);
        }
        let interval: NodeJS.Timeout;
        if (isPlaying && durationMs) {
            interval = setInterval(() => {
                setPosition(prevPosition => {
                    const newPosition = prevPosition + increment;
                    return Math.min(newPosition, durationMs);
                });
            }, increment);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [positionMs, isPlaying, durationMs, increment]);

    const progress = useMemo(() => {
        if (!durationMs || !position) return 0;
        return durationMs > 0 ? position / durationMs : 0;
    }, [position, durationMs]);

    const handleClick = (event: {nativeEvent: {locationX: number}}) => {
        if (!durationMs || !containerWidth || durationMs <= 0 || containerWidth <= 0) return;

        const clickedPosition = event.nativeEvent.locationX;
        const newPosition = Math.round((clickedPosition * durationMs) / containerWidth);
        seek?.(newPosition);
    };

    return (
        <TouchableWithoutFeedback onPress={handleClick} disabled={!isPlaying}>
            <View onLayout={onLayout} style={[{paddingTop: SPACING.s}, style]}>
                <ProgressBar progress={progress} color={MD3Colors.primary50} style={style} pointerEvents={'none'} />
            </View>
        </TouchableWithoutFeedback>
    );
};
