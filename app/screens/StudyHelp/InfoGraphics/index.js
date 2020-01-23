import React,{Component} from 'react';
import { StyleSheet,Image,ScrollView, FlatList,TouchableOpacity, Text, View, Alert, Platform } from 'react-native';


import {connect} from 'react-redux'
import {selectedChapter,updateAudio,updateContentType} from '../../../store/action/'
import APIFetch from '../../../utils/APIFetch'
import { NavigationEvents } from 'react-navigation';


import infographics from '../../../assets/infographics.json'
import Icon from 'react-native-vector-icons/MaterialIcons'


class Infographics extends Component {

  static navigationOptions = ({navigation}) =>{
    const { params={} } = navigation.state 
    return{
        headerTitle:(
          <View style={styles.headerLeftStyle}>
            <View style={{marginRight:10}}>
              <TouchableOpacity style={styles.touchableStyleLeft}  
              onPress={() =>{navigation.navigate("SelectionTab", {bookId:params.bookId,chapterNumber:params.currentChapter,totalVerses:params.totalVerses,getReference:params.callBackForUpdateBook,contentType:'infographics'})}}>
                <Text  style={styles.headerTextStyle}>{params.bookName}  {params.currentChapter }</Text>
              <Icon name="arrow-drop-down" color="#fff" size={24}/>
              </TouchableOpacity>
            </View>
            <View style={{marginRight:10}}>
              <TouchableOpacity onPress={() =>{navigation.navigate("LanguageList", {callBackForUpdateBook:params.callBackForUpdateBook,contentType:'infographics'})}} style={styles.headerLeftStyle}>
                <Text style={styles.headerTextStyle}>{params.languageName}  {params.versionCode}</Text>
                <Icon name="arrow-drop-down" color="#fff" size={24}/>
              </TouchableOpacity>
           
            </View>
          </View>
       
      ), 
        headerTintColor:"#fff",
    }
}
    constructor(props){
      super(props)
      this.state = {
      GridViewItems: [],
    }
    }
   getImage =(val)=>{
    if(val ==null){
      return
      // this.setState({imagePath})
    }
   }
    async componentDidMount(){
      console.log("IMAGE PATH ",this.props.filePath)
      this.props.navigation.setParams({
        bookName:this.props.bookName,
        currentChapter: this.props.chapterNumber,
        languageName:this.props.language,
        versionCode:this.props.version,
        updateContentType:this.props.updateContentType('Infographics'),
        // callBackForUpdateBook:this.getImage
      })
    }
 
  render(){
      console.log("infographics json file ",this.props.navigation.state.routeName)
   return(
     <View style={{flex:1}}>
    {/* <ScrollView contentContainerStyle={{alignItems: 'center'}}> */}
      <NavigationEvents
      onDidFocus={() => this.getImage}
      />
       <Image  style={{height:"98%",width:'98%'}}resizeMode='cover' source={{ uri: this.props.filePath }} />
       {/* </ScrollView> */}
       </View>
   )
  }
 
}

const styles = StyleSheet.create({
  MainContainer :{
  // justifyContent: 'center',
  flex:1,
  // margin: 8,
  // paddingTop: (Platform.OS) === 'ios' ? 20 : 0
   
  }, 
  GridViewBlockStyle: {
    justifyContent: 'center',
    flex:1,
    alignItems: 'center',
    height: 220,
    margin: 5,
    backgroundColor: '#00BCD4'
   
  },
  GridViewInsideTextItemStyle: {
     color: '#fff',
     padding: 4,
     fontSize: 18,
     justifyContent: 'center',  
   },
   headerLeftStyle:{
    flexDirection:'row',
    flex:1,
  },
  headerRightStyle:{
    flexDirection:'row',
    flex:1,
  },
  touchableStyleRight:{
      flexDirection:"row",
      marginRight:10
  },
  touchableStyleLeft:{
    flexDirection:"row",
      marginLeft:10,
  },
  headerTextStyle:{
      fontSize:16,
      color:"#fff",
      textAlign:'center'
  },
  });
const mapStateToProps = state =>{
  return{
    language: state.updateVersion.language,
    languageCode:state.updateVersion.languageCode,
    version:state.updateVersion.version,
    sourceId:state.updateVersion.sourceId,
    downloaded:state.updateVersion.downloaded,
    contentType:state.updateVersion.contentType,


    chapterNumber:state.updateVersion.chapterNumber,
    totalChapters:state.updateVersion.totalChapters,
    bookName:state.updateVersion.bookName,
    bookId:state.updateVersion.bookId,
    fontFamily:state.updateStyling.fontFamily,

    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
    close:state.updateSplitScreen.close,

    audio:state.updateAudio.visible,
    filePath:state.infographics.fileName

  }
}

const mapDispatchToProps = dispatch =>{
  return {
    selectedChapter: (chapterNumber,totalVerses)=>dispatch(selectedChapter(chapterNumber,totalVerses)),
    closeSplitScreen :(close)=>dispatch(closeSplitScreen(close)),
    updateAudio :(audio)=>dispatch(updateAudio(audio)),
    updateContentType:(content) =>dispatch(updateContentType(content)),
  }
}
export  default connect(mapStateToProps,mapDispatchToProps)(Infographics)
