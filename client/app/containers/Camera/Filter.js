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
import { Surface } from 'gl-react-native';

const { width, height } = Dimensions.get('window');

const shaders = GL.Shaders.create({
  filter: {
    frag: `
precision highp float;
varying vec2 uv;
uniform sampler2D image;
uniform float factor;

void main () {
  vec4 c = texture2D(image, uv);
  // Algorithm from Chapter 16 of OpenGL Shading Language
  const vec3 W = vec3(0.2125, 0.7154, 0.0721);
  gl_FragColor = vec4(mix(vec3(dot(c.rgb, W)), c.rgb, factor), c.a);
}
    `
  }
});

const GLFilter = GL.createComponent(
  ({ factor, image }) => (
    <GL.Node
      shader={shaders.filter}
      uniforms={{ factor, image }}
    />
  ), { displayName: 'Filter' });

export default class Filter extends Component {
  constructor() {
    super();
    this.state = {
      saturation: 1,
      brightness: 1,
      contrast: 1,
      hue: 0,
      sepia: 0,
      gray: 0,
      mixFactor: 0
    };
  }
  render() {
    return (
      <Surface width={width} height={width}>
        <GLFilter
          factor={this.state.saturation}
          image={this.props.source}
        />
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
