import React, { Component } from 'react';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import * as actions from '../../reducers/session';
import FBLoginButton from '../../components/Auth/FBLoginButton';
import Login from './Login';
import Signup from './Signup';
import Avatar from './Avatar';
import Pet from './Pet';

const { height, width } = Dimensions.get('window');

class Home extends Component {
  constructor() {
    super();
    this.state = {
      isUploadingAvatar: false,
      isSettingPet: false,
      tab: 0,
      username: '',
    };
    this.setUsername = this.setUsername.bind(this);
    this.navigateToLogin = this.navigateToLogin.bind(this);
    this.navigateToSignup = this.navigateToSignup.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    // Check the users without username.
    if (
      nextProps.currentUser &&
      (!this.props.currentUser || (
        nextProps.currentUser._id !== this.props.currentUser._id &&
        !nextProps.currentUser.username
      ))) {
      this.setState({ isUploadingAvatar: true });
      this.avatar.bounceIn(800);
    }
    if (nextState.username && nextState.username !== this.state.username) {
      this.setState({ isSettingPet: true });
      this.avatar.fadeOut(400);
      this.petView.fadeIn(1500);
    }
  }

  navigateToSignup() {
    this.tabview.goToPage(1);
  }

  navigateToLogin() {
    this.tabview.goToPage(0);
  }

  setUsername(username) {
    this.setState({ username })
  }

  render() {
    const { isUploadingAvatar, isSettingPet, tab } = this.state;
    const { currentUser, isLoggingIn } = this.props;

    const text = tab === 0
      ? 'Sign up with your email!'
      : 'Already have account?';

    const navigate = tab === 0
      ? this.navigateToSignup
      : this.navigateToLogin;

    return (
      <KeyboardAwareScrollView scrollEnabled={false} >
        <View style={styles.container}>
          <LinearGradient
            colors={['#e63460', '#e6535a']}
            style={[styles.overlay, {
              zIndex: isUploadingAvatar ? 1 : isSettingPet ? 2 : 0
            }]}
          />
          <Animatable.View
            style={[styles.overlay, {
              zIndex: isUploadingAvatar ? 2 : -1
            }]}
            ref={avatar => this.avatar = avatar}
          >
            <Avatar setUsername={this.setUsername} />
          </Animatable.View>
          <Animatable.View
            style={[styles.overlay, {
              zIndex: isSettingPet ? 3 : -1
            }]}
            ref={petView => this.petView = petView}
          >
            <Pet username={this.state.username} />
          </Animatable.View>
          <View style={styles.titleContainer} >
            <Image
              source={require('../../assets/img/logo.png')}
              style={{
                width: width <= 325 ? 90 : 110,
                height: width <= 325 ? 100 : 125,
                resizeMode: 'stretch'
              }}
            />
          </View>
          <ScrollableTabView
            prerenderingSiblingsNumber={1}
            tabBarPosition='overlayBottom'
            ref={tabview => this.tabview = tabview}
            renderTabBar={() => <View />}
            onChangeTab={index => this.setState({ tab: index.i })}
            style={{ backgroundColor: 'transparent', flex: 0 }}
          >
            <Login tabLabel={'login'} { ...this.props } />
            <Signup tabLabel={'signup'} { ...this.props } />
          </ScrollableTabView>
          <View style={styles.textContainer}>
            <Text style={styles.text}>- or -</Text>
          </View>
          <FBLoginButton
            style={styles.facebookButton}
            isLoading={isLoggingIn === 'facebook'}
            onLogin={
              (data) => this.props.dispatch({
                type: actions.LOGIN_USER,
                strategy: 'facebook',
                token: {
                  access_token: data.accessToken,
                }
              })
            }
          />
          <TouchableOpacity
            style={{ backgroundColor: 'transparent' }}
            onPress={() => navigate()}
          >
            <Text style={styles.signupText}>{ text }</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    flex: 1,
    alignSelf: 'stretch',
    width: null,
    height,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    zIndex: 1,
    height,
    width,
  },
  textContainer: {
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'transparent',
    height: height <= 480 ? 15 : 30,
  },
  text: {
    color: 'white',
    fontFamily: 'Lato',
    fontSize: height <= 480 ? 10 : 12,
  },
  signupText: {
    color: '#FFCC00',
    fontFamily: 'Lato',
    fontSize: height <= 480 ? 12 : 14,
    textAlign: 'center',
    marginTop: height <= 480 ? 20 : 30,
  },
  textInputContainer: {
    flexDirection: 'row',
    height: height <= 480 ? 30 : 40,
    marginHorizontal: height <= 480 ? 30 : 40,
    marginVertical: height <= 480 ? 10 : 12,
    backgroundColor: 'rgba(150, 150, 150, 0.3)',
    borderRadius: 4,
    alignItems: 'center',
  },
  textInput: {
    fontSize: height <= 480 ? 14 : 16,
    color: '#141823',
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
    marginTop: height >= 730 ? 100 : 50,
    marginBottom: width <= 325 ? 15 : 25,
    backgroundColor: 'transparent',
    alignItems:'center',
    justifyContent:'center'
  },
  title: {
    fontSize: height <= 480 ? 50 : 70,
    color: 'white',
    fontFamily: 'BerlinBold',
  },
});

const mapStateToProps = (state) => {
  return {
    isCheckingUser: state.session.isCheckingUser,
    isLoggingIn: state.session.isLoggingIn,
    currentUser: state.session.currentUser,
  };
};

export default connect(mapStateToProps)(Home);
