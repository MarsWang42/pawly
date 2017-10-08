import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  LayoutAnimation,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  UIManager,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconM from 'react-native-vector-icons/MaterialIcons';
import ProgressPie from 'react-native-progress/Pie';
import Comment from '../Shared/Comment';
import ImageWithProgress from '../../components/Helpers/ImageWithProgress';
import * as pictureActions from '../../reducers/picture';
import * as petActions from '../../reducers/pet';
import * as userActions from '../../reducers/user';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
const { height, width } = Dimensions.get('window');
const AnimatableTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity);

class PictureDetail extends Component {
  constructor() {
    super();
    this.state = {
      isPetListOpen: false,
      isCommentModalVisible: false,
    };
    this.togglePetModal = this.togglePetModal.bind(this);
    this.selectPet = this.selectPet.bind(this);
    this.openCommentModal = this.openCommentModal.bind(this);
    this.closeCommentModal = this.closeCommentModal.bind(this);
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

  togglePetModal() {
    const { pictureDetails, pictureId } = this.props;
    const pictureDetail = pictureDetails[pictureId];

    if (pictureDetail.pets.length >= 2) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({ isPetModalOpen: !this.state.isPetModalOpen });
    } else {
      this.selectPet(pictureDetail.pets[0].id);
    }
  }

  openCommentModal(target) {
    this.setState({ isCommentModalVisible: true, target });
  }

  closeCommentModal() {
    this.setState({ isCommentModalVisible: false });
  }

  selectUser(id) {
    const { navigation, dispatch, currentUser, view } = this.props;
    dispatch({
      type: userActions.FETCH_USER_DETAIL,
      id: id,
      token: currentUser.accessToken,
    });
    navigation.navigate(`${view}User`, { userId: id, view });
  }

  selectPet(id) {
    const { navigation, dispatch, view } = this.props;
    navigation.navigate(`${view}Pet`, { petId: id , view });
    dispatch({
      type: petActions.FETCH_PET_DETAIL,
      id: id,
      token: this.props.currentUser.accessToken,
    });
  }

  renderPet(pet) {
    const petImageSource = pet.avatar ? { uri: pet.avatar } : require('../../assets/img/pet.png');
    return (
      <TouchableOpacity
        onPress={() => this.selectPet(pet.id)}
        style={{ justifyContent: 'center', alignItems: 'center', margin: 3 }}
      >
        <Image
          style={{
            height: 30,
            width: 30,
            borderRadius: 15,
          }}
          source={petImageSource}
        />
        <Text style={{ fontFamily: 'Lato', fontSize: 14 }}>{ pet.name }</Text>
      </TouchableOpacity>
    );
  }

