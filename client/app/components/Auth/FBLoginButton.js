import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FBSDK from 'react-native-fbsdk';
import Spinner from 'react-native-spinkit';

const { LoginManager, AccessToken } = FBSDK;

export default class FBLoginButton extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.onPress = this.onPress.bind(this);
  }

  handleLogin() {
    // Permission of the token
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      function(result){
        if (!result.isCancelled) {
          AccessToken.getCurrentAccessToken().then((data) => {
            this.props.onLogin && this.props.onLogin(data);
          })
        }
      }.bind(this)
    );
  }

  onPress() {
    this.handleLogin();
    this.props.onPress && this.props.onPress();
  }

  render() {
    const text = 'Log in with Facebook';
    return (
      <View style={this.props.style}>
        <TouchableHighlight
          disabled={this.props.disabled}
          activeOpacity={0.8}
          style={styles.container}
          onPress={this.onPress}
        >
          <View style={styles.FBLoginButton}>
            <View style={styles.FBLogo}>
              <Icon name={'facebook-square'} color={'white'} size={20} />
            </View>
            { this.props.isLoading ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Spinner type={'Wave'} size={20} color={'#fff'} />
              </View>
              ) : (
                <Text
                  style={styles.FBLoginButtonText}
                  numberOfLines={1}
                >
                  {text}
                </Text>
              )
            }
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

FBLoginButton.propTypes = {
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  onPress: PropTypes.func,
  style: PropTypes.any,
};

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  FBLoginButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',

    height: height <= 480 ? 30 : 40,
    width: 175,

    backgroundColor: 'rgba(66, 93, 174, 0.9)',
    borderWidth: 2,
    borderColor: '#F6F6F6',
    borderRadius: 8,
  },
  FBLoginButtonText: {
    flex: 1,
    color: 'white',
    fontWeight: '500',
    fontFamily: 'Lato',
    fontSize: height <= 480 ? 12 : 16,
    textAlign: 'center',
  },
  FBLogo: {
    height: 20,
    width: 40,
    paddingHorizontal: 10,
  },
});
