import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from './ScreenStack';
import {
  DefaultAuthClient,
  StoreProvider,
} from '@spotify/client';
import { KeyChainService } from '@keychain/service';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createGetApi, createPostApi } from '@http/client';

const authClient = new DefaultAuthClient(createPostApi);
const storage = KeyChainService.token;

const deps = {
  auth: { authClient, storage },
  httpClient: { createGetApi },
};

export default function AppContainer() {
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
