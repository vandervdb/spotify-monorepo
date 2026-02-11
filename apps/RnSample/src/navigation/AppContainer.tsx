import {NavigationContainer} from '@react-navigation/native';
import {RootStack} from './ScreenStack';
import {DefaultAuthClient, StoreProvider} from '@spotify/client';
import {KeyChainService} from '@keychain/service';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createGetApi, createPostApi} from '@http/client';
import {useMemo} from 'react';

export default function AppContainer() {
    const deps = useMemo(() => {
        const authClient = new DefaultAuthClient(createPostApi);
        const storage = KeyChainService.token;

        return {
            auth: {authClient, storage},
            httpClient: {createGetApi},
        };
    }, []);

    return (
        <SafeAreaProvider>
            <StoreProvider deps={deps}>
                <NavigationContainer>
                    <RootStack />
                </NavigationContainer>
            </StoreProvider>
        </SafeAreaProvider>
    );
}
