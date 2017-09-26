import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { NavigatorProfile } from '../../navigators/Profile';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

const mapStateToProps = (state) => {
  return {
    navigationState: state.nav.profile,
  };
};

class ProfileNavigation extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon
        size={ 23 }
        style={{ marginTop: -1 }}
        name={ 'user-o' }
        color={ tintColor }
      />
    )
  };

  render(){
    const { navigationState, dispatch } = this.props;
    return (
      <NavigatorProfile
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

export default connect(mapStateToProps)(ProfileNavigation);
