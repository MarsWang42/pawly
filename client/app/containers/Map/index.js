import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class Notifications extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon
        style={styles.icon}
        size={ 22 }
        name={ 'map-o' }
        color={ tintColor }
      />
    )
  };

  render() {
    return <View />;
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  icon: {
    marginRight: (Platform.OS === 'ios') ? 40 : 20,
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
  };
};


export default connect(mapStateToProps)(Notifications);
