import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ProfileTabBar from '../../components/Profile/ProfileTabBar';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import * as userActions from '../../reducers/user';
import * as sessionActions from '../../reducers/session';
import * as pictureActions from '../../reducers/picture';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      text: '',
    };
  }

  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: userActions.FETCH_RECEIVED_ADOPTIONS,
      token: currentUser.accessToken,
    });
  }

  selectUser(id, notificationId, read) {
    const { navigation, dispatch, currentUser } = this.props;
    dispatch({
      type: userActions.FETCH_USER_DETAIL,
      id: id,
      token: currentUser.accessToken,
    });
    if (!read) {
      dispatch({
        type: sessionActions.READ_NOTIFICATION,
        id: notificationId,
        token: currentUser.accessToken
      });
    }
    navigation.navigate('ProfileUser', { userId: id, view: 'Profile' });
  }

  openPictureDetail(picture, notificationId, read) {
    const { currentUser, dispatch, navigation } = this.props;
    dispatch({
      type: pictureActions.FETCH_PICTURE_DETAIL,
      id: picture.pictureId,
      token: currentUser.accessToken
    });
    if (!read) {
      dispatch({
        type: sessionActions.READ_NOTIFICATION,
        id: notificationId,
        token: currentUser.accessToken
      });
    }
    navigation.navigate('ProfilePictureDetail', {
      pictureId: picture.pictureId,
      view: 'Profile',
      data: picture,
    });
  }

  renderAdoptionRequest(request) {
    const { adoptionApplicant, fullName, pet, id, createdAt } = request;
    let avatarUrl = adoptionApplicant.avatar;
    if (!avatarUrl && adoptionApplicant && adoptionApplicant.facebookId) {
      avatarUrl = `https://graph.facebook.com/${adoptionApplicant.facebookId}/picture?width=9999`;
    }
    const imageSource = avatarUrl ? { uri: avatarUrl }
      : require('../../assets/img/user-default.png');

    const petImageSource = pet.avatar ? { uri: pet.avatar }
      : require('../../assets/img/pet.png');
    return (
      <View style={styles.notificationContainer}>
        <Image source={imageSource} style={styles.userAvatar} />
        <TouchableOpacity
          activeOpacity={1}
          style={styles.notificationInfo}
        >
          <Text style={{ fontFamily: 'Lato', color: 'grey', flex: 1 }}>
            <Text style={{ fontSize: 15, color: 'black' }}>{ fullName }</Text>
            <Text> is interested in </Text>
            <Text style={{ fontSize: 15, color: 'black' }}>
              { pet.name }
            </Text>
            <Text> { moment(createdAt).fromNow() }.</Text>
          </Text>
          <Image source={petImageSource} style={styles.petAvatar} />
        </TouchableOpacity>
      </View>
    )
  }

  renderNotification(notification) {
    const { notifiedBy, type, picture, createdAt, read, id } = notification;
    let avatarUrl = notifiedBy.avatar;
    if (!avatarUrl && notifiedBy && notifiedBy.facebookId) {
      avatarUrl = `https://graph.facebook.com/${notifiedBy.facebookId}/picture?width=9999`;
    }
    const imageSource = avatarUrl ? { uri: avatarUrl }
      : require('../../assets/img/user-default.png');

    const renderContent = () => {
      switch (type) {
        case 'like': {
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.openPictureDetail(picture, id, read)}
              style={styles.notificationInfo}
            >
              <Text style={{ fontFamily: 'Lato', color: 'grey', flex: 1 }}>
                <Text style={{ fontSize: 15, color: 'black' }}>
                  { notifiedBy.username }
                </Text>
                <Text> liked your picture { moment(createdAt).fromNow() }.</Text>
              </Text>
              <Image source={{ uri: picture.image }} style={styles.picture} />
            </TouchableOpacity>
          );
        }
        case 'comment': {
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.openPictureDetail(picture, id, read)}
              style={styles.notificationInfo}
            >
              <Text style={{ fontFamily: 'Lato', color: 'grey', flex: 1 }}>
                <Text style={{ fontSize: 15, color: 'black' }}>
                  { notifiedBy.username }
                </Text>
                <Text> commented on your picture { moment(createdAt).fromNow() }.</Text>
              </Text>
              <Image source={{ uri: picture.image }} style={styles.picture} />
            </TouchableOpacity>
          );
        }
        case 'follow': {
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.selectUser(notifiedBy.id, id, read)}
              style={styles.notificationInfo}
            >
              <Text style={{ fontFamily: 'Lato', color: 'grey', flex: 1 }}>
                <Text style={{ fontSize: 15, color: 'black' }}>
                  { notifiedBy.username }
                </Text>
                <Text> followed you { moment(createdAt).fromNow() }.</Text>
              </Text>
            </TouchableOpacity>
          );
        }
        default: {
          return null;
        }
      }
    };

    return (
      <View style={{ backgroundColor: read ? 'white' : 'transparent' }}>
        <View style={styles.notificationContainer}>
          <Image source={imageSource} style={styles.userAvatar} />
          { renderContent(notification) }
        </View>
      </View>
    );
  }

  render() {
    const { dispatch, notifications, receivedRequests, navigation } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={{ fontFamily: 'Lato', fontSize: 16 }}>Back</Text>
        </TouchableOpacity>
        <LinearGradient
          style={styles.header}
          start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
          colors={['#ECE9E6', '#ffffff']}
        >
          <Text style={styles.title}>
            Notifications
          </Text>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <ScrollableTabView
            tabBarPosition='top'
            prerenderingSiblingsNumber={1}
            renderTabBar={() => <ProfileTabBar />}
            tabBarTextStyle={{ fontFamily: 'Lato', fontSize: 16 }}
          >
            { (notifications && notifications.length > 0) ? (
              <FlatList
                tabLabel={'General'}
                data={notifications}
                removeClippedSubviews={false}
                style={{ flex: 1, paddingTop: 5 }}
                onEndReachedThreshold={0}
                keyExtractor={(item) => (item.id)}
                onEndReached={this.onEndReached}
                renderItem={({ item }) => this.renderNotification(item)}
              />
            ) : (
              <View
                tabLabel={'General'}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              >
                <Icon
                  size={ 40 }
                  style={{ marginBottom: 5, backgroundColor: 'transparent', textAlign: 'center' }}
                  name={'notifications-none'}
                  color={'grey'}
                />
                <Text style={{ fontFamily: 'Lato', fontSize: 20, color: 'grey' }}>
                  No notifications found.
                </Text>
              </View>
            ) }
            { (receivedRequests && receivedRequests.length) > 0 ? (
              <FlatList
                tabLabel={'Adoption'}
                data={receivedRequests}
                removeClippedSubviews={false}
                style={{ flex: 1, paddingTop: 5 }}
                onEndReachedThreshold={0}
                keyExtractor={(item) => (item.id)}
                onEndReached={this.onEndReached}
                renderItem={({ item }) => this.renderAdoptionRequest(item)}
              />
            ) : (
              <View
                tabLabel={'Adoption'}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              >
                <Icon
                  size={ 40 }
                  style={{ marginBottom: 5, backgroundColor: 'transparent', textAlign: 'center' }}
                  name={'pets'}
                  color={'grey'}
                />
                <Text style={{ fontFamily: 'Lato', fontSize: 20, color: 'grey' }}>
                  No adoption request received.
                </Text>
              </View>
            ) }
          </ScrollableTabView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  back: {
    position: 'absolute',
    top: 30,
    left: 30,
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
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 3,
    marginHorizontal: 10,
  },
  notificationInfo: {
    flex: 1,
    padding: 5,
    borderBottomWidth: 1,
    borderColor: 'grey',
    flexDirection: 'row',
    minHeight: 60
  },
  userAvatar: {
    height: 50,
    width: 50,
    borderRadius: 4,
    marginRight: 8,
    marginVertical: 4,
    overflow: 'hidden',
    backgroundColor: '#ececec'
  },
  petAvatar: {
    height: 40,
    width: 40,
    marginLeft: 15,
    borderRadius: 20,
    marginVertical: 4,
  },
  picture: {
    height: 40,
    width: 40,
    marginLeft: 15,
    borderRadius: 3,
    marginVertical: 4,
  }
});

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
    notifications: state.session.notifications.toJS(),
    receivedRequests: state.user.receivedRequests,
  };
};

export default connect(mapStateToProps)(Settings);
