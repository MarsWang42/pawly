import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import uuidv4 from 'uuid/v4';
import Spinner from 'react-native-spinkit';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ImageCropper from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal'
const Clarifai = require('clarifai');
import * as actions from '../../reducers/session';

function ucfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

const app = new Clarifai.App({
  apiKey: 'c5dc272a19e141d8893da0ed6ba1658b'
});

class Avatar extends Component {
  constructor() {
    super();
    this.state = {
      isModalVisible: false,
      petAvatar: '',
      petName: '',
      petType: 'dog',
    };
    this.showPetImagePicker = this.showPetImagePicker.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal() {
    this.setState({ isModalVisible: true });
  }

  hideModal() {
    this.setState({ isModalVisible: false });
  }

  showPetImagePicker() {
    this.setState({ isLoadingImage: true });
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        this.setState({ isLoadingImage: false });
      } else if (response.error) {
      } else {
        ImageCropper.openCropper({
          path: response.uri,
          width: 300,
          height: 300,
          compressImageQuality: 0.5,
          includeBase64: true,
        }).then(response => {
          this.setState({ isRecognizingImage: true });
          this.setState({
            petAvatar: response.path,
            isLoadingImage: false,
          });
          app.models.predict(Clarifai.GENERAL_MODEL, { base64: response.data })
            .then((response) => {
              const petType = response.outputs[0].data.concepts[0].name;
              this.setState({ petType, isRecognizingImage: false });
            }).catch((response) => {
              this.setState({ isRecognizingImage: false });
            });
        }).catch(error => {
          this.setState({ isLoadingImage: false });
        });
      }
    });
  }

  submitForm() {
    const { petAvatar, petName, petType } = this.state;
    const { username } = this.props;
    let formData = new FormData();
    formData.append('username', username)
    formData.append('pet_name', petName);
    formData.append('pet_type', petType);
    formData.append('pet_avatar',
      { uri: petAvatar, name: `${uuidv4()}.jpg`, type: 'multipart/formdata' });
    this.props.dispatch({
      type: actions.UPDATE_USER,
      update: formData,
      token: this.props.currentUser.accessToken,
    });
  }

  render() {
    const { currentUser } = this.props;
    const { isLoadingImage, petAvatar, petType, isRecognizingImage } = this.state;

    const userImageSource = petAvatar ? { uri: petAvatar }
      : require('../../assets/img/pet.png');

    return (
      <KeyboardAwareScrollView scrollEnabled={false} style={{ flex: 1 }} >
        <View style={styles.container}>
          <Modal
            isVisible={this.state.isModalVisible}
            backdropColor={'grey'}
            backdropOpacity={0.8}
            animationIn={'zoomIn'}
            animationOut={'zoomOut'}
            animationInTiming={500}
            animationOutTiming={500}
            backdropTransitionInTiming={500}
            backdropTransitionOutTiming={500}
          >
            <View style={styles.modalContent}>
              <Text>Hello!</Text>
              <TouchableOpacity onPress={this.hideModal}>
                <View style={styles.button}>
                  <Text>Hello</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
          { isLoadingImage && <View style={styles.overlay} /> }
          <TouchableOpacity onPress={this.showPetImagePicker}>
            <Image source={userImageSource} style={styles.uploadAvatar} />
          </TouchableOpacity>
          <Text style={styles.title}>
            Name of your pet?
          </Text>
          <View style={styles.textInputContainer}>
            <Icon
              name={'account'}
              size={22}
              color={'white'}
              style={{ paddingHorizontal: 10 }}
            />
            <TextInput
              blurOnSubmit={ false }
              autoCapitalize={'none'}
              returnKeyType={ 'go' }
              placeholder={'8-20 characters'}
              placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
              value={this.state.petName}
              style={styles.textInput}
              onChangeText={(text) => this.setState({ petName: text })}
            />
          </View>
          <Text style={styles.title}>
            Type
          </Text>
          <TouchableOpacity
            style={styles.textContainer}
            onPress={this.showModal}
          >
            { isRecognizingImage ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Spinner type={'Wave'} size={20} color={'#fff'} />
              </View>
            ) : (
              <Text style={styles.text}>{ ucfirst(petType) }</Text>
            ) }
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.submitForm}
          >
            <MaterialIcon
              name={'pets'}
              size={22}
              color={'white'}
              style={{ paddingHorizontal: 5 }}
            />
            <Text style={styles.text}>Let's Go!</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
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
    overflow: 'hidden',
  },
  textInputContainer: {
    flexDirection: 'row',
    height: 40,
    marginHorizontal: 30,
    marginVertical: 10,
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    borderRadius: 4,
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    height: 40,
    width: 200,
    marginVertical: 10,
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 17,
    color: 'white',
    height: 40,
    width: width - 150,
    textAlign: 'center',
  },
  text: {
    fontSize: 17,
    color: 'white',
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,

    height: height <= 480 ? 30 : 40,
    width: 175,

    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F6F6F6',
    borderRadius: 8,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});

const mapStateToProps = (state) => {
  return {
    isCheckingUser: state.session.isCheckingUser,
    currentUser: state.session.currentUser,
  };
};

export default connect(mapStateToProps)(Avatar);
