import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';

class Camera extends Component {
  render() {
    return <View />;
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
  };
};


export default connect(mapStateToProps)(Camera);
