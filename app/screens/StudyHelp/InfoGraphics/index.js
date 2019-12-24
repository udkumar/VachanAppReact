import React,{Component} from 'react';
import {
  Text,
  View
} from 'react-native';
var RNFS = require('react-native-fs');




export default class Infographics extends Component {
  
    constructor(props){
       console.log("commentry props ",props)
      super(props)
        
    }
 
  render(){
   return(
       <Text>Infographics</Text>
   )
  }
 
}
