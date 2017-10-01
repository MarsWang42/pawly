import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Animated,
  Dimensions,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import MapView from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import MapPin from '../../components/Map/MapPin';
import * as sessionActions from '../../reducers/session';
import * as pictureActions from '../../reducers/picture';
import Carousel from '../../components/Helpers/Carousel';
import PictureCard from './PictureCard';

const { width, height } = Dimensions.get('window');

class Home extends Component {
  constructor() {
    super();
    this.state = {
      opacityAnim: new Animated.Value(0),
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.1500,
        longitudeDelta: 0.0800,
      },
      selectedPicture: undefined,
      selectedPictureId: -1,
    };
  }

  componentDidMount() {
    this._locationReceived = false;
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      this.getInitialAndroid23Location();
    } else {
      this.getInitialLocation();
    }
  }

  componentWillReceiveProps(nextProps) {
    // Update the center of the location
    if (nextProps.currentLocation !== this.props.currentLocation && !this.updatedLocation) {
      this.setState({
        region: {
          longitude: nextProps.currentLocation.coords.longitude,
          latitude: nextProps.currentLocation.coords.latitude,
          latitudeDelta: 0.1500,
          longitudeDelta: 0.0800,
        }
      });
      this.updatedLocation = true;
    }
  }

  getInitialAndroid23Location = async() => {
    try {
      // Asking for permission, then get location.
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Location',
          'message': 'Access to your location ' +
                    'for some reason.'
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getInitialLocation();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  getInitialLocation = () => {
    // Getting Geolocation data.
    this.setState({ isFetchingLocation: true });
    navigator.geolocation.getCurrentPosition(
      // Once get current location, fetch dishes and restaurants
      (position) => {
        this.setState({
          isLocationAuthorized: true,
          isFetchingLocation: false,
        });
        this.props.dispatch({
          type: sessionActions.SET_LOCATION_AUTH,
          isLocationAuthed: true,
        });
        this.props.dispatch({
          type: sessionActions.SET_CURRENT_LOCATION,
          loc: position,
        });
        this.props.dispatch({
          type: pictureActions.FETCH_NEARBY,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          radius: 10,
          token: this.props.currentUser.accessToken,
        });
      },
      (error) => this.setState({
        isLocationAuthorized: false,
        isFetchingLocation: false,
        fetchLocationError: true,
      }),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.props.dispatch({
        type: sessionActions.SET_CURRENT_LOCATION,
        loc: position
      });
    });
  };

  selectPicture(picture, i) {
    this.setState({ selectedPicture: picture, selectedPictureId: i });
    this.isSelecting = true;
    Animated.spring(
      this.state.opacityAnim,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      },
    ).start(() => {
      this.isSelecting = false;
    });
    this.map.animateToRegion({
      longitude: picture.longitude,
      latitude: picture.latitude - 0.005,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.0111,
    });
  }

  deselectPicture(picture, i) {
    this.setState({ selectedPicture: undefined });
    this._carousel && this._carousel.snapToItem(-1);
    if (!this.isSelecting) {
      Animated.timing(
        this.state.opacityAnim,
        {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        },
      ).start(() => this.setState({
        selectedPictureId: -1,
        selectedPicture: null,
      }) );
    }
  }

  renderMarkers() {
    const {
      nearbyList,
      currentLocation,
      mainTab,
    } = this.props;
    const markers = nearbyList &&
      nearbyList.map((picture) => ({
        latlng: {
          latitude: picture.latitude,
          longitude: picture.longitude,
        },
        key: picture.pictureId,
        data: picture,
    }));

    return  markers && markers.map((marker, i) => (
      <MapView.Marker
        coordinate={marker.latlng}
        key={marker.key}
        style={{
          zIndex:  this.state.selectedPictureId === i ? 100 : 0
        }}
        onPress={(e) => {
          e.preventDefault();
          e.stopPropagation();
          this.selectPicture(marker.data, i);
          this._carousel && this._carousel.snapToItem(i);
        }}
      >
        <MapPin
          data={marker.data}
          isSelected={ this.state.selectedPicture === i }
        />
      </MapView.Marker>
    ));
  }

  renderPicture({ item, index }) {
    return (
      <TouchableOpacity>
        <PictureCard data={item} />
      </TouchableOpacity>
    )
  }

  render() {
    const { nearbyList } = this.props;
    const { region, selectedPicture, selectedPictureId, opacityAnim } = this.state;
    const cardWidth = width - 30;
    return (
      <View style={styles.container}>
        <LinearGradient
          style={styles.header}
          start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
          colors={['#ECE9E6', '#ffffff']}
        >
          <Text style={styles.title}>Pawly Map</Text>
        </LinearGradient>
        { nearbyList && (
          <Animated.View
            style={[styles.cardContainer, {
              opacity: opacityAnim,
              bottom: selectedPictureId === -1 ? -300 : 60,
            }]}
          >
            <Carousel
              sliderWidth={width}
              itemWidth={cardWidth}
              enableSnap
              onSnapToItem={(i) => this.selectPicture(nearbyList[i], i)}
              ref={(carousel) => { this._carousel = carousel; }}
              data={nearbyList}
              renderItem={this.renderPicture}
            />
          </Animated.View>
        )}
        <View style={styles.container}>
          <MapView
            style={styles.map}
            region={region}
            pitchEnabled={false}
            ref={map => this.map = map}
            onRegionChange={region => this.setState({ region })}
            onPress={() => this.deselectPicture()}
          >
            { nearbyList && this.renderMarkers() }
          </MapView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 4,
  },
  icon: {
    marginRight: (Platform.OS === 'ios') ? 40 : 20,
    marginTop: -2,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    backgroundColor: '#e2e2e2',
    height: 55,
    paddingTop: 17,
    alignItems:'center',
    justifyContent:'center'
  },
  title: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Berlin Bold',
    letterSpacing: 1,
    fontWeight: '600',
    backgroundColor: 'transparent',
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
    currentLocation: state.session.currentLocation,
    nearbyList: state.picture.nearbyList.toJS(),
  };
};


export default connect(mapStateToProps)(Home);
