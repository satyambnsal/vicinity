/**
 * @format
 */

import {AppRegistry, NativeModules} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

if (NativeModules.JsiJSEngine) {
  NativeModules.JsiJSEngine.setHeapSizeMB(512); // Increase to 512MB
}

AppRegistry.registerComponent(appName, () => App);
