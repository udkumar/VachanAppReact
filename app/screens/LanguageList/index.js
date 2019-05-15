import React, { Component } from 'react';
import { Text, StyleSheet, View, FlatList, TextInput, ActivityIndicator,TouchableOpacity} from 'react-native';
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
   
        isLoading: false,
        text: '',
        languages:[],
        searchList:[]
      }
      
    }
   
    async  componentDidMount() {
      this.setState({isLoading:true})
      const languageRes = await APIFetch.getLanguages()
      console.log("langauge response "+languageRes)
      var lanVer = []
          for(var key in languageRes){
            lanVer.push({"languageName":key,"languageCode":languageRes[key]})
            // dbQueries.addLangaugeList(key,responseJson[key])
          }
          this.setState({
            isLoading: false,
             languages: lanVer,
             searchList: lanVer
            })
          // dbQueries.getLangaugeList()
        this.setState({isLoading:false})
    }
   
    goToVersionScreen (value) {
     this.props.navigation.navigate('VersionList',  {languages: value });
    }

    SearchFilterFunction(text){
      const newData = this.state.searchList.filter(function(item){
          const itemData = item.languageName
          const textData = text.toLowerCase()
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
              <TouchableOpacity  onPress={this.goToVersionScreen.bind(this, item)}>
                <Card style={{padding:8}}>
                  <Text >{item.languageName}</Text>
                </Card>
              </TouchableOpacity >
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