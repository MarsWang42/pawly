import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import * as urls from '../../apis';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import uuidv4 from 'uuid/v4';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ImageCropper from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';
import * as actions from '../../reducers/session';

const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

class Avatar extends Component {
  constructor() {
    super();
    this.state = {
      avatarSource: '',
    };
    this.showImagePicker = this.showImagePicker.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.validate = this.validate.bind(this);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.updateError
      && nextProps.updateError !== this.props.updateError
      && nextProps.updateError.username
    ) {
      this.setState({ usernameError: 'Username already taken.' });
    }
  }

  showImagePicker() {
    this.setState({ isLoadingImage: true });
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        this.setState({ isLoadingImage: false });
      } else if (response.error) {
      } else {
        ImageCropper.openCropper({
          path: response.uri,
          width: 600,
          height: 600,
          compressImageQuality: 0.5,
          includeBase64: true,
        }).then(response => {
          // Put image in a form to upload
          let formData = new FormData();
          formData.append('avatar',
            { uri: response.path, name: `${uuidv4()}.jpg`, type: 'multipart/formdata' });
          this.props.dispatch({
            type: actions.UPLOAD_AVATAR,
            image: formData,
            token: this.props.currentUser.accessToken,
            callback: () => this.setState({ isLoadingImage: false }),
          });
        }).catch(error => {
          this.setState({ isLoadingImage: false });
        });
      }
    });
  }

  validate() {
    const { username } = this.state;
    if (!username) {
      this.setState({ usernameError: 'Username is required.'});
      return false;
    } else if (username.length < 4) {
      this.setState({ usernameError: 'Username too short.'});
      return false;
    } else if (username.length > 20) {
      this.setState({ usernameError: 'Username too long.'});
      return false;
    } else {
      this.setState({ usernameError: undefined });
      return true;
    }
  }

  updateUsername() {
    const { username } = this.state;
    axios({
      method: 'post',
      headers: { Authorization: this.props.currentUser.accessToken },
      url: urls.USERNAME_URL,
      data: { username },
    }).then((response) => {
      if (response.data.exist) {
        this.setState({ usernameError: 'Username already taken.' })
      } else {
        this.props.setUsername(username);
      }
    }).catch(() => {
      this.setState({ usernameError: 'Network error.' })
    })
  }

  render() {
    const { currentUser, updateError } = this.props;
    const { isLoadingImage, username, usernameError } = this.state;

    let avatarUrl = currentUser && currentUser.avatar;
    if (!avatarUrl && currentUser && currentUser.facebookId) {
      avatarUrl = `https://graph.facebook.com/${currentUser.facebookId}/picture?width=9999`;
    }
    const imageSource = avatarUrl ? { uri: avatarUrl }
      : require('../../assets/img/user-default.png');

    return (
      <View style={styles.container}>
        { isLoadingImage && <View style={styles.overlay} /> }
        <TouchableOpacity onPress={this.showImagePicker}>
          <Image source={imageSource} style={styles.uploadAvatar} />
          <LinearGradient
            colors={['#1c92d2', '#f2fcfe']}
            style={styles.plus}
          >
            <Text style={{ color: 'white', backgroundColor: 'transparent' }}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.title}>
          Choose a unique username
        </Text>
        <View style={styles.textInputContainer}>
          <Icon
            name={'account'}
            size={22}
            color={'white'}
            style={{ paddingHorizontal: 10 }}
          />
          <TextInput
            blurOnSubmit={ true }
            autoCapitalize={'none'}
            placeholder={'4-20 characters'}
            placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
            value={username}
            style={styles.textInput}
            onChangeText={(text) => this.setState({ username: text })}
          />
        </View>
        <View style={styles.warningContainer}>
          { usernameError ?
            <Text style={styles.warningText}>{ usernameError }</Text>
            : null
          }
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() =>{
            if (this.validate()) {
              this.updateUsername();
            }
          }}
        >
          <MaterialIcon
            name={'pets'}
            size={22}
            color={'white'}
            style={{ paddingHorizontal: 5 }}
          />
          <Text style={styles.text}>I'm a pet owner!</Text>
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Lato', color: 'white', fontSize: 14 }}>
          - Or -
        </Text>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() =>{
            if (this.validate()) {
              this.props.dispatch({
                type: actions.UPDATE_USER,
                update: { username: username },
                token: currentUser.accessToken,
              })
            }
          }}
        >
          <MaterialIcon
            name={'pets'}
            size={22}
            color={'white'}
            style={{ paddingHorizontal: 5 }}
          />
          <Text style={styles.text}>I'm a pet lover!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
  },
  plus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Lato',
    color: 'white',
    fontSize: 26,
    marginTop: 30,
    marginBottom: 15,
  },
  uploadAvatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
    overflow: 'hidden',
  },
  textInputContainer: {
    flexDirection: 'row',
    height: 40,
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    borderRadius: 4,
    alignItems: 'center',
  },
  textInput: {
    fontSize: 16,
    color: '#fff',
    height: 40,
    width: 175,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,

    height: height <= 480 ? 30 : 40,
    width: 175,

    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F6F6F6',
    borderRadius: 8,
  },
  text: {
    fontSize: 17,
    color: 'white',
    fontFamily: 'Lato',
    marginHorizontal: 5,
  },
  warningContainer: {
    height: 12,
    marginHorizontal: height <= 480 ? 30 : 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 12,
    color: 'yellow',
    textAlign: 'center'
  },
});

const mapStateToProps = (state) => {
  return {
    isCheckingUser: state.session.isCheckingUser,
    currentUser: state.session.currentUser,
    updateError: state.session.updateError,
  };
};

export default connect(mapStateToProps)(Avatar);
