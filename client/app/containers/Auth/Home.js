import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import * as Animatable from 'react-native-animatable';
import * as actions from '../../reducers/session';
import FBLoginButton from '../../components/Auth/FBLoginButton';
import Login from './Login';
import Signup from './Signup';
import Avatar from './Avatar';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      isUploadingAvatar: false,
      tab: 0,
    };
    this.navigateToLogin = this.navigateToLogin.bind(this);
    this.navigateToSignup = this.navigateToSignup.bind(this);
  }

  componentWillReceiveProps(nextProps) {
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
  }

  navigateToSignup() {
    this.tabview.goToPage(1);
  }

  navigateToLogin() {
    this.tabview.goToPage(0);
  }

  render() {
    const { isUploadingAvatar, tab } = this.state;
    const { currentUser } = this.props;

    const text = tab === 0
      ? 'Sign up with your email!'
      : 'Already have account?';

    const navigate = tab === 0
      ? this.navigateToSignup
      : this.navigateToLogin;

    return (
      <View style={styles.container}>
        <View style={[styles.overlay, { backgroundColor: '#fff' }]} />
        <Animatable.View
          style={[styles.overlay, {
            zIndex: isUploadingAvatar ? 2 : -1
          }]}
          ref={avatar => this.avatar = avatar}
        >
          <Avatar />
        </Animatable.View>
        <View style={styles.titleContainer} >
          <Text style={styles.title} >PAWLY</Text>
        </View>
        <ScrollableTabView
          prerenderingSiblingsNumber={1}
          tabBarPosition='overlayBottom'
          ref={tabview => this.tabview = tabview}
          renderTabBar={() => <View />}
          onChangeTab={index => this.setState({ tab: index.i })}
          style={{ backgroundColor: '#fff', flex: 0 }}
        >
          <Login tabLabel={'login'} { ...this.props } />
          <Signup tabLabel={'signup'} { ...this.props } />
        </ScrollableTabView>
        <View style={styles.textContainer}>
          <Text style={styles.text}>- or -</Text>
        </View>
        <FBLoginButton
          style={styles.facebookButton}
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
        <TouchableOpacity onPress={() => navigate()} >
          <Text style={styles.signupText}>{ text }</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const { height, width } = Dimensions.get('window');

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
    height: height <= 480 ? 15 : 30,
  },
  text: {
    color: '#141823',
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
    marginTop: height >= 730 ? 125 : 75,
    marginBottom: width <= 325 ? 20 : 50,
    alignItems:'center',
    justifyContent:'center'
  },
  title: {
    fontSize: height <= 480 ? 50 : 70,
    color: '#CD594A',
    fontFamily: 'BerlinBold',
  },
});

const mapStateToProps = (state) => {
  return {
    isCheckingUser: state.session.isCheckingUser,
    currentUser: state.session.currentUser,
  };
};

export default connect(mapStateToProps)(Home);
