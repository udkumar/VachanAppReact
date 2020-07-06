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
  styles,
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
  <View style={styles.controlerContainer}>
    <View style={{width: 20}} />
    {/* <TouchableOpacity > */}
      <Icon onPress={onBack} styles={styles.iconStyle} name="fast-rewind"  size={24} />
    {/* </TouchableOpacity> */}
    <View style={{width: 10}} />
    {!paused ?
      // <TouchableOpacity onPress={onPressPause}>
        <View style={styles.playButton}>
        <Icon onPress={onPressPause} name="pause" size={24}  style={[styles.iconStyle,forwardDisabled && {opacity: 0.3}]}/>
        </View>
      // </TouchableOpacity> 
      :
      // <TouchableOpacity >
        <View style={styles.playButton}>
        <Icon  onPress={onPressPlay} styles={styles.iconStyle}   name="play-arrow" size={24}/>
        </View>
      //  </TouchableOpacity> 
    }
    <View style={{width: 10}} />
    {/* <TouchableOpacity  */}
      {/* disabled={forwardDisabled}> */}
      <Icon   onPress={onForward} styles={styles.iconStyle} name="fast-forward" size={24}  />
    {/* </TouchableOpacity> */}
    <View style={{width: 20}} />
    
  </View>
);

export default Controls;

