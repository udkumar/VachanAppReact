import React, { Component } from 'react';
import { Text, StyleSheet,ScrollView,Dimensions, Modal,View,ActivityIndicator,TextInput,FlatList,LayoutAnimation,UIManager,Platform,TouchableOpacity} from 'react-native';
import {Card} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'
import dbQueries from '../../utils/dbQueries'
import APIFetch from '../../utils/APIFetch'
import timestamp from '../../assets/timestamp.json'
import  grammar from 'usfm-grammar'
import { getBookNameFromMapping, getBookSectionFromMapping, getBookNumberFromMapping } from '../../utils/UtilFunctions';
const width = Dimensions.get('window').width;
var height =  Dimensions.get('window').width;

class ExpandableItemComponent extends Component {
  constructor() {
    super();
    this.state = {
      layoutHeight: 0,
      modalVisible:true
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
            // onPress={this.props.setModalVisible}
              style={styles.content}>
              <Text style={styles.text}>
                 {item.versionName}
              </Text>
              {/* <TouchableOpacity > */}
              <Icon name="file-download" size={24} 
               onPress={()=>{this.props.DownloadBible(item,this.props.item.languageName)}}
               />
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
                      // console.log(" langauge code "+language+" version res "+JSON.stringify(versionRes.bible[language]))
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

    DownloadBible = async(item,langName)=>{
      console.log("item "+JSON.stringify(item)+ "language name "+langName)
      console.log("DOWNLOAD FUNCTION PRESS")
      var bookModel = []
      var chapterModel = []
      var verseModel = []
      var content = await APIFetch.getContent(item.versionId)
      console.log("constent key "+content["gen"])
      var jsonOutput =   grammar.parse(content["gen"],grammar.SCRIPTURE)
      console.log(JSON.stringify(jsonOutput)+ " JSON OBJECT ")
      if(jsonOutput !=null){
      for(var i=0;i<jsonOutput.chapters.length-1;i++){
        for(var j=0; j< jsonOutput.chapters[i].verses.length; j++){
          let verseModels = {
            verseText:jsonOutput.chapters[i].verses[j].verseText,
            VerseNumber:jsonOutput.chapters[i].verses[j].VerseNumber
          }
            verseModel.push(verseModels)
        }
        var numberOfVerses = jsonOutput.chapters[i].verses.length
        var chapterNum = jsonOutput.chapters[i].chapterTitle 
        let chapterModels = { 
          chapterNumber: chapterNum,
          numberOfVerses: numberOfVerses,
          verseModel:verseModel,
        }
          chapterModel.push(chapterModels)
      }
    }
      const bookKey  = 'GEN'
      let bookModels = {
        languageName:langName,
        versionCode:item.versionCode,
        bookId: bookKey,
        bookName:getBookNameFromMapping(bookKey),
        chapterModel: chapterModel,
        section: getBookSectionFromMapping(bookKey),
        bookNumber: getBookNumberFromMapping(bookKey)
      }
      bookModel.push(bookModels)
      dbQueries.addNewVersion(langName,item.versionCode,bookModel)
      console.log("book model "+JSON.stringify(bookModel))
      // this.setState({modalVisible:this.state.modalVisible})
    }
    setModalVisible=()=>{
      this.setState({modalVisible:!this.state.modalVisible})
    }
    render(){
      console.log("render visible "+this.state.modalVisible)
      //  console.log("langauge length "+JSON.stringify(this.state.languages))
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
                    DownloadBible = {this.DownloadBible}
                    // setModalVisible={this.setModalVisible}
                    // modalVisible={this.state.modalVisible}
                  />
                ))}
              </ScrollView>
            </View>
            }
            
             {/* {this.state.modalVisible == true ?
              <Modal
              animationType="fade"
              // presentationStyle="presentationStyle"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
              alert('Modal has been closed.');
              }}>
              <View style={{flex:1,marginVertical:height/3}}>
                <View 
                  style={{
                    flex:1,
                    width:width,
                    height:height,
                    justifyContent:'center',
                    alignItems:'center',
                    backgroundColor:"red"
                  }}>
                    <FlatList
                      numColumns={4}
                      data={["1","2","3","4","5","6","8","9","10","11","12","13","14","15"]}
                      renderItem={({item, index}) => 
                      <TouchableOpacity 
                      style={{
                        backgroundColor:'transparent',
                        borderRightWidth:1, 
                        borderBottomWidth:1,
                        height:height/4,
                        width:width/4, 
                        justifyContent:"center",
                        alignItems:'center'
                      }}
                        onPress={this.setModalVisible}
                        >
                              <Text>{item}</Text>
                          </TouchableOpacity>
                      }
                    />
                </View>
              </View>
            </Modal>
             : null 
            } */}
      
        {/* <TouchableOpacity
          onPress={() => {
            this.setModalVisible(true);
          }}>
          <Text>Show Modal</Text>
        </TouchableOpacity> */}
      
          {/* <Modal
            visible={this.state.modalVisible}
            animationType='slide'
            onRequestClose={() => {console.log('Modal has been closed.');}}
            transparent={true}
         >
         <View
         style={{
           width:width,
           height:height,
           justifyContent:'center',
           alignItems:'center'
         }}
          > 
          <View style={{
             alignItems: 'center',
             backgroundColor: 'red',
             justifyContent: 'center',
             height: height,
             width:width
          }}>
           <TouchableOpacity
            onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
            >
            <Text>Close</Text>
            </TouchableOpacity>
            </View>
          </View>
          </Modal> */}
        </View>
      )
    }
}
const styles = StyleSheet.create({
 
    MainContainer :{
    //  flex:1,
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

