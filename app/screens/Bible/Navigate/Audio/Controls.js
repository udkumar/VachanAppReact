import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

const Controls = ({
  paused,
  shuffleOn,
  repeatOn,
  onPressPlay,
  onPressPause,
  onBack,
  onForward,
  onPressShuffle,
  onPressRepeat,
  forwardDisabled,
}) => (
  <View style={styles.container}>
    <View style={{width: 20}} />
    <TouchableOpacity onPress={onBack}>
      <Icon name="fast-rewind" size={30} />
    </TouchableOpacity>
    <View style={{width: 10}} />
    {!paused ?
      <TouchableOpacity onPress={onPressPause}>
        <View style={styles.playButton}>
        <Icon name="pause" size={30}  style={[forwardDisabled && {opacity: 0.3}]}/>
        </View>
      </TouchableOpacity> :
      <TouchableOpacity onPress={onPressPlay}>
        <View style={styles.playButton}>
        <Icon name="play-arrow" size={30}/>
        </View>
      </TouchableOpacity>
    }
    <View style={{width: 10}} />
    <TouchableOpacity onPress={onForward}
      disabled={forwardDisabled}>
      <Icon name="fast-forward" size={30}  />
    </TouchableOpacity>
    <View style={{width: 20}} />
    
  </View>
);

export default Controls;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop: 8,
  },
  playButton: {
    height:56,
    width: 56,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 58 / 2,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  
  secondaryControl: {
    // height: 18,
    // width: 18,
  },
  off: {
    opacity: 0.30,
  }
})