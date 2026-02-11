import React, {useEffect, useMemo, useState} from 'react';
import {LayoutChangeEvent, StyleProp, TouchableWithoutFeedback, View, ViewStyle} from 'react-native';
import {MD3Colors, ProgressBar} from 'react-native-paper';
import {log} from '@core/logger';
import {SPACING} from '../theme';

export interface TrackProgressProps {
    durationMs: number | undefined;
    positionMs: number | undefined;
    isPlaying: boolean;
    onSeek?: (newPosition: number) => void;
    increment?: number;
    style?: StyleProp<ViewStyle>;
}

export const TrackProgress = ({
    positionMs,
    durationMs,
    isPlaying,
    onSeek,
    increment = 500,
    style,
}: TrackProgressProps) => {
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
        if (isPlaying) {
            interval = setInterval(() => {
                setPosition(prevPosition => {
                    return prevPosition + increment;
                });
            }, increment);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [positionMs, isPlaying]);

    const progress = useMemo(() => {
        if (!durationMs || !position) return 0;
        return durationMs > 0 ? position / durationMs : 0;
    }, [position, durationMs]);

    const handleClick = (event: any) => {
        log.debug(`TrackProgress: containerWidth: ${containerWidth}, handleClick: ${event.nativeEvent.locationX}`);
        log.debug(`TrackProgress: progress before click -> position: ${progress}`);
        setPosition((event.nativeEvent.locationX * durationMs!) / containerWidth);
        log.debug(`TrackProgress: handleClick position: ${position}`);
        log.debug(`TrackProgress: progress after click -> position: ${progress}`);
    };

    return (
        <TouchableWithoutFeedback onPress={handleClick} onLayout={onLayout} disabled={!isPlaying}>
            <View onLayout={onLayout} style={[{paddingTop: SPACING.s}, style]}>
                <ProgressBar progress={progress} color={MD3Colors.primary50} style={style} pointerEvents={'none'} />
            </View>
        </TouchableWithoutFeedback>
    );
};
