import React, { Component } from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { NavigatorApp } from '../navigators/App';
import * as actions from '../reducers/session';
import Auth from './Auth';

class AppNavigation extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: actions.GET_CURRENT_USER,
    })
  }

  render(){
    const {
      navigationState,
      dispatch,
      isCheckingUser,
      currentUser,
    } = this.props;

    if (isCheckingUser) {
      return <View />;
    } else if (currentUser && currentUser.username) {
      return (
        <NavigatorApp
          navigation={
            addNavigationHelpers({
              dispatch: dispatch,
              state: navigationState
            })
          }
        />
      );
    } else {
      return <Auth />;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    navigationState: state.nav.app,
    isLoggedIn: state.session.isLoggedIn,
    isCheckingUser: state.session.isCheckingUser,
    currentUser: state.session.currentUser,
  };
};


export default connect(mapStateToProps)(AppNavigation);
