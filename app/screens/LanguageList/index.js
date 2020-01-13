import React, { Component } from 'react';
import { Text, StyleSheet,ScrollView,Dimensions, Modal,View,ActivityIndicator,TextInput,FlatList,LayoutAnimation,UIManager,Platform,TouchableOpacity} from 'react-native';
import {Card,ListItem,Left,Right,List} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DbQueries from '../../utils/dbQueries'
// import APIFetch from '../../utils/APIFetch'
import timestamp from '../../assets/timestamp.json'
import { getBookNameFromMapping, getBookSectionFromMapping, getBookNumberFromMapping } from '../../utils/UtilFunctions';
import AsyncStorageUtil from '../../utils/AsyncStorageUtil';
import {AsyncStorageConstants} from '../../utils/AsyncStorageConstants';
import ExpandableItemComponent from './Expandable';
import { styles } from './styles.js';
import {connect} from 'react-redux';
import {updateVersion} from '../../store/action/'
import Spinner from 'react-native-loading-spinner-overlay';
import {API_BASE_URL} from '../../utils/APIConstant'
import {fetchAPI} from '../../store/action/'

const languageList = async () => { 
  return await DbQueries.getLangaugeList()
}

class LanguageList extends Component {
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
        // if(diffDays <= 20 ){
          switch(this.props.contentType){
            case 'bible' :{
            var languageList =  await DbQueries.getLangaugeList()
            for(var i =0 ; i<languageList.length;i++){
              lanVer.push(languageList[i])
            }
            if(languageList.length == 0){
              const apiURL = API_BASE_URL + "bibles"
              await this.props.fetchAPI(apiURL)
              var languageRes = this.props.apiData

              // APIFetch.getVersions().then(languageRes=>{
                for(var i = 0; i<languageRes.length;i++){
                  var versions = []
                  const language = languageRes[i].language.charAt(0).toUpperCase() + languageRes[i].language.slice(1)
                  let languageCode=''
                  for(var j= 0; j<languageRes[i].languageVersions.length;j++){
                  console.log(" LANGUAGE list",languageRes[i].languageVersions[j].language.code)
                    languageCode = languageRes[i].languageVersions[j].language.code
                    const  {version} = languageRes[i].languageVersions[j]
                    versions.push({sourceId:languageRes[i].languageVersions[j].sourceId,versionName:version.name,versionCode:version.code,license:"license",year:2019,downloaded:false})
                  }
                  lanVer.push({languageName:language,languageCode:languageCode,versionModels:versions})
                }
                DbQueries.addLangaugeList(lanVer)
              // })
              // .catch(error => {
              //   this.setState({isLoading:false})
              //   alert(" please check internet connected or slow  OR book is not available ")
              // });
              
            }
            this.setState({
              languages: lanVer,
              searchList: lanVer
            })
          }
          break;
            case 'commentary':{
              alert("commentary language list ")
            }
            break;
            case 'infographics':{
              alert("infographics language list ")
            }
            break;
            default: {
              alert("default")
            }
          }
        
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

    DownloadBible = (langName,verCode,index,sourceId)=>{
      console.log("source id ",sourceId)
      this.setState({isLoading:true,isdownLoading:true,index},async()=>{
        var bookModels = []
          var apiURL = API_BASE_URL + "bibles" + "/" + sourceId + "/" + "json"
          this.props.fetchAPI(apiURL)
          var mainContent = this.props.apiData
            var content = mainContent.bibleContent
            for(var id in content){
              if(content != null){
                var  chapterModels = []
                for(var i=0; i< content[id].chapters.length; i++){
                  var  verseModels = []
                  for(var j=0; j< content[id].chapters[i].verses.length; j++){
                    verseModels.push({
                      text: content[id].chapters[i].verses[j].text,
                      number: content[id].chapters[i].verses[j].number,
                    })
                  }
                  var chapterModel = { 
                    chapterNumber:  parseInt(content[id].chapters[i].header.title),
                    numberOfVerses: parseInt(content[id].chapters[i].verses.length),
                    verses:verseModels,
                  }
                  chapterModels.push(chapterModel)
                }
                
              }
              else{
                alert("Sorry Version is not Available for now")
                return 
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
              await DbQueries.addNewVersion(langName,verCode,bookModels,sourceId)
              this.setState({isLoading:false,isdownLoading:false})
              languageList().then(async(language) => {
                this.setState({languages:language})
              })
          

      })

    }
    navigateTo = (langName,langCode,verCode,sourceId,downloaded)=>{
      console.log("downloaded value in language page ",langName,langCode,verCode,sourceId,downloaded)
      AsyncStorageUtil.setAllItems([
        [AsyncStorageConstants.Keys.SourceId, JSON.stringify(sourceId)],
        [AsyncStorageConstants.Keys.LanguageName, langName],
        [AsyncStorageConstants.Keys.LanguageCode, langCode],

        [AsyncStorageConstants.Keys.VersionCode, verCode],
        [AsyncStorageConstants.Keys.Downloaded, JSON.stringify(downloaded)]
      ]); 
      this.props.updateVersion(langName,langCode,verCode,sourceId,downloaded)
      this.props.navigation.state.params.callBackForUpdateBook(null)
      this.props.navigation.goBack()
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
            contentType = {this.props.contentType}
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

    contentType:state.updateVersion.contentType,

    apiData:state.APIFetch.data,
    isFetching:state.APIFetch.isFetching,

    error:state.APIFetch.error
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    updateVersion: (language,langaugeCode,version,sourceId,downloaded)=>dispatch(updateVersion(language,langaugeCode,version,sourceId,downloaded)),
    fetchAPI:(api)=>dispatch(fetchAPI(api))
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(LanguageList)