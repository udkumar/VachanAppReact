import React, { Component } from 'react';
import { Text, StyleSheet,ScrollView, View,ActivityIndicator,TextInput,FlatList,LayoutAnimation,UIManager,Platform,TouchableOpacity} from 'react-native';
import {Card} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'
import dbQueries from '../../utils/dbQueries'
import APIFetch from '../../utils/APIFetch'
import timestamp from '../../assets/timestamp.json'
import  grammar from 'usfm-grammar'
import { getBookNameFromMapping, getBookSectionFromMapping, getBookNumberFromMapping } from '../../utils/UtilFunctions';

class ExpandableItemComponent extends Component {
  constructor() {
    super();
    this.state = {
      layoutHeight: 0,
    };
  }
  componentWillReceiveProps(nextProps){
    console.log("next props "+JSON.stringify(nextProps))
    if (nextProps.item.isExpanded) {
      this.setState(() => {
        return {
          layoutHeight: null,
        };
      });
    } else {
      this.setState(() => {
        return {
          layoutHeight: 0,
        };
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log("should update next props "+JSON.stringify(nextProps)+ "next state "+nextState)
    if (this.state.layoutHeight !== nextState.layoutHeight) {
      return true;
    }
    return false;
  }

//   DownloadBible(){}

 
  render() {
      console.log("version model "+JSON.stringify(this.props.item.isExpanded))
    return (
      <View>
      <Card>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.props.onClickFunction}
          style={styles.header}
        >
          <Text style={styles.headerText}>{this.props.item.languageName}</Text>
          <Icon name={this.props.item.isExpanded ? "keyboard-arrow-down" : "keyboard-arrow-up" } style={styles.iconStyle} size={24}/>
        </TouchableOpacity>
        <View
          style={{
            height: this.state.layoutHeight,
            overflow: 'hidden',
          }}>
          {/*Content under the header of the Expandable List Item*/}
          {this.props.item.versionModels.map((item, key) => (
            <TouchableOpacity
           
              style={styles.content}>
              <Text style={styles.text}>
                 {item.versionName}
              </Text>
              {/* <TouchableOpacity > */}
              <Icon name="file-download" size={24}  onPress={this.props.DownloadBible(item.versionId)}/>
              {/* </TouchableOpacity> */}
              {/* <View style={styles.separator} /> */}
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      </View>
    );
  }
}


export default class LanguageList extends Component {
    static navigationOptions = ({navigation}) => ({
        headerTitle: 'Languages',
    });
    constructor(props){
      super(props)
      if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
        this.state = {
          isLoading: false,
          text: '',
          languages:[],
          searchList:[],
          isConnected:this.props.screenProps.isConnected
      }
    }
   
    updateLayout(index){
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const array = [...this.state.languages];
      array[index]['isExpanded'] = !array[index]['isExpanded'];
      this.setState(() => {
        return {
          languages: array,
        }
      })
    }

    componentDidMount(){
      this.fetchLanguages()
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
            if(languageList.length == 0 ){
            var  versionRes = await APIFetch.getVersions()
                  if(versionRes){
                    for(var language in versionRes.bible){
                      var versions = []
                      console.log(" langauge code "+language+" version res "+JSON.stringify(versionRes.bible[language]))
                      for(var versionCode in versionRes.bible[language]){
                        var version = {"versionName":'Indian Revised Version',"versionCode":versionCode,versionId:versionRes.bible[language][versionCode].version_id}
                        versions.push(version)
                        var langObj = {"languageName":language,versionModels:versions}
                      }
                      lanVer.push(langObj)
                      await dbQueries.addLangaugeList(langObj,versions)
                    }
                   
                  }
            }
        }
        else{
          var versionRes = await APIFetch.getVersions()
                console.log("versionRes "+JSON.stringify(versionRes))
                if(versionRes){
                  for(var language in versionRes.bible){
                    var versions = []
                    console.log(" langauge code "+language+" version res "+JSON.stringify(versionRes.bible[language]))
                    for(var versionCode in versionRes.bible[language]){
                      var version = {"versionName":'Indian Revised Version',"versionCode":versionCode,versionId:versionRes.bible[language][versionCode].version_id}
                      versions.push(version)
                      var langObj = {"languageName":language,versionModels:versions}
                    }
                    lanVer.push(langObj)
                    await dbQueries.addLangaugeList(langObj,versions)
                  }
                 
                }
        }
        this.setState({
          languages: lanVer,
          searchList: lanVer
        })
    }
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
    async DownloadBible(id){
        console.log("id "+id)
        if(id == null){
            return
          }
        var content = await APIFetch.getContent(id)
        console.log("content "+JSON.stringify(content))
        for(var key in content ){
                var jsonOutput = grammar.parse(content[key],grammar.SCRIPTURE)
                console.log("book id "+key)
                console.log("jsonOutput "+JSON.stringify(jsonOutput))
                
                // console.log("json output "+JSON.stringify(jsonOutput))
                var bookKey = key.toUpperCase()
                // console.log("book key "+bookKey)
                // var bookModel = {
                //     languageName:versionData.languageName,
                //     versionCode:item.versionCode,
                //     bookId: bookKey,
                //     bookName:getBookNameFromMapping(bookKey),
                //     chapterModels: [],
                //     section: getBookSectionFromMapping(bookKey),
                //     bookNumber: getBookNumberFromMapping(bookKey)
                // }
                // bookModels.push(bookModel)
        }
        // console.log("book models "+JSON.stringify(bookModels))
        // var ChapterModel = {
        //     chapterNumber: 'int',
        //     numberOfVerses: 'int',
        //     verseComponentsModels: 'VerseComponentsModel[]',
        // }
        // var versionModel = {
        //     type: 'string',
        //     verseNumber: {type: 'string', indexed: true},
        //     text: {type: 'string', indexed: true},
        //     highlighted: 'bool',
        //     languageCode: 'string',
        //     versionCode: 'string',
        //     bookId: {type: 'string', indexed: true},
        //     chapterNumber: {type: 'int', indexed: true},
        // }
       
        // console.log("content "+JSON.stringify(content))
    }

    render(){
       console.log("langauge length "+JSON.stringify(this.state.languages))
      return (
            <View style={styles.MainContainer}>
            {this.state.languages.length == 0 ? 
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>   
            <ActivityIndicator 
              size="large" 
              color="#0000ff"/>
              </View>
              :
            <View>
              <TextInput 
                style={styles.TextInputStyleClass}
                onChangeText={(text) => this.SearchFilterFunction(text)}
                value={this.state.text}
                underlineColorAndroid='transparent'
                placeholder="Search Here"
              />  
              <ScrollView>
                {this.state.languages.map((item, index) => (
                  <ExpandableItemComponent
                    // key={item}
                    onClickFunction={this.updateLayout.bind(this, index)}
                    item={item}
                    DownloadBible = {this.DownloadBible.bind(this)}
                  />
                ))}
              </ScrollView>
            </View>
            }
            </View>
      )
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
           
      },
      container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: '#F5FCFF',
      },
      topHeading: {
        paddingLeft: 10,
        fontSize: 20,
      },
      header: {
        flexDirection:"row",
        padding: 6,
        paddingHorizontal:10,
        justifyContent:'space-between'
      },
      headerText: {
        fontSize: 16,
        // fontWeight: '500',
        // alignItems:'flex-start'
      },
      iconStyle:{
        // alignItems:'flex-end'
      },
      separator: {
        height: 0.5,
        backgroundColor: '#808080',
        width: '95%',
        marginLeft: 16,
        marginRight: 16,
      },
      text: {
        fontSize: 16,
        color: '#606070',
        // paddingLeft:10
      },
      content: {

        paddingHorizontal:20,
        paddingVertical:10,
        // paddingLeft: 20,
        // paddingRight: 20,
        flexDirection:"row",
        justifyContent:'space-between',
        backgroundColor: '#fff',
      },
    
   });

