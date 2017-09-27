import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImageResizer from 'react-native-image-resizer';
import {
  Dimensions,
  Image,
  ImageEditor,
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
    };
    this.takePicture = this.takePicture.bind(this);
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
        ImageResizer.createResizedImage(data.path, 1000, 1000, 'JPEG', 80).then((response) => {
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
                  this.setState({ path: successURI });
                },
                (error) => console.log('cropImage,',error)
              )
            },
            error => console.log(error),
          )
        }).catch((err) => console.error(err));
      }).catch(err => console.error(err));
  }

  renderImage() {
    return (
      <Filter source={this.state.path} />
    );
  }

  renderCamera() {
    return (
      <View style={styles.container}>
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.takePicture}>
            <Icon
              name={ 'circle-o' }
              color={ 'white' }
              size={this.windowHeight <= 480 ? 55 : 85}
              style={{ textAlign: 'center' }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    const { path } = this.state;
    return (
      <View style={styles.container}>
        <LinearGradient
          style={styles.header}
          start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
          colors={['#ECE9E6', '#ffffff']}
        >
          <Text style={styles.title}>Camera</Text>
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
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default connect(mapStateToProps)(AppCamera);
