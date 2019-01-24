import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
// import DbQueries from '../utils/dbQueries'
import Icon from 'react-native-vector-icons/MaterialIcons'


export default class Audio extends Component {
  static navigationOptions = ({navigation}) =>{
    return{
        headerTitle:(<Text style={{fontSize:16,color:"white",marginLeft:10}}>Audio</Text>),
        headerRight:(
            <Icon name="close"  style={{fontSize:20,marginRight:10,color:"#fff"}}/>
        )
    }
}
  
  render() {
    return (
      <View>
       <Text onPress={this.props.navigation.navigate("SelectBook")}>go to next </Text>
      </View>
    );
  }
}
