import React, { Component } from 'react';
import { Text, StyleSheet, View, FlatList, TextInput, ActivityIndicator,TouchableOpacity} from 'react-native';
import {Card} from 'native-base'
import dbQueries from '../../utils/dbQueries'
import APIFetch from '../../utils/APIFetch'
import connectionInfo from '../../utils/connectionInfo'
import timestamp from '../../assets/timestamp.json'
import { version } from 'moment';
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
        searchList:[],
      }
      
    }
   
    async componentDidMount(){ 
      console.log("data coming this page")
      connectionInfo.addEventToConnection("connectionChange",async()=>{
        var connection = await connectionInfo.isConnection()
          this.fetchLanguages(connection)
        })
        
    }
    async fetchLanguages(netCon){
      var lanVer = []
      var oneDay = 24*60*60*1000; 
      var d = new Date('1-Feb-2000');
      var ud = new Date(timestamp.languageUpdate)
    
      var diffDays = Math.round(Math.abs((d.getTime() - ud.getTime())/(oneDay)))
      console.log("hi fetch languages")
      console.log("difference of days "+diffDays)
  
        if(diffDays <= 20 ){
          console.log("days difference is less  "+diffDays)
          // var languageList =  await dbQueries.getLangaugeList()
            // console.log("language list "+JSON.stringify(languageList))
            // lanVer.push(languageList)
         }
        else{
        console.log("hi in else")
        if(netCon){
          const languageRes = await APIFetch.getLanguages()
          for(var langaugeKey in languageRes){
            const versionRes = await APIFetch.getVersions()
            for(var versionKey in versionRes.bible){

              if(versionKey == langaugeKey){
                var versions = []
                console.log("VERSION RESPONSE KEY"+JSON.stringify(langaugeKey))
                  for(var versionCode in versionRes.bible[versionKey]){
                    console.log("version code "+JSON.stringify(versionCode))
                    versions.push({"versionCode":versionCode,"versionName":'Indian Revised Version'})
                  }
                var langObj = {"languageName":langaugeKey,"languageCode":languageRes[langaugeKey],versionModels:versions}
                lanVer.push(langObj)
                dbQueries.addLangaugeList(langObj)
              }
            }
          }
        }
      }
      this.setState({
        languages: lanVer,
        searchList: lanVer
      })
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

  componentWillMount(){
    // connectionInfo.removeEventToConnection("connectionChange",async()=>{
    //   this.fetchLanguages()
    // })
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

      return (
        <View style={styles.MainContainer}>
          {this.state.languages.length == 0 ? 
           <View style={{alignItems: 'center'}}>   
           <ActivityIndicator 
           size="large" 
           color="#0000ff"/></View>
          :
          <View>
          <TextInput 
          style={styles.TextInputStyleClass}
          onChangeText={(text) => this.SearchFilterFunction(text)}
          value={this.state.text}
          underlineColorAndroid='transparent'
          placeholder="Search Here"
        />
          <FlatList 
            data={this.state.languages}
            extraData={this.state}
            renderItem={({item}) => (
              <TouchableOpacity  onPress={this.goToVersionScreen.bind(this, item)}>
                <Card style={{padding:8}}>
                  <Text>{item.languageName}</Text>
                </Card>
              </TouchableOpacity >
            )}
      
          />
          </View>
          }
        </View>
      );
    }

}
const styles = StyleSheet.create({
 
    MainContainer :{
     flex:1,
     justifyContent:'center',
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