import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Camera from 'react-native-camera';

const { width, height } = Dimensions.get('window');

class AppCamera extends Component {
  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          style={styles.header}
          start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
          colors={['#ECE9E6', '#ffffff']}
        >
          <Text style={styles.title}>Camera</Text>
        </LinearGradient>
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
  header: {
    height: 50,
    paddingTop: 15,
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
});

export default connect(mapStateToProps)(AppCamera);
