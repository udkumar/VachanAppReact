import React, { Component } from 'react';
import { AppRegistry, Text,TouchableOpacity ,Alert,FlatList} from 'react-native';
import { View } from 'native-base';

export default class Versionlist extends Component {
    constructor(props) {
        super(props);
        console.log("propsvalues........."+JSON.stringify(this.props.navigation.state.params))
        this.state = {
          langaugeProp:this.props.navigation.state.params ? this.props.navigation.state.params.languages.language : null,
          versionData:[]
        }
    }
    _onLongPressButton =()=> {
      this.props.screenProps.Navigatehome()
    }
    componentDidMount() {
      return fetch('https://stagingapi.autographamt.com/app/versions')
        .then((response) => response.json())
        .then((responseJson) => {
          var data = []
          for(var key in responseJson.bible){
              if(key == this.state.langaugeProp){
                console.log("VERSION RESPONSE KEY"+JSON.stringify(responseJson.bible[key]))
                data.push(responseJson.bible[key])
              }
          }
          this.setState({
            isLoading: false,
            versionData:data
            })
        })
        .catch((error) => {
          console.error(error);
        });
    }
  
  render() {
    console.log("version data "+JSON.stringify(Object.keys(this.state.versionData)))
    return (
      <View style={{flex:1}}>
      {
         this.state.versionData.length > 0 ?  
         this.state.versionData.map((item)=>{
          return Object.keys(item).map((value,i) =>
          <Text key={i}>{item[value].version_id}</Text>
        )
         })
         : null 
       } 
     </View>
    );
  }
}