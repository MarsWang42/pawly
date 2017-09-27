import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const DefaultTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    backgroundColor: React.PropTypes.string,
    activeTextColor: React.PropTypes.string,
    inactiveTextColor: React.PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: View.propTypes.style,
    renderTab: React.PropTypes.func,
    underlineStyle: View.propTypes.style,
  },

  getDefaultProps() {
    return {
      activeTextColor: '#2e2e2e',
      inactiveTextColor: '#9a9a9a',
      backgroundColor: null,
    };
  },

  renderTabOption(name, page) {
  },

  renderTab(name, page, isTabActive, onPressHandler) {
    const { activeTextColor, inactiveTextColor, textStyle } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = '600';

    return <TouchableOpacity
      style={styles.flexOne}
      key={name}
      accessible={true}
      accessibilityLabel={name}
      accessibilityTraits='button'
      onPress={() => onPressHandler(page)}
    >
      <View style={[styles.tab, this.props.tabStyle, ]}>
        { name === 'Nearby' ? (
          <View style={{ flexDirection: 'row' }}>
            <Text style={[{color: textColor, fontWeight }, textStyle, ]}>
              Nearby
            </Text>
            <Icon
              size={ 16 }
              style={{ marginTop: 2, marginLeft: 5 }}
              name={'location-arrow'}
              color={textColor}
            />
          </View>
        ) : (
          <Text style={[{color: textColor, fontWeight }, textStyle, ]}>
            { name }
          </Text>
        )}
      </View>
    </TouchableOpacity>;
  },

  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: 40,
      height: 5,
      backgroundColor: '#e63460',
      bottom: 3,
      borderRadius: 3,
      shadowColor: '#000000',
      shadowOpacity: 0.4,
      shadowRadius: 1,
      shadowOffset: {
        height: 1,
        width: 1,
      },
    };
    const startLeft = (containerWidth + 20) / (2 * numberOfTabs) - 20;
    const endLeft = (3 * (containerWidth - 20)) / (2 * numberOfTabs) - 20;

    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [startLeft, endLeft ],
    });
    return (
      <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor, }, this.props.style, ]}>
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, this.props.goToPage);
        })}
        <Animated.View style={[tabUnderlineStyle, { left }, this.props.underlineStyle, ]} />
      </View>
    );
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  flexOne: {
    flex: 1,
  },
  tabs: {
    height: 55,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
    zIndex: 5,
  },
});

module.exports = DefaultTabBar;
