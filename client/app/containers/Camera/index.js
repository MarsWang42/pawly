import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  CameraRoll,
  Dimensions,
  FlatList,
  Image,
  ImageEditor,
  Linking,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  UIManager,
} from 'react-native';
import Spinner from 'react-native-spinkit';
import RNGooglePlaces from 'react-native-google-places';
import ImageResizer from 'react-native-image-resizer';
import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import { InputGroup, Input } from 'native-base';
import ImageCropper from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Camera from 'react-native-camera';
import * as actions from '../../reducers/picture';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SortableGrid from '../../components/Helpers/SortableGrid';
import Filter from './Filter';
import apis from '../../apis';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const { width, height } = Dimensions.get('window');

class AppCamera extends Component {
  constructor() {
    super();
    this.state = {
      imageWidth: width,
      isEditingInfo: false,
      lastCursor: null,
      loadingMore: false,
      modalPicture: 0,
      noMorePhotos: false,
      path: undefined,
      photos: [],
      pickedPicture: undefined,
      petList: [],
      selectedPets: [],
      view: 'camera',
      caption: '',
    };
    this.takePicture = this.takePicture.bind(this);
    this.pickPicture = this.pickPicture.bind(this);
    this.searchPets = this.searchPets.bind(this);
    this.renderSelectedPet = this.renderSelectedPet.bind(this);
    this.openSearchModal = this.openSearchModal.bind(this);
    this.uploadPicture = this.uploadPicture.bind(this);
  }

  componentDidMount() {
    this.tryPhotoLoad();
    if (Platform === 'ios') {
      Camera.checkVideoAuthorizationStatus().then(
        (response) => { this.setState({ cameraAuthorized: response }); }
      );
    } else {
      this.setState({ cameraAuthorized: true });
    }
    apis.user.petsSearch('', this.props.currentUser.accessToken).then(
      (response) => this.setState({ petList: response.data.pets })
    );
  }

