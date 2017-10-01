import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  FlatList,
  Platform,
  StyleSheet,
} from 'react-native';
import PictureCard from './PictureCard';
import * as pictureActions from '../../reducers/picture';
import * as actions from '../../reducers/picture';

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
      token: currentUser.accessToken,
    });
  }

  render() {
    const { isLoading, nearbyList } = this.props;
    return (
      <FlatList
        data={nearbyList.toJS()}
        removeClippedSubviews={false}
        refreshing={isLoading}
        onRefresh={this.onRefresh}
        style={styles.container}
        keyExtractor={(item) => (item.pictureId)}
        renderItem={({ item }) => (
          <PictureCard data={item} />
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
    currentLocation: state.session.currentLocation,
    isLoading: state.picture.isFetchingFeed,
  };
};


export default connect(mapStateToProps)(NearbyList);
