import React, { Component } from 'react';
import { Text,View,UIManager,Platform,TouchableOpacity,Alert} from 'react-native';
import {Accordion} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DbQueries from '../../utils/dbQueries'
import APIFetch from '../../utils/APIFetch'
import {getBookSectionFromMapping} from '../../utils/UtilFunctions';
import { styles } from './styles.js';
import {connect} from 'react-redux';
import {updateVersion,fetchVersionBooks,fetchAllContent,updateMetadata} from '../../store/action/'
import Spinner from 'react-native-loading-spinner-overlay';
import Color from '../../utils/colorConstants'
import ReloadButton from '../../components/ReloadButton';



// const languageList = async () => { 
//   return await DbQueries.getLangaugeList()
// }
// const booksValue = null

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
          // searchList:[],
          startDownload:false,
          index : -1,
          // languageName:'',
          language:this.props.language,
          versionCode:this.props.versionCode,
          downloaded:this.props.downloaded,
          sourceId:this.props.sourceId,

          colorFile:this.props.colorFile,
          sizeFile:this.props.sizeFile,

      }
      this.styles = styles(this.props.colorFile, this.props.sizeFile);  
      this.fetchLanguages = this.fetchLanguages.bind(this) 
      this.alertPresent = false 
    }
   

     componentDidMount(){
      this.fetchLanguages()  
    }

    errorMessage=()=>{
      if (!this.alertPresent) {
          this.alertPresent = true;
          if (this.state.languages.length == 0) {
            this.fetchLanguages()
            Alert.alert("", "Check your internet connection", [{text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
            }else{
            console.log("LANGUAGEG LIST ",this.state.languages.length)
            this.alertPresent = false;
            // this.setState({languages:this.props.bibleLanguages[0].content})
          }
      }
    }
  updateData=()=>{
      this.props.fetchAllContent()
      this.errorMessage()
  }
    async fetchLanguages(){
      var lanVer = []
      const languageList =  await DbQueries.getLangaugeList()
      console.log(" language list ",languageList)
      try{
      if(languageList == null){
        const books = await APIFetch.fetchBookInLanguage()
        var languages = this.props.bibleLanguages[0].content
        console.log(" LANGUAGE FROM API ",languages.length, " BOOKS ",books.length )
        if(languages && books){
          for(var i=0; i<languages.length; i++){
            for(var j=0;j<books.length;j++){
            var bookArr = []
              if(languages[i].languageName.toLowerCase() == books[j].language.name){
                for(var k=0;k<books[j].bookNames.length;k++){
                  const bookObj={
                    bookId:books[j].bookNames[k].book_code,
                    bookName:books[j].bookNames[k].short,
                    bookNumber:books[j].bookNames[k].book_id,
                  }
                  bookArr.push(bookObj)
                }
                var bookList =  bookArr.sort(function(a, b){return a.bookNumber - b.bookNumber})
                    lanVer.push({
                      languageName:languages[i].languageName ,
                      languageCode:languages[i].languageCode,
                      versionModels: languages[i].versionModels,
                      bookNameList:bookList,
                    })
              }
            }
          }
          DbQueries.addLangaugeList(languages,books)
        }
        else{
          console.log("no language found, call update ")
          this.updateData()
        }
      }
      else{
        for(var i =0 ; i<languageList.length;i++){
          lanVer.push(languageList[i])
        }
      }
      console.log(" LANGUAGGE LIST",lanVer)
      this.setState({
        languages: lanVer,
        // searchList: lanVer
      })
    }
    catch(error){
      console.log(" ERROR add language",error)
    }
    }

    downloadBible = async(langName,verCode,books,sourceId)=>{
      console.log(langName+" ",books) 
      var bookModels = []
      try{
        this.setState({startDownload:true})
        var content = await APIFetch.getAllBooks(parseInt(sourceId),"json")
        console.log(" Content ",content.bibleContent)
        for(var i =0;i<books.length;i++){
          console.log(" BOOKS ",books[i])
            bookModels.push({
            languageName: langName,
            versionCode: verCode,
            bookId:books[i].bookId,
            bookName:books[i].bookName,
            bookNumber:books[i].bookNumber,
            chapters: this.getChapters(content.bibleContent,books[i].bookId),
            section: getBookSectionFromMapping(books[i].bookId),
          })
        }
      DbQueries.addNewVersion(langName,verCode,bookModels,sourceId)
      // const languageList =  await DbQueries.getLangaugeList()
      // await this.fetchLanguages()
      this.setState({startDownload:false,languages:languageList})
      }catch(error){
      console.log("Error ",error)
      this.setState({startDownload:false})
        alert("Something went wrong. Try Again")
      }
    }
    getChapters=(content,bookId)=>{
      var chapterModels =[]
        for(var id in content){
        if(content != null && id == bookId){
          console.log("id in chapter",id,bookId)
          for(var c=0; c<content[id].chapters.length; c++){
            var  verseModels = []
            for(var v=0; v<content[id].chapters[c].verses.length; v++){
              verseModels.push(content[id].chapters[c].verses[v])
            }
            var chapterModel = { 
              chapterNumber:  parseInt(content[id].chapters[c].header.title),
              numberOfVerses: parseInt(content[id].chapters[c].verses.length),
              verses:verseModels,
            }
            chapterModels.push(chapterModel)
          }
          return chapterModels
        }
      }
    }

     navigateTo(langName,langCode,booklist,verCode,sourceId,metadata,downloaded){
       console.log(' book List ',booklist )
      this.props.navigation.state.params.updateLangVer({
        sourceId:sourceId,languageName:langName,languageCode:langCode, 
        versionCode:verCode,downloaded:downloaded,
        books:booklist,
        metadata:metadata
      })
      this.props.navigation.pop()
    }
    async deleteBible(languageName,languageCode,versionCode,sourceId,downloaded){
     await  DbQueries.deleteBibleVersion(languageName,versionCode,sourceId,downloaded)
     await this.fetchLanguages()
    }

    _renderHeader = (item, expanded) =>{
      return(
        <View style={{
          flexDirection: "row",
          padding: 10,
          justifyContent: "space-between",
          alignItems: "center" ,
          }}>
          <Text
          style={this.styles.headerText} 
          >
          {/* {" "}{item.languageName.charAt(0).toUpperCase()+item.languageName.slice(1)} */}
          {item.languageName}
          </Text>
          <Icon  style={this.styles.iconStyle} name={expanded ? "keyboard-arrow-down" : "keyboard-arrow-up" }  size={24}/>
        </View>
      )
    }
    _renderContent = (item) =>{
      return(
        <View>
            {/*Content under the header of the Expandable List Item*/}
            {item.versionModels.map((element, index, key) => (
              <TouchableOpacity 
              style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginHorizontal:8}} 
               onPress={()=>{this.navigateTo(item.languageName,item.languageCode,item.bookNameList,element.versionCode,element.sourceId,element.metaData, element.downloaded)}}>
                  <View>
                    <Text style={[this.styles.text,{marginLeft:8,fontWeight:'bold'}]} >{element.versionCode} </Text>
                    <Text style={[this.styles.text,{marginLeft:8}]} >{element.versionName}</Text>
                  </View>
                  <View>
                  {
                    element.downloaded == true ? 
                  
                    item.languageName.toLowerCase() == 'english' ? null : 
                    <Icon style={[this.styles.iconStyle,{marginRight:8}]} name="delete" size={24}  onPress={()=>{this.deleteBible(item.languageName,item.languageCode,element.versionCode,element.sourceId, element.downloaded)}}
                    />
                  :
                  item.languageName.toLowerCase() == 'english' ? null :
                  <Icon  style={[this.styles.iconStyle,{marginRight:12}]} name="file-download" size={24} onPress={()=>{this.downloadBible(item.languageName,element.versionCode,item.bookNameList,element.sourceId)}}/>
                  }
                </View>
                </TouchableOpacity>
            ))}
        </View>

      )
    }
    render(){
      // console.log(" LANGUaGE ",this.state.languages )
      return (
        <View style={this.styles.MainContainer}>
        {
        this.props.isLoading ?
            <Spinner
            visible={true}
            textContent={'Loading...'}
            //  textStyle={styles.spinnerTextStyle}
          />
           :null }
          {this.state.startDownload ?
            <Spinner
            visible={true}
            textContent={'DOWNLOADING BIBLE...'}
            //  textStyle={styles.spinnerTextStyle}
          />
        :null }
          
            {this.state.languages.length == 0  ?
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <ReloadButton
                reloadFunction={this.updateData}
                styles={this.styles}
                />
              {/* <TouchableOpacity 
              onPress={()=>this.updateData()}
              style={{height:40,width:120,borderRadius:4,backgroundColor:Color.Blue_Color,justifyContent:'center',alignItems:'center'}}
              >
              <Text style={{fontSize:18,color:'#fff'}}>Reload</Text>
              </TouchableOpacity> */}
              </View>
              :
              <Accordion 
                dataArray={this.state.languages}
                animation={true}
                expanded={true}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
              />
              }
            
        
       
      </View>
      )
    }
}

const mapStateToProps = state =>{
  return{
    language: state.updateVersion.language,
    versionCode:state.updateVersion.versionCode,
    sourceId:state.updateVersion.sourceId,
    downloaded:state.updateVersion.downloaded,
    bookId:state.updateVersion.bookId,
    chapterNumber:state.updateVersion.chapterNumber,
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
    bibleLanguages:state.contents.contentLanguages,
    books:state.versionFetch.data,
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    updateVersion: (value)=>dispatch(updateVersion(value)),
    fetchAllContent:()=>dispatch(fetchAllContent()),
    fetchVersionBooks:(payload)=>dispatch(fetchVersionBooks(payload)),
    updateMetadata:(payload)=>dispatch(updateMetadata(payload)),
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(LanguageList)