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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';
import PictureCard from '../Main/PictureCard';
import UserList from '../Shared/UserList';
import SearchBar from '../../components/Helpers/SearchBar';
import * as userActions from '../../reducers/user';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

class Home extends Component {
  constructor() {
    super();
    this.state = {
      scrollY: new Animated.Value(0),
      isUserListShow: false,
    };
    this.focusSearchBar = this.focusSearchBar.bind(this);
    this.cancelSearchBar = this.cancelSearchBar.bind(this);
    this.searchUsers = this.searchUsers.bind(this);
  }

  focusSearchBar() {
    this.setState({ isUserListShow: true });
  }

  cancelSearchBar() {
    this.setState({ isUserListShow: false });
  }

  searchUsers(keyword) {
    if (keyword) {
      this.props.dispatch({
        type: userActions.SEARCH_USERS,
        keyword,
        token: this.props.currentUser.accessToken,
      });
    } else {
      this.props.dispatch({
        type: userActions.CLEAR_SEARCH_USERS,
      });
    }
  }

  render() {
    const { isLoading, followingList, userList, dispatch } = this.props;
    const { isUserListShow } = this.state;

    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });

    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });
    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 75],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <SearchBar
            ref={o => this.searchBar = o}
            isLoading={isLoading}
            onFocus={this.focusSearchBar}
            onCancel={this.cancelSearchBar}
            onSearch={this.searchUsers}
            onChangeText={_.debounce(this.searchUsers, 200)}
            onDelete={() => dispatch({ type: userActions.CLEAR_SEARCH_USERS })}
          />
        </View>
        <View style={styles.container}>
          { isUserListShow && (
            <TouchableOpacity
              style={styles.userList}
              activeOpacity={1}
              onPress={this.searchBar.onCancel}
            >
              <UserList
                userList={userList.toJS()}
                onPressUser={(user) => {
                  this.props.dispatch({
                    type: userActions.FETCH_USER_DETAIL,
                    id: user.id,
                    token: this.props.currentUser.accessToken,
                  });
                  this.props.navigation.navigate('DiscoverUser', {
                    userId: user.id,
                    view: 'Discover',
                  });
                }}
              />
            </TouchableOpacity>
          ) }
          <AnimatedLinearGradient
            style={[
              styles.header,
              { transform: [{ translateY: headerTranslate }] },
            ]}
            start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
            colors={['#fc4a1a', '#f7b733']}
          >
            <AnimatedLinearGradient
              start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
              colors={['#cb2d3e', '#ef473a']}
              style={[
                styles.backgroundImage,
                {
                  opacity: imageOpacity,
                  transform: [{ translateY: imageTranslate }],
                },
              ]}
            >
              <Icon
                size={ 40 }
                style={{ marginTop: 5, backgroundColor: 'transparent', textAlign: 'center' }}
                name={'fire'}
                color={'#f7b733'}
              />
              <Text style={styles.title}>popular</Text>
            </AnimatedLinearGradient>
          </AnimatedLinearGradient>
          <Animated.ScrollView
            style={{ flex: 1 }}
            scrollEventThrottle={1}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: {y: this.state.scrollY } } }],
              { useNativeDriver: true },
            )}
            ref={o => { this.scrollView = o && o._component; }}
          >
            <View style={styles.scrollViewContent}>
              { followingList.toJS().map((item) => (
                <PictureCard data={item} key={item.pictureId} />
              )) }
            </View>
          </Animated.ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    paddingTop: 20,
    zIndex: 3,
    backgroundColor: 'white',
  },
  userList: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 4,
    backgroundColor: 'white',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: 'grey',
  },
  userAvatar: {
    height: 40,
    width: 40,
    borderRadius: 4,
    marginRight: 5,
    overflow: 'hidden',
    backgroundColor: '#ececec'
  },
  username: {
    fontFamily: 'Lato',
  },
  petContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  petAvatar: {
    height: 15,
    width: 15,
    borderRadius: 7,
    overflow: 'hidden',
  },
  petName: {
    fontFamily: 'Lato-Italic',
    fontSize: 12,
    color: 'gray',
    backgroundColor: 'transparent',
    marginLeft: 5
  },
  icon: {
    marginLeft: (Platform.OS === 'ios') ? 35 : 15,
    marginTop: 2,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 1,
    height: HEADER_MAX_HEIGHT,
  },
  backgroundImage: {
    position: 'absolute',
    paddingTop: 55,
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
  },
  titleBar: {
    position: 'absolute',
    alignItems: 'center',
    paddingTop: 35,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: 'transparent',
    height: HEADER_MIN_HEIGHT,
  },
  title: {
    fontFamily: 'BerlinBold',
    fontSize: 40,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
    marginBottom: 28,
  },
});

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
    followingList: state.picture.followingList,
    userList: state.user.userList,
    isLoading: state.user.isSearchingUsers,
  };
};


export default connect(mapStateToProps)(Home);
