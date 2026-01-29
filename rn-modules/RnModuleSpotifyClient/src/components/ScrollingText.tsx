import React, {useEffect, useRef, useState} from "react";
import {Animated, Easing, ScrollView, StyleSheet, View} from "react-native";
import {Text} from "react-native-paper";

export const ScrollingText = ({text, style, variant}: { text: string, style?: any, variant: any }) => {
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
                        duration: 0,
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
                    transform: [{translateX: scrollX}],
                    width: textWidth > 0 ? textWidth : undefined,
                    minWidth: textWidth > 0 ? textWidth : undefined,
                }}
            >
                <Text
                    variant={variant}
                    style={[style, {flexShrink: 0, width: textWidth > 0 ? textWidth : undefined}]}
                    numberOfLines={1}
                    ellipsizeMode="clip"
                >
                    {text}
                </Text>
            </Animated.View>

            <ScrollView
                horizontal
                style={{position: 'absolute', opacity: 0, height: 0}}
                contentContainerStyle={{alignItems: 'flex-start'}}
                pointerEvents="none"
            >
                <Text
                    variant={variant}
                    style={[style, {flexShrink: 0, width: undefined}]}
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

const styles = StyleSheet.create({
    scrollingTextContainer: {
        overflow: 'hidden',
        width: '100%',
        marginVertical: 1, // Petite marge pour éviter que les glyphes hauts ne soient coupés par l'overflow
    },
});
