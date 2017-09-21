import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { connect } from 'react-redux';
import { TabBar } from '../navigators/TabBar';
import Icon from 'react-native-vector-icons/FontAwesome';

const mapStateToProps = (state) => {
 return {
    navigationState: state.nav.tabBar,
  };
};

class TabBarNavigation extends React.Component {
  constructor() {
    super();
    this.state = {
      isOverlayShow: false,
      modalBottomAnim: new Animated.Value(-200),
      isModalOpen: false,
    };
  }

  render(){
    const { dispatch, navigationState } = this.props;
    const x = Dimensions.get('window').width;
    return (
      <View style={styles.container} >
        <TabBar
          navigation={
            addNavigationHelpers({
              dispatch: dispatch,
              state: navigationState,
            })
          }
        />
        <TouchableOpacity
          style={[ styles.camera, { left: x/2-14 } ]}
          onPress={() => {
            this.props.navigation.navigate('Camera');
          }}
        >
          <Icon
            name={'plus-square'}
            color={'black'}
            size={28}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    position: 'absolute',
    bottom: 10,
    height: 28,
    width: 28,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

export default connect(mapStateToProps)(TabBarNavigation);
