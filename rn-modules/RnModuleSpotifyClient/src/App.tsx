import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {PaperProvider} from 'react-native-paper';
import {MiniPlayer, HeaderCard} from './components';
import {useSpotifySession, useStyle} from './hooks';
import {BORDER_RADIUS, COLORS, SIZES, SPACING, TYPOGRAPHY} from './theme';

function App(): React.JSX.Element {
    const {isDarkMode, backgroundStyle} = useStyle();
    const {authenticateUser, isConnected} = useSpotifySession();

    useEffect(() => {
        if (!isConnected) {
            authenticateUser();
        }
    }, [isConnected, authenticateUser]);

    return (
        <SafeAreaProvider>
            <PaperProvider>
                <View style={[styles.flex1, backgroundStyle]}>
                    <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                    <SafeAreaView style={styles.flex1}>
                        <View style={styles.container}>
                            <HeaderCard style={styles.topCard} />
                            {/*<View style={styles.topCard}></View>*/}
                            <View style={styles.middleCard}></View>
                            <MiniPlayer />
                        </View>
                    </SafeAreaView>
                </View>
            </PaperProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    flex1: {flex: 1},
    container: {
        flex: 1,
        paddingHorizontal: SPACING.l,
        paddingBottom: SPACING.xl,
        backgroundColor: COLORS.transparent,
    },
    topCard: {
        height: SIZES.topCardHeight,
        borderRadius: BORDER_RADIUS.l,
        backgroundColor: COLORS.cardBackground,
        marginBottom: SPACING.m,
    },
    middleCard: {
        flex: 1,
        borderRadius: BORDER_RADIUS.l,
        backgroundColor: COLORS.cardBackground,
        marginBottom: SPACING.m,
    },
    miniplayer: {justifyContent: 'flex-end'},
    h1: {
        ...TYPOGRAPHY.h1,
        marginTop: SPACING.m,
        marginBottom: SPACING.m,
    },
    h2: {
        ...TYPOGRAPHY.h2,
        marginTop: SPACING.l,
        marginBottom: SPACING.s,
    },
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.m,
        padding: SPACING.s + 2, // 10
        marginBottom: SPACING.s,
        color: COLORS.inputText,
        backgroundColor: COLORS.inputBackground,
    },
    inputSmall: {flex: 1},
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.s - 2, // 6
    },
    spacer: {width: SPACING.s + 2}, // 10
    small: {
        ...TYPOGRAPHY.small,
        color: COLORS.secondaryText,
        marginTop: SPACING.xs,
    },
    eventsBox: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.eventsBorder,
        borderRadius: BORDER_RADIUS.m,
        padding: SPACING.s + 2, // 10
        marginTop: SPACING.s,
        backgroundColor: COLORS.eventsBackground,
    },
});

export default App;
