import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  FlatList,
  Platform,
  StyleSheet,
} from 'react-native';
import PictureCard from './PictureCard';
import * as actions from '../../reducers/picture';

class FollowingList extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: actions.FETCH_FEED,
      token: this.props.currentUser.accessToken,
    });
    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    this.props.dispatch({
      type: actions.FETCH_FEED,
      token: this.props.currentUser.accessToken,
    });
  }

  render() {
    const { isLoading, followingList, navigation } = this.props;
    return (
      <FlatList
        data={followingList.toJS()}
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
});

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
    followingList: state.picture.followingList,
    isLoading: state.picture.isFetchingFeed,
  };
};


export default connect(mapStateToProps)(FollowingList);
