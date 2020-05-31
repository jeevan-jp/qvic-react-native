/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

if(Platform.OS === "android") {
  console.log('Registering RNCallKeepBackgroundMessage')
  AppRegistry.registerHeadlessTask('RNCallKeepBackgroundMessage', () => ({ name, callUUID, handle }) => {
    // Make your call here
    console.log('hey hey')
    return Promise.resolve();
  });
}