import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FitImage from 'react-native-fit-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class PictureCard extends Component {
  render() {
    const { data } = this.props;

    const pl = data.pets.length;
    const ll = data.likers.length;
    const cl = data.comments.length;
    let petNames, likerNames, comments;
    if (pl >= 3) {
      petNames = `${data.pets[0].name}, ${data.pets[1].name} and ${pl - 2} others`;
    } else if (pl === 2) {
      petNames = `${data.pets[0].name} and ${data.pets[1].name}`;
    } else {
      petNames = data.pets[0].name;
    }
    if (ll >= 2) {
      likerNames = `${data.likers[0]} and ${ll - 1} others`;
    } else {
      likerNames = data.likers[0];
    }
    if (cl >= 3) {
      comments = (
        <View style={styles.commentContainer}>
          { data.comments.slice(0, 3).map((comment, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Lato-Italic', fontSize: 12 }}>{ comment.username }: </Text>
              <Text style={{ fontFamily: 'Lato', fontSize: 12 }}>{ comment.text }</Text>
            </View>
          )) }
          <Text>See more</Text>
        </View>
      );
    } else {
      comments = (
        <View style={styles.commentContainer}>
          { data.comments.map((comment, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Lato-Italic', fontSize: 12 }}>{ comment.username }: </Text>
              <Text style={{ fontFamily: 'Lato', fontSize: 12 }}>{ comment.text }</Text>
            </View>
          )) }
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.petAvatarContainer}>
            <Image
              style={[styles.firstPetAvatar, { left: pl === 1 ? 20 : 2 ? 15 : 5 }]}
              source={{ uri: data.pets[0].avatar }}
            />
            { data.pets[1] &&
              <Image
                style={[styles.secondPetAvatar, { left: pl === 2 ? 26 : 21 }]}
                source={{ uri: data.pets[1].avatar }}
              />
            }
            { data.pets[2] &&
              <Image style={styles.thirdPetAvatar} source={{ uri: data.pets[2].avatar }}/>
            }
          </View>
          <View style={styles.petInfoContainer}>
            <Text style={styles.petName}>{ petNames }</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <Text style={{ fontSize: 11, fontFamily: 'Lato' }}>Taken by </Text>
              <Text style={styles.username}>{ data.creator.name }</Text>
            </View>
          </View>
        </View>
        <FitImage
          source={{ uri: data.image }}
          style={styles.image}
        />
        <View style={styles.footerContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name={'heart-outline'} size={20} color={'#e6535a'} style={{ marginTop: 2 }} />
            <Text style={{ fontSize: 12, fontFamily: 'Lato', marginLeft: 5 }}>Liked by </Text>
            <Text style={styles.likername}>{ likerNames }</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            { comments }
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor:'#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  petAvatarContainer: {
    flexDirection: 'row',
    height: 40,
    width: 60,
    alignItems: 'center',
  },
  firstPetAvatar: {
    height: 25,
    width: 25,
    borderRadius: 12,
    position: 'absolute',
    top: 8,
    zIndex: 3,
    borderWidth: 2,
    borderColor: 'white'
  },
  secondPetAvatar: {
    height: 25,
    width: 25,
    borderRadius: 12,
    position: 'absolute',
    top: 8,
    zIndex: 2,
    borderWidth: 2,
    borderColor: 'white'
  },
  thirdPetAvatar: {
    height: 25,
    width: 25,
    borderRadius: 12,
    position: 'absolute',
    top: 8,
    left: 27,
    zIndex: 1,
    borderWidth: 2,
    borderColor: 'white'
  },
  petInfoContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  petName: {
    fontFamily: 'Lato-Italic',
    fontSize: 12,
  },
  username: {
    fontFamily: 'Lato-Bold',
    fontSize: 11,
  },
  likername: {
    fontFamily: 'Lato-Bold',
    fontSize: 13,
  },
  commentContainer: {
    marginLeft: 10,
    marginTop: 5,
  },
  footerContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  }
});

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
  };
};


export default connect(mapStateToProps)(PictureCard);
