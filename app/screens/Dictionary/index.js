import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
// import DbQueries from '../utils/dbQueries'

export default class Dictionary extends Component {
  static navigationOptions = {
    headerTitle: 'Dictionary',
  };

  render() {
    return (
      <View>
       <Text>Dictionary</Text>
      </View>
    );
  }
}
