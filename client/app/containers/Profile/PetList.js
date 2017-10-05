import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconM from 'react-native-vector-icons/MaterialIcons';
import * as petActions from '../../reducers/pet';

class PetList extends Component {
  constructor() {
    super();
  }

  removePet(id) {
    this.props.dispatch({
      type: petActions.DELETE_PET,
      id,
      token: this.props.currentUser.accessToken
    });
  }

  renderPet(pet) {
    const petImageSource = pet.avatar ? { uri: pet.avatar }
      : require('../../assets/img/pet.png');
    if (pet === 'plus') {
      return (
        <TouchableOpacity
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 5,
          }}
          onPress={() => this.props.navigation.navigate('AddPet')}
        >
          <Icon name={'plus'} size={25} color={'grey'} style={{ marginRight: 20 }} />
          <Text style={{ fontFamily: 'Lato', fontSize: 18, color: 'black' }}>
            Add a new pet
          </Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.petContainer}>
        <Image source={petImageSource} style={styles.petAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.petName}>{ pet.name }</Text>
          <Text style={styles.petType}>Type: { pet.type }</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Warning',
              `All pictures of ${pet.name} will be removed, are you sure?`,
              [
                {text: 'Cancel', onPress: () => true, style: 'cancel'},
                {text: 'Yes, remove them!', onPress: () => this.removePet(pet.id) }
              ],
              { cancelable: false }
            );
          }}
        >
          <Icon
            size={ 30 }
            style={{ marginRight: 10, backgroundColor: 'transparent' }}
            name={'delete'}
            color={'black'}
          />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { currentUser, userDetails, dispatch, navigation } = this.props;
    const petList = userDetails[currentUser.id].pets;
    if (petList.length) {
      petList.unshift('plus');
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <IconM name={'arrow-back'} size={24} color={'black'} />
        </TouchableOpacity>
        <LinearGradient
          style={styles.header}
          start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
          colors={['#ECE9E6', '#ffffff']}
        >
          <Text style={styles.title}>
            Pets
          </Text>
        </LinearGradient>
        { (petList && petList.length) !== 0 ? (
          <FlatList
            data={petList}
            removeClippedSubviews={false}
            keyExtractor={(item) => (item.id || item)}
            renderItem={({ item }) => (
              this.renderPet(item)
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
              Add first pet now!
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
  header: {
    height: 60,
    paddingTop: 19,
    alignItems:'center',
    justifyContent:'center',
    marginBottom: 10,
  },
  back: {
    position: 'absolute',
    top: 26,
    left: 20,
    zIndex: 10,
    width: 80,
    backgroundColor: 'transparent',
  },
  title: {
    color: 'black',
    fontFamily: 'Berlin Bold',
    letterSpacing: 1,
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
  petListContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: 'black',
  },
  petContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 5,
    marginHorizontal: 10,
    marginVertical: 2,
    borderTopWidth: 1,
    borderColor: 'black',
  },
  petAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 20,
    overflow: 'hidden',
  },
  petName: {
    fontFamily: 'Lato',
    fontSize: 16,
    backgroundColor: 'transparent',
    marginLeft: 5
  },
  petType: {
    fontFamily: 'Lato-Italic',
    fontSize: 14,
    backgroundColor: 'transparent',
    marginLeft: 5
  },
});

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
    userDetails: state.user.userDetails.toJS(),
  };
};


export default connect(mapStateToProps)(PetList);
