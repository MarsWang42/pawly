import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import pluralize from 'pluralize';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProgressPie from 'react-native-progress/Pie';
import * as pictureActions from '../../reducers/picture';

const PLACE_HOLDER = 'https://images.pexels.com/photos/7720/night-animal-dog-pet.jpg?w=1260&h=750&auto=compress&cs=tinysrgb';
const { height, width } = Dimensions.get('window');
const AnimatableTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity);
const cardWidth = width - 30;

class PictureCard extends Component {
  constructor() {
    super();
    this.state = {
      imageWidth: width,
      imageHeight: width
    };
  }

  componentDidMount() {
    Image.getSize(
      this.props.data.image,
      (imageWidth, imageHeight) => {
        this.setState({ imageWidth, imageHeight })
      },
      error => console.log(error),
    )
  }

  likePic(id) {
    this.props.dispatch({
      type: pictureActions.TOGGLE_PICTURE_LIKE,
      toggleType: 'like',
      picId: id,
      callback: () => {
        this.like.rubberBand();
      },
      token: this.props.currentUser.accessToken,
    });
  }

  unlikePic(id) {
    this.props.dispatch({
      type: pictureActions.TOGGLE_PICTURE_LIKE,
      toggleType: 'unlike',
      picId: id,
      token: this.props.currentUser.accessToken,
    });
  }

  openPictureDetail(id) {
    const { currentUser, data, dispatch, navigation, view } = this.props;
    dispatch({
      type: pictureActions.FETCH_PICTURE_DETAIL,
      id,
      token: currentUser.accessToken
    });
    navigation.navigate(`${view}PictureDetail`, { pictureId: id, view, data });
  }

  render() {
    const { data } = this.props;
    const { imageWidth, imageHeight } = this.state;

    const pl = data.pets.length;

    let isRescue = false;
    for (let i = 0; i < pl; i++) {
      if (data.pets[i].isRescue) {
        isRescue = true;
        break;
      }
    }

    // Prioritize rescue pets.
    const petList = isRescue ? data.pets.sort((a, b) => {
      if (a.isRescue) {
        return -1;
      } else if (b.isRescue) {
        return 1;
      } else {
        return 0;
      }
    }) : data.pets;

    let petNames;
    if (pl >= 3) {
      petNames = `${petList[0].name}, ${petList[1].name} and ${pl - 2} others`;
    } else if (pl === 2) {
      petNames = `${petList[0].name} and ${petList[1].name}`;
    } else {
      petNames = petList[0].name;
    }

    const petImageSource = (url) => (
      url ? { uri: url } : require('../../assets/img/pet.png')
    );

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.container}
        onPress={() => this.openPictureDetail(data.pictureId)}
      >
        <View
          style={{ height: cardWidth * 2 / 3, width: cardWidth }}
        >
          <Image
            source={{ uri: data.image }}
            style={{ height: '100%', width: '100%', backgroundColor: 'grey' }}
          />
          <View style={styles.labelContainer}>
            <View style={styles.label}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AnimatableTouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    ref={like => this.like = like}
                    onPress={() => {
                      if (!data.liked) {
                        this.likePic(data.pictureId);
                      } else {
                        this.unlikePic(data.pictureId);
                      }
                    }}
                  >
                    <Icon
                      name={data.liked ? 'heart' : 'heart-outline'}
                      size={24}
                      color={'#e6535a'}
                      style={{ marginTop: 3 }}
                    />
                    <Text style={{ fontFamily: 'Lato', fontSize: 16, marginHorizontal: 5 }}>
                      { data.likerLength }
                    </Text>
                  </AnimatableTouchableOpacity>
                  <Icon name={'message-outline'} size={22} style={{ marginTop: 2, marginLeft: 5 }} />
                  <Text style={{ fontFamily: 'Lato', fontSize: 16, marginHorizontal: 5 }}>
                    { data.commentLength }
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.headerContainer}>
          { isRescue && (
            <View style={styles.rescueTriangle}/>
          ) }
          { isRescue && (
            <Text style={styles.rescueText}>R</Text>
          ) }
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={[styles.petAvatarContainer,
                { width: pl === 1 ? 60 : pl === 2 ? 70 : 80 }
              ]}
            >
              <Image
                style={[
                  styles.firstPetAvatar,
                  { borderColor: petList[0].isRescue ? '#9eff89' : 'white' }
                ]}
                source={petImageSource(petList[0].avatar)}
              />
              { petList[1] &&
                <Image
                  style={[
                    styles.secondPetAvatar,
                    { borderColor: petList[1].isRescue ? '#9eff89' : 'white' }
                  ]}
                  source={petImageSource(petList[1].avatar)}
                />
              }
              { petList[2] &&
                <Image
                  style={[
                    styles.thirdPetAvatar,
                    { borderColor: petList[2].isRescue ? '#9eff89' : 'white' }
                  ]}
                  source={petImageSource(petList[2].avatar)}
                />
              }
            </View>
            <View style={styles.petInfoContainer}>
              <Text style={styles.petName}>{ petNames }</Text>
              { data.place && (
                <View style={styles.locationContainer}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={styles.locationText}
                  >
                    At { data.place.name }
                  </Text>
                </View>
              ) }
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor:'#fff',
    flex: 0,
    width: cardWidth,
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  rescueTriangle: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
    width: 0,
    height: 0,
    borderTopWidth: 30,
    borderLeftWidth: 30,
    borderTopColor: '#3ce694',
    borderLeftColor: 'transparent',
  },
  rescueText: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 2,
    fontFamily: 'Berlin bold',
    color: 'white',
    backgroundColor: 'transparent',
  },
  petAvatarContainer: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  firstPetAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    position: 'absolute',
    top: 5,
    left: 10,
    zIndex: 3,
    borderWidth: 2,
    borderColor: 'white'
  },
  secondPetAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    position: 'absolute',
    top: 5,
    left: 20,
    zIndex: 2,
    borderWidth: 2,
    borderColor: 'white'
  },
  thirdPetAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    position: 'absolute',
    top: 5,
    left: 30,
    zIndex: 1,
    borderWidth: 2,
    borderColor: 'white'
  },
  petInfoContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  petName: {
    width: width - 120,
    fontFamily: 'Lato-Italic',
    fontSize: 14,
  },
  username: {
    fontFamily: 'Lato-Bold',
    fontSize: 12,
  },
  locationContainer: {
    backgroundColor: '#f4f4f4',
    width: 200,
    height: 15,
    borderRadius: 8,
    marginVertical: 3,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    fontFamily: 'Lato',
    fontSize: 11,
    color: 'grey',
  },
  likername: {
    fontFamily: 'Lato-Bold',
    fontSize: 13,
  },
  commentContainer: {
    marginLeft: 10,
    marginTop: 5,
  },
  time: {
    fontFamily: 'Lato',
    fontSize: 12,
    color: 'gray',
    marginLeft: 10,
  },
  labelContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  label: {
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  }
});

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
  };
};


export default connect(mapStateToProps)(PictureCard);
