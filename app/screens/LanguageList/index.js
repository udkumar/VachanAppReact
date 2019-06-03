import React, { Component } from 'react';
import { Text, StyleSheet, View, FlatList, TextInput, ActivityIndicator,NetInfo,TouchableOpacity} from 'react-native';
import {Card} from 'native-base'
import dbQueries from '../../utils/dbQueries'
import APIFetch from '../../utils/APIFetch'
import timestamp from '../../assets/timestamp.json'
export default class LanguageList extends Component {

    static navigationOptions = ({navigation}) => ({
        headerTitle: 'Languages',
    });
    constructor(props){
      super(props)
        this.state = {
          isLoading: false,
          text: '',
          languages:[],
          searchList:[],
          isConnected:this.props.screenProps.isConnected
      }
      
    }
  
    componentDidUpdate(){
      if(this.props.screenProps.isConnected == true && this.state.languages.length == 0){
      this.fetchLanguages()
      }
    }

    async fetchLanguages(){
      var lanVer = []
      var oneDay = 24*60*60*1000; 
      var d = new Date('1-feb-2000')
      var ud = new Date(timestamp.languageUpdate)
      var diffDays = Math.round(Math.abs((d.getTime() - ud.getTime())/(oneDay)))
      
        if(diffDays <= 20 ){
          console.log("diff ")
          var languageList =  await dbQueries.getLangaugeList()
          console.log("lanaguage list "+JSON.stringify(languageList))
            for(var i =0 ; i<languageList.length-1;i++){
            lanVer.push(languageList[i])
            }
            if(languageList.length ==0){
              const versionRes = await APIFetch.getVersions()
              if(versionRes){
                for(var language in versionRes.bible){
                  var versions = []
                  console.log(" langauge code "+language+" version res "+JSON.stringify(versionRes.bible[language]))
                  for(var versionCode in versionRes.bible[language]){
                    var version = {"versionCode":versionCode,"versionName":'Indian Revised Version',versionId:versionRes.bible[language][versionCode].version_id}
                    versions.push(version)
                    var langObj = {"languageName":language,versionModels:versions}
                  }
                  await dbQueries.addLangaugeList(langObj,versions)
                  lanVer.push(langObj)
                }
              }
            }
        }
        else{
          const versionRes = await APIFetch.getVersions()
          if(versionRes){
            for(var language in versionRes.bible){
              var versions = []
              console.log(" langauge code "+language+" version res "+JSON.stringify(versionRes.bible[language]))
              for(var versionCode in versionRes.bible[language]){
                var version = {"versionCode":versionCode,"versionName":'Indian Revised Version',versionId:versionRes.bible[language][versionCode].version_id}
                versions.push(version)
                var langObj = {"languageName":language,versionModels:versions}
              }
              await dbQueries.addLangaugeList(langObj,versions)
              lanVer.push(langObj)
            }
          }
        }
      this.setState({
        languages: lanVer,
        searchList: lanVer
      })
      
    }
  //  async fetchFromApi(){
  //    console.log("connected in LANGUAGE PAGE")
  //   //  if(connected){
  //    console.log("connected in LANGUAGE PAGE")
  //     const versionRes = await APIFetch.getVersions()
  //     if(versionRes){
  //       for(var language in versionRes.bible){
  //         var versions = []
  //         console.log(" langauge code "+language+" version res "+JSON.stringify(versionRes.bible[language]))
  //         for(var versionCode in versionRes.bible[language]){
  //           var version = {"versionCode":versionCode,"versionName":'Indian Revised Version',versionId:versionRes.bible[language][versionCode].version_id}
  //           versions.push(version)
  //           var langObj = {"languageName":language,versionModels:versions}
  //         }
  //         await dbQueries.addLangaugeList(langObj,versions)
  //         lanVer.push(langObj)
  //       }
  //     }
     
  //   //  }
  //   // else{
  //   //   alert("no intenet connection")
  //   // }
  //  }

    goToVersionScreen(value){
      console.log('value passesed '+value)
     this.props.navigation.navigate('VersionList',  {versions: value });
    }

    SearchFilterFunction = (text)=>{
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
    console.log("is connected langagueg page"+this.props.screenProps.isConnected)
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
              <TouchableOpacity  onPress={()=>this.goToVersionScreen(item)}>
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