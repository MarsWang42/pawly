import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Animated,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PictureCard from '../Main/PictureCard';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as sessionActions from '../../reducers/session';
import * as pictureActions from '../../reducers/picture';

const HEADER_MAX_HEIGHT = 270;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

function ucfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      scrollY: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    this.props.dispatch({
      type: pictureActions.FETCH_USER_DETAIL,
      id: currentUser.id,
      token: currentUser.accessToken,
      currentUser: true,
    });
  }

  renderPets() {
    const { currentUserDetail } = this.props;
    const content = currentUserDetail.pets.slice(0, 2).map(pet => {
      const petImageSource = pet.avatar.url ? { uri: pet.avatar.url }
        : require('../../assets/img/pet.png');
      return (
        <View style={styles.petContainer} key={pet.id}>
          <Image source={petImageSource} style={styles.petAvatar} />
          <Text style={styles.petName}>{ pet.name }</Text>
          <Text style={styles.petType}>{ ucfirst(pet.type) }</Text>
        </View>
      );
    });
    if (currentUserDetail.pets.length >= 3) {
      content.push(
        <Text key={'...'} style={[styles.petType, { fontSize: 10 }]}>...</Text>
      );
    }
    return content;
  }

  render() {
    const { currentUserDetail, dispatch } = this.props;
    let avatarUrl = currentUserDetail && currentUserDetail.avatar.url;
    if (!avatarUrl && currentUserDetail && currentUserDetail.facebookId) {
      avatarUrl = `https://graph.facebook.com/${currentUserDetail.facebookId}/picture?width=9999`;
    }
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

    const titleScale = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0.8],
      extrapolate: 'clamp',
    });
    const titleTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, -8],
      extrapolate: 'clamp',
    });

    const imageSource = avatarUrl ? { uri: avatarUrl }
      : require('../../assets/img/user-default.png');

    if (currentUserDetail) {
      return (
        <View style={styles.container}>
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
            <Text style={styles.title}>{ currentUserDetail.username }</Text>
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
              <View style={[styles.infoContainer, { justifyContent: 'center' }]}>
                <Image source={imageSource} style={styles.userAvatar} />
                <View style={{ alignItems: 'center', width: 200 }}>
                  <Text style={styles.petTitle}>
                    Pets
                  </Text>
                  { this.renderPets() }
                  <View style={styles.petButtons}>
                    <TouchableOpacity style={[styles.petButton, { borderColor: '#aeb0ff' }]}>
                      <Text style={[styles.petButtonText, { color: '#aeb0ff' }]}>
                        See all...
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.petButton, { borderColor: '#aeffe1' }]}>
                      <Text style={[styles.petButtonText, { color: '#aeffe1' }]}>
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.infoContainer}>
                <View style={{ alignItems: 'center', width: 100 }}>
                  <Text style={styles.infoNumber}>1</Text>
                  <Text style={styles.infoTitle}>Follower</Text>
                </View>
                <View style={{ alignItems: 'center', width: 100 }}>
                  <Text style={styles.infoNumber}>1</Text>
                  <Text style={styles.infoTitle}>Following</Text>
                </View>
                <View style={{ alignItems: 'center', width: 100 }}>
                  <Text style={styles.infoNumber}>1</Text>
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
              { currentUserDetail.pictures.map((item) => (
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
  userAvatar: {
    height: 120,
    width: 120,
    borderRadius: 60,
    overflow: 'hidden',
    margin: 20,
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
    width: 70,
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 4,
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
    currentUserDetail: state.picture.currentUserDetail &&
      state.picture.currentUserDetail.toJS(),
  };
};


export default connect(mapStateToProps)(Profile);
