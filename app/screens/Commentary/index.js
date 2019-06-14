import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions
} from 'react-native';
// import DbQueries from '../utils/dbQueries'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default class Commentary extends Component {
  static navigationOptions = {
    headerTitle: 'Commentary',
    headerRight:(
      <View style={{flexDirection:"row",justifyContent:"flex-end"}}>
      <TextInput
      // placeholder="Search"
      underlineColorAndroid = '#fff'
      placeholderTextColor={'#fff'} 
      returnKeyType="search"
      multiline={false}
      numberOfLines={1}
      style={{width:Dimensions.get('window').width/4}}
     
    />
      <Icon name='search' color="#fff" size={28} style={{marginHorizontal:8}} />
    </View>
    )
  };

  render() {
    return (
      <View>
       <Text>Commentary</Text>
      </View>
    );
  }
}
