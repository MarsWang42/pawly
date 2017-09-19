import React, { Component, PropTypes } from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { NavigatorAuth } from '../../navigators/Auth';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    navigationState: state.nav.auth,
  };
};

class AuthNavigation extends Component {
  render(){
    const { navigationState, dispatch } = this.props;
    return (
      <NavigatorAuth
        navigation={
          addNavigationHelpers({
            dispatch: dispatch,
            state: navigationState
          })
        }
      />
    );
  }
}

AuthNavigation.propTypes = {
  navigationState: PropTypes.any,
  dispatch: PropTypes.func,
};

export default connect(mapStateToProps)(AuthNavigation);
