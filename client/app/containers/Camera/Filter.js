import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import GL from 'gl-react';
import { Nashville } from "../../components/Helpers/Filters";
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { Surface } from 'gl-react-native';

const { width, height } = Dimensions.get('window');

const shaders = GL.Shaders.create({
  filter: {
    frag: `
precision highp float;
varying vec2 uv;
uniform sampler2D image;

void main () {
  gl_FragColor = texture2D(image, uv);
}
    `
  }
});

const GLFilter = GL.createComponent(
  ({ factor, image }) => (
    <GL.Node
      shader={shaders.filter}
      uniforms={{ image }}
    />
  ), { displayName: 'Filter' });

export default class Filter extends Component {
  constructor() {
    super();
  }

  render() {
    const { source, imageWidth, imageHeight } = this.props;
    return (
      <Surface
        width={width}
        height={parseInt(imageHeight / imageWidth * width, 10)}
        pixelRatio={imageWidth / width}
      >
        <Nashville>
          <GLFilter
            image={this.props.source}
            width={width}
            height={parseInt(imageHeight / imageWidth * width, 10)}
          />
        </Nashville>
      </Surface>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
