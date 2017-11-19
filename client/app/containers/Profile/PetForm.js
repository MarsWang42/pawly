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
import IconM from 'react-native-vector-icons/MaterialIcons';
import ImageCropper from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';
const Clarifai = require('clarifai');
import * as actions from '../../reducers/pet';

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
        return 'others';
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

class PetForm extends Component {
  constructor(props) {
    super(props);
    const { pet } = props;
    this.state = {
      isModalVisible: false,
      petAvatar: (pet && pet.avatar) || '',
      petName: (pet && pet.name) || '',
      petType: (pet && pet.type) || '',
      gender: (pet && pet.gender) || '',
      bio: (pet && pet.bio) || '',
      isPetAvatarUpdated: false,
      isRescue: (pet && pet.isRescue) || false,
      isMissing: (pet && pet.isMissing) || false,
    };
    this.showPetImagePicker = this.showPetImagePicker.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.showModal = this.showModal.bind(this);
    this.toggleRescue = this.toggleRescue.bind(this);
    this.toggleMissing = this.toggleMissing.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.validate = this.validate.bind(this);
  }

  showModal() {
    this.setState({ isModalVisible: true });
  }

  hideModal() {
    this.setState({ isModalVisible: false });
  }

  toggleRescue() {
    this.setState({ isRescue: !this.state.isRescue });
  }

