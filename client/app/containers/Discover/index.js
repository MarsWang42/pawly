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
import Icon from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import PictureCard from '../Main/PictureCard';
import SearchBar from '../../components/Helpers/SearchBar';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

class Discover extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon
        style={styles.icon}
        size={ 28 }
        name={ 'ios-search' }
        color={ tintColor }
      />
    )
  };

  constructor() {
    super();
    this.state = {
      scrollY: new Animated.Value(0),
    };
  }

  render() {
    const { followingList } = this.props;

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
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 0.6],
      extrapolate: 'clamp',
    });
    const titleTranslate = this.state.scrollY.interpolate({
      inputRange: [0, 2 * HEADER_SCROLL_DISTANCE / 3, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, -40],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <SearchBar
            ref='search_box'
          />
        </View>
        <View style={styles.container}>
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
              <IconM
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
  };
};


export default connect(mapStateToProps)(Discover);
