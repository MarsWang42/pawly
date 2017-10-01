import React from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { addNavigationHelpers } from 'react-navigation';
import { NavigatorMap } from '../../navigators/Map';

const mapStateToProps = (state) => {
  return {
    navigationState: state.nav.map,
  };
};

class MapNavigation extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon
        style={{
          marginRight: (Platform.OS === 'ios') ? 40 : 20,
          marginTop: -2,
        }}
        size={ 22 }
        name={ 'map-o' }
        color={ tintColor }
      />
    )
  };


  render(){
    const { navigationState, dispatch } = this.props;
    return (
      <NavigatorMap
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

export default connect(mapStateToProps)(MapNavigation);