  // Api related methods
  searchPets(keyword) {
    apis.user.petsSearch(keyword, this.props.currentUser.accessToken).then(
      (response) => this.setState({ petList: response.data.pets })
    );
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ isPetListOpen: true });
  }

  // Image related methods
  takePicture() {
    const options = {
      // metadata: {
      //   location: this.props.loc,
      // }
    };
    this.camera.capture(options)
      .then((data) => {
        ImageResizer.createResizedImage(data.path, 1000, 1800, 'JPEG', 80).then((response) => {
          Image.getSize(
            response.uri,
            (imageWidth, imageHeight) => {
              const cropData = {
                  offset: { x: 0, y: (imageHeight - imageWidth) / 2 },
                  size: { width: imageWidth, height: imageWidth},
              //  displaySize:{ width:20, height:20}, THESE 2 ARE OPTIONAL.
              //  resizeMode:'contain',
              };
              ImageEditor.cropImage(
                response.uri,
                cropData,
                (successURI) => {
                  this.setState({
                    view: 'filter',
                    path: successURI,
                    imageWidth,
                  });
                },
                (error) => console.log('cropImage,',error)
              );
            },
            error => console.log(error),
          );
        }).catch((err) => console.error(err));
      }).catch(err => console.error(err));
  }

  cropPicture(uri) {
    ImageCropper.openCropper({
      path: uri,
      width: 1000,
      height: 1000,
      compressImageQuality: 0.8,
    }).then(response => {
      Image.getSize(
        response.path,
        (imageWidth, imageHeight) => {
          this.setState({
            view: 'filter',
            path: response.path,
            imageWidth,
          });
        },
        error => console.log(error),
      );
    }).catch(error => {
      console.log(error);
    });
  }

  pickPicture(url) {
    this.setState({ isFetchingPlaces: true });
    RNGooglePlaces.getCurrentPlace()
      .then(places => this.setState({ places, isFetchingPlaces: false }))
      .catch(error => this.setState({ placeError: error, isFetchingPlaces: false }));
    this.setState({
      pickedPicture: url,
      view: 'image',
    });
  }

  uploadPicture() {
    const { pickedPicture, selectedPlace, selectedPets, caption } = this.state;
    const { currentUser, dispatch, navigation } = this.props;
    let formData = new FormData();
    if (selectedPlace) {
      formData.append('place_name', selectedPlace.name);
      formData.append('google_place_id', selectedPlace.placeID);
      formData.append('longitude', selectedPlace.longitude);
      formData.append('latitude', selectedPlace.latitude);
    }
    formData.append('pets', JSON.stringify(selectedPets.map(pet => pet.id)));
    formData.append('caption', caption);
    formData.append('image',
      { uri: pickedPicture, name: `${uuidv4()}.jpg`, type: 'multipart/formdata' });
    dispatch({
      type: actions.CREATE_PICTURE,
      body: formData,
      token: currentUser.accessToken,
      callback: () => navigation.goBack(),
    });
  }

  // Camera Roll related methods
  tryPhotoLoad() {
    if (!this.state.loadingMore) {
      this.setState({ loadingMore: true }, () => { this.loadPhotos(); });
    }
  }

  loadPhotos() {
    const fetchParams = {
      first: 100,
      assetType: 'Photos',
    };

    if (this.state.lastCursor) {
      fetchParams.after = this.state.lastCursor;
    }

    CameraRoll.getPhotos(fetchParams).then((data) => {
      this.appendAssets(data);
      this.setState({ cameraRollAuthorized: true });
    }).catch((e) => {
      this.setState({ cameraRollAuthorizationError: true });
    });
  }

  appendAssets(data) {
    const photos = data.edges;
    const nextState = {
      loadingMore: false,
    };

    if (!data.page_info.has_next_page) {
      nextState.noMorePhotos = true;
    }

    if (photos.length > 0) {
      nextState.lastCursor = data.page_info.end_cursor;
      nextState.photos = this.state.photos.concat(photos);
    }

    this.setState(nextState);
  }

  endReached() {
    if (!this.state.noMorePhotos) {
      this.tryPhotoLoad();
    }
  }

  // Modal related methods
  openImageModal(id) {
    this.setState({
      isImageModalOpen: true,
      modalPicture: id,
    });
  }

  openSearchModal() {
    RNGooglePlaces.openPlacePickerModal()
      .then((place) => {
        this.setState({ selectedPlace: place });
      })
      .catch(error => console.log(error.message));  // error is a Javascript Error object
  }


  renderPet(pet) {
    const petAvatar = pet.avatar.url;
    const petImageSource = petAvatar ? { uri: petAvatar }
      : require('../../assets/img/pet.png');

    return (
      <TouchableOpacity
        style={styles.petContainer}
        key={pet.id}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          const selectedPets = [...this.state.selectedPets];
          selectedPets.push(pet);
          this.setState({ selectedPets, isPetListOpen: false });
          this.petSearchBar.blur();
        }}
      >
        <Image source={petImageSource} style={styles.petAvatar} />
        <Text style={styles.petName}>{ pet.name }</Text>
        <Text style={styles.username}>Owned by { pet.owner }</Text>
      </TouchableOpacity>
    );
  }

  renderSelectedPet(pet) {
    const petAvatar = pet.avatar.url;
    const petImageSource = petAvatar ? { uri: petAvatar }
      : require('../../assets/img/pet.png');

    return (
      <View
        style={styles.selectedPetContainer}
        key={pet.id}
        doubleTapTreshold={500}
        onDoubleTap={() => {
          this.setState({
            selectedPets: this.state.selectedPets.filter(o => o.id !== pet.id)
          });
        }}
      >
        <Image source={petImageSource} style={styles.selectedPetAvatar} />
        <Text
          numberOfLines={1}
          ellipsizeMode={'head'}
          style={[ styles.petName, {
          maxWidth: 60,
          overflow: 'hidden'
          }]}
        >{ pet.name }</Text>
      </View>
    );
  }

  renderLocationButtons() {
    const { isLocationAuthed } = this.props;
    const { places } = this.state;
    // If location is not authorized, navigate to settings
    if (!isLocationAuthed) {
      return (
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => {
            Linking.canOpenURL('app-settings:').then(supported => {
              if (!supported) {
                console.log('Can\'t handle settings url');
              } else {
                return Linking.openURL('app-settings:');
              }
            }).catch(err => console.error('An error occurred', err))
          }}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={{ fontFamily: 'Lato', fontSize: 13, color: 'grey' }}
          >
            Authroize location now!
          </Text>
        </TouchableOpacity>
      );
    }

    const placeButtons = places ? places.slice(0, 10).map(place => (
      <TouchableOpacity
        key={place.placeID}
        style={styles.locationButton}
        onPress={() => this.setState({ selectedPlace: place })}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={{ fontFamily: 'Lato', fontSize: 13, color: 'grey' }}
        >
          { place.name }
        </Text>
      </TouchableOpacity>
    )) : [];
    placeButtons.push(
      <TouchableOpacity
        key={'add-place'}
        style={[ styles.locationButton, { height: 40 }]}
        onPress={this.openSearchModal}
      >
        <Icon
          name={'search'}
          style={{ fontSize: 14, marginRight: 10 }}
          color={'grey'}
        />
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={{ fontFamily: 'Lato', fontSize: 13, color: 'grey' }}
        >
          Search your place
        </Text>
      </TouchableOpacity>
    );
    return placeButtons;
  }

  // A form to fill before upload the post.
  renderImage() {
    const {
      isFetchingPlaces,
      pickedPicture,
      isPetListOpen,
      selectedPets,
      selectedPlace,
      caption,
    } = this.state;
    // Filter out the selected pets.
    const petList = this.state.petList.filter(pet =>
      selectedPets.findIndex(selectedPet =>
        selectedPet.id === pet.id) === -1
    );
    return (
      <View style={{ flex: 1 }}>
        { isPetListOpen && (
          <TouchableOpacity
            style={[styles.overlay, { top: 40 }]}
            activeOpacity={1}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              this.setState({ isPetListOpen: false });
              this.petSearchBar.blur();
            }}
          />
        ) }
        { isPetListOpen &&
          <FlatList
            style={styles.petList}
            data={petList}
            renderItem={({ item }) => this.renderPet(item)}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={(
              <Text
                style={{
                  fontFamily: 'Lato-italic',
                  fontSize: 15,
                  textAlign: 'center',
                  flex: 1,
                  margin: 5,
                }}
              >
                No pets found.
              </Text>
            )}
          />
        }
        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <InputGroup style={{ paddingLeft: 16 }}
          >
            <Icon
              name={'search'}
              style={{ fontSize: 18 }}
            />
            <TextInput
              placeholder={'Add pets from you or your following list!'}
              placeholderTextColor={'grey'}
              style={styles.searchInput}
              onFocus={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                this.setState({ isPetListOpen: true });
              }}
              onChangeText={_.debounce(this.searchPets, 200)}
              ref={petSearchBar => this.petSearchBar = petSearchBar}
            />
          </InputGroup>
          { selectedPets.length !== 0 && (
            <Text style={{ width, textAlign: 'center', fontFamily: 'Lato', color: 'grey', fontSize: 12 }}>
              Double Tap to remove a pet.
            </Text>
          ) }
          { selectedPets.length === 0 ? (
            <TouchableOpacity
              style={{
                height: 100,
                width,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => this.petSearchBar.focus()}
            >
              <Icon
                name={'plus'}
                style={{ fontSize: 30 }}
                color={'grey'}
              />
              <Text style={{
                fontFamily: 'Lato-bold',
                fontSize: 16,
                textAlign: 'center',
                color: 'grey'
              }}>
                Add pets from your or the people you following.
              </Text>
            </TouchableOpacity>
          ) : (
            <SortableGrid
              onDragRelease = {({ itemOrder }) => {
                const selectedPetList = [...selectedPets];
                for (let i = 0; i < itemOrder.length; i++) {
                  selectedPetList.find(pet => pet.id.toString() === itemOrder[i].key).order = i;
                }
                selectedPetList.sort((a, b) => a.order - b.order);
                this.setState({ selectedPets: selectedPetList });
              }}
            >
              { selectedPets.map(this.renderSelectedPet) }
            </SortableGrid>
          ) }
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              paddingVertical: 10,
              alignItems: 'center',
              justifyContent: 'space-around',
              borderBottomWidth: 1,
              borderColor: 'grey',
            }}
          >
            <TouchableOpacity onPress={() => this.openImageModal()}>
              <Image
                style={{ height: 80, width: 80, borderRadius: 4, overflow: 'hidden' }}
                source={{ uri: pickedPicture }}
              />
            </TouchableOpacity>
            <View style={{ width: width / 2, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Lato', fontSize: 18 }}>Your location</Text>
              { !selectedPlace && !isFetchingPlaces && (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ height: 90, flexGrow: 0 }}
                >
                  { this.renderLocationButtons() }
                </ScrollView>
              ) }
              { isFetchingPlaces && (
                <View style={{ height: 90, justifyContent: 'center', alignItems: 'center' }}>
                  <Spinner type={'Pulse'} size={30} color={'grey'} />
                </View>
              ) }
              { selectedPlace && (
                <View style={{ height: 90, justifyContent: 'center', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => this.openSearchModal()}>
                    <Text style={{ textAlign: 'center', fontFamily: 'Lato', fontSize: 18, color: 'grey' }}>
                      { selectedPlace.name }
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ marginTop: 10 }}
                    onPress={() => this.setState({ selectedPlace: undefined })}
                  >
                    <Icon
                      name={ 'remove' }
                      color={ 'grey' }
                      size={20}
                      style={{ textAlign: 'center' }}
                    />
                  </TouchableOpacity>
                </View>
              ) }
            </View>
          </View>
          <TextInput
            multiline
            style={styles.textInput}
            placeholderTextColor={'grey'}
            placeholder={'Say something! Maximum 200 charactres.'}
            maxLength={200}
            value={caption}
            onChangeText={(caption) => this.setState({caption})}
          />
        </KeyboardAwareScrollView>
        <View style={styles.uploadButtonContainer}>
          <TouchableOpacity style={styles.uploadButton} onPress={this.uploadPicture}>
            <Text style={{ fontFamily: 'Lato-bold', fontSize: 20, color: '#107896' }}>
              Upload !
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderCamera() {
    return (
      <ScrollView
        contentContainerStyle={styles.scrollView}
        onScroll={e => {
          let currentHeight = e.nativeEvent.contentSize.height,
            offset = e.nativeEvent.contentOffset.y;
          if ( height + offset >= currentHeight / 2 ) {
            this.endReached();
          }
        }}
      >
        <View style={styles.cameraContainer}>
          <Camera
            defaultOnFocusComponent
            captureTarget={Camera.constants.CaptureTarget.disk}
            captureQuality={'high'}
            style={styles.camera}
            aspect={Camera.constants.Aspect.fill}
            ref={(cam) => {
              this.camera = cam;
            }}
          />
          <TouchableOpacity style={styles.captureButton} onPress={this.takePicture}>
            <Icon
              name={ 'circle-o' }
              color={ 'rgba(255, 255, 255, 0.8)' }
              size={40}
              style={{ textAlign: 'center' }}
            />
          </TouchableOpacity>
        </View>
        {
          this.state.photos.map((p, i) => {
            return (
              <TouchableOpacity
                style={{opacity: i === this.state.index ? 0.5 : 1}}
                key={i}
                underlayColor='transparent'
                onPress={() => this.cropPicture(p.node.image.uri, p.node.location)}
              >
                <Image
                  style={{
                    width: width / 3,
                    height: width / 3,
                  }}
                  source={{uri: p.node.image.uri}}
                />
              </TouchableOpacity>
            );
          })
        }
      </ScrollView>
    );
  }

  renderContent() {
    const { view, path, imageWidth } = this.state;
    switch (view) {
      case 'camera': {
        return this.renderCamera();
      }
      case 'filter': {
        return (
          <Filter
            source={path}
            imageWidth={imageWidth}
            pickPicture={this.pickPicture}
          />
        );
      }
      case 'image': {
        return this.renderImage();
      }
      default: {
        return <View />;
      }
    }
  }

  render() {
    const { view, pickedPicture, isImageModalOpen, modalPicture } = this.state;
    const { isLoading, navigation } = this.props;
    return (
      <View style={styles.container}>
        { isLoading && (
          <View
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              this.setState({ isPetListOpen: false });
              this.petSearchBar.blur();
            }}
          >
            <View style={styles.spinnerContainer}>
              <Spinner type={'ChasingDots'} size={60} color={'white'} />
            </View>
          </View>
        ) }
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={{ fontFamily: 'Lato', fontSize: 16 }}>Back</Text>
        </TouchableOpacity>
        <LinearGradient
          style={styles.header}
          start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
          colors={['#ECE9E6', '#ffffff']}
        >
          <Text style={styles.title}>
            { view === 'camera' ? 'Pick a picture' : view === 'filter' ? 'Select a Filter' : 'Upload!' }
          </Text>
        </LinearGradient>
        <Modal isVisible={isImageModalOpen} style={styles.modal}>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'black',
            }}
            activeOpacity={1}
            onPress={() => this.setState({ isImageModalOpen: false })}
          >
            <Image
              style={{ height: width, width }}
              source={{ uri: pickedPicture }}
            />
          </TouchableOpacity>
        </Modal>
        { this.renderContent() }
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
  modal: {
    margin: 0,
  },
  camera: {
    height: width,
    width,
  },
  image: {
    height: width,
    width,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: 100,
    borderRadius: 8,
    backgroundColor: '#ffb438'
  },
  petList: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 3,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'grey',
    maxHeight: 200,
    backgroundColor: '#fff',
  },
  petContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    padding: 5,
  },
  selectedPetContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 5,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: '#e63460',
    backgroundColor: 'white',
  },
  petAvatar: {
    height: 30,
    width: 30,
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
    backgroundColor: '#ececec'
  },
  selectedPetAvatar: {
    height: 30,
    width: 30,
    borderRadius: 4,
    marginBottom: 5,
    overflow: 'hidden',
    backgroundColor: '#ececec'
  },
  petName: {
    fontFamily: 'Lato',
    fontSize: 15,
  },
  username: {
    fontFamily: 'Lato-Italic',
    fontSize: 13,
    color: 'gray',
    backgroundColor: 'transparent',
    marginLeft: 5
  },
  textInput: {
    fontSize: 15,
    fontFamily: 'Lato',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: 'Lato',
    fontSize: 15,
    padding: 10,
  },
  contain: {
    flex: 1,
    height: 150,
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width,
  },
  locationButton: {
    borderWidth: 1,
    borderColor: '#107896',
    width: 150,
    height: 20,
    borderRadius: 8,
    margin: 3,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    position: 'absolute',
    bottom: 30,
    left: 25,
    right: 25,
    borderWidth: 3,
    borderColor: '#107896',
    height: 35,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  cameraContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    position: 'absolute',
    bottom: 10,
    left: width / 2 - 20,
    zIndex: 10,
    backgroundColor: 'transparent',
  }
});

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
    currentLocation: state.session.currentLocation,
    isLocationAuthed: state.session.isLocationAuthed,
    isLoading: state.picture.isCreatingPicture,
  };
};

export default connect(mapStateToProps)(AppCamera);
