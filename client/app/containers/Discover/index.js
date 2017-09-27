import React from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { addNavigationHelpers } from 'react-navigation';
import { NavigatorDiscover } from '../../navigators/Discover';

const mapStateToProps = (state) => {
  return {
    navigationState: state.nav.discover,
  };
};

class DiscoverNavigation extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon
        style={{
          marginLeft: (Platform.OS === 'ios') ? 35 : 15,
          marginTop: 2,
        }}
        size={ 28 }
        name={ 'ios-search' }
        color={ tintColor }
      />
    )
  };


  render(){
    const { navigationState, dispatch } = this.props;
    return (
      <NavigatorDiscover
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

export default connect(mapStateToProps)(DiscoverNavigation);
