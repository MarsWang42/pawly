import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { View } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../reducers/session';
import Auth from './Auth';

class AppNavigation extends React.Component {
  componentWillMount() {
    this.props.dispatch({
      type: actions.GET_CURRENT_USER,
    })
  }

  render(){
    const {
      navigationState,
      dispatch,
      isLoggingIn,
      currentUser,
    } = this.props;

    if (isLoggingIn) {
      return <View />
    } else if (currentUser && currentUser.username) {
      return <View />
    } else {
      return <Auth />;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    navigationState: state.nav.app,
    isLoggedIn: state.session.isLoggedIn,
    isLoggingIn: state.session.isLoggingIn,
    currentUser: state.session.currentUser,
  };
};


export default connect(mapStateToProps)(AppNavigation);
