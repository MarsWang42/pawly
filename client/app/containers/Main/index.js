import React from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addNavigationHelpers } from 'react-navigation';
import { NavigatorMain } from '../../navigators/Main';

const mapStateToProps = (state) => {
  return {
    navigationState: state.nav.main,
  };
};

class MainNavigation extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon
        size={ 30 }
        name={ 'home-outline' }
        color={ tintColor }
      />
    )
  };


  render(){
    const { navigationState, dispatch } = this.props;
    return (
      <NavigatorMain
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

export default connect(mapStateToProps)(MainNavigation);
