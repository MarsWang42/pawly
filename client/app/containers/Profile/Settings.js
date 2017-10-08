import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as sessionActions from '../../reducers/session';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Settings extends Component {
  constructor() {
    super();
    this.logoutUser = this.logoutUser.bind(this);
  }

  logoutUser() {
    const { dispatch, navigation } = this.props;
    dispatch({ type: sessionActions.LOGOUT_USER });
    navigation.dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Home'})
      ]
    }));
  }

  render() {
    const { navigation } = this.props;
    return (
      <View>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Icon name={'arrow-back'} size={24} color={'black'} />
        </TouchableOpacity>
        <LinearGradient
          style={styles.header}
          start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
          colors={['#ECE9E6', '#ffffff']}
        >
          <Text style={styles.title}>
            Settings
          </Text>
        </LinearGradient>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.option}
            onPress={this.logoutUser}
          >
            <IconM name={'logout'} color={'#ff2f2f'} size={25} style={styles.optionIcon} />
            <Text style={[styles.optionText, { color: '#ff2f2f' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  back: {
    position: 'absolute',
    top: 26,
    left: 20,
    zIndex: 10,
    width: 80,
    backgroundColor: 'transparent',
  },
  header: {
    height: 60,
    paddingTop: 19,
    alignItems:'center',
    justifyContent:'center'
  },
  title: {
    color: 'black',
    fontFamily: 'Berlin Bold',
    letterSpacing: 1,
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
  optionsContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'grey',
  },
  option: {
    flexDirection: 'row',
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  optionIcon: {
    width: 40,
  },
  optionText: {
    flex: 1,
    fontFamily: 'Lato',
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: 'grey',
  }
});

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
    userDetails: state.user.userDetails.toJS(),
  };
};

export default connect(mapStateToProps)(Settings);
