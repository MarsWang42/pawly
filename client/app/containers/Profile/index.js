import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as actions from '../../reducers/session';

function ucfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class Profile extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon
        size={ 23 }
        style={styles.icon}
        name={ 'user-o' }
        color={ tintColor }
      />
    )
  };

  renderPets() {
    const { currentUser } = this.props;
    const content = currentUser.pets.slice(0, 2).map(pet => {
      const petImageSource = pet.avatar.url ? { uri: pet.avatar.url }
        : require('../../assets/img/pet.png');
      return (
        <View style={styles.petContainer} key={pet.id}>
          <Image source={petImageSource} style={styles.petAvatar} />
          <Text style={styles.petName}>{ pet.name }</Text>
          <Text style={styles.petType}>{ ucfirst(pet.type) }</Text>
        </View>
      );
    });
    if (currentUser.pets.length >= 3) {
      content.push(
        <Text style={[styles.petType, { fontSize: 10 }]}>...</Text>
      );
    }
    return content;
  }

  render() {
    const { currentUser, dispatch } = this.props;
    let avatarUrl = currentUser && currentUser.avatar.url;
    if (!avatarUrl && currentUser && currentUser.facebookId) {
      avatarUrl = `https://graph.facebook.com/${currentUser.facebookId}/picture?width=9999`;
    }
    const imageSource = avatarUrl ? { uri: avatarUrl }
      : require('../../assets/img/user-default.png');

    return (
      <View style={styles.container}>
        <LinearGradient
          start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
          colors={['#4568DC', '#B06AB3']}
          style={styles.headerContainer}
        >
          <Text style={styles.title}>{ currentUser.username }</Text>
          <View style={[styles.infoContainer, { justifyContent: 'center' }]}>
            <Image source={imageSource} style={styles.userAvatar} />
            <View style={{ alignItems: 'center', width: 200 }}>
              <Text style={styles.petTitle}>
                Pets
              </Text>
              { this.renderPets() }
              <View style={styles.petButtons}>
                <TouchableOpacity style={[styles.petButton, { borderColor: '#aeb0ff' }]}>
                  <Text style={[styles.petButtonText, { color: '#aeb0ff' }]}>
                    See all...
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.petButton, { borderColor: '#aeffe1' }]}>
                  <Text style={[styles.petButtonText, { color: '#aeffe1' }]}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.infoContainer}>
            <View style={{ alignItems: 'center', width: 100 }}>
              <Text style={styles.infoNumber}>1</Text>
              <Text style={styles.infoTitle}>Follower</Text>
            </View>
            <View style={{ alignItems: 'center', width: 100 }}>
              <Text style={styles.infoNumber}>1</Text>
              <Text style={styles.infoTitle}>Following</Text>
            </View>
            <View style={{ alignItems: 'center', width: 100 }}>
              <Text style={styles.infoNumber}>1</Text>
              <Text style={styles.infoTitle}>Post</Text>
            </View>
          </View>
        </LinearGradient>
        <TouchableOpacity onPress={() => dispatch({ type: actions.LOGOUT_USER })}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 35,
    paddingBottom: 20,
    alignItems: 'center',
    height: 270,
  },
  userAvatar: {
    height: 120,
    width: 120,
    borderRadius: 60,
    overflow: 'hidden',
    margin: 20,
  },
  icon: {
    marginTop: -1,
  },
  title: {
    fontFamily: 'Berlin',
    fontSize: 25,
    color: 'white',
    backgroundColor: 'transparent'
  },
  titleContainer: {
    backgroundColor:'#2e2e2e',
    padding: 12,
    alignItems:'center',
    justifyContent:'center'
  },
  petContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 2,
  },
  petTitle: {
    fontFamily: 'Lato-italic',
    fontSize: 20,
    marginBottom: 5,
    color: '#fff5c3',
    backgroundColor: 'transparent'
  },
  petAvatar: {
    height: 20,
    width: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  petName: {
    fontFamily: 'Lato',
    color: 'white',
    backgroundColor: 'transparent',
    marginHorizontal: 15
  },
  petType: {
    fontFamily: 'Lato-italic',
    color: '#c9c9c9',
    backgroundColor: 'transparent',
  },
  petButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 5,
  },
  petButton: {
    width: 70,
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 4,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 4,
    marginHorizontal: 10,
  },
  petButtonText: {
    fontFamily: 'Lato',
    fontSize: 12,
    backgroundColor: 'transparent'
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  infoTitle: {
    fontFamily: 'Lato',
    fontSize: 12,
    color: 'white',
    backgroundColor: 'transparent'
  },
  infoNumber: {
    fontFamily: 'Lato-bold',
    fontSize: 16,
    color: 'white',
    backgroundColor: 'transparent'
  },
  bgImg: {
    flex: 1,
    width: '100%',
    alignItems:'center',
    justifyContent:'center'
  },
});

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
  };
};


export default connect(mapStateToProps)(Profile);
