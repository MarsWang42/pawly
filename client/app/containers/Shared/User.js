import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import PictureCard from '../Main/PictureCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconM from 'react-native-vector-icons/MaterialIcons';
import * as sessionActions from '../../reducers/session';
import * as userActions from '../../reducers/user';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = width <= 325 ? 250 : 270;
const HEADER_MIN_HEIGHT = width <= 325 ? 50 : 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatableTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity);

function ucfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class User extends Component {
  constructor() {
    super();
    this.state = {
      scrollY: new Animated.Value(0),
    };
  }

  followUser(id) {
    this.props.dispatch({
      type: userActions.TOGGLE_USER_FOLLOW,
      toggleType: 'follow',
      userId: id,
      callback: () => {
        this.follow.pulse();
      },
      token: this.props.currentUser.accessToken,
    });
  }

  unfollowUser(id) {
    this.props.dispatch({
      type: userActions.TOGGLE_USER_FOLLOW,
      toggleType: 'unfollow',
      userId: id,
      token: this.props.currentUser.accessToken,
    });
  }

  renderPets() {
    const { userDetails, userId, view } = this.props;
    const userDetail = userDetails[userId];
    const content = userDetail.pets.slice(0, 2).map(pet => {
      const petImageSource = pet.avatar ? { uri: pet.avatar }
        : require('../../assets/img/pet.png');
      return (
        <View style={styles.petContainer} key={pet.id}>
          <Image source={petImageSource} style={styles.petAvatar} />
          <Text style={styles.petName}>{ pet.name }</Text>
          <Text style={styles.petType}>{ ucfirst(pet.type) }</Text>
        </View>
      );
    });
    if (userDetail.pets.length >= 3) {
      content.push(
        <Text key={'...'} style={[styles.petType, { fontSize: 10 }]}>...</Text>
      );
    }
    return content;
  }

  render() {
    const { view, userDetails, dispatch, userId, currentUser, navigation } = this.props;
    const userDetail = userDetails[userId];
    const isCurrentUser = userDetail ? userDetail.id === currentUser.id : false;
    let avatarUrl = userDetail && userDetail.avatar;
    if (!avatarUrl && userDetail && userDetail.facebookId) {
      avatarUrl = `https://graph.facebook.com/${userDetail.facebookId}/picture?width=9999`;
    }
    const imageSource = avatarUrl ? { uri: avatarUrl }
      : require('../../assets/img/user-default.png');

    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });

    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 0.2, 0],
      extrapolate: 'clamp',
    });
    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 75],
      extrapolate: 'clamp',
    });

    const backTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, width <= 325 ? -15 : -10],
      extrapolate: 'clamp',
    });

    const titleScale = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, width <= 325 ? 0.7 : 0.8],
      extrapolate: 'clamp',
    });
    const titleTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 3, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, width <= 325 ? -10 : -8],
      extrapolate: 'clamp',
    });

    if (userDetail) {
      return (
        <View style={styles.container}>
          <AnimatedTouchableOpacity
            style={[
              styles.back,
              { transform: [{ translateY: backTranslate }] },
            ]}
            onPress={() => navigation.goBack()}
          >
            <IconM name={'arrow-back'} size={24} color={'white'} />
          </AnimatedTouchableOpacity>
          <Animated.View
            style={[
              styles.titleBar,
              {
                transform: [
                  { scale: titleScale },
                  { translateY: titleTranslate },
                ],
              },
            ]}
          >
            <Text style={styles.title}>{ userDetail.username }</Text>
          </Animated.View>
          <AnimatedLinearGradient
            style={[
              styles.header,
              { transform: [{ translateY: headerTranslate }] },
            ]}
            start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
            colors={['#5C258D', '#4389A2']}
          >
            <AnimatedLinearGradient
              start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
              colors={['#4568DC', '#B06AB3']}
              style={[
                styles.backgroundImage,
                {
                  opacity: imageOpacity,
                  transform: [{ translateY: imageTranslate }],
                },
              ]}
            >
              <View style={[styles.petsContainer, { justifyContent: 'center' }]}>
                <Image source={imageSource} style={styles.userAvatar} />
                <View style={{ alignItems: 'center', width: 200 }}>
                  <Text style={styles.petTitle}>
                    Pets
                  </Text>
                  { this.renderPets() }
                  <View style={styles.petButtons}>
                    <TouchableOpacity
                      style={[styles.petButton,
                        { width: isCurrentUser ? 160 : 80, borderColor: '#ffe1af' }
                      ]}
                    >
                      <Text style={[styles.petButtonText, { color: '#ffe1af' }]}>
                        See all...
                      </Text>
                    </TouchableOpacity>
                    { !isCurrentUser && (
                      <AnimatableTouchableOpacity
                        style={[styles.petButton, { borderColor: '#aeffe1' }]}
                        ref={follow => this.follow = follow}
                        onPress={() => {
                          if (!userDetail.followed) {
                            this.followUser(userDetail.id);
                          } else {
                            this.unfollowUser(userDetail.id);
                          }
                        }}
                      >
                        { userDetail.followed &&
                          <Icon
                            name={'checkbox-marked-outline'}
                            size={14}
                            color={'#aeffe1'}
                            style={{ marginRight: 3 }}
                          />
                        }
                        <Text style={[styles.petButtonText, { color: '#aeffe1' }]}>
                          { userDetail.followed ? 'Following' : 'Follow' }
                        </Text>
                      </AnimatableTouchableOpacity>
                    ) }
                  </View>
                </View>
              </View>
              <View style={styles.infoContainer}>
                <TouchableOpacity
                  disabled={!userDetail || (userDetail && userDetail.followingLength === 0)}
                  onPress={() => {
                    dispatch({
                      type: userActions.FETCH_FOLLOWER_LIST,
                      id: currentUser.id,
                      token: currentUser.accessToken,
                    });
                    navigation.navigate(`${view}FollowerList`, { userId: currentUser.id, view });
                  }}
                  style={{ alignItems: 'center', width: 100 }}
                >
                  <Text style={styles.infoNumber}>
                    { userDetail ? userDetail.followerLength : '-' }
                  </Text>
                  <Text style={styles.infoTitle}>Follower</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!userDetail || (userDetail && userDetail.followingLength === 0)}
                  onPress={() => {
                    dispatch({
                      type: userActions.FETCH_FOLLOWING_LIST,
                      id: currentUser.id,
                      token: currentUser.accessToken,
                    });
                    navigation.navigate(`${view}FollowingList`, { userId: currentUser.id, view });
                  }}
                  style={{ alignItems: 'center', width: 100 }}
                >
                  <Text style={styles.infoNumber}>
                    { userDetail ? userDetail.followingLength : '-' }
                  </Text>
                  <Text style={styles.infoTitle}>Following</Text>
                </TouchableOpacity>
                <View style={{ alignItems: 'center', width: 100 }}>
                  <Text style={styles.infoNumber}>
                    { userDetail ? userDetail.pictures.length : '-' }
                  </Text>
                  <Text style={styles.infoTitle}>Post</Text>
                </View>
              </View>
            </AnimatedLinearGradient>
          </AnimatedLinearGradient>
          <Animated.ScrollView
            style={{ flex: 1 }}
            scrollEventThrottle={1}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: {y: this.state.scrollY } } }],
              { useNativeDriver: true },
            )}
          >
            <View style={styles.scrollViewContent}>
              { userDetail.pictures.map((item) => (
                <PictureCard data={item} key={item.pictureId} />
              )) }
            </View>
          </Animated.ScrollView>
          <TouchableOpacity onPress={() => dispatch({ type: sessionActions.LOGOUT_USER })}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#03A9F4',
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
  back: {
    position: 'absolute',
    top: 35,
    left: 25,
    zIndex: 10,
    width: 80,
    backgroundColor: 'transparent',
  },
  userAvatar: {
    height: width <= 325 ? 100 : 120,
    width: width <= 325 ? 100 : 120,
    borderRadius: width <= 325 ? 50 : 60,
    overflow: 'hidden',
    backgroundColor: 'white'
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
    marginBottom: 28,
  },
  icon: {
    marginTop: -1,
  },
  title: {
    fontFamily: 'Berlin',
    fontSize: 25,
    color: 'white',
    backgroundColor: 'transparent'
  },
  titleContainer: {
    backgroundColor:'#2e2e2e',
    padding: 12,
    alignItems:'center',
    justifyContent:'center'
  },
  petsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 20,
    height: width <= 325 ? 130 : 150,
  },
  petContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 2,
  },
  petTitle: {
    fontFamily: 'Lato-italic',
    fontSize: 20,
    marginBottom: 5,
    color: '#fff5c3',
    backgroundColor: 'transparent'
  },
  petAvatar: {
    height: 20,
    width: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  petName: {
    fontFamily: 'Lato',
    color: 'white',
    backgroundColor: 'transparent',
    marginHorizontal: 15
  },
  petType: {
    fontFamily: 'Lato-italic',
    color: '#c9c9c9',
    backgroundColor: 'transparent',
  },
  petButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 5,
  },
  petButton: {
    flexDirection: 'row',
    width: 80,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 4,
    marginHorizontal: 10,
  },
  petButtonText: {
    fontFamily: 'Lato',
    fontSize: 12,
    backgroundColor: 'transparent'
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingTop: 20,
  },
  infoTitle: {
    fontFamily: 'Lato',
    fontSize: 12,
    color: 'white',
    backgroundColor: 'transparent'
  },
  infoNumber: {
    fontFamily: 'Lato-bold',
    fontSize: 16,
    color: 'white',
    backgroundColor: 'transparent'
  },
  bgImg: {
    flex: 1,
    width: '100%',
    alignItems:'center',
    justifyContent:'center'
  },
});

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
    userDetails: state.user.userDetails.toJS(),
  };
};


export default connect(mapStateToProps)(User);
