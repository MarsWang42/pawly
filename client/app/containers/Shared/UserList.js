import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as userActions from '../../reducers/user';

const AnimatableTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity);

class UserList extends Component {
  constructor() {
    super();
    this.follow = {};
  }

  followUser(id) {
    this.props.dispatch({
      type: userActions.TOGGLE_USER_FOLLOW,
      toggleType: 'follow',
      userId: id,
      callback: () => {
        this.follow[id].pulse();
      },
      token: this.props.currentUser.accessToken,
    });
  }

  unfollowUser(id) {
    this.props.dispatch({
      type: userActions.TOGGLE_USER_FOLLOW,
      toggleType: 'unfollow',
      userId: id,
      token: this.props.currentUser.accessToken,
    });
  }

  renderPets(pets) {
    const content = pets.slice(0, 2).map(pet => {
      const petImageSource = pet.avatar ? { uri: pet.avatar }
        : require('../../assets/img/pet.png');
      return (
        <View style={styles.petContainer} key={pet.id}>
          <Image source={petImageSource} style={styles.petAvatar} />
          <Text style={styles.petName}>{ pet.name }</Text>
        </View>
      );
    });
    if (pets.length >= 3) {
      content.push(
        <Text key={'...'} style={{ fontFamily: 'Lato-italic', fontSize: 10 }}>...</Text>
      );
    }
    return content;
  }

  renderUser(user) {
    let avatarUrl = user && user.avatar;
    if (!avatarUrl && user && user.facebookId) {
      avatarUrl = `https://graph.facebook.com/${user.facebookId}/picture?width=9999`;
    }
    const imageSource = avatarUrl ? { uri: avatarUrl }
      : require('../../assets/img/user-default.png');

    const isCurrentUser = user.id === this.props.currentUser.id;

    return (
      <TouchableOpacity
        style={styles.userContainer}
        key={user.id}
        onPress={() => this.props.onPressUser(user)}
      >
        <Image source={imageSource} style={styles.userAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{ user.username }</Text>
          { user.pets.length ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Lato', fontSize: 12 }}>Pets: </Text>
              { this.renderPets(user.pets) }
            </View>
          ) : null}
        </View>
        { !isCurrentUser && (
          <AnimatableTouchableOpacity
            style={[styles.followButton, { borderColor: '#167ac6' }]}
            ref={follow => this.follow[user.id] = follow}
            onPress={() => {
              if (!user.followed) {
                this.followUser(user.id);
              } else {
                this.unfollowUser(user.id);
              }
            }}
          >
            { user.followed &&
              <Icon
                name={'checkbox-marked-outline'}
                size={14}
                color={'#167ac6'}
                style={{ marginRight: 3 }}
              />
            }
            <Text style={[styles.followButtonText, { color: '#167ac6' }]}>
              { user.followed ? 'Following' : 'Follow' }
            </Text>
          </AnimatableTouchableOpacity>
        ) }
      </TouchableOpacity>
    );
  }


  render() {
    const userList = this.props.userList;

    return (
      <View style={styles.container}>
        { (userList && userList.length) !== 0 ? (
          <FlatList
            data={userList}
            removeClippedSubviews={false}
            keyExtractor={(item) => (item.id)}
            renderItem={({ item }) => (
              this.renderUser(item)
            )}
          />
        ) : (
          <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
            <Icon
              size={ 40 }
              style={{ marginBottom: 5, backgroundColor: 'transparent', textAlign: 'center' }}
              name={'account-search'}
              color={'grey'}
            />
            <Text style={{ fontFamily: 'Lato', fontSize: 20, color: 'grey' }}>
              No User Found.
            </Text>
          </View>
        ) }
      </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: 'grey',
  },
  userAvatar: {
    height: 40,
    width: 40,
    borderRadius: 4,
    marginRight: 5,
    overflow: 'hidden',
    backgroundColor: '#ececec'
  },
  username: {
    fontFamily: 'Lato',
  },
  petContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  petAvatar: {
    height: 15,
    width: 15,
    borderRadius: 7,
    overflow: 'hidden',
  },
  petName: {
    fontFamily: 'Lato-Italic',
    fontSize: 12,
    color: 'gray',
    backgroundColor: 'transparent',
    marginLeft: 5
  },
  followButton: {
    flexDirection: 'row',
    width: 80,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 4,
    marginHorizontal: 10,
  },
  followButtonText: {
    fontFamily: 'Lato',
    fontSize: 12,
    backgroundColor: 'transparent'
  },
});

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
  };
};


export default connect(mapStateToProps)(UserList);
