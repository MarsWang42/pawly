import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MainTabBar from '../../components/Main/TabBar';
import FollowingList from './FollowingList';
import NearbyList from './NearbyList';

class Main extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon
        size={ 30 }
        style={styles.icon}
        name={ 'home-outline' }
        color={ tintColor }
      />
    )
  };
  render() {
    return (
      <View style={styles.container}>
        <ScrollableTabView
          tabBarPosition='top'
          prerenderingSiblingsNumber={1}
          renderTabBar={() => <MainTabBar />}
          tabBarTextStyle={{ marginBottom: 12, fontFamily: 'Lato' }}
        >
          <FollowingList
            tabLabel={'Following'}
          />
          <NearbyList
            tabLabel={'Nearby'}
          />
        </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
  },
  header: {
    width: '100%',
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
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
  };
};


export default connect(mapStateToProps)(Main);
