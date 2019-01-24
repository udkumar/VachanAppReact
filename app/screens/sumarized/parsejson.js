import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,Image,FlatList,
  View
} from 'react-native';
 

 
export default class Summary extends Component {
constructor(){
  super()
  this.state ={
    dataValue:[]
  }
}

componentDidMount(){
fetch('https://api.autographamt.com/v2/alignments/40001005/grkhin')
.then((response)=>response.json())
.then((responsejson)=>{
const data =responsejson;
console.log("jsondata"+JSON.stringify(data))
this.setState({
  dataValue:data.englishword
  
})
})
.catch((error)=>{
  console.error(error);
})
}



  render(){
    console.log("data "+ JSON.stringify(this.state.dataValue))
    return (
    <View>
      {
        this.state.dataValue ?
        <FlatList
        data={this.state.dataValue}
        renderItem={({item})=>
        <View>
            <Text>{item}</Text>
        </View>
            }
          />:null
      }
     
  </View>
    );
  }
}
 