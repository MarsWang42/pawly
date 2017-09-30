import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import GL from 'gl-react';
import { Surface } from 'gl-react-native';
import ImageFilter from 'gl-react-imagefilters';
import RNFS from 'react-native-fs';
import {
  Sierra,
  Amaro,
  Earlybird
} from '../../components/Helpers/Filters';
import Carousel from '../../components/Helpers/Carousel';

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
    this.state = {
      selectedFilter: 0,
    };
    this.filters = [];
    this.renderFilter = this.renderFilter.bind(this);
    this.selectFilter = this.selectFilter.bind(this);
  }

  selectFilter() {
    const { pickPicture } = this.props;
    const config = {
      quality: 1,
      type: 'jpg',
      format: 'file',
      filePath: `${RNFS.DocumentDirectoryPath}/${(new Date()).getTime()}.jpg`,
    };

    this.filters[this.state.selectedFilter].captureFrame(config)
      .then(function(data){
        pickPicture(data);
      })
      .catch(function(err){
        console.log(err);
      });
  }

  renderFilter({ item, index }) {
    const { source, imageWidth, imageHeight } = this.props;
    const filterWidth = width - 40;
    if (item === 'Original') {
      return (
        <Surface
          width={filterWidth}
          height={filterWidth}
          pixelRatio={imageWidth / filterWidth}
          ref={filter => this.filters[index] = filter}
        >
          <GLFilter
            image={source}
          />
        </Surface>
      )
    }
    const Components = {
      'Earlybird': Earlybird,
      'Amaro': Amaro,
      'Sierra': Sierra,
    };
    const FilterComponent = Components[item];
    return (
      <Surface
        width={filterWidth}
        height={filterWidth}
        pixelRatio={imageWidth / filterWidth}
        ref={filter => this.filters[index] = filter}
      >
        <ImageFilter brightness={1.2}>
          <FilterComponent>
            <GLFilter
              image={source}
            />
          </FilterComponent>
        </ImageFilter>
      </Surface>
    );
  }

  render() {
    const { selectedFilter } = this.state;
    const filterWidth = width - 40;
    const filters = [
      'Original',
      'Earlybird',
      'Sierra',
      'Amaro',
    ];
    return (
      <View style={styles.container}>
        <Carousel
          sliderWidth={width}
          itemWidth={filterWidth}
          enableSnap
          containerCustomStyle={{ flexGrow: 0, marginTop: 10 }}
          onSnapToItem={(i) => this.setState({ selectedFilter: i })}
          ref={(carousel) => { this._carousel = carousel; }}
          data={filters}
          renderItem={this.renderFilter}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.text}>
            { filters[selectedFilter] }
          </Text>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this.selectFilter()}
          >
            <Text style={styles.buttonText}>
              Choose
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontFamily: 'Berlin-italic',
    fontSize: 22,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35,

    height: 30,
    width: 100,

    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: 'Lato-bold',
    fontSize: 18,
    color: 'gray',
  }
});
