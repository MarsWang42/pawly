import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from 'react-native-blur';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as userActions from '../../reducers/user';
import * as pictureActions from '../../reducers/picture';

const { width, height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 180;
const HEADER_MIN_HEIGHT = width <= 325 ? 50 : 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

class Pet extends Component {
  constructor() {
    super();
    this.state = {
      scrollY: new Animated.Value(0),
    };
  }

  selectUser(id) {
    const { navigation, dispatch, currentUser, view } = this.props;
    dispatch({
      type: userActions.FETCH_USER_DETAIL,
      id: id,
      token: currentUser.accessToken,
    });
    navigation.navigate(`${view}User`, { userId: id, view });
  }

  openPictureDetail(id, data) {
    const { currentUser, dispatch, navigation, view } = this.props;
    dispatch({
      type: pictureActions.FETCH_PICTURE_DETAIL,
      id,
      token: currentUser.accessToken
    });
    navigation.navigate(`${view}PictureDetail`, { pictureId: id, view, data });
  }

  renderOwner() {
    const { petDetails, petId } = this.props;
    const petDetail = petDetails[petId];
    let avatarUrl = petDetail.owner.avatar;
    if (!avatarUrl && petDetail.owner.facebookId) {
      avatarUrl = `https://graph.facebook.com/${petDetail.owner.facebookId}/picture?width=9999`;
    }
    const userImageSource = avatarUrl ? { uri: avatarUrl }
      : require('../../assets/img/user-default.png');
    return (
      <TouchableOpacity
        style={styles.ownerInfo}
        onPress={() => this.selectUser(petDetail.owner.userId)}
      >
        <Image source={userImageSource} style={styles.userAvatar} />
        <Text
          style={{
            backgroundColor: 'transparent',
            fontFamily: 'Lato-italic',
            color: 'white',
            fontSize: 12
          }}
        >
          Owner:&nbsp;
        </Text>
        <Text style={{ backgroundColor: 'transparent', fontFamily: 'Lato', color: 'white', fontSize: 13 }}>
          { petDetail.owner.username }
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { petDetails, dispatch, petId, pet, view, currentUser, navigation } = this.props;
    let petDetailFetched = true;
    let petDetail = petDetails[petId];

    if (!petDetail) {
      petDetail = pet;
      petDetailFetched = false;
    }

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

    const petImageSource = petDetail.avatar ? { uri: petDetail.avatar }
      : require('../../assets/img/pet.png');

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Icon name={'arrow-back'} size={24} color={'white'} />
        </TouchableOpacity>
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
          <Text style={styles.title}>{ petDetail.name }</Text>
        </Animated.View>
        <AnimatedLinearGradient
          style={[
            styles.header,
            { transform: [{ translateY: headerTranslate }] },
          ]}
          start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
          colors={['#5C258D', '#4389A2']}
        >
          <Animated.View
            style={[
              styles.backgroundImage,
              {
                opacity: imageOpacity,
                transform: [{ translateY: imageTranslate }],
              },
            ]}
          >
            <Image
              source={petImageSource}
              style={styles.backgroundImage}
              ref={(img) => { this.backgroundImage = img; }}
            />
            <BlurView
              style={styles.blurView}
              viewRef={this.backgroundImage}
              blurType="light"
              blurAmount={10}
            />
            <Image source={petImageSource} style={styles.petAvatar} />
            { petDetailFetched && this.renderOwner() }
          </Animated.View>
        </AnimatedLinearGradient>
        { petDetailFetched && (
          <Animated.ScrollView
            style={{ flex: 1 }}
            scrollEventThrottle={1}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: {y: this.state.scrollY } } }],
              { useNativeDriver: true },
            )}
          >
            <View style={styles.scrollViewContent}>
              { petDetail.pictures.map((item) => (
                <TouchableOpacity
                  key={item.pictureId}
                  activeOpacity={0.8}
                  onPress={() => this.openPictureDetail(item.pictureId, item)}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: width / 3, height: width / 3 }}
                  />
                </TouchableOpacity>
              )) }
            </View>
          </Animated.ScrollView>
        ) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    marginBottom: 45,
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
    fontFamily: 'Berlin',
    fontSize: 25,
    color: 'white',
    backgroundColor: 'transparent'
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    width: 80,
    backgroundColor: 'transparent',
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
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    backgroundColor: 'lightgray',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 30,
  },
  ownerInfo: {
    position: 'absolute',
    right: 40,
    top: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
    marginBottom: 28,
    flexDirection: 'row',
  },
  icon: {
    marginLeft: (Platform.OS === 'ios') ? 40 : 20,
    marginTop: -2,
  },
  blurView: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0, right: 0,
  },
  infoContainer: {
    height: 120,
    width: '100%',
    alignItems:'center',
    justifyContent:'center'
  },
  petAvatar: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginTop: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  userAvatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
    margin: 5,
    overflow: 'hidden',
    backgroundColor: 'white'
  },
});

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
    petDetails: state.pet.petDetails.toJS(),
  };
};


export default connect(mapStateToProps)(Pet);
