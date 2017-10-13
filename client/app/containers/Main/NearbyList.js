import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import PictureCard from './PictureCard';
import * as pictureActions from '../../reducers/picture';

class NearbyList extends Component {
  constructor() {
    super();
    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    const { dispatch, currentUser, currentLocation } = this.props;
    dispatch({
      type: pictureActions.FETCH_NEARBY,
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      radius: 10,
      list: 'nearby',
      token: currentUser.accessToken,
    });
  }

  render() {
    const { isLoading, fetchError, nearbyList, navigation } = this.props;

    if (fetchError) {
      return (
        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 40 }}
          activeOpacity={1}
          onPress={this.onRefresh}
        >
          <Image
            source={require('../../assets/img/network-error.png')}
            style={{ height: 200, width: 200, marginBottom: 10 }}
          />
          <Text style={{ fontFamily: 'Lato', fontSize: 18, color: 'grey' }}>Network error</Text>
        </TouchableOpacity>
      );
    }

    return (
      <FlatList
        data={nearbyList.toJS()}
        removeClippedSubviews={false}
        refreshing={isLoading}
        onRefresh={this.onRefresh}
        style={styles.container}
        keyExtractor={(item) => (item.pictureId)}
        renderItem={({ item }) => (
          <PictureCard
            data={item}
            navigation={navigation}
            view={'Main'}
          />
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    marginBottom: 45,
  },
  icon: {
    marginLeft: (Platform.OS === 'ios') ? 40 : 20,
    marginTop: -2,
  },
  titleContainer: {
    backgroundColor:'#2e2e2e',
    padding: 12,
    alignItems:'center',
    justifyContent:'center'
  },
  title: {
    fontSize: 18,
    color: 'white',
    letterSpacing: 2,
    fontWeight: '600'
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
    nearbyList: state.picture.nearbyList,
    fetchError: state.picture.fetchNearbyError,
    currentLocation: state.session.currentLocation,
    isLoading: state.picture.isFetchingNearby,
  };
};


export default connect(mapStateToProps)(NearbyList);
