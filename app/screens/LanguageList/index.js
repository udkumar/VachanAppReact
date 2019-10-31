import React, { Component } from 'react';
import { Text, StyleSheet,ScrollView,Dimensions, Modal,View,ActivityIndicator,TextInput,FlatList,LayoutAnimation,UIManager,Platform,TouchableOpacity} from 'react-native';
import {Card,ListItem,Left,Right,List} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DbQueries from '../../utils/dbQueries'
import APIFetch from '../../utils/APIFetch'
import timestamp from '../../assets/timestamp.json'
import { getBookNameFromMapping, getBookSectionFromMapping, getBookNumberFromMapping } from '../../utils/UtilFunctions';
import AsyncStorageUtil from '../../utils/AsyncStorageUtil';
import {AsyncStorageConstants} from '../../utils/AsyncStorageConstants';
import { styles } from './styles.js';
import {connect} from 'react-redux';
import {updateVersion} from '../../store/action/'

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
        <Text >{this.props.item.languageName }</Text>
        </Left>
        <Right>
          <Icon name={this.props.item.isExpanded ? "keyboard-arrow-down" : "keyboard-arrow-up" }  size={24}/>
        </Right>
        </ListItem>
        </List>
        <View
          style={{
            height: this.state.layoutHeight,
            overflow: 'hidden',
          }}>
          {/*Content under the header of the Expandable List Item*/}
          {this.props.item.versionModels.map((item, index,key) => (
              <List>
                <ListItem button={true} onPress={()=>{this.props.goToBible(this.props.item.languageName,item.versionCode,item.sourceId, item.downloaded ? true : false )}}>
                <Left>
                <View style={{alignSelf:'center',marginLeft:12}}>
                  <Text  style={{fontWeight:'bold'}}>{item.versionCode} </Text>
                  <Text style={{marginLeft:8}}> {item.versionName}</Text>
                </View>
                </Left>
                <Right>
                {
                  item.downloaded == true ? 
                  <Icon name="check" size={24} style={{marginRight:8}}  onPress={()=>{this.props.goToBible(this.props.item.languageName,item.versionCode,item.sourceId,true)}}
                  />
                :
                  (
                  (this.props.isLoading &&  index == this.props.index ) ?
                  <ActivityIndicator  size="small"  color="#0000ff"/> 
                  : 
                  <Icon name="file-download" size={24} style={{marginRight:12}} onPress={()=>{this.props.DownloadBible(this.props.item.languageName,item.versionCode,index,item.sourceId)}}/>
                  )
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
      if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
        this.state = {
          isLoading: false,
          text: '',
          languages:[],
          searchList:[],
          startDownload:false,
          colorFile:this.props.screenProps.colorFile,
          sizeFile:this.props.screenProps.sizeFile,
          index : -1

      }
      this.styles = styles(this.state.colorFile, this.state.sizeFile);    
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

    DownloadBible = (langName,verCode,index,sourceId)=>{

      var bookModels = []
      var verseModels = []
      var  chapterModels = []
      this.setState({isLoading:true,index},async()=>{

        try{
          var mainContent = await APIFetch.getAllBooks(sourceId,"json")
          
          if(mainContent.length != 0){
            var content = mainContent.bibleContent
            console.log("JSON CONTENT ",content)
            for(var id in content){
              // if(content != null){
                for(var i=0; i< content[id].chapters.length; i++){
                  const verses = content[id].chapters[i].verses
                  for(var j=0; j< verses.length; j++){
                    verseModels.push({
                      text: verses[j].text,
                      number: verses[j].number,
                      // metadata:verses[j].metadata ? ( verses[j].metadata[0].styling ? verses[j].metadata[0].styling : "" ) : "",
                    })
                  }
                    var chapterModel = { 
                      chapterNumber:  parseInt(content[id].chapters[i].header.title),
                      numberOfVerses: parseInt(content[id].chapters[i].verses.length),
                      verses:verseModels,
                    }
                    chapterModels.push(chapterModel)
                }
              // }
              // console.log("verse model .......>>...",verseModels)
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
          }
          
          console.log("book model .......",bookModels)
        // const booksid = await APIFetch.availableBooks(sourceId)
        // var bookListData = []
        // var res = booksid[0].books.sort(function(a, b){return a.bibleBookID - b.bibleBookID})
        //  for(var key in res){
        //   var bookId = res[key].abbreviation
        //   bookListData.push({bookId})
        // }
  
        await DbQueries.addNewVersion(langName,verCode,bookModels,sourceId)
        this.setState({isLoading:false,})
        languageList().then(async(language) => {
          this.setState({languages:language})
        })
        }catch(error){
          console.log("error ",error)
          // alert("There is some error on downloading this version please select another version")
        }

      })

    }
    setModalVisible=()=>{
      this.setState({modalVisible:!this.state.modalVisible})
    }
    goToBible = (langName,verCode,sourceId,downloaded)=>{
      AsyncStorageUtil.setAllItems([
        [AsyncStorageConstants.Keys.SourceId, sourceId.toString()],
        [AsyncStorageConstants.Keys.LanguageName, langName],
        [AsyncStorageConstants.Keys.VersionCode, verCode],
        [AsyncStorageConstants.Keys.Downloaded, JSON.stringify(downloaded)]
      ]); 
      this.props.updateVersion(langName,verCode,sourceId,downloaded)
      this.props.navigation.state.params.callBackForUpdateBook()
      this.props.navigation.goBack()

    }
  
    render(){
      console.log("PROPS VALUE IN LANGUAGE PAGE ",this.props.language,this.props.version)

      return (
        <View style={this.styles.MainContainer}>
        {this.state.languages.length == 0 ?
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>   
          <ActivityIndicator 
            size="large" 
            color="#0000ff"/>
        </View> 
          :
        <View style={{flex:1}}>
        <TextInput 
          style={this.styles.TextInputStyleClass}
          onChangeText={(text) => this.SearchFilterFunction(text)}
          value={this.state.text}
          underlineColorAndroid='transparent'
          placeholder="Search Here"
        />  
        <ScrollView>
        <FlatList
          data={this.state.languages}
          extraData={this.state}
          renderItem={({item, index, separators}) =><ExpandableItemComponent
            // key={item}
            onClickFunction={this.updateLayout.bind(this, index)}
            item={item}
            DownloadBible = {this.DownloadBible}
            goToBible = {this.goToBible}
            startDownload ={this.state.startDownload}
            colorFile={this.state.colorFile}
            sizeFile={this.state.sizeFile}
            isLoading = {this.state.isLoading}
            index = {this.state.index}
            // setModalVisible={this.setModalVisible}
          />}

        />
      </ScrollView>
      </View>
      }
  
      </View>
      )
    }
}

const mapStateToProps = state =>{
  return{
    language: state.updateVersion.language,
    version:state.updateVersion.version,
    sourceId:state.updateVersion.sourceId,
    downloaded:state.updateVersion.downloaded
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    updateVersion: (language,version,sourceId,downloaded)=>dispatch(updateVersion(language,version,sourceId,downloaded)),
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(LanguageList)