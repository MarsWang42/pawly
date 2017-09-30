import React, { Component } from 'react';
import { Animated, Keyboard } from 'react-native';

class KeyboardAvoidView extends Component {
  constructor(props) {
    super(props);

    this.keyboardHeight = new Animated.Value(0);
  }

  componentWillMount () {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
    }).start();
  };

  keyboardWillHide = (event) => {
    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0,
    }).start();
  };

  render() {
    return (
      <Animated.View style={{ ...this.props.style, flex: 1, paddingBottom: this.keyboardHeight }}>
        { this.props.children }
      </Animated.View>
    );
  }
}

export default KeyboardAvoidView;
