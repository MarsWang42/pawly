import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
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
    console.log(this.props.isLoading, this.props.isLoadingMore)
    if (!this.props.isLoading && !this.props.isLoadingMore) {
      this.props.dispatch({
        type: actions.FETCH_FEED,
        token: this.props.currentUser.accessToken,
      });
    }
  }

  render() {
    const { isLoadingMore, isLoading, navigation } = this.props;
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
    isLoading: state.picture.isFetchingFeed,
    isLoadingMore: state.picture.isFetchingMoreFeed,
  };
};


export default connect(mapStateToProps)(FollowingList);
