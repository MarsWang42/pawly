import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImageResizer from 'react-native-image-resizer';
import {
  CameraRoll,
  Dimensions,
  Image,
  ImageEditor,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Camera from 'react-native-camera';
import Filter from './Filter';

const { width, height } = Dimensions.get('window');

class AppCamera extends Component {
  constructor() {
    super();
    this.state = {
      path: undefined,
      imageWidth: width,
      imageHeight: width,
      photos: [],
      lastCursor: null,
      noMorePhotos: false,
      loadingMore: false,
      tab: 0,
    };
    this.takePicture = this.takePicture.bind(this);
  }

  componentDidMount() {
    this.tryPhotoLoad();
    if (Platform === 'ios') {
      Camera.checkVideoAuthorizationStatus().then(
        (response) => { this.setState({ cameraAuthorized: response }); }
      );
    } else {
      this.setState({ cameraAuthorized: true });
    }
  }

  takePicture() {
    const options = {
      jpegQuality: 20,
      // metadata: {
      //   location: this.props.loc,
      // }
    };
    this.camera.capture(options)
      .then((data) => {
        this.pickPicture(data.path);
      }).catch(err => console.error(err));
  }

  pickPicture(uri) {
    ImageResizer.createResizedImage(uri, 1000, 1000, 'JPEG', 80).then((response) => {
      Image.getSize(
        response.uri,
        (imageWidth, imageHeight) => {
          const cropData = {
              offset: { x: 0, y: (imageHeight - imageWidth) / 2 },
              size: { width: imageWidth, height: imageWidth},
          //  displaySize:{ width:20, height:20}, THESE 2 ARE OPTIONAL.
          //  resizeMode:'contain',
          };
          ImageEditor.cropImage(
            response.uri,
            cropData,
            (successURI) => {
              this.setState({
                path: successURI,
                imageWidth,
                imageHeight,
              });
            },
            (error) => console.log('cropImage,',error)
          );
        },
        error => console.log(error),
      );
    }).catch((err) => console.error(err));
  }

  tryPhotoLoad() {
    if (!this.state.loadingMore) {
      this.setState({ loadingMore: true }, () => { this.loadPhotos(); });
    }
  }

  loadPhotos() {
    const fetchParams = {
      first: 100,
      assetType: 'Photos',
    };

    if (this.state.lastCursor) {
      fetchParams.after = this.state.lastCursor;
    }

    CameraRoll.getPhotos(fetchParams).then((data) => {
      this.appendAssets(data);
      this.setState({ cameraRollAuthorized: true });
    }).catch((e) => {
      this.setState({ cameraRollAuthorizationError: true });
    });
  }

  appendAssets(data) {
    const photos = data.edges;
    const nextState = {
      loadingMore: false,
    };

    if (!data.page_info.has_next_page) {
      nextState.noMorePhotos = true;
    }

    if (photos.length > 0) {
      nextState.lastCursor = data.page_info.end_cursor;
      nextState.photos = this.state.photos.concat(photos);
    }

    this.setState(nextState);
  }

  endReached() {
    if (!this.state.noMorePhotos) {
      this.tryPhotoLoad();
    }
  }

  renderImage() {
    const { path, imageHeight, imageWidth } = this.state;
    return (
      <Filter
        source={path}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
      />
    );
  }

  renderCamera() {
    return (
      <ScrollView
        contentContainerStyle={styles.scrollView}
        onScroll={e => {
          let currentHeight = e.nativeEvent.contentSize.height,
            offset = e.nativeEvent.contentOffset.y;
          if ( height + offset >= currentHeight / 2 ) {
            this.endReached();
          }
        }}
      >
        <View style={styles.cameraContainer}>
          <Camera
            defaultOnFocusComponent
            captureTarget={Camera.constants.CaptureTarget.disk}
            captureQuality={'high'}
            style={styles.camera}
            aspect={Camera.constants.Aspect.fill}
            ref={(cam) => {
              this.camera = cam;
            }}
          />
          <TouchableOpacity style={styles.captureButton} onPress={this.takePicture}>
            <Icon
              name={ 'circle-o' }
              color={ 'rgba(255, 255, 255, 0.8)' }
              size={40}
              style={{ textAlign: 'center' }}
            />
          </TouchableOpacity>
        </View>
        {
          this.state.photos.map((p, i) => {
            return (
              <TouchableOpacity
                style={{opacity: i === this.state.index ? 0.5 : 1}}
                key={i}
                underlayColor='transparent'
                onPress={() => this.pickPicture(p.node.image.uri, p.node.location)}
              >
                <Image
                  style={{
                    width: width / 3,
                    height: width / 3,
                  }}
                  source={{uri: p.node.image.uri}}
                />
              </TouchableOpacity>
            );
          })
        }
      </ScrollView>
    );
  }

  render() {
    const { path, tab } = this.state;
    return (
      <View style={styles.container}>
        <LinearGradient
          style={styles.header}
          start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
          colors={['#ECE9E6', '#ffffff']}
        >
          <Text style={styles.title}>
            { tab === 0 ? 'Camera' : 'Camera Roll' }
          </Text>
        </LinearGradient>
        { !path && this.renderCamera() }
        { path && this.renderImage() }
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    height: width,
    width,
  },
  image: {
    height: width,
    width,
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  header: {
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
  cameraContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    position: 'absolute',
    bottom: 10,
    left: width / 2 - 20,
    zIndex: 10,
    backgroundColor: 'transparent',
  }
});

export default connect(mapStateToProps)(AppCamera);
