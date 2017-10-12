import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Picker,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-spinkit';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconM from 'react-native-vector-icons/MaterialIcons';
import * as actions from '../../reducers/pet';

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function ucfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class AdoptionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };

    this.inputs = [];

    this.submitForm = this.submitForm.bind(this);
    this.validate = this.validate.bind(this);
  }

  validate() {
    const { email, fullName, phone, introduction, reason } = this.state;
    let valid = true;
    if (!fullName) {
      this.setState({ fullNameError: 'Full name is required.'});
      valid = false;
    } else if (fullName .length > 40) {
      this.setState({ fullNameError: 'Full name too long.'});
      valid = false;
    } else {
      this.setState({ petNameError: undefined });
    }

    if (!email || !validateEmail(email) ) {
      this.setState({ emailError: 'Please input a valid email.'});
      valid = false;
    } else {
      this.setState({ emailError: false });
    }

    if (!phone || phone.length !== 10 ) {
      this.setState({ phoneError: 'Please input a valid phone number.'});
      valid = false;
    } else {
      this.setState({ phoneError: false });
    }

    if (!introduction) {
      this.setState({ introductionError: 'Please introduce yourself.'});
      valid = false;
    } else if (introduction.length > 200){
      this.setState({ introductionError: 'Introduction too long.'});
      valid = false;
    } else {
      this.setState({ introductionError: false });
    }

    if (!reason) {
      this.setState({ reasonError: 'Please introduce yourself.'});
      valid = false;
    } else if (reason.length > 200){
      this.setState({ reasonError: 'Introduction too long.'});
      valid = false;
    } else {
      this.setState({ reasonError: false });
    }
    return valid;
  }

  submitForm() {
    if (this.validate()) {
      const { fullName, email, phone, introduction, reason } = this.state;
      const { currentUser, navigation, pet, dispatch } = this.props;
      let formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('reason', reason);
      formData.append('introduction', introduction);
      dispatch({
        type: actions.REQUEST_ADOPTION,
        petId: pet.id,
        payload: formData,
        token: currentUser.accessToken,
        callback: () => navigation.goBack(),
      });
    }
  }

  render() {
    const { currentUser, isLoading, pet } = this.props;
    const {
      fullName,
      email,
      phone,
      introduction,
      reason,
      fullNameError,
      emailError,
      phoneError,
      introductionError,
      reasonError,
    } = this.state;

    const petImageSource = pet.avatar ? { uri: pet.avatar }
      : require('../../assets/img/pet.png');

    return (
      <LinearGradient
        colors={['#e63460', '#e6535a']}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
          <Image source={petImageSource} style={styles.petAvatar} />
          <Text
            style={{
              fontFamily: 'Lato-bold',
              color: 'white',
              fontSize: 16,
              marginTop: 10,
              marginBottom: 5,
            }}
          >
            { pet.name }
          </Text>
          <Text style={{ fontFamily: 'Lato', color: 'white', fontSize: 13 }}>
            { ucfirst(pet.type) }
          </Text>
          <View style={[styles.textInputContainer, { marginTop: 30  }]}>
            <Icon
              name={'account'}
              size={22}
              color={'white'}
              style={{ paddingHorizontal: 10 }}
            />
            <TextInput
              blurOnSubmit={ false }
              autoCapitalize={'none'}
              placeholder={'Your Full Name'}
              placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
              value={fullName}
              style={styles.textInput}
              onChangeText={(text) => this.setState({ fullName: text })}
              ref={input => { this.inputs[0] = input; }}
              onSubmitEditing={() => this.inputs[1].focus()}
            />
          </View>
          <View style={styles.warningContainer}>
            { fullNameError ?
              <Text style={styles.warningText}>{ fullNameError }</Text>
              : null
            }
          </View>
          <View style={styles.textInputContainer}>
            <Icon
              name={'email'}
              size={22}
              color={'white'}
              style={{ paddingHorizontal: 10 }}
            />
            <TextInput
              blurOnSubmit={ false }
              autoCapitalize={'none'}
              placeholder={'Contact Email'}
              placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
              value={email}
              keyboardType={'email-address'}
              style={styles.textInput}
              onChangeText={(text) => this.setState({ email: text })}
              ref={input => { this.inputs[1] = input; }}
              onSubmitEditing={() => this.inputs[2].focus()}
            />
          </View>
          <View style={styles.warningContainer}>
            { emailError ?
              <Text style={styles.warningText}>{ emailError }</Text>
              : null
            }
          </View>
          <View style={styles.textInputContainer}>
            <Icon
              name={'phone'}
              size={22}
              color={'white'}
              style={{ paddingHorizontal: 10 }}
            />
            <TextInput
              blurOnSubmit={ false }
              autoCapitalize={'none'}
              placeholder={'Phone Number'}
              placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
              value={phone}
              style={styles.textInput}
              keyboardType={'phone-pad'}
              onChangeText={(text) => this.setState({ phone: text })}
              ref={input => { this.inputs[2] = input; }}
              onSubmitEditing={() => this.inputs[3].focus()}
            />
          </View>
          <View style={styles.warningContainer}>
            { phoneError ?
              <Text style={styles.warningText}>{ phoneError }</Text>
              : null
            }
          </View>
          <Text
            style={{
              fontFamily: 'Lato',
              fontSize: 17,
              color: 'rgba(255, 255, 255, 0.8)',
              marginTop: 20,
            }}
          >
            Introduction
          </Text>
          <TextInput
            multiline
            style={styles.longInput}
            placeholderTextColor={'lightgrey'}
            placeholder={'Write something about yourself! Maximum 200 charactres.'}
            maxLength={200}
            value={introduction}
            onChangeText={(text) => this.setState({ introduction: text })}
            ref={input => { this.inputs[3] = input; }}
          />
          <View style={styles.warningContainer}>
            { introductionError ?
            <Text style={styles.warningText}>{ introductionError }</Text>
              : null
            }
          </View>
          <Text
            style={{
              fontFamily: 'Lato',
              fontSize: 17,
              color: 'rgba(255, 255, 255, 0.8)',
              marginTop: 20,
            }}
          >
            Why you interested in {pet.name}?
          </Text>
          <TextInput
            multiline
            style={styles.longInput}
            placeholderTextColor={'lightgrey'}
            placeholder={'Maximum 400 charactres.'}
            maxLength={400}
            value={reason}
            onChangeText={(text) => this.setState({ reason: text })}
            ref={input => { this.inputs[4] = input; }}
          />
          <View style={styles.warningContainer}>
            { reasonError ?
            <Text style={styles.warningText}>{ reasonError }</Text>
              : null
            }
          </View>
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
                <Text style={styles.text}>Send</Text>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
  }
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: height - 45,
    backgroundColor: 'transparent',
    alignItems: 'center',
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
  petAvatar: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginTop: 50,
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
    height: 30,
    width: width - 100,
    marginVertical: 10,
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    borderRadius: 4,
    alignItems: 'center',
  },
  textInput: {
    fontSize: 16,
    color: '#fff',
    height: 40,
    width: width - 140,
  },
  longInput: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Lato',
    height: 200,
    width: width - 60,
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
    marginTop: 50,
    marginBottom: 25,

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

export default connect(mapStateToProps)(AdoptionForm);
