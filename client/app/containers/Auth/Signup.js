import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
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
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm() {
    const {
      email,
      password,
      emailError,
      passwordError,
    } = this.state;

    if (!password || password.length < 8 || password.length > 20) {
      this.setState({ passwordError: true });
    } else {
      this.setState({ passwordError: false });
    }

    if (!email || !validateEmail(email) ) {
      this.setState({ emailError: true });
    } else {
      this.setState({ emailError: false });
    }

    if (password && password.length >= 8 && password.length <= 20
      && email && validateEmail(email)) {
      this.props.dispatch({
        type: actions.REGISTER_USER,
        email,
        password,
      });
    }
  }

  render(){
    const {
      isLoggingIn,
      isRegistering,
      loginUserByFacebook,
      loginUserByEmail,
      loginError,
      navigation,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.textInputContainer}>
          <Icon
            name={'envelope'}
            size={18}
            color={'white'}
            style={{ paddingHorizontal: 13 }}
          />
          <TextInput
            blurOnSubmit={ false }
            autoCapitalize={'none'}
            returnKeyType={ 'next' }
            placeholder={'E-mail'}
            placeholderTextColor={'rgba(255, 255, 255, 0.3)'}
            value={this.state.email}
            style={styles.textInput}
            keyboardType={'email-address'}
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
            color={'white'}
            style={{ paddingHorizontal: 14 }}
          />
          <TextInput
            blurOnSubmit={ false }
            autoCapitalize={'none'}
            returnKeyType={ 'go' }
            secureTextEntry
            placeholder={'Password'}
            placeholderTextColor={'rgba(255, 255, 255, 0.3)'}
            value={this.state.password}
            style={styles.textInput}
            onChangeText={(text) => this.setState({ password: text })}
            ref={input => { this.inputs[1] = input; }}
            onSubmitEditing={this.submitForm}
          />
        </View>
        <View style={styles.warningContainer}>
          { this.state.passwordError ?
            <Text style={styles.warningText}>Passward should between 8 to 20 characters.</Text>
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
          <Text style={{ color: 'white', fontFamily: 'Lato', fontSize: 13 }}>
            I agree to Pawly's Terms of Use.
          </Text>
        </TouchableOpacity>
        <View style={styles.warningContainer}>
          { this.props.registerError ?
            <Text style={styles.warningText}>Can't register this email.</Text>
            : null
          }
        </View>
        <LoginButton
          style={styles.loginButton}
          text={'Sign Up'}
          isLoading={isRegistering}
          disabled={(isLoggingIn || isRegistering) ? true : false}
          onPress={() => this.submitForm()}
        />
      </View>
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
    marginTop: width <= 325 ? 5 : 10,
    marginBottom: 10,
    alignItems:'center',
    justifyContent:'center'
  },
  warningContainer: {
    height: 12,
    marginHorizontal: height <= 480 ? 30 : 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 12,
    color: 'yellow',
    textAlign: 'center'
  },
});

const mapStateToProps = (state) => {
  return {
    registerError: state.session.registerError,
    isRegistering: state.session.isRegistering,
  };
};

export default connect(mapStateToProps)(Signup);