  toggleMissing() {
    this.setState({ isMissing: !this.state.isMissing });
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
          width: 600,
          height: 600,
          compressImageQuality: 0.5,
          includeBase64: true,
        }).then(response => {
          this.setState({
            isRecognizingImage: true,
            petAvatar: response.path,
            isLoadingImage: false,
            isPetAvatarUpdated: true,
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
      const { isPetAvatarUpdated, petAvatar, petName, petType, bio, isMissing, isRescue, gender } = this.state;
      const { currentUser, navigation, pet, dispatch } = this.props;
      let formData = new FormData();
      formData.append('name', petName);
      formData.append('type', petType || 'others');
      formData.append('gender', gender);
      formData.append('bio', bio);
      formData.append('is_rescue', isRescue);
      formData.append('is_missing', isMissing);
      if (isPetAvatarUpdated) {
        formData.append('avatar',
          { uri: petAvatar, name: `${uuidv4()}.jpg`, type: 'multipart/formdata' });
      }
      if (!pet) {
        dispatch({
          type: actions.CREATE_PET,
          payload: formData,
          token: currentUser.accessToken,
          callback: () => navigation.goBack(),
        });
      } else {
        dispatch({
          type: actions.EDIT_PET,
          petId: pet.id,
          payload: formData,
          token: currentUser.accessToken,
          callback: () => navigation.goBack(),
        });
      }
    }
  }

  render() {
    const { pet, currentUser, isLoading, navigation } = this.props;
    const {
      isLoadingImage,
      bio,
      petAvatar,
      petType,
      gender,
      isRecognizingImage,
      petNameError,
      isRescue,
      isMissing,
    } = this.state;

    const petImageSource = petAvatar ? { uri: petAvatar }
      : require('../../assets/img/pet.png');

    return (
      <KeyboardAwareScrollView scrollEnabled={false} style={{ flex: 1 }} >
        <LinearGradient
          colors={['#e63460', '#e6535a']}
          style={styles.container}
        >
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
                <IconM
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
                  <Picker.Item label='- Select a type -' value='' />
                  <Picker.Item label='Cat' value='cat' />
                  <Picker.Item label='Dog' value='dog' />
                  <Picker.Item label='Chinchilla' value='chinchilla' />
                  <Picker.Item label='Fish' value='fish' />
                  <Picker.Item label='Lizard' value='lizard' />
                  <Picker.Item label='Parrot' value='parrot' />
                  <Picker.Item label='Rabbit' value='rabbit' />
                  <Picker.Item label='Rodent' value='rodent' />
                  <Picker.Item label='Snake' value='snake' />
                  <Picker.Item label='Others' value='others' />
                </Picker>
              </View>
            </LinearGradient>
          </Modal>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <IconM name={'arrow-back'} size={36} color={'white'} />
          </TouchableOpacity>
          { isLoadingImage && <View style={styles.overlay} /> }
          <View style={{ width, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={this.showPetImagePicker} style={{ height: 80, width: 80 }}>
                <Image source={petImageSource} style={styles.uploadAvatar} />
                <LinearGradient
                  start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
                  colors={['#1c92d2', '#f2fcfe']}
                  style={styles.plus}
                >
                  <Text style={{ color: 'white', backgroundColor: 'transparent' }}>+</Text>
                </LinearGradient>
              </TouchableOpacity>
              <View style={styles.petButtons}>
                <TouchableOpacity
                  style={[styles.petButton, {
                    borderColor: '#ffe1af',
                    backgroundColor: isRescue ? '#ffe1af' : 'transparent',
                  }]}
                  onPress={this.toggleRescue}
                >
                  <Text style={[styles.petButtonText, { color: isRescue ? 'black' : '#ffe1af' }]}>
                    Rescue
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.petButton, {
                    borderColor: '#aeffe1',
                    backgroundColor: isMissing ? '#aeffe1' : 'transparent',
                  }]}
                  onPress={this.toggleMissing}
                >
                  <Text style={[styles.petButtonText, { color: isMissing ? 'black' : '#aeffe1' }]}>
                    Missing
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ width: width - 175, justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.textInputContainer}>
                <Icon
                  name={'account'}
                  size={18}
                  color={'white'}
                  style={{ paddingLeft: 8, paddingRight: 4 }}
                />
                <TextInput
                  blurOnSubmit={ false }
                  autoCapitalize={'none'}
                  placeholder={'Name'}
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
              <TouchableOpacity
                style={styles.textInputContainer}
                onPress={this.showModal}
              >
                <Icon
                  name={'paw'}
                  size={18}
                  color={'white'}
                  style={{ paddingLeft: 8, paddingRight: 4 }}
                />
                { isRecognizingImage ? (
                  <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Spinner type={'Wave'} size={14} color={'#fff'} />
                  </View>
                ) : (
                <Text
                  style={{ flex: 1, fontFamily: 'Lato', fontSize: 14, color: petType ? 'white' : 'rgba(255, 255, 255, 0.5)' }}
                >
                  { ucfirst(petType) || 'Type' }
                </Text>
                ) }
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: width - 200,
                  marginTop: 22
                }}
              >
                <TouchableOpacity
                  style={[styles.genderButton, { backgroundColor: gender === 'male' ? 'white' : 'transparent' }]}
                  onPress={() => this.setState({ gender: 'male' })}
                >
                  <Icon
                    name={'gender-male'}
                    size={16}
                    color={gender === 'male' ? '#2f61d0' : 'white'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderButton, { backgroundColor: gender === 'female' ? 'white' : 'transparent' }]}
                  onPress={() => this.setState({ gender: 'female' })}
                >
                  <Icon
                    name={'gender-female'}
                    size={16}
                    color={gender === 'female' ? '#d1152d' : 'white'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Text
            style={{
              fontFamily: 'Lato',
              fontSize: 17,
              color: 'rgba(255, 255, 255, 0.8)',
              marginTop: 20,
            }}
          >
            Bio
          </Text>
          <TextInput
            multiline
            style={styles.bioInput}
            placeholderTextColor={'lightgrey'}
            placeholder={'Say something! Maximum 200 charactres.'}
            maxLength={200}
            value={bio}
            onChangeText={(bio) => this.setState({bio})}
          />
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.submitForm}
            disabled={isLoading}
          >
            { isLoading ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Spinner type={'Wave'} size={20} color={'#fff'} />
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconM
                  name={'pets'}
                  size={22}
                  color={'white'}
                  style={{ paddingHorizontal: 5 }}
                />
                <Text style={styles.text}>{ pet ? 'Save' : 'Add Pet!' }</Text>
              </View>
            )}
          </TouchableOpacity>
        </LinearGradient>
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
  back: {
    position: 'absolute',
    top: 36,
    left: 20,
    zIndex: 10,
    width: 80,
    backgroundColor: 'transparent',
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
    height: 80,
    width: 80,
    borderRadius: 40,
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
  petButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  petButton: {
    width: 70,
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 4,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  petButtonText: {
    fontFamily: 'Lato',
    fontSize: 13,
    backgroundColor: 'transparent'
  },
  textInputContainer: {
    flexDirection: 'row',
    height: 30,
    width: width - 200,
    marginVertical: 10,
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    borderRadius: 4,
    alignItems: 'center',
  },
  textInput: {
    width: width - 230,
    color: 'white',
    fontSize: 15,
  },
  genderButton: {
    width: (width - 220) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 4,
  },
  bioInput: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Lato',
    height: height - 400,
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    borderRadius: 4,
    marginTop: 10,
    marginHorizontal: 30,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: width <= 325 ? 30 : 50,

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
  text: {
    fontFamily: 'Lato-bold',
    fontSize: 17,
    color: 'white',
  },
});

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
    isLoading: state.pet.isCreatingPet || state.pet.isEditingPet,
  };
};

export default connect(mapStateToProps)(PetForm);
