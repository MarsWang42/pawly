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
import ImageWithProgress from 'react-native-image-progress';
import ProgressPie from 'react-native-progress/Pie';
import * as actions from '../../reducers/picture';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PLACE_HOLDER = 'https://images.pexels.com/photos/7720/night-animal-dog-pet.jpg?w=1260&h=750&auto=compress&cs=tinysrgb';
const { height, width } = Dimensions.get('window');
const AnimatableTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity);

class PictureCard extends Component {
  constructor() {
    super();
    this.likePic = this.likePic.bind(this);
  }

  likePic(id) {
    this.props.dispatch({
      type: actions.TOGGLE_LIKE,
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
      type: actions.TOGGLE_LIKE,
      toggleType: 'unlike',
      picId: id,
      token: this.props.currentUser.accessToken,
    });
  }

  render() {
    const { data } = this.props;

    const pl = data.pets.length;
    const ll = data.likers.length;
    // const cl = data.comments.length;
    let petNames, likerNames, comments;
    if (pl >= 3) {
      petNames = `${data.pets[0].name}, ${data.pets[1].name} and ${pl - 2} others`;
    } else if (pl === 2) {
      petNames = `${data.pets[0].name} and ${data.pets[1].name}`;
    } else {
      petNames = data.pets[0].name;
    }
    if (ll >= 2) {
      likerNames = `${data.likers[0].username} and ${ll - 1} others`;
    } else if (ll == 1) {
      likerNames = data.likers[0].username;
    }
    // if (cl >= 3) {
    //   comments = (
    //     <View style={styles.commentContainer}>
    //       { data.comments.slice(0, 3).map((comment, i) => (
    //         <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
    //           <Text style={{ fontFamily: 'Lato-Italic', fontSize: 12 }}>{ comment.username }: </Text>
    //           <Text style={{ fontFamily: 'Lato', fontSize: 12 }}>{ comment.text }</Text>
    //         </View>
    //       )) }
    //       <Text>See more</Text>
    //     </View>
    //   );
    // } else {
    //   comments = (
    //     <View style={styles.commentContainer}>
    //       { data.comments.map((comment, i) => (
    //         <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
    //           <Text style={{ fontFamily: 'Lato-Italic', fontSize: 12 }}>{ comment.username }: </Text>
    //           <Text style={{ fontFamily: 'Lato', fontSize: 12 }}>{ comment.text }</Text>
    //         </View>
    //       )) }
    //     </View>
    //   );
    // }

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.petAvatarContainer}>
              <Image
                style={[styles.firstPetAvatar, { left: pl === 1 ? 15 : 2 ? 10 : 0 }]}
                source={{ uri: data.pets[0].avatar || PLACE_HOLDER }}
              />
              { data.pets[1] &&
                <Image
                  style={[styles.secondPetAvatar, { left: pl === 2 ? 21 : 16 }]}
                  source={{ uri: data.pets[1].avatar || PLACE_HOLDER }}
                />
              }
              { data.pets[2] &&
                <Image style={styles.thirdPetAvatar} source={{ uri: data.pets[2].avatar }}/>
              }
            </View>
            <View style={styles.petInfoContainer}>
              <Text style={styles.petName}>{ petNames }</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Text style={{ fontSize: 11, fontFamily: 'Lato' }}>Taken by </Text>
                <Text style={styles.username}>{ data.creator.username }</Text>
                <Text style={styles.time}> { moment(data.timestamp).fromNow() }</Text>
              </View>
            </View>
          </View>
        </View>
        <ImageWithProgress
          source={{ uri: data.image }}
          indicator={ProgressPie}
          indicatorProps={{ color: 'rgba(230, 83, 90, 0.7)' }}
          style={{ height: data.height / data.width * width, width: width }}
        />
        <View style={styles.footerContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              { likerNames &&
                <Text style={{ fontSize: 12, fontFamily: 'Lato' }}>Liked by </Text>
              }
              <Text style={styles.likername}>{ likerNames }</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AnimatableTouchableOpacity
                onPress={() => {
                  if (!data.liked) {
                    this.likePic(data.pictureId);
                  } else {
                    this.unlikePic(data.pictureId);
                  }
                }}
                ref={like => this.like = like}
              >
                <Icon
                  name={data.liked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={'#e6535a'}
                  style={{ marginTop: 3 }}
                />
              </AnimatableTouchableOpacity>
              <Icon name={'message-outline'} size={22} style={{ marginTop: 2, marginLeft: 5 }} />
            </View>
          </View>
          {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}> */}
          {/*   { comments } */}
          {/* </View> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor:'#fff',
  },
  image: {
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  petAvatarContainer: {
    flexDirection: 'row',
    height: 40,
    width: 60,
    alignItems: 'center',
  },
  firstPetAvatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
    position: 'absolute',
    top: 5,
    zIndex: 3,
    borderWidth: 2,
    borderColor: 'white'
  },
  secondPetAvatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
    position: 'absolute',
    top: 5,
    zIndex: 2,
    borderWidth: 2,
    borderColor: 'white'
  },
  thirdPetAvatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
    position: 'absolute',
    top: 5,
    left: 22,
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
    fontFamily: 'Lato-Italic',
    fontSize: 12,
  },
  username: {
    fontFamily: 'Lato-Bold',
    fontSize: 11,
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
    fontSize: 11,
    color: 'gray',
    marginLeft: 10,
  },
  footerContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  }
});

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
  };
};


export default connect(mapStateToProps)(PictureCard);
