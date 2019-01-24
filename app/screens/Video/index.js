import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

// import DbQueries from '../utils/dbQueries'

export default class Video extends Component {
  static navigationOptions = ({navigation}) =>{
    return{
        headerTitle:(<Text style={{fontSize:16,color:"white",marginLeft:10}}>Video</Text>),
        headerRight:(
            <Icon name="close"  style={{fontSize:20,marginRight:10,color:"#fff"}}/>
        )
    }
}

  render() {
    return (
      <View>
       <Text>Video</Text>
      </View>
    );
  }
}
