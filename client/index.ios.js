/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import App from './app/index';

Text.defaultProps.allowFontScaling = false;

class DarkTheme extends Component {
  render() {
    return (
      <View style={styles.container}>
        <App />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: 20,
  },
});

AppRegistry.registerComponent('Pawly', () => DarkTheme);
