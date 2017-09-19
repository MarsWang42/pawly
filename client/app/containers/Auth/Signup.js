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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as actions from '../../reducers/session';
import LoginButton from '../../components/Auth/LoginButton';

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

class Signup extends Component {
  constructor(props) {
    super(props);
    this.inputs = [];

    this.state = {
      email: '',
      password: '',
    };
  }

  submitForm() {
    const {
      email,
      password,
      emailError,
      passwordError,
    } = this.state;

    if (!password) {
      this.setState({ passwordError: true })
    } else {
      this.setState({ passwordError: false })
    }

    if (!email || !validateEmail(email) ) {
      this.setState({ emailError: true })
    } else {
      this.setState({ emailError: false })
    }

    if (password && email && validateEmail(email)) {
      this.props.dispatch({
        type: actions.REGISTER_USER,
        email,
        password,
      });
    }
  }

  render(){
    const { loginUserByFacebook, loginUserByEmail, loginError, navigation } = this.props;
    return (
      <KeyboardAwareScrollView scrollEnabled={false} >
        <View style={styles.container}>
          <View style={styles.textInputContainer}>
            <Icon
              name={'envelope'}
              size={18}
              color={'#292f33'}
              style={{ paddingHorizontal: 13 }}
            />
            <TextInput
              blurOnSubmit={ false }
              autoCapitalize={'none'}
              returnKeyType={ 'next' }
              placeholder={'E-mail'}
              placeholderTextColor={'gray'}
              value={this.state.email}
              style={styles.textInput}
              onChangeText={(text) => this.setState({ email: text })}
              ref={input => { this.inputs[0] = input; }}
              onSubmitEditing={() => this.inputs[1].focus()}
            />
          </View>
          <View style={styles.warningContainer}>
            { this.state.emailError ?
              <Text style={styles.warningText}>Please input a valid email.</Text>
              : null
            }
          </View>
          <View style={styles.textInputContainer}>
            <Icon
              name={'lock'}
              size={24}
              color={'#292f33'}
              style={{ paddingHorizontal: 14 }}
            />
            <TextInput
              blurOnSubmit={ false }
              autoCapitalize={'none'}
              returnKeyType={ 'go' }
              secureTextEntry
              placeholder={'Password'}
              placeholderTextColor={'gray'}
              value={this.state.password}
              style={styles.textInput}
              onChangeText={(text) => this.setState({ password: text })}
              ref={input => { this.inputs[1] = input; }}
              onSubmitEditing={() => loginUserByEmail({
                email: this.state.email,
                password: this.state.password,
                navigate: navigation.navigate,
              })}
            />
          </View>
          <View style={styles.warningContainer}>
            { this.state.passwordError ?
              <Text style={styles.warningText}>Please give a password.</Text>
              : null
            }
          </View>
          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center', margin: 5 }}
            onPress={() => {
            Linking.openURL('https:fabrichealth.files.wordpress.com/2017/07/terms-and-conditions-privacy-policy-fabric-pdf.pdf')
                .catch(err => console.error('An error occurred', err));
            }}
          >
            <Text style={{ color: 'black', fontSize: 13 }}>
              I agree to Fabric's Terms of Use.
            </Text>
          </TouchableOpacity>
          <View style={{ height: 15, alignItems: 'center', justifyContent: 'center' }}>
            { this.props.registerError ?
              <Text style={{ color: 'red' }}>Can't register this user.</Text>
              : null }
          </View>
          <LoginButton
            style={styles.loginButton}
            text={'Sign Up'}
            onPress={() => this.submitForm()}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

Signup.propTypes = {
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
  textInputContainer: {
    flexDirection: 'row',
    height: height <= 480 ? 30 : 40,
    marginHorizontal: height <= 480 ? 30 : 40,
    marginVertical: height <= 480 ? 10 : 12,
    backgroundColor: 'rgba(150, 150, 150, 0.3)',
    alignItems: 'center',
    borderRadius: 8,
  },
  textInput: {
    fontSize: height <= 480 ? 14 : 16,
    color: '#292f33',
    height: height <= 480 ? 30 : 40,
    width: width - 120,
  },
  loginButton: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: width <= 325 ? 5 : 10,
    marginBottom: 10,
    alignItems:'center',
    justifyContent:'center'
  },
  warningContainer: {
    height: 12,
    marginHorizontal: height <= 480 ? 30 : 40,
  },
  warningText: {
    fontSize: 12,
    color: 'red',
  },
});

const mapStateToProps = (state) => {
  return {
    loginError: state.session.loginError,
  };
};

export default connect(mapStateToProps)(Signup);
