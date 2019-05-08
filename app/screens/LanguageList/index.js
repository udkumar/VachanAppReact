import React, { Component } from 'react';
import { Text, StyleSheet, View, FlatList, TextInput, ActivityIndicator} from 'react-native';
import {Card} from 'native-base'
import dbQueries from '../../utils/dbQueries'
import APIFetch from '../../utils/APIFetch'
export default class LanguageList extends Component {

    static navigationOptions = ({navigation}) => ({
        headerTitle: 'Languages',
    });

    constructor(props) {
 
      super(props);
   
      this.state = {
   
        isLoading: true,
        text: '',
        languages:[],
        searchList:[]
      }
      
    }
   
     componentDidMount() {
      const languageRes = APIFetch.getLanguages()
      console.log("langauge response "+languageRes)

    //   return fetch('https://stagingapi.autographamt.com/app/languages')
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //       var lanVer = []
    //       for(var key in responseJson){
    //         lanVer.push({"language":key,"languageCode":responseJson[key]})
    //         // dbQueries.addLangaugeList(key,responseJson[key])
    //       }
    //       this.setState({
    //         isLoading: false,
    //          languages: lanVer,
    //          searchList:lanVer
    //         })
    //       dbQueries.getLangaugeList()
    //       // console.log("language list "+langList)
    //       // console.log("json data "+JSON.stringify(responseJson))
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
        
    }
   
    goToVersionScreen (value) {
     this.props.navigation.navigate('VersionList',  {languages: value });
    }

    SearchFilterFunction(text){
      const newData = this.state.searchList.filter(function(item){
          const itemData = item.language
          const textData = text
          return itemData.indexOf(textData) > -1
      })
      console.log("new DATA "+newData+" TEXT "+text)
      this.setState({
          text: text,
          languages:newData
      })
  }
  
    ListViewItemSeparator = () => {
      return (
        <View
          style={{
            height: .5,
            width: "100%",
            backgroundColor: "#000",
          }}
        />
      );
    }
   
   
    render() {
      // console.log("lANGUAGES .....",this.state.languages)
      return (
        <View style={styles.MainContainer}>
          <TextInput 
           style={styles.TextInputStyleClass}
           onChangeText={(text) => this.SearchFilterFunction(text)}
           value={this.state.text}
           underlineColorAndroid='transparent'
           placeholder="Search Here"
         />
          {this.state.languages.length > 0 ? 
          <FlatList 
            data={this.state.languages}
            extraData={this.state}
            renderItem={({item}) => (
                <Card style={{padding:8}}>
                  <Text onPress={this.goToVersionScreen.bind(this, item)}>{item.language}</Text>
                </Card>
            )}
      
          />
          :null}
        </View>
      );
    }

}
const styles = StyleSheet.create({
 
    MainContainer :{
     flex:1,
     margin:8
     },
    
    rowViewContainer: {
      fontSize: 17,
      padding: 10
     },
    
     TextInputStyleClass:{
      // position:'absolute',
      // top:0,
      textAlign: 'center',
      height: 40,

      borderWidth: 1,
      borderColor: '#009688',
      borderRadius: 7 ,
      backgroundColor : "#FFFFFF"
           
      }
    
   });
   