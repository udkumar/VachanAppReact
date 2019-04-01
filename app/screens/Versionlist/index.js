import React, { Component } from 'react';
import { AppRegistry, Text,TouchableOpacity ,Alert} from 'react-native';
import { View } from 'native-base';

export default class Versionlist extends Component {
    constructor(props) {
 
        super(props);
      
        console.log("propsvalues........."+JSON.stringify(this.props.navigation.state.params))
        this.state ={
        
        }
    }
    _onLongPressButton =()=> {
     
      this.props.screenProps.Navigatehome()
    }
  
   
  render() {
    return (
      <View>
      <Text style={{fontWeight: 'bold'}}>
    geting version  </Text>
    <TouchableOpacity onPress={this._onLongPressButton}>
      <View>
        <Text style={{color: 'red'}} >
        { this.props.navigation.state.params? this.props.navigation.state.params.data:null} 
        </Text>
        </View>
    </TouchableOpacity>
     
    </View>
    );
  }
}