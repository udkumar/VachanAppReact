import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
// import DbQueries from '../../../../utils/dbQueries'

export default class Dictionary extends Component {
  static navigationOptions = {
    headerTitle: 'Dictionary',
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
       <Text>Dictionary</Text>
      </View>
    );
  }
}
