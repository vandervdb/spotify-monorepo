import React, {useEffect, useMemo} from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import {Header} from 'react-native/Libraries/NewAppScreen';
import MiniPlayer from './components/MiniPlayer';
import {useSpotifySession, useStyle} from './hooks';

function App(): React.JSX.Element {
    const {isDarkMode, backgroundStyle} = useStyle();
    const {authenticateUser, isConnected, getAuthToken} = useSpotifySession();

    useEffect(() => {
        if (!isConnected) {
            authenticateUser();
        }
    }, [isConnected, authenticateUser]);

    return (
        <SafeAreaView style={[styles.flex1, backgroundStyle]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.flex1}>
                <Header />
                <View style={[styles.container]}>
                    <MiniPlayer />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex1: {flex: 1},
    container: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        backgroundColor: '#00000000',
    },
    h1: {fontSize: 22, fontWeight: '700', marginTop: 12, marginBottom: 12},
    h2: {fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 6},
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#555',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        color: '#222',
        backgroundColor: '#fff',
    },
    inputSmall: {flex: 1},
    row: {flexDirection: 'row', alignItems: 'center', marginVertical: 6},
    spacer: {width: 10},
    small: {fontSize: 12, color: '#666', marginTop: 4},
    eventsBox: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#444',
        borderRadius: 8,
        padding: 10,
        marginTop: 8,
        backgroundColor: '#fafafa',
    },
});

export default App;
