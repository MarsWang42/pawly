import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UserList from '../Shared/UserList';
import SearchBar from '../../components/Helpers/SearchBar';
import * as userActions from '../../reducers/user';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

class FollowerList extends Component {
  render() {
    const { userDetails, userId, navigation, dispatch, view } = this.props;

    const followerList = userDetails[userId].followers;

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Icon name={'arrow-back'} size={24} color={'black'} />
        </TouchableOpacity>
        <LinearGradient
          style={styles.header}
          start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
          colors={['#ECE9E6', '#ffffff']}
        >
          <Text style={styles.title}>
            Followers
          </Text>
        </LinearGradient>
        <UserList
          userList={followerList}
          onPressUser={(user) => {
            dispatch({
              type: userActions.FETCH_USER_DETAIL,
              id: user.id,
              token: this.props.currentUser.accessToken,
            });
            navigation.navigate(`${view}User`, { userId: user.id, view });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  back: {
    position: 'absolute',
    top: 26,
    left: 20,
    zIndex: 10,
    width: 80,
    backgroundColor: 'transparent',
  },
  header: {
    height: 60,
    paddingTop: 19,
    alignItems:'center',
    justifyContent:'center'
  },
  title: {
    color: 'black',
    fontFamily: 'Berlin Bold',
    letterSpacing: 1,
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
});

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
    userDetails: state.user.userDetails.toJS(),
  };
};


export default connect(mapStateToProps)(FollowerList);
