/**
 * @format
 */
console.log('index.js: Start loading');
import './src/setup/polyfill';
import {AppRegistry, View, Text} from 'react-native';

const appName = 'RnSample';

console.log('index.js: appName is hardcoded to', appName);

// Register a very early fallback to ensure something is registered immediately
const InitialLoading = () => {
    console.log('InitialLoading component rendering');
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
            <Text style={{color: 'black'}}>Initializing...</Text>
        </View>
    );
};
AppRegistry.registerComponent(appName, () => InitialLoading);
console.log('index.js: Initial registration done for', appName);

try {
    console.log('index.js: Importing AppContainer');
    // Using require instead of import to catch errors during loading
    const AppContainerModule = require('./src/navigation/AppContainer');
    console.log('index.js: AppContainer module required');
    const AppContainer = AppContainerModule.default || AppContainerModule;
    console.log('index.js: AppContainer default export resolved');

    // Register the real app, which should override the initial registration
    AppRegistry.registerComponent(appName, () => {
        console.log('AppContainer component wrapper calling');
        try {
            if (!AppContainer) {
                console.error('AppContainer is null or undefined at registration time');
            }
            return AppContainer;
        } catch (e) {
            console.error('Error returning AppContainer from wrapper', e);
            throw e;
        }
    });
    console.log('index.js: Final component registered');
} catch (error) {
    console.error('index.js: Registration failed', error);
    if (error.stack) {
        console.error('index.js: Error stack', error.stack);
    }
    const Fallback = () => (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
            <Text style={{color: 'black'}}>Failed to load AppContainer</Text>
            <Text style={{color: 'red', marginTop: 10}}>{error.message}</Text>
        </View>
    );
    console.log('index.js: Registering Fallback component');
    AppRegistry.registerComponent(appName, () => Fallback);
    console.log('index.js: Fallback component registered');
}
