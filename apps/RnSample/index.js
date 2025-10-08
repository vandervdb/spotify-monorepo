/**
 * @format
 */
import './src/setup/polyfill';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import AppContainer from "./src/navigation/AppContainer";

AppRegistry.registerComponent(appName, () => AppContainer);
