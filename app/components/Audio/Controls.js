import React, { Component } from 'react';

import {
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

const Controls = ({
  styles,
  paused,
  onPressPlay,
  onPressPause,
  onBack,
  onForward,
  forwardDisabled,
}) => (
    <View style={styles.controlerContainer}>
      <View style={{ width: 20 }} />
      <Icon onPress={onBack} styles={styles.iconStyle} name="fast-rewind" size={24} />
      <View style={{ width: 10 }} />
      {!paused ?
        <View style={styles.playButton}>
          <Icon onPress={onPressPause} name="pause" size={24} style={[styles.iconStyle, forwardDisabled && { opacity: 0.3 }]} />
        </View>
        :
        <View style={styles.playButton}>
          <Icon onPress={onPressPlay} styles={styles.iconStyle} name="play-arrow" size={24} />
        </View>
      }
      <View style={{ width: 10 }} />
      <Icon onPress={onForward} styles={styles.iconStyle} name="fast-forward" size={24} />
      <View style={{ width: 20 }} />

    </View>
  );

export default Controls;

