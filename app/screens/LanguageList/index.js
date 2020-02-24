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
import { styles } from './styles.js';
import {connect} from 'react-redux';
import {updateVersion,updateInfographics,fetchAllContent} from '../../store/action/'
import Spinner from 'react-native-loading-spinner-overlay';
import {API_BASE_URL} from '../../utils/APIConstant'
import { State } from 'react-native-gesture-handler';
const languageList = async () => { 
  return await DbQueries.getLangaugeList()
}

class ExpandableItemComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layoutHeight: 0,
      modalVisible:true,

    };
    this.styles = styles(this.props.colorFile, this.props.sizeFile);    
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
      <View style={this.styles.container}>
      {/* <Card> */}
      <List>
      <ListItem button={true} onPress={this.props.onClickFunction}>
        <Left>
        <Text style={this.styles.text} >{this.props.item.languageName }</Text>
        </Left>
        <Right>
          <Icon style={this.styles.iconStyle} name={this.props.item.isExpanded ? "keyboard-arrow-down" : "keyboard-arrow-up" }  size={24}/>
        </Right>
        </ListItem>
        </List>
        <View
          style={{
            height: this.state.layoutHeight,
            overflow: 'hidden',
          }}>
          {/*Content under the header of the Expandable List Item*/}
          {this.props.item.versionModels.map((item, index, key) => (
              <List>
                <ListItem button={true} onPress={()=>{this.props.goToBible(this.props.item.languageName,this.props.item.languageCode,item.versionCode,item.sourceId, item.downloaded  )}}>
                <Left>
                <View style={{alignSelf:'center',marginLeft:12}}>
                  <Text style={[this.styles.text,{fontWeight:'bold'}]} >{item.versionCode} </Text>
                  <Text style={[this.styles.text,{marginLeft:8}]} > {item.versionName}</Text>
                </View>
                </Left>
                <Right>
                {
                  item.downloaded == true ? 
                  <Icon style={[this.styles.iconStyle,{marginRight:8}]} name="check" size={24}  onPress={()=>{this.props.goToBible(this.props.item.languageName,this.props.item.languageCode,item.versionCode,item.sourceId, item.downloaded )}}
                  />
                :
                  <Icon  style={[this.styles.iconStyle,{marginRight:12}]} name="file-download" size={24} onPress={()=>{this.props.DownloadBible(this.props.item.languageName,item.versionCode,index,item.sourceId)}}/>
                }
              
              </Right>
              </ListItem>
              </List>
          ))}
        </View>
      {/* </Card> */}

      </View>
    );
  }
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
    componentDidUpdate(prevProps,prevState){
      if(prevState.languages !==this.state.languages){
        this.setState({
          languages: this.props.bibleLanguages[0].content
        })
      }
    }
    async fetchLanguages(){
      var lanVer = []
      var oneDay = 24*60*60*1000; 
      var d = new Date('1-feb-2000')
      var ud = new Date(timestamp.languageUpdate)
      var diffDays = Math.round(Math.abs((d.getTime() - ud.getTime())/(oneDay)))
      var languageList =  await DbQueries.getLangaugeList()
      for(var i =0 ; i<languageList.length;i++){
        lanVer.push(languageList[i])
      }
      if(languageList.length == 0 && this.props.bibleLanguages[0].content.length > 0 ){
        DbQueries.addLangaugeList(this.props.bibleLanguages[0].content)
        lanVer = this.props.bibleLanguages[0].content
      }
      else{
        this.props.fetchAllContent()
      }
      this.setState({
        languages: lanVer,
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
        this.setState({startDownload:true})
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
      this.setState({startDownload:false})

      }catch(error){
      this.setState({startDownload:false})
        alert("There is some error on downloading this version please select another version")
      }
    }
 
    navigateTo = (langName,langCode,verCode,sourceId,downloaded)=>{
      console.log("downloaded ",downloaded)
        console.log("navigate back ",langName,langCode,verCode,sourceId,downloaded)
        this.props.updateVersion({language:langName,languageCode:langCode,versionCode:verCode,sourceId:sourceId,downloaded:downloaded,bookId:this.props.bookId,chapterNumber:this.props.chapterNumber})
        AsyncStorageUtil.setAllItems([
          [AsyncStorageConstants.Keys.SourceId, JSON.stringify(sourceId)],
          [AsyncStorageConstants.Keys.LanguageName, langName],
          [AsyncStorageConstants.Keys.LanguageCode, langCode],
          [AsyncStorageConstants.Keys.VersionCode, verCode],
          [AsyncStorageConstants.Keys.Downloaded, JSON.stringify(downloaded)]
        ]); 
        this.props.navigation.goBack()
    }
    componentWillUnmount(){
      this.props.navigation.state.params.callBackForUpdateBook(null)
    }
    render(){
      return (
        <View style={this.styles.MainContainer}>
        {this.props.isLoading &&
            <Spinner
            visible={true}
            textContent={'Loading...'}
            //  textStyle={styles.spinnerTextStyle}
          />}
          {this.state.startDownload &&
            <Spinner
            visible={true}
            textContent={'DOWNLOADING BIBLE...'}
            //  textStyle={styles.spinnerTextStyle}
          />}
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
          renderItem={({item, index, separators}) =>
          <ExpandableItemComponent
            // key={item}
            onClickFunction={this.updateLayout.bind(this, index)}
            item={item}
            DownloadBible = {this.DownloadBible}
            goToBible = {this.navigateTo}
            startDownload ={this.state.startDownload}
            colorFile={this.state.colorFile}
            sizeFile={this.state.sizeFile}
            isLoading = {this.state.isLoading}
            index = {this.state.index}
            languageName = {this.state.languageName}
            // setModalVisible={this.setModalVisible}
          />
          }

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
    updateVersion: (value)=>dispatch(updateVersion(value)),
    updateInfographics:(fileName)=>dispatch(updateInfographics(fileName)),
    fetchAllContent:()=>dispatch(fetchAllContent()),
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(LanguageList)