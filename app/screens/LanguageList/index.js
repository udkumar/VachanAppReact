import React, { Component } from 'react';
import { Text, StyleSheet,ScrollView,Dimensions, Modal,View,ActivityIndicator,TextInput,FlatList,LayoutAnimation,UIManager,Platform,TouchableOpacity} from 'react-native';
import {Card} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DbQueries from '../../utils/dbQueries'
import APIFetch from '../../utils/APIFetch'
import timestamp from '../../assets/timestamp.json'
import {NavigationActions} from 'react-navigation'
import  grammar from 'usfm-grammar'
import { getBookNameFromMapping, getBookSectionFromMapping, getBookNumberFromMapping } from '../../utils/UtilFunctions';
import VerseModel from '../../models/VerseModel';
import dbQueries from '../../utils/dbQueries';
import { catchClause } from '@babel/types';
import { version } from 'moment';
import { constColors } from '../../utils/colors';
const width = Dimensions.get('window').width;
var height =  Dimensions.get('window').width;

const languageList = async () => { 
return await dbQueries.getLangaugeList()
}

//  {
  // try{
    // return await dbQueries.getLangaugeList()
  // }
  // catch(error){
    // console.log("erooro "+error )
  // }
  
// }



class ExpandableItemComponent extends Component {
  constructor() {
    super();
    this.state = {
      layoutHeight: 0,
      modalVisible:true,
    };
  }
  componentWillReceiveProps(nextProps){
    // console.log("next props "+JSON.stringify(nextProps))
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
    // console.log("should update next props "+JSON.stringify(nextProps)+ "next state "+nextState)
    if (this.state.layoutHeight !== nextState.layoutHeight) {
      return true;
    }
    return false;
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
          <Text style={styles.headerText}>{this.props.item.languageName}</Text>
          <Icon name={this.props.item.isExpanded ? "keyboard-responseow-down" : "keyboard-responseow-up" } style={styles.iconStyle} size={24}/>
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
              {/* <TouchableOpacity > */}
              </TouchableOpacity>
              {
                item.downloaded==true ? 
              //   <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{this.props.DownloadBible(this.props.item.languageName,item.versionCode,index)}}>
              //   <Icon name="file-download" size={24} 
              //   />
              //  </TouchableOpacity>
              <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{this.props.goToBible(this.props.item.languageName,item.versionCode)}}>
                <Icon name="check" size={24} 
                />
               </TouchableOpacity>
               :
              <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{this.props.DownloadBible(this.props.item.languageName,item.versionCode,index)}}>
                <Icon name="file-download" size={24} 
                />
               </TouchableOpacity>}
              {/* </TouchableOpacity> */}
              {/* <View style={styles.separator} /> */}
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
          console.log("diff "+diffDays)
            languageList().then(async(language) => {
            console.log("language list ",language)
            console.log("language list ",language.length)

              if(language.length == 0){
                var versionRes = await APIFetch.getVersions()
                this.addLangauge(versionRes)
                // console.log("response ",response)
               
            }
            this.setState({
              languages: language,
              searchList:language
            })
            })
          .catch(err => console.error(err))
        }
    }

    addLangauge(response1){
      var response =[
        { 
          "sourceId": 21, 
          "language": {"code": "hin", "name": "hindi", "localScriptName": null, "scriptDirection": null, "script": null, "id": 2302}, 
          "version": {"name": " HINDI Indian Revised Version", "longName": "irv_1", "code": "IRV"}, "updatedDate": "2019-07-23 11:57:20.650000+00:00", "audioBible": []
        },
        {
          "sourceId": 22, 
          "language": {"code": "tamil", "name": "tamil", "localScriptName": null, "scriptDirection": null, "script": null, "id": 2302}, 
          "version": {"name": " TAMIL 1 Indian Revised Version", "longName": "irv_2", "code": "IRV"}, "updatedDate": "2019-07-24 10:50:52.710000+00:00", "audioBible": []
        },
        { 
          "sourceId": 23, 
          "language": {"code": "tamil", "name": "tamil", "localScriptName": null, "scriptDirection": null, "script": null, "id": 2302}, 
          "version": {"name": " TAMIL 2  Indian Revised Version", "longName": "irv_1", "code": "IRV"}, "updatedDate": "2019-07-23 11:57:20.650000+00:00", "audioBible": []
        },
        {
          "sourceId": 24, 
          "language": {"code": "eng", "name": "eng", "localScriptName": null, "scriptDirection": null, "script": null, "id": 2302}, 
          "version": {"name":"ENG 1 Indian Revised Version", "longName": "irv_2", "code": "IRV"}, "updatedDate": "2019-07-24 10:50:52.710000+00:00", "audioBible": []
        },
        {
          "sourceId": 25, 
          "language": {"code": "eng", "name": "eng", "localScriptName": null, "scriptDirection": null, "script": null, "id": 2302}, 
          "version": {"name": " ENG 2 Indian Revised Version", "longName": "irv_2", "code": "IRV"}, "updatedDate": "2019-07-24 10:50:52.710000+00:00", "audioBible": []
        },
        {
          "sourceId": 26, 
          "language": {"code": "eng", "name": "eng", "localScriptName": null, "scriptDirection": null, "script": null, "id": 2302}, 
          "version": {"name": " ENG 3 Indian Revised Version", "longName": "irv_2", "code": "IRV"}, "updatedDate": "2019-07-24 10:50:52.710000+00:00", "audioBible": []
        }
      ]
      var array = [
        {"name":"Steven Smith","Country":"England","Age":35},
        {"name":"Hannah Reed","Country":"Scottland","Age":23},
        {"name":"Steven Smith","Country":"England","Age":35},
        {"name":"Robert Landley","Country":"England","Age":84},
        {"name":"Steven Smith","Country":"England","Age":35},
        {"name":"Robert Landley","Country":"England","Age":84}
      ]

      var result = array.reduce((c, v) => {
          console.log("c",c)
          console.log("v ",v)
      },[])
      
      console.log("reduce",result);
       
  }
   
    goToVersionScreen(value){
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

    DownloadBible = async(langName,versCode,index)=>{
      // console.log("language NAME ",langName,"version cosde ",versCode)
      var chapterModels = []
      var verseModels = []
      var content = await APIFetch.getContent(18,"json",62)
      var bookId = ''

      for(var id in content){
      if(content !=null){
        for(var i=0; i< content[id].chapters.length; i++){
          verseModels = []
          for(var j=0; j< content[id].chapters[i].verses.length; j++){
              verseModels.push(content[id].chapters[i].verses[j])
          }
          var chapterModel = { 
                chapterNumber:  parseInt(content[id].chapters[i].header.title),
                numberOfVerses: parseInt(content[id].chapters[i].verses.length),
                verses:verseModels,
              }
          chapterModels.push(chapterModel)
          bookId = id
        }
      }
      }
      var bookModels = {
        languageName: langName,
        versionCode: versCode,
        bookId: bookId,
        bookName:getBookNameFromMapping(bookId,this.props.screenProps.languageName),
        chapters: chapterModels,
        section: getBookSectionFromMapping(bookId),
        bookNumber: getBookNumberFromMapping(bookId)
      }
     
      
      await DbQueries.addNewVersion(langName,versCode,bookModels)
      languageList().then(async(language) => {
        this.setState({languages:language})
      })
      .catch((error)=>{console.log("error")})
     
    }
    setModalVisible=()=>{
      this.setState({modalVisible:!this.state.modalVisible})
    }
    goToBible = (langName,verCode)=>{
      this.props.navigation.state.params.updateLanguage(langName,verCode)
      this.props.navigation.dispatch(NavigationActions.back())    
    }
  
    render(){
      // languageList =  await languageList
      // console.log("languaguage list ",languageList)
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

