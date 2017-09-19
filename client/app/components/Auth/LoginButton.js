import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
} from 'react-native';

export default class LoginButton extends Component {
  render() {
    return (
      <View style={this.props.style}>
        <TouchableHighlight
          style={styles.container}
          onPress={this.props.onPress}
        >
          <View style={styles.loginButton}>
            <Text style={styles.loginButtonText}
              numberOfLines={1}>{ this.props.text }</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

LoginButton.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.any,
};

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    height: height <= 480 ? 30 : 40,
    width: 175,

    backgroundColor:'rgba(255, 196, 71, 0.9)',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '500',
    fontFamily: 'Lato',
    fontSize: height <= 480 ? 12 : 16,
  },
  loginButtonTextLoggedIn: {
    marginLeft: 5,
  },
  loginButtonTextLoggedOut: {
    marginLeft: 18,
  },
  FBLogo: {
    position: 'absolute',
    height: 14,
    width: 14,

    left: 7,
    top: 7,
  },
});
