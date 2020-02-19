import React, { Component } from 'react';
import { Text, StyleSheet,ScrollView,Dimensions, Modal,View,ActivityIndicator,TextInput,FlatList,LayoutAnimation,UIManager,Platform,TouchableOpacity} from 'react-native';
import {Card,ListItem,Left,Right,List} from 'native-base'
import { NavigationActions,StackActions } from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DbQueries from '../../utils/dbQueries'
import APIFetch from '../../utils/APIFetch'
import timestamp from '../../assets/timestamp.json'
import { getBookNameFromMapping, getBookSectionFromMapping, getBookNumberFromMapping } from '../../utils/UtilFunctions';
import AsyncStorageUtil from '../../utils/AsyncStorageUtil';
import {AsyncStorageConstants} from '../../utils/AsyncStorageConstants';
import ExpandableItemComponent from './Expandable';
import { styles } from './styles.js';
import {connect} from 'react-redux';
import {updateVersion,updateInfographics,} from '../../store/action/'
import Spinner from 'react-native-loading-spinner-overlay';
import {API_BASE_URL} from '../../utils/APIConstant'
import { State } from 'react-native-gesture-handler';
const languageList = async () => { 
  return await DbQueries.getLangaugeList()
}

class LanguageList extends Component {
    static navigationOptions = ({navigation}) => ({
        headerTitle: 'Languages',
    });
    constructor(props){
      super(props)
      // console.log("LANGUAGELIST PROPS ",this.props.navigation.state.routeName)
      if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
        this.state = {
          isLoading: false,
          text: '',
          languages:[],
          searchList:[],
          startDownload:false,
          index : -1,
          languageName:'',
          colorFile:this.props.colorFile,
          sizeFile:this.props.sizeFile,

      }
      this.styles = styles(this.props.colorFile, this.props.sizeFile);    
    }
   
    updateLayout(index){
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const responseay = [...this.state.languages];
      responseay[index]['isExpanded'] = !responseay[index]['isExpanded'];
      this.setState(() => {
        return {
          languages: responseay,
        }
      })
    }

    async componentDidMount(){
      this.fetchLanguages()  
    }
    async fetchLanguages(){
      var lanVer = []
      var oneDay = 24*60*60*1000; 
      var d = new Date('1-feb-2000')
      var ud = new Date(timestamp.languageUpdate)
      var diffDays = Math.round(Math.abs((d.getTime() - ud.getTime())/(oneDay)))
            this.setState({
              languages: this.props.bibleLanguages[0].content,
              searchList: lanVer
            })
    }
    // SearchFilterFunction = (text)=>{
    //     const newData = this.state.searchList.filter(function(item){
    //       const itemData = item.languageName
    //       const textData = text.toLowerCase()
    //       return itemData.indexOf(textData) > -1
    //     })
    //     this.setState({
    //       text: text,
    //       languages:newData
    //     })
    // }

   
    DownloadBible = async(langName,verCode,index,sourceId)=>{
      console.log("language name"+langName+" ver code  "+verCode+" source id "+sourceId)

      var bookModels = []
      try{
        var content = await APIFetch.getAllBooks(sourceId,"json")
        var content = content.bibleContent
        for(var id in content){
          var  chapterModels = []
          if(content != null){
            for(var i=0; i< content[id].chapters.length; i++){
              var  verseModels = []
              for(var j=0; j< content[id].chapters[i].verses.length; j++){
                verseModels.push(content[id].chapters[i].verses[j])
              }
              var chapterModel = { 
                chapterNumber:  parseInt(content[id].chapters[i].header.title),
                numberOfVerses: parseInt(content[id].chapters[i].verses.length),
                verses:verseModels,
              }
              chapterModels.push(chapterModel)
            }
          }
          bookModels.push({
            languageName: langName,
            versionCode: verCode,
            bookId: id,
            bookName:getBookNameFromMapping(id,langName),
            chapters: chapterModels,
            section: getBookSectionFromMapping(id),
            bookNumber: getBookNumberFromMapping(id)
          })
        }
      var result = bookModels.sort(function(a, b){
        return parseFloat(a.bookId) - parseFloat(b.bookId);  
      })
      const booksid = await APIFetch.availableBooks(sourceId)
      var bookListData=[]
      for(var key in booksid[0].books){
        var bookId = booksid[0].books[key].abbreviation
        bookListData.push(bookId)
      }
      await DbQueries.addNewVersion(langName,verCode,result,sourceId,bookListData)
      languageList().then(async(language) => {
        this.setState({languages:language})
      })
      }catch(error){
        alert("There is some error on downloading this version please select another version")
      }
    }
 
    navigateTo = (langName,langCode,verCode,sourceId,downloaded)=>{
      // const url = BASE_URL+
      // if(this.props.navigation.state.params.contentType == 'bible'){
        console.log("navigate back ",langName,langCode,verCode,sourceId,downloaded)
        AsyncStorageUtil.setAllItems([
          [AsyncStorageConstants.Keys.SourceId, JSON.stringify(sourceId)],
          [AsyncStorageConstants.Keys.LanguageName, langName],
          [AsyncStorageConstants.Keys.LanguageCode, langCode],
          [AsyncStorageConstants.Keys.VersionCode, verCode],

          [AsyncStorageConstants.Keys.Downloaded, JSON.stringify(downloaded)]
        ]); 
        this.props.updateVersion({language:langName,languageCode:langCode,versionCode:verCode,sourceId:sourceId,downloaded:downloaded})
        // this.props.updateVersion(langName,langCode,verCode,sourceId,downloaded)
        // this.props.navigation.state.params.callBackForUpdateBook(null)
      // }
      this.props.navigation.goBack()
      // this.props.updateInfographics(file ? file : this.props.fileName)
      // this.props.navigation.state.params.getInfoFileName(null)
    }

    render(){
      return (
        <View style={this.styles.MainContainer}>
        {this.props.isFetching &&  <Spinner visible={true} textContent={'Loading...'}/>}
        
        <View style={{flex:1}}>
        {/* <TextInput 
          style={this.styles.TextInputStyleClass}
          onChangeText={(text) => this.SearchFilterFunction(text)}
          value={this.state.text}
          underlineColorAndroid='transparent'
          placeholder="Search Here"
        />   */}
        <ScrollView>
        <FlatList
          data={this.state.languages}
          extraData={this.state}
          renderItem={({item, index, separators}) =><ExpandableItemComponent
            onClickFunction={this.updateLayout.bind(this, index)}
            item={item}
            DownloadBible = {this.DownloadBible}
            navigateTo = {this.navigateTo}
            // contentType = {this.props.navigation.state.params.contentType}
            styles={this.styles}
          />}

        />
      </ScrollView>
      </View>
      </View>
      )
    }
}

const mapStateToProps = state =>{
  return{
    bookId:state.updateVersion.bookId,
    chapterNumber:state.updateVersion.chapterNumber,
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
    fontFamily:state.updateStyling.fontFamily,
    fileName:state.infographics.fileName,
    contentType:state.updateVersion.contentType,
    bibleLanguages:state.contents.contentLanguages,
    commentaryLanguages:state.contents.commentaryLanguages,
    // allLanguage:state.contents.allLanguages
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    updateVersion: (language,langaugeCode,version,sourceId,downloaded)=>dispatch(updateVersion(language,langaugeCode,version,sourceId,downloaded)),
    updateInfographics:(fileName)=>dispatch(updateInfographics(fileName)),
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(LanguageList)