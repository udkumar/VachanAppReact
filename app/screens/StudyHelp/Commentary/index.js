import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions
} from 'react-native';
// import DbQueries from '../../../../utils/dbQueries'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Card,} from 'native-base'
import { FlatList } from 'react-native-gesture-handler';


const ListItems = [
  {
    Commentary:'Commentary1',

  },
  {
    Commentary:'Commentary2',
  },
  {
    Commentary:'Commentary3',
  }
]
export default class Commentary extends Component {
  static navigationOptions = {
    headerTitle: 'Commentary',

  };

  render() {
    return (
      <View>
        <FlatList
        data={ListItems}
        renderItem={({data})=>{
          <View><Text>{data.Commentary}</Text></View>
        }}
        />
      </View>
    );
  }
}
