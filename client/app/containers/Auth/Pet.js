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
  Picker,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
function getPetType(concepts) {
  for (let i = 0, l = concepts.length; i < l; i++) {
    switch (concepts[i].name) {
      case 'dog': {
        return 'dog';
      }
      case 'cat': {
        return 'cat';
      }
      case 'rabbit': {
        return 'rabbit';
      }
      case 'hamster': {
        return 'hamster';
      }
      case 'fish': {
        return 'fish';
      }
      case 'parrot': {
        return 'parrot';
      }
      case 'chinchilla': {
        return 'chinchilla';
      }
      case 'lizard': {
        return 'lizard';
      }
      case 'snake': {
        return 'snake';
      }
      case 'rodent': {
        return 'rodent';
      }
      default: {
        return 'Others';
      }
    }
  }
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
      petType: '',
    };
    this.showPetImagePicker = this.showPetImagePicker.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.validate = this.validate.bind(this);
  }

  showModal() {
    this.setState({ isModalVisible: true });
  }

  hideModal() {
    this.setState({ isModalVisible: false });
  }

  validate() {
    const { petName } = this.state;
    if (!petName) {
      this.setState({ petNameError: 'Name is required.'});
      return false;
    } else if (petName.length > 20) {
      this.setState({ petNameError: 'Name too long.'});
      return false;
    } else {
      this.setState({ petNameError: undefined });
      return true;
    }
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
              const petType = getPetType(response.outputs[0].data.concepts);
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
    if (this.validate()) {
      const { petAvatar, petName, petType } = this.state;
      const { username, currentUser } = this.props;
      let formData = new FormData();
      formData.append('username', username)
      formData.append('pet_name', petName);
      formData.append('pet_type', petType);
      formData.append('pet_avatar',
        { uri: petAvatar, name: `${uuidv4()}.jpg`, type: 'multipart/formdata' });
      this.props.dispatch({
        type: actions.UPDATE_USER,
        update: formData,
        token: currentUser.accessToken,
      });
    }
  }

  render() {
    const { currentUser } = this.props;
    const { isLoadingImage, petAvatar, petType, isRecognizingImage, petNameError } = this.state;

    const userImageSource = petAvatar ? { uri: petAvatar }
      : require('../../assets/img/pet.png');

    return (
      <KeyboardAwareScrollView scrollEnabled={false} style={{ flex: 1 }} >
        <View style={styles.container}>
          <Modal
            isVisible={this.state.isModalVisible}
            backdropColor={'black'}
            backdropOpacity={0.3}
            animationIn={'zoomIn'}
            animationOut={'zoomOut'}
            animationInTiming={300}
            animationOutTiming={300}
            backdropTransitionInTiming={300}
            backdropTransitionOutTiming={300}
            onBackdropPress={this.hideModal}
          >
            <LinearGradient
              colors={['#ECE9E6', '#ffffff']}
              style={styles.modalContent}
            >
              <Text style={styles.petOptionsTitle}>
                <MaterialIcon
                  name={'pets'}
                  size={24}
                  color={'#141823'}
                  style={{ marginHorizontal: 5 }}
                />
                &nbsp;Type
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  style={{ width: '100%' }}
                  selectedValue={petType}
                  itemStyle={{ color: '#141823', fontSize: 19 }}
                  onValueChange={(itemValue) => this.setState({ petType: itemValue })}
                >
                  <Picker.Item label="Cat" value="cat" />
                  <Picker.Item label="Dog" value="dog" />
                  <Picker.Item label="Chinchilla" value="chinchilla" />
                  <Picker.Item label="Fish" value="fish" />
                  <Picker.Item label="Lizard" value="lizard" />
                  <Picker.Item label="Parrot" value="parrot" />
                  <Picker.Item label="Rabbit" value="rabbit" />
                  <Picker.Item label="Rodent" value="rodent" />
                  <Picker.Item label="Snake" value="snake" />
                  <Picker.Item label="Others" value="others" />
                </Picker>
              </View>
            </LinearGradient>
          </Modal>
          { isLoadingImage && <View style={styles.overlay} /> }
          <TouchableOpacity onPress={this.showPetImagePicker}>
            <Image source={userImageSource} style={styles.uploadAvatar} />
            <LinearGradient
              colors={['#1c92d2', '#f2fcfe']}
              style={styles.plus}
            >
              <Text style={{ color: 'white', backgroundColor: 'transparent' }}>+</Text>
            </LinearGradient>
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
              placeholder={'Pawly'}
              placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
              value={this.state.petName}
              style={styles.textInput}
              onChangeText={(text) => this.setState({ petName: text })}
            />
          </View>
          <View style={styles.warningContainer}>
            { petNameError ?
              <Text style={styles.warningText}>{ petNameError }</Text>
              : null
            }
          </View>
          <Text style={styles.title}>
            Type
          </Text>
          <Text style={{ fontFamily: 'Lato', color: 'white', textAlign: 'center' }}>
            Try upload a photo of him/her, we can guess the type!
          </Text>
          <TouchableOpacity
            style={styles.textContainer}
            onPress={this.showModal}
          >
            { isRecognizingImage ? (
              <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.text}>Guessing... </Text>
                <Spinner type={'Wave'} size={20} color={'#fff'} />
              </View>
            ) : (
            <Text style={styles.text}>{ ucfirst(petType) || 'No pic detected.' }</Text>
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
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  petOptionsTitle: {
    fontFamily: 'Lato',
    color: '#141823',
    fontSize: 26,
    marginBottom: 15,
  },
  pickerContainer: {
    height: 120,
    width: width - 100,
    padding: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadAvatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    overflow: 'hidden',
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
    fontSize: 16,
    color: '#fff',
    height: 40,
    width: width - 200,
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
    marginTop: 50,

    height: height <= 480 ? 30 : 40,
    width: 175,

    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F6F6F6',
    borderRadius: 8,
  },
  modalContent: {
    padding: 22,
    height: 200,
    borderWidth: 2,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    overflow: 'hidden',
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
  };
};

export default connect(mapStateToProps)(Avatar);
