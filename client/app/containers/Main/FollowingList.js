import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PictureCard from './PictureCard';
import * as actions from '../../reducers/picture';

class FollowingList extends Component {
  componentDidMount() {
    this.props.dispatch({
      initial: true,
      type: actions.FETCH_FEED,
      token: this.props.currentUser.accessToken,
    });
    this.onRefresh = this.onRefresh.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
  }

  onRefresh() {
    this.props.dispatch({
      type: actions.FETCH_FEED,
      initial: true,
      token: this.props.currentUser.accessToken,
    });
  }

  onEndReached(data) {
    if (!this.props.isLoading && !this.props.isLoadingMore && !this.props.feedReachEnd) {
      this.props.dispatch({
        type: actions.FETCH_FEED,
        token: this.props.currentUser.accessToken,
      });
    }
  }

  render() {
    const { isLoadingMore, isLoading, navigation, fetchError } = this.props;

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

    const followingList = this.props.followingList.toJS();
    if (isLoadingMore === true) {
      followingList.push({ pictureId: 'isLoading' });
    }
    return (
      <FlatList
        data={followingList}
        removeClippedSubviews={false}
        refreshing={isLoading}
        onRefresh={this.onRefresh}
        style={styles.container}
        onEndReachedThreshold={0}
        keyExtractor={(item) => (item.pictureId)}
        onEndReached={this.onEndReached}
        renderItem={({ item }) => {
          if (item.pictureId === 'isLoading') {
          return (
            <View style={{ height: 80, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator />
            </View>
          );
          }
          return (
            <PictureCard
              data={item}
              navigation={navigation}
              view={'Main'}
            />
          );
        }}
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
});

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
    followingList: state.picture.followingList,
    fetchError: state.picture.fetchFeedError,
    isLoading: state.picture.isFetchingFeed,
    isLoadingMore: state.picture.isFetchingMoreFeed,
    feedReachEnd: state.picture.feedReachEnd,
  };
};


export default connect(mapStateToProps)(FollowingList);
