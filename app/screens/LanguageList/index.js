import React, { Component } from 'react';
import { Text, StyleSheet,ScrollView,Dimensions, Modal,View,ActivityIndicator,TextInput,FlatList,LayoutAnimation,UIManager,Platform,TouchableOpacity} from 'react-native';
import {Card} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DbQueries from '../../utils/dbQueries'
import APIFetch from '../../utils/APIFetch'
import timestamp from '../../assets/timestamp.json'
import {NavigationActions} from 'react-navigation'
import { getBookNameFromMapping, getBookSectionFromMapping, getBookNumberFromMapping } from '../../utils/UtilFunctions';
import AsyncStorageUtil from '../../utils/AsyncStorageUtil';
import {AsyncStorageConstants} from '../../utils/AsyncStorageConstants';
import * as Progress from 'react-native-progress';

const languageList = async () => { 
  return await DbQueries.getLangaugeList()
}

class ExpandableItemComponent extends Component {
  constructor() {
    super();
    this.state = {
      layoutHeight: 0,
      modalVisible:true,
    };
  }
  componentWillReceiveProps(nextProps){
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
 
  render() {
    return (
      <View>
      <Card>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.props.onClickFunction}
          style={styles.header}
        >
          <Text style={styles.headerText}>{  this.props.item.languageName }</Text>
          <Icon name={this.props.item.isExpanded ? "keyboard-arrow-down" : "keyboard-arrow-up" } style={styles.iconStyle} size={24}/>
        </TouchableOpacity>
        <View
          style={{
            height: this.state.layoutHeight,
            overflow: 'hidden',
          }}>
          {/*Content under the header of the Expandable List Item*/}
          {this.props.item.versionModels.map((item, index,key) => (
            <View style={styles.content}>
            <TouchableOpacity
              // onPress={this.props.goToBible}
              >
              <View style={{flex:1,flexDirection:'column',}}>
              <Text  style={{fontWeight:'bold',fontSize:18}}>{item.versionCode} </Text>
              <Text style={{fontSize:18}}> {item.versionName}</Text>
              </View>
              </TouchableOpacity>
              {
                item.downloaded==true ? 
             
              <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{this.props.goToBible(this.props.item.languageName,item.versionCode,item.sourceId)}}>
                <Icon name="check" size={24} 
                />
               </TouchableOpacity>
               :
              <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{this.props.DownloadBible(this.props.item.languageName,item.versionCode,index,item.sourceId)}}>
              {/* {
                this.props.startDownload ?
                 <Progress.Bar progress={0.3} width={200} /> 
              : 
              <Icon name="file-download" size={24} />
              } */}
              <Icon name="file-download" size={24} />
               </TouchableOpacity>}
            </View>
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
          startDownload:false

      }
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
        if(diffDays <= 20 ){
          var languageList =  await DbQueries.getLangaugeList()
            for(var i =0 ; i<languageList.length;i++){
              lanVer.push(languageList[i])
            }
            if(languageList.length == 0){
              const languageRes = await APIFetch.getVersions()
              for(var i = 0; i<languageRes.length;i++){
                var versions = []
                const language = languageRes[i].language.charAt(0).toUpperCase() + languageRes[i].language.slice(1)
                for(var j= 0; j<languageRes[i].languageVersions.length;j++){
                  const  {version} = languageRes[i].languageVersions[j]
                  versions.push({sourceId:languageRes[i].languageVersions[j].sourceId,versionName:version.name,versionCode:version.code,license:"license",year:2019,downloaded:false})
                }
                lanVer.push({languageName:language,versionModels:versions})
              }

              console.log("language list",lanVer)
              DbQueries.addLangaugeList(lanVer)
            }
         }
         else{
          const languageRes = await APIFetch.getVersions()
          for(var i = 0; i<languageRes.length;i++){
            var versions = []
            const language = languageRes[i].language.charAt(0).toUpperCase() + languageRes[i].language.slice(1)
            for(var j= 0; j<languageRes[i].languageVersions.length;j++){
              const  {version} = languageRes[i].languageVersions[j]
              versions.push({sourceId:languageRes[i].languageVersions[j].sourceId,versionName:version.name,versionCode:version.code,license:"license",year:2019,downloaded:false})
            }
            lanVer.push({languageName:language,versionModels:versions})

          }
          // console.log("language list",lanVer)
          DbQueries.addLangaugeList(lanVer)
         
        }
    
      this.setState({
        languages: lanVer,
        searchList: lanVer
      })
    }

    goToVersionScreen(value){
    //  this.props.navigation.navigate('VersionList',  {versions: value });
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

    DownloadBible = async(langName,verCode,index,sourceId)=>{
       console.log("language name ",langName," verCode ",verCode)
      var bookModels = []
      var content = await APIFetch.getAllBooks(sourceId,"json")
      var content = content.bibleContent
      for(var id in content){
      var  chapterModels = []
        // console.log("content ",content[id].chapters.length)
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
      console.log("book id ",id)
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
      // console.log("book model ",bookModels)
      await DbQueries.addNewVersion(langName,verCode,result,sourceId,bookListData)
      languageList().then(async(language) => {
        this.setState({languages:language})
      })
      .catch((error)=>{console.log("error",error)})
      
    }
    setModalVisible=()=>{
      this.setState({modalVisible:!this.state.modalVisible})
    }
    goToBible = (langName,verCode,sourceId)=>{
      console.log("sourceID",sourceId,"langauge name ",langName,"versioncode",verCode)
      AsyncStorageUtil.setAllItems([
        [AsyncStorageConstants.Keys.SourceId, sourceId.toString()],
        [AsyncStorageConstants.Keys.LanguageName, langName],
        [AsyncStorageConstants.Keys.VersionCode, verCode],
        [AsyncStorageConstants.Keys.Downloaded, JSON.stringify(true)]
      ]); 
      this.props.navigation.state.params.queryBookFromAPI()
      this.props.navigation.dispatch(NavigationActions.back())    
    }
  
    render(){
      console.log("LANGUAGE IN RENDER ",this.state.languages.length)
      return (
            <View style={styles.MainContainer}>
            {this.state.languages.length == 0 ?
              <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>   
              <ActivityIndicator 
                size="large" 
                color="#0000ff"/>
                </View>:
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
              DownloadBible = {this.DownloadBible}
              goToBible = {this.goToBible}
              startDownload ={this.state.startDownload}
              // setModalVisible={this.setModalVisible}
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

