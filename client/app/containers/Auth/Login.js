import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../reducers/session';
import FBLoginButton from '../../components/Auth/FBLoginButton';
import LoginButton from '../../components/Auth/LoginButton';
import Icon from 'react-native-vector-icons/FontAwesome';

class Login extends Component {
  constructor(props) {
    super(props);
    this.inputs = [];

    this.state = {
      email: '',
      password: '',
    };
  }

  render(){
    const {
      isLoggingIn,
      loginUserByFacebook,
      loginUserByEmail,
      loginError,
      navigation,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={[styles.textInputContainer, { marginTop: 25 }]}>
          <Icon
            name={'envelope'}
            size={18}
            color={'white'}
            style={{ marginHorizontal: 13 }}
          />
          <TextInput
            blurOnSubmit={ false }
            autoCapitalize={'none'}
            returnKeyType={ 'next' }
            placeholder={'E-mail'}
            placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
            value={this.state.email}
            style={styles.textInput}
            onChangeText={(text) => this.setState({ email: text })}
            ref={input => { this.inputs[0] = input; }}
            onSubmitEditing={() => this.inputs[1].focus()}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Icon
            name={'lock'}
            size={24}
            color={'white'}
            style={{ paddingHorizontal: 14 }}
          />
          <TextInput
            blurOnSubmit={ true }
            autoCapitalize={'none'}
            returnKeyType={ 'go' }
            secureTextEntry
            placeholder={'Password'}
            placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
            value={this.state.password}
            style={styles.textInput}
            onChangeText={(text) => this.setState({ password: text })}
            ref={input => { this.inputs[1] = input; }}
            onSubmitEditing={() => this.props.dispatch({
              type: actions.LOGIN_USER,
              strategy: 'local',
              token: {
                email: this.state.email,
                password: this.state.password,
              }
            })}
          />
        </View>
        <View style={{ height: 20, alignItems: 'center', justifyContent: 'center' }}>
          { loginError ?
            <Text style={{ color: 'yellow', fontFamily: 'Lato' }}>Can't find the email/password combination.</Text>
            : null }
        </View>
        <LoginButton
          style={styles.loginButton}
          text={'Log In'}
          isLoading={isLoggingIn === 'local'}
          onPress={() => this.props.dispatch({
            type: actions.LOGIN_USER,
            strategy: 'local',
            token: {
              email: this.state.email,
              password: this.state.password,
            }
          })}
        />
      </View>
    );
  }
}

Login.propTypes = {
  navigation: PropTypes.any,
  loginUserByFacebook: PropTypes.func,
  loginUser: PropTypes.func,
};

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 0,
    zIndex: 1,
  },
  textContainer: {
    alignItems:'center',
    justifyContent:'center',
    height: height <= 480 ? 15 : 30,
  },
  text: {
    color: 'white',
    fontSize: height <= 480 ? 10 : 12,
  },
  signupText: {
    color: '#f89406',
    fontSize: height <= 480 ? 12 : 14,
    textAlign: 'center',
    marginTop: height <= 480 ? 20 : 30,
  },
  textInputContainer: {
    flexDirection: 'row',
    height: height <= 480 ? 30 : 40,
    marginHorizontal: height <= 480 ? 30 : 40,
    marginVertical: height <= 480 ? 16 : 18,
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    alignItems: 'center',
    borderRadius: 8,
  },
  textInput: {
    fontSize: height <= 480 ? 14 : 16,
    color: '#fff',
    height: height <= 480 ? 30 : 40,
    width: width - 120,
  },
  loginButton: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: width <= 325 ? 5 : 20,
    marginBottom: 10,
    alignItems:'center',
    justifyContent:'center'
  },
  facebookButton: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: width <= 325 ? 5 : 10,
    marginBottom: 10,
    alignItems:'center',
    justifyContent:'center'
  },
  titleContainer: {
    marginTop: height >= 730 ? 125 : 75,
    marginBottom: width <= 325 ? 20 : 50,
    alignItems:'center',
    justifyContent:'center'
  },
  title: {
    fontSize: height <= 480 ? 50 : 70,
    color: 'white',
    fontFamily: 'Helvetica neue',
  },
});

const mapStateToProps = (state) => {
  return {
    loginError: state.session.loginError,
    isLoggingIn: state.session.isLoggingIn,
  };
};

export default connect(mapStateToProps)(Login);
