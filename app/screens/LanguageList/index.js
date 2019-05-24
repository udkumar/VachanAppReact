import React, { Component } from 'react';
import { Text, StyleSheet, View, FlatList, TextInput, ActivityIndicator,TouchableOpacity} from 'react-native';
import {Card} from 'native-base'
import dbQueries from '../../utils/dbQueries'
import APIFetch from '../../utils/APIFetch'
import connectionInfo from '../../utils/connectionInfo'
import timestamp from '../../assets/timestamp.json'
import { version, lang } from 'moment';
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
   
    componentDidMount(){ 
      console.log("data coming this page")
      // connectionInfo.addEventToConnection("connectionChange",async()=>{
        // var connection = await connectionInfo.isConnection()
          this.fetchLanguages()
      // })
    }
    async fetchLanguages(){
      var lanVer = []
      var oneDay = 24*60*60*1000; 
      var d = new Date('1-feb-2000')
      var ud = new Date(timestamp.languageUpdate)
      var diffDays = Math.round(Math.abs((d.getTime() - ud.getTime())/(oneDay)))
        if(diffDays <= 20 ){
          var languageList =  await dbQueries.getLangaugeList()
            for(var i =0 ; i<languageList.length-1;i++){
            lanVer.push(languageList[i])
            }
            if(languageList.length == 0){
              const languageRes = await APIFetch.getLanguages()
              for(var langaugeKey in languageRes){
                const versionRes = await APIFetch.getVersions()
                for(var versionKey in versionRes.bible){
                  if(versionKey == langaugeKey){
                    var langObj = {"languageName":langaugeKey,"languageCode":languageRes[langaugeKey],versionModels:{"versionCode":"irv","versionName":'Indian Revised Version'}}
                    dbQueries.addLangaugeList(langObj,{"versionCode":"irv","versionName":'Indian Revised Version'})
                    lanVer.push(langObj)
                  }
                }
              }
            }
         }
        else {
          const languageRes = await APIFetch.getLanguages()
              for(var langaugeKey in languageRes){
                const versionRes = await APIFetch.getVersions()
                for(var versionKey in versionRes.bible){
                  if(versionKey == langaugeKey){
                    var langObj = {"languageName":langaugeKey,"languageCode":languageRes[langaugeKey],versionModels:{"versionCode":"irv","versionName":'Indian Revised Version'}}
                    dbQueries.addLangaugeList(langObj,{"versionCode":"irv","versionName":'Indian Revised Version'})
                    lanVer.push(langObj)
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
      this.setState({
          text: text,
          languages:newData
      })
  }

  // async fetchApiData(){
  //   var lanVer = []
  //   const languageRes = await APIFetch.getLanguages()
  //   for(var langaugeKey in languageRes){
  //     const versionRes = await APIFetch.getVersions()
  //     for(var versionKey in versionRes.bible){
  //       if(versionKey == langaugeKey){
          // var versions = []
          // console.log("VERSION RESPONSE KEY"+JSON.stringify(langaugeKey))
          //   for(var versionCode in versionRes.bible[versionKey]){
          //     console.log("version code "+JSON.stringify(versionCode))
          //     versions.push({"versionCode":versionCode,"versionName":'Indian Revised Version'})
          //   }
          // var langObj = {"languageName":langaugeKey,"languageCode":languageRes[langaugeKey],versionModels:versions}
          // dbQueries.addLangaugeList(langObj,versions)
          // lanVer.push(langObj)
          // return lanVer


          //for now adding version dynamically 
  //         var langObj = {"languageName":langaugeKey,"languageCode":languageRes[langaugeKey],versionModels:[{"versionCode":"irv","versionName":'Indian Revised Version'}]}
  //         dbQueries.addLangaugeList(langObj,[{"versionCode":"irv","versionName":'Indian Revised Version'}])
  //         lanVer.push(langObj)
  //       }
  //     }
  //   }
  //   // return lanVer
  // }

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
           <View style={{flex:1,alignItems: 'center',justifyContent:'center'}}>   
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