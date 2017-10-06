import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as sessionActions from '../../reducers/session';
import * as pictureActions from '../../reducers/picture';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      text: '',
    };
    this.submitComment = this.submitComment.bind(this);
  }

  submitComment() {
    const { dispatch, target, currentUser, pictureId, closeModal } = this.props;
    const { text } = this.state;
    dispatch({
      type: pictureActions.COMMENT_PICTURE,
      pictureId,
      body: text,
      token: currentUser.accessToken,
      targetId: target && target.id,
      callback: closeModal,
    });
  }

  render() {
    const { dispatch, closeModal, target } = this.props;
    const { text } = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={closeModal}>
          <Text style={{ fontFamily: 'Lato', fontSize: 16 }}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.post} onPress={this.submitComment}>
          <Text style={{ fontFamily: 'Lato', fontSize: 16, color: '#ffbf4a' }}>Post</Text>
        </TouchableOpacity>
        <LinearGradient
          style={styles.header}
          start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
          colors={['#ECE9E6', '#ffffff']}
        >
          <Text style={styles.title}>
            Comment
          </Text>
        </LinearGradient>
        <View style={{ flex: 1, paddingTop: 10 }}>
          <TextInput
            multiline
            style={styles.textInput}
            placeholderTextColor={'grey'}
            placeholder={target ? `Reply ${target.username}` : 'Add a comment...'}
            maxLength={200}
            value={text}
            onChangeText={(text) => this.setState({text})}
          />
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
    top: 30,
    left: 30,
    zIndex: 10,
    width: 80,
    backgroundColor: 'transparent',
  },
  post: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 10,
    width: 80,
    backgroundColor: 'transparent',
    alignItems: 'flex-end'
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
  textInput: {
    fontSize: 15,
    fontFamily: 'Lato',
    flex: 1,
    padding: 20,
  },
});

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
    userDetails: state.user.userDetails.toJS(),
  };
};

export default connect(mapStateToProps)(Settings);