  renderCaption() {
    const { navigation, isLoading, pictureDetails, pictureId, data } = this.props;
    const pictureDetail = pictureDetails[pictureId] || data;
    const { creator, caption } = pictureDetail;

    let avatarUrl = creator && creator.avatar;
    if (!avatarUrl && creator && creator.facebookId) {
      avatarUrl = `https://graph.facebook.com/${creator.facebookId}/picture?width=9999`;
    }
    const imageSource = avatarUrl ? { uri: avatarUrl }
      : require('../../assets/img/user-default.png');

    return (
      <View style={styles.commentContainer}>
        <TouchableOpacity activeOpacity={1} onPress={() => this.selectUser(creator.id)}>
          <Image source={imageSource} style={styles.creatorAvatar} />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            padding: 5,
            marginRight: 15,
            fontSize: 14,
            fontFamily: 'Lato',
          }}
        >
          <Text style={{ fontFamily: 'Lato-bold' }}>{ creator.username }  </Text>
          <Text>{ caption }</Text>
        </Text>
      </View>
    );
  }

  renderComment(comment) {
    const { author, body, target } = comment;
    let avatarUrl = author && author.avatar;
    if (!avatarUrl && author && author.facebookId) {
      avatarUrl = `https://graph.facebook.com/${author.facebookId}/picture?width=9999`;
    }
    const imageSource = avatarUrl ? { uri: avatarUrl }
      : require('../../assets/img/user-default.png');
    return (
      <View style={styles.commentContainer}>
        <TouchableOpacity activeOpacity={1} onPress={() => this.selectUser(author.id)}>
          <Image source={imageSource} style={styles.userAvatar} />
        </TouchableOpacity>
        <TouchableOpacity
          opacity={1}
          style={{
            flex: 1,
            padding: 5,
            marginRight: 15,
            borderBottomWidth: 1,
            borderColor: 'lightgrey',
          }}
          onPress={() => this.openCommentModal(author)}
        >
          <Text style={styles.commentUsername}>{ author.username }</Text>
          <Text style={{ fontFamily: 'Lato', fontSize: 14 }}>
            { target && (
              <Text>
                <Text>Reply </Text>
                <Text
                  style={{ color: 'orange', textDecorationLine: 'underline' }}
                  onPress={() => this.selectUser(target.id)}
                >
                  { target.username }
                </Text>
                <Text>:  </Text>
              </Text>
            ) }
            <Text>{ body }</Text>
          </Text>
          <Text style={{ fontFamily: 'Lato', fontSize: 12, color: 'grey', marginTop: 5 }}>
            { moment(comment.createdAt).format('MM-DD hh:mm AA') }
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { navigation, isLoading, pictureDetails, pictureId, data } = this.props;
    const { isPetModalOpen, isCommentModalVisible, target } = this.state;
    let pictureDetailFetched = true;
    let pictureDetail = pictureDetails[pictureId];

    if (!pictureDetail) {
      pictureDetail = data;
      pictureDetailFetched = false;
    }

    const pl = pictureDetail.pets.length;
    let ll = pictureDetail.likers ? pictureDetail.likers.length : pictureDetail.likerLength;
    // const cl = pictureDetail.comments.length;
    let petNames, likerNames;
    if (pl >= 3) {
      petNames = `${pictureDetail.pets[0].name}, ${pictureDetail.pets[1].name} and ${pl - 2} others`;
    } else if (pl === 2) {
      petNames = `${pictureDetail.pets[0].name} and ${pictureDetail.pets[1].name}`;
    } else {
      petNames = pictureDetail.pets[0].name;
    }

    if (pictureDetailFetched) {
      if (ll >= 2) {
        likerNames = `${pictureDetail.likers[0].username} and ${ll - 1} others`;
      } else if (ll === 1) {
        likerNames = pictureDetail.likers[0].username;
      } else {
        likerNames = 'Be the first one who like this!';
      }
    }

    const petImageSource = (url) => (
      url ? { uri: url } : require('../../assets/img/pet.png')
    );

    return (
      <View style={styles.container}>
        <Modal
          animationType='slide'
          transparent={false}
          visible={isCommentModalVisible}
        >
          <Comment
            closeModal={this.closeCommentModal}
            pictureId={pictureId}
            target={target}
          />
        </Modal>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <IconM name={'arrow-back'} size={24} color={'black'} />
        </TouchableOpacity>
        <LinearGradient
          style={styles.header}
          start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
          colors={['#ECE9E6', '#ffffff']}
        >
          <Text style={styles.title}>
            Picture
          </Text>
        </LinearGradient>
        <View style={[styles.headerContainer, { height: pictureDetail.place ? 65 : 55 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={this.togglePetModal}
              activeOpacity={0.6}
              style={[styles.petAvatarContainer,
                { width: pl === 1 ? 60 : pl === 2 ? 70 : 80 }
              ]}
            >
              <Image style={styles.firstPetAvatar} source={petImageSource(pictureDetail.pets[0].avatar)} />
              { pictureDetail.pets[1] &&
                <Image style={styles.secondPetAvatar} source={petImageSource(pictureDetail.pets[1].avatar)} />
              }
              { pictureDetail.pets[2] &&
                <Image style={styles.thirdPetAvatar} source={petImageSource(pictureDetail.pets[2].avatar)} />
              }
            </TouchableOpacity>
            <View style={styles.petInfoContainer}>
              <Text style={styles.petName}>{ petNames }</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Text style={{ fontSize: 11, fontFamily: 'Lato' }}>Taken by </Text>
                <Text style={styles.username}>{ pictureDetail.creator.username }</Text>
                <Text style={styles.time}> { moment(pictureDetail.timestamp).fromNow() }</Text>
              </View>
              { pictureDetail.place && (
                <View style={styles.locationContainer}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={styles.locationText}
                  >
                    At { pictureDetail.place.name }
                  </Text>
                </View>
              ) }
            </View>
          </View>
        </View>
        <ScrollView>
          <View style={{ height: width, width }}>
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                this.setState({ isPetModalOpen: false });
              }}
            >
              <ImageWithProgress
                source={{ uri: pictureDetail.image }}
                indicator={ProgressPie}
                indicatorProps={{ color: 'rgba(230, 83, 90, 0.7)' }}
                style={{ height: '100%', width: '100%', backgroundColor: '#eeeeee' }}
              />
            </TouchableOpacity>
            { isPetModalOpen && (
              <View style={styles.petModal}>
                <FlatList
                  horizontal
                  style={{ padding: 5 }}
                  data={pictureDetail.pets}
                  renderItem={({ item }) => this.renderPet(item)}
                  keyExtractor={(item) => item.id}
                />
              </View>
            ) }
          </View>
          { pictureDetail.caption && this.renderCaption() }
          <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 10, alignItems: 'center' }}>
            <AnimatableTouchableOpacity
              ref={like => this.like = like}
              onPress={() => {
                if (!pictureDetail.liked) {
                  this.likePic(pictureDetail.pictureId);
                } else {
                  this.unlikePic(pictureDetail.pictureId);
                }
              }}
            >
              <Icon
                name={pictureDetail.liked ? 'heart' : 'heart-outline'}
                size={24}
                color={'#e6535a'}
                style={{ marginTop: 3 }}
              />
            </AnimatableTouchableOpacity>
            <Text style={{ fontFamily: 'Lato', fontSize: 14, marginHorizontal: 15 }}>
              { pictureDetailFetched && likerNames }
            </Text>
          </View>
          { isLoading && (
            <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator />
            </View>
          ) }
          { pictureDetailFetched && (
            <FlatList
              style={{ marginBottom: 100 }}
              data={pictureDetail.comments}
              renderItem={({ item }) => this.renderComment(item)}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={(
              <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
                <Icon name={'message-outline'} size={22} color={'grey'} />
                <Text
                  style={{
                    fontFamily: 'Lato-italic',
                    fontSize: 15,
                    textAlign: 'center',
                    marginTop: 5,
                    color: 'grey'
                  }}
                >
                  No comment yet.
                </Text>
              </View>
              )}
            />
          ) }
        </ScrollView>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => this.openCommentModal()}
        >
          <Text
            style={{
              fontFamily: 'Lato-bold',
              fontSize: 23,
              color: 'grey',
              backgroundColor: 'transparent'
            }}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor:'#fff',
    marginBottom: 40,
  },
  back: {
    position: 'absolute',
    top: 26,
    left: 20,
    zIndex: 10,
    width: 80,
    backgroundColor: 'transparent',
  },
  header: {
    height: 60,
    paddingTop: 19,
    alignItems:'center',
    justifyContent:'center'
  },
  title: {
    color: 'black',
    fontFamily: 'Berlin Bold',
    letterSpacing: 1,
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
  petModal: {
    position: 'absolute',
    top: 10,
    left: 15,
    width: width - 30,
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  image: {
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  creatorAvatar: {
    height: 25,
    width: 25,
    borderRadius: 12,
    marginTop: 3,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'lightgrey'
  },
  commentContainer: {
    marginLeft: 10,
    marginTop: 2,
    flexDirection: 'row',
  },
  userAvatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginTop: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'lightgrey'
  },
  commentUsername: {
    color: '#3a3a3a',
    fontFamily: 'Lato',
    fontSize: 15,
    marginBottom: 3,
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
  },
  addButton: {
    position: 'absolute',
    opacity: 0.8,
    bottom: 20,
    right: 25,
    borderWidth: 3,
    borderColor: 'grey',
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
    pictureDetails: state.picture.pictureDetails.toJS(),
    isLoading: state.picture.isFetchingPictureDetail,
  };
};


export default connect(mapStateToProps)(PictureDetail);
