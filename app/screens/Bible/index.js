import React, { Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Alert,
  ActivityIndicator,
  Dimensions,
  TouchableHighlight,
  StyleSheet,
  TouchableOpacity,
  Share,
  ToastAndroid,
  Modal,
  LayoutAnimation,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {createResponder } from 'react-native-gesture-responder';
import DbQueries from '../../utils/dbQueries'
import VerseView from './VerseView'
import AsyncStorageUtil from '../../utils/AsyncStorageUtil';
import {AsyncStorageConstants} from '../../utils/AsyncStorageConstants'
import Player from '../../screens/Bible/Navigate/Audio/Player';
import {getResultText} from '../../utils/UtilFunctions';
import {getBookNameFromMapping,getBookChaptersFromMapping,getBookNumOfVersesFromMapping} from '../../utils/UtilFunctions';
import APIFetch from '../../utils/APIFetch'
import {fetchDownloadedVersionContent,fetchVersionLanguage,fetchVersionContent,queryDownloadedBook,updateVersionBook,updateVersion} from '../../store/action/'
import SelectContent from '../Bible/component/SelectContent'
import SelectBottomTabBar from '../Bible/component/SelectBottomTabBar'
import Spinner from 'react-native-loading-spinner-overlay';
// import Orientation from 'react-native-orientation';
import { styles } from './styles.js';
import {connect} from 'react-redux'
import Commentary from '../StudyHelp/Commentary/'
import MainHeader from '../../components/MainHeader'
import {Card,CardItem,Content,Body,Header,Container, Button,Right,Left,Title} from 'native-base'
import BibleChapter from './component/BibleChapter';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
var arrLayout = [];

class Bible extends Component {
  static navigationOptions = ({navigation}) =>{
        const { params={} } = navigation.state 
        return{
          header: params.visibleParallelView && null,
          headerLeft:(
                <View style={navStyles.headerLeftStyle}>
                  <View style={{marginRight:10}}>
                  <TouchableOpacity style={navStyles.touchableStyleLeft}  
                      onPress={() =>{navigation.toggleDrawer()}}>
                    <Icon 
                        name="menu"  
                        color="#fff"
                        size={20}
                    />
                    </TouchableOpacity>
                  </View>
                  <View style={{marginRight:10}}>
                    <TouchableOpacity style={navStyles.touchableStyleLeft} 
                      onPress={() =>{navigation.navigate("SelectionTab", {getReference:params.getRef,bookId:params.bookId,chapterNumber:params.currentChapter,totalChapters:params.numOfChapter,totalVerses:params.numOfVerse})}}> 
                      <Text  style={navStyles.headerTextStyle}>{params.bookName}  {params.currentChapter }</Text>
                    <Icon name="arrow-drop-down" color="#fff" size={20}/>
                    </TouchableOpacity>
                  </View>
                  <View style={{marginRight:10}}>
                    <TouchableOpacity onPress={() =>{{navigation.navigate("LanguageList",{updateLangVer:params.updatelangVer})}}} style={navStyles.headerLeftStyle}>
                      <Text style={navStyles.headerTextStyle}>{params.languageName}  {params.versionCode}</Text>
                      <Icon name="arrow-drop-down" color="#fff" size={20}/>
                    </TouchableOpacity>
                  </View>
                </View>
            ), 
       
            headerTintColor:"#fff",
            headerStyle: {
              backgroundColor: "#3F51B5",
              elevation: 0,
              shadowOpacity: 0,
              height:40,
              width:params.visibleParallelView ? '50%' :'100%'
          },
            headerRight:(
              <View style={navStyles.headerRightStyle}>
              {params.audio &&
              <TouchableOpacity  onPress={params.toggleAudio}
                style={[navStyles.touchableStyleRight,{flexDirection:'row'}]}>
                <Icon 
                    name='volume-up'
                    size={20} 
                    color={ "#fff" }
                /> 
              </TouchableOpacity>
              }
                  <TouchableOpacity  style={[navStyles.touchableStyleRight,{flexDirection:'row'}]}>
                    <Icon 
                      onPress={()=> {params.onBookmark(params.isBookmark)}} 
                      name='bookmark'
                      color={params.isBookmark ? "red" : "#fff"} 
                      size={20} 
                  /> 
                 </TouchableOpacity>
                 <SelectContent visible={params.modalVisible} visibleParallelView={params.visibleParallelView} navigation={navigation} navStyles={navStyles} />
              </View>
            )
        }
    }
    

  constructor(props) {
    super(props);
    console.log("PROPS VALUE ",this.props)
    this.state = {
      // languageName:this.props.language,
      // languageCode:this.props.languageCode,
      // versionCode:this.props.versionCode,
      // sourceId:this.props.sourceId,
      // downloaded:this.props.downloaded,
      // bookId:this.props.bookId,
      // bookName:this.props.bookName,
      // totalChapters:this.props.totalChapters,
      // totalVerses:this.props.totalVerses,
      // verseNumber:this.props.verseNumber,
      downloadedBook:[],
      audio:false,
      chapterContent:[],
      error:null,
      // downloadedChapters:[],
      isLoading: false,
      showBottomBar: false,
      bookmarksList: [],
      isBookmark: false,
      currentVisibleChapter:this.props.chapterNumber,
      bookNumber:this.props.bookNumber,
      selectedReferenceSet: [],
      verseInLine: this.props.verseInLine,
      bottomHighlightText:false,
      HightlightedVerseArray:[],
      gestureState: {},
      thumbSize: 100,
      left: width / 2,
      top: height / 2,

      scrollDirection:'up',
      close:true,
      message:'',
      status:false,
      modalVisible: false,
      arrLayout:[]
      //modal value for showing chapter grid 
    }

    this.getSelectedReferences = this.getSelectedReferences.bind(this)
    this.onBookmarkPress = this.onBookmarkPress.bind(this)
    // this.getReference = this.getReference.bind(this)
    this.alertPresent
    this.pinchDiff = 0
    this.pinchTime = new Date().getTime()
    this.styles = styles(this.props.colorFile, this.props.sizeFile);    
  }
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   // console.log("NEXT PROPS ",nextProps.navigation.state.params)
  //     return{
  //       colorFile:nextProps.colorFile,
  //       sizeFile:nextProps.sizeFile,
  //       totalVerses:nextProps.totalVerses,
  //       totalChapters:nextProps.totalChapters,
  //       languageName:nextProps.language,
  //       versionCode:nextProps.versionCode,
  //       bookId:nextProps.bookId,
  //       bookName:nextProps.bookName,
  //       sourceId:nextProps.sourceId,
  //       downloaded:nextProps.downloaded,
  //       currentVisibleChapter:nextProps.chapterNumber,
  //   }
  // }

  scrollToVerse(verseNumber){
    if(this.state.arrLayout.length > 0){
    console.log("SCROLL TO ........  ",this.state.arrLayout, " ",this.state.arrLayout[verseNumber],"  ",verseNumber)

      // if(this.arrLayout[this.props.verseNumber+1] == this.props.verseNumber)
      this.scrollViewRef.scrollTo({
        x: 0,
        y: this.state.arrLayout[verseNumber-1],
        // animated: true,
      })
    }
  }

  async componentDidMount(){
    this.gestureResponder = createResponder({
      onStartShouldSetResponder: (evt, gestureState) => true,
      onStartShouldSetResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetResponder: (evt, gestureState) => true,
      onMoveShouldSetResponderCapture: (evt, gestureState) => true,
      onResponderGrant: (evt, gestureState) => {},
      onResponderMove: (evt, gestureState) => {
        let thumbSize = this.state.thumbSize;
        if (gestureState.pinch && gestureState.previousPinch) {
          thumbSize *= (gestureState.pinch / gestureState.previousPinch)
          let currentDate = new Date().getTime()
          let diff = currentDate - this.pinchTime
          console.log("time diff : " + diff + " prev diff : " + this.pinchDiff)
          if (diff > this.pinchDiff) {
              console.log("gesture pinch diff = " + (gestureState.pinch - gestureState.previousPinch))
             if (gestureState.pinch - gestureState.previousPinch > 5) {
                // large
                console.log("large")
                this.props.screenProps.changeSizeByOne(1)              
            } else if (gestureState.previousPinch - gestureState.pinch > 5) {
                console.log("small")
                // small
                this.props.screenProps.changeSizeByOne(-1)              
            }
          }
          this.pinchDiff = diff
          this.pinchTime = currentDate
        }
        let {left, top} = this.state;
        left += (gestureState.moveX - gestureState.previousMoveX);
        top += (gestureState.moveY - gestureState.previousMoveY);
        this.setState({
          gestureState: {
            ...gestureState
          },
          left, top, thumbSize
        })  
      },
      onResponderTerminationRequest: (evt, gestureState) => true,
      onResponderRelease: (evt, gestureState) => {
        this.setState({
          gestureState: {
            ...gestureState
          }
        })
      },
      onResponderTerminate: (evt, gestureState) => {},
      
      onResponderSingleTapConfirmed: (evt, gestureState) => {
        console.log('onResponderSingleTapConfirmed...' + JSON.stringify(gestureState));
      },
      moveThreshold: 2,
      debug: false
    })
    this.props.navigation.setParams({
      onBookmark: this.onBookmarkPress,
      isBookmark:this.state.isBookmark,
      toggleAudio:this.toggleAudio,
      bookName:getBookNameFromMapping(this.props.bookId,this.props.language).length > 8 ? getBookNameFromMapping(this.props.bookId,this.props.language).slice(0,7)+"..." : getBookNameFromMapping(this.props.bookId,this.props.language),
      currentChapter:this.state.currentVisibleChapter,
      languageName: this.props.language, 
      versionCode: this.props.versionCode,
      bookId:this.props.bookId,
      audio:this.state.audio,
      modalVisible:false,
      toggleModal:this.setState({modalVisible:!this.state.modalVisible}),
      visibleParallelView:false,
      getRef:this.getReference,
      updatelangVer:this.updateLangVer,
      numOfChapter:this.props.totalChapters,
      numOfVerse:this.props.totalVerses
    })
    this.getChapter()
    // this.queryBookFromAPI(null)
    this.audioComponentUpdate()
    this.getHighlights()
    this.getBookMarks()
  }
  
  getReference = async(item)=>{
    this.scrollToVerse(item.verseNumber)
    var time =  new Date()
    DbQueries.addHistory(this.props.sourceId,this.props.language,this.props.languageCode, this.props.versionCode, item.bookId, item.chapterNumber, this.props.downloaded, time)
    this.props.navigation.setParams({
      bookId:item.bookId,
      bookName:getBookNameFromMapping(item.bookId,this.props.language).length > 8 ? getBookNameFromMapping(item.bookId,this.props.language).slice(0,7)+"..." : getBookNameFromMapping(item.bookId,this.props.language),
      currentChapter:item.chapterNumber,
      numOfChapter:item.totalChapters,
      numOfVerse:item.totalVerses
    })
    this.props.updateVersionBook({
      bookId:item.bookId,
      bookName:item.bookName,
      chapterNumber:item.chapterNumber,
      totalChapters:item.totalChapters,
      totalVerses:item.totalVerses,
      verseNumber:item.verseNumber
    })
    this.getChapter()
    this.audioComponentUpdate()
    this.getHighlights()
    this.getBookMarks()
  }

  updateLangVer=async(item)=>{
    console.log('UPDATE VERSION ',item)
    var time =  new Date()
    DbQueries.addHistory(item.sourceId,item.languageName,item.languageCode, 
    item.versionCode, this.props.bookId, this.state.currentVisibleChapter, item.downloaded, time)

    this.props.updateVersion({language:item.languageName,languageCode:item.languageCode,
      versionCode:item.versionCode,sourceId:item.sourceId,downloaded:item.downloaded})
    this.props.navigation.setParams({
      languageName:item.languageName,
      versionCode:item.versionCode,
      bookName:getBookNameFromMapping(this.props.bookId,item.languageName).length > 8 ? getBookNameFromMapping(this.props.bookId,item.languageName).slice(0,7)+"..." : getBookNameFromMapping(this.props.bookId,item.languageName),
    })
    this.getChapter()
    this.audioComponentUpdate()
    this.getHighlights()
    this.getBookMarks()
  }

  async getDownloadedContent(){
        var content = await DbQueries.queryVersions(this.props.language,this.props.versionCode,this.props.bookId,this.state.currentVisibleChapter) 
        this.setState({
          downloadedBook:content[0].chapters,
          chapterContent:content[0].chapters[this.state.currentVisibleChapter-1].verses,
          isLoading:false,
          error:null,
          currentVisibleChapter:this.state.currentVisibleChapter,
        })
  }
  async getChapter(){
    try{
      if(this.props.downloaded){
        this.getDownloadedContent()
        }else{
          var content = await APIFetch.getChapterContent(this.props.sourceId, this.props.bookId, this.state.currentVisibleChapter)
          this.setState({chapterContent:content.chapterContent.verses,error:null,isLoading:false,currentVisibleChapter:this.state.currentVisibleChapter})
      }
    }
    catch(error){
      this.setState({error:error,isLoading:false})
    }
    
  }

  queryBookFromAPI = async(val)=>{
    console.log("query book ",this.props.downloaded,this.props.language,this.props.sourceId,this.props.totalChapters,this.props.totalVerses)
    this.setState({isLoading:true,currentVisibleChapter: val != null ? this.state.currentVisibleChapter + val : this.props.chapterNumber,error:null },async()=>{
          try{
            this.props.navigation.setParams({
              languageName:this.props.language,
              versionCode:this.props.versionCode,
              bookId:this.props.bookId,
              bookName:getBookNameFromMapping(this.props.bookId,this.props.language).length > 8 ? getBookNameFromMapping(this.props.bookId,this.props.language).slice(0,7)+"..." : getBookNameFromMapping(this.props.bookId,this.props.language),
              currentChapter:this.state.currentVisibleChapter,
              numOfChapter:this.props.totalChapters,
              numOfVerse:this.props.totalVerses
            })
            if(this.props.downloaded){
              if(this.state.downloadedBook.length > 0){
                console.log("downloaded book ",this.state.downloadedBook)
               this.setState({
                chapterContent:this.state.downloadedBook[this.state.currentVisibleChapter-1].verses,
                isLoading:false
               })
              }
            }
            else{
                var content = await APIFetch.getChapterContent(this.props.sourceId, this.props.bookId, this.state.currentVisibleChapter)
                  console.log("fetch content",content)
                  this.setState({chapterContent:content.chapterContent.verses,isLoading:false,currentVisibleChapter:this.state.currentVisibleChapter})
            }
            this.updateBookmark()
          }
          catch(error) {
            this.setState({isLoading:false,error:error})
            console.log("ERROR ",error)
          }
    })
}


toggleAudio=()=>{
  if(this.state.audio){
    this.setState({status:!this.state.status})
  }
  else{
    ToastAndroid.showWithGravityAndOffset(
      "Sorry Audio is not there for this book",
       ToastAndroid.LONG,
       ToastAndroid.BOTTOM,
       25,
       50,
     )
  }
}

async audioComponentUpdate(){
  console.log("audio value ",this.state.audio)
var found = false
let res =  await APIFetch.availableAudioBook(this.props.languageCode,this.props.versionCode)
try{
if(res.length !== 0){
for (var key in res.books){
  if(key == this.props.bookId){
    found = true
    this.props.navigation.setParams({audio:true})
    this.setState({audio:true})
    break;
  }
}
  if(found==false){
    this.props.navigation.setParams({audio:false })
    this.setState({audio:false})
  }
}
}
catch(error){
this.props.navigation.setParams({audio:false})
this.setState({audio:false})
}
}

  async getHighlights(){
    let model2 = await  DbQueries.queryHighlights(this.props.language,this.props.versionCode,this.props.bookId)
    const HightlightedVerseArray = []
    if(model2 !=null){
      for(var i = 0; i<=model2.length-1;i++){
        const obj = {"bookId":model2[i].bookId,"chapterNumber":model2[i].chapterNumber,"verseNumber":model2[i].verseNumber}
        HightlightedVerseArray.push(obj)
      }
      this.setState({HightlightedVerseArray})
    }
  }
  async getBookMarks(){
    console.log("this.props.language,this.props.versionCode,this.props.bookId,this.state.currentVisibleChapter ",this.props.language,this.props.versionCode,this.props.bookId,this.state.currentVisibleChapter)
    let model = await  DbQueries.queryBookmark(this.props.language,this.props.versionCode,this.props.bookId)
    console.log("model ",model) 
    var bookmarksList = []
    if(model != null){
      for(var i = 0; i<=model.length-1;i++){
        const obj = {"bookId":model[i].bookId,"chapterNumber":model[i].chapterNumber}
        bookmarksList.push(obj)
      }
      this.setState({bookmarksList},()=>{
        this.updateBookmark()
      })
    }
   
  }
  updateBookmark(){
    let isBookmark  = false
    if(this.state.bookmarksList.length > 0){
      for(var i = 0; i < this.state.bookmarksList.length;i++){
        console.log("bookmark list ",this.state.bookmarksList[i])
        if(this.state.bookmarksList[i].bookId == this.props.bookId && this.state.bookmarksList[i].chapterNumber == this.state.currentVisibleChapter){
          isBookmark = true
        }
      }
      console.log("is BOOK MARK UPDATE  ",isBookmark)
      this.setState({isBookmark})
      this.props.navigation.setParams({
        isBookmark:isBookmark
      })
      }
    else{
      this.setState({isBookmark:false},
        ()=>{
          this.props.navigation.setParams({
            isBookmark:false
          })
      })
    }
  }

  //add book mark from header icon 
  onBookmarkPress(isbookmark){
    // console.log("bookmark bookid chapter isbookmark ",bookId,chapterNum,isbookmark)
     DbQueries.updateBookmarkInBook(this.props.language,this.props.versionCode,this.props.bookId,this.state.currentVisibleChapter, isbookmark  ? false : true);
      this.setState({isBookmark: isbookmark ? false : true}, () => {
      this.props.navigation.setParams({isBookmark: this.state.isBookmark}) 
    })
  }


//selected reference for highlighting verse
  getSelectedReferences = (vIndex, chapterNum, vNum,text)=> {
      console.log("vIndex, chapterNum, vNum,text ",vIndex, chapterNum, vNum,text)
    let obj = chapterNum+'_' +vIndex+'_'+vNum+'_'+text
    let selectedReferenceSet = [...this.state.selectedReferenceSet]
    
    var found = false;
    for(var i = 0; i < selectedReferenceSet.length; i++) {
      if (selectedReferenceSet[i] == obj) {
        found = true;
        selectedReferenceSet.splice(i, 1);
        break;
      }
    }

    if (!found) {
      selectedReferenceSet.push(obj)
    }
    this.setState({selectedReferenceSet}, () => {
      let selectedCount = this.state.selectedReferenceSet.length, highlightCount = 0;
      for (let item of this.state.selectedReferenceSet) {
          let tempVal = item.split('_')
          for(var i=0; i<=this.state.HightlightedVerseArray.length-1; i++ ){
              if (this.state.HightlightedVerseArray[i].verseNumber == JSON.parse(tempVal[2]) && this.state.HightlightedVerseArray[i].chapterNumber ==JSON.parse(tempVal[0]) && this.state.HightlightedVerseArray[i].bookId == this.props.bookId  ) {
                highlightCount++
              }
              
          }
      }

      this.setState({showBottomBar: this.state.selectedReferenceSet.length > 0 ? true : false, bottomHighlightText: selectedCount == highlightCount ?  false : true})
    })
  }
  
  addToNotes = () => {
    let refList = []
    let id = this.props.bookId
    let name = getBookNameFromMapping(this.props.bookId,this.props.language)
    for (let item of this.state.selectedReferenceSet) {

      let tempVal = item.split('_')
      const verseNumber =  tempVal[2].toString()
      let refModel = {
        bookId: id, bookName: name, 
        chapterNumber: parseInt(tempVal[0]), 
        verseNumber: verseNumber, 
        verseText:tempVal[3],
        versionCode: this.props.versionCode, 
        languageName: this.props.language,
      };
      refList.push(refModel)
    }
    this.props.navigation.navigate('EditNote', {
        referenceList: refList,
        bookId:id,
        onbackNote:this.onbackNote,
        chapterNumber:this.state.currentVisibleChapter,
        totalVerses:getBookNumOfVersesFromMapping(id,this.state.currentVisibleChapter),
        totalChapters:getBookChaptersFromMapping(id),
        noteIndex:-1,
        // noteObject:''
    })
    this.setState({selectedReferenceSet: [], showBottomBar: false})
    
  }
  onbackNote=()=>{

    console.log("onback nothing in bible page")
  }
 
  //after selected reference do highlight 
  doHighlight = async () => {
    console.log(" HightlightedVerseArray ",this.state.HightlightedVerseArray)
    // let HightlightedVerseArray = [...this.state.HightlightedVerseArray]
    if (this.state.bottomHighlightText == true) {
      // do highlight
      var arr = []
      for (let item of this.state.selectedReferenceSet){
        let tempVal = item.split('_')
        await DbQueries.updateHighlightsInVerse( this.props.language, this.props.versionCode,this.props.bookId,this.state.currentVisibleChapter, tempVal[2], true)
        var highlightArr = this.state.HightlightedVerseArray
        highlightArr.push({"bookId":this.props.bookId,"chapterNumber":this.state.currentVisibleChapter,"verseNumber":JSON.parse(tempVal[2])})
        var arr = highlightArr.sort( function( a, b){ return a.verseNumber - b.verseNumber; } );
        for( var i=0; i<arr.length-1; i++ ) {
        if ( arr[i].verseNumber == arr[i+1].verseNumber ){
          arr.splice(i+1,1)
        }
        }
        }
    } else {
      // remove highlight
      for (let item of this.state.selectedReferenceSet){
        let tempVal = item.split('_')
        for(var i=0; i<=this.state.HightlightedVerseArray.length-1; i++){
          if(this.state.HightlightedVerseArray[i].chapterNumber == JSON.parse(tempVal[0]) && this.state.HightlightedVerseArray[i].verseNumber == JSON.parse(tempVal[2]) &&  this.state.HightlightedVerseArray[i].bookId == this.props.bookId) {
            await DbQueries.updateHighlightsInVerse(this.props.language, this.props.versionCode,this.props.bookId,this.state.currentVisibleChapter, tempVal[2],false)
            this.state.HightlightedVerseArray.splice(i, 1)
          }
        }
      }
    }
    this.setState({ selectedReferenceSet: [], showBottomBar: false})
  }


  //share verse
  addToShare = () => {
    let shareText = ''
    for (let item of this.state.selectedReferenceSet) {
      let tempVal = item.split('_')
      let chapterNumber= parseInt(tempVal[0])
      let vIndex= parseInt(tempVal[1])
      let verseNumber= tempVal[2]
      shareText = shareText.concat(this.props.bookName + " " + chapterNumber + ":" + verseNumber + " ");
      shareText = shareText.concat(tempVal[3])
      shareText = shareText.concat("\n");
    }
    Share.share({message: shareText})
    this.setState({selectedReferenceSet: [], showBottomBar: false})
  }
 
  componentWillUnmount(){

      var time =  new Date()
      DbQueries.addHistory(item.sourceId,item.languageName,item.languageCode, 
      item.versionCode, this.props.bookId, this.state.currentVisibleChapter, item.downloaded, time)
      
      this.props.updateVersionBook({
        bookId:this.props.bookId,
        bookName:this.props.bookName,
        chapterNumber:this.props.chapterNumber,
        totalChapters:this.props.totalChapters,
        totalVerses:this.props.totalVerses,
        verseNumber:this.props.verseNumber
      })

      this.props.updateVersion({language:this.props.languageName,languageCode:this.props.languageCode,
      versionCode:this.props.versionCode,sourceId:this.props.sourceId,downloaded:this.props.downloaded})
     
  }

  //close split screen 
  closeSplitScreen = ()=>{
     this.setState({close:!this.state.close})
  }
//change book from split screen 
  changeBookFromSplit = ( id,chapterNum) => {
    this.setState({bookId:id,currentVisibleChapter:chapterNum,bookName:this.props.bookName})
    this.props.navigation.setParams({
      currentChapter:chapterNum,
      bookName:this.props.bookName,
      isBookmark:true
    })
  }
 
  _keyExtractor = (item, index) => item.number;

 
  onScroll=(event)=> {
    var currentOffset = event.nativeEvent.contentOffset.y;
    var direction = currentOffset > this.state.offset ? 'down' : 'up';
    this.setState({offset:currentOffset,direction:direction})
    console.log(direction)
  }


  toggleParallelView(value){
    this.props.navigation.setParams({visibleParallelView:value})
  }
  errorMessage(){
    console.log("props ",this.props.error)
    if (!this.alertPresent) {
        this.alertPresent = true;
        if (this.props.error) {
            Alert.alert("", "Check your internet connection", [{text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
        } else {
            this.alertPresent = false;
        }
    }
  }
updateData = ()=>{
  if(this.state.error){
    this.errorMessage()
    this.queryBookFromAPI(null)
  }
  else{
    return
  }
}
// shouldComponentUpdate(nextProps, nextState){
// if(nextState.chapterContent != this.state.chapterContent ||
//   nextProps.sourceId !=this.props.sourceId ||
//   nextProps.downloaded !=this.props.downloaded ||
//   nextProps.bookId !=this.props.bookId
//  ){
//   console.log("COMPOENNT SHOULD UPDATE CONDITION SETISFIED ")
//   return true
// }
// // console.log("COMPOENNT SHOULD UPDATE CONDITION NOT  ........ SETISFIED nextProps",nextProps)
// // console.log("COMPOENNT SHOULD UPDATE CONDITION NOT  ........ SETISFIED nextState",nextState)
// return false
// }
  render() {
    // console.log("CHAPTER CONTENT VALUE  ",this.props.language)
    // console.log("language code version code  ",this.props.languageCode,this.props.versionCode)


      return (
        <View  style={this.styles.container}>
          {this.state.isLoading &&
            <Spinner
            visible={true}
            textContent={'Loading...'}
            //  textStyle={styles.spinnerTextStyle}
          />}
          {(this.state.error) ?
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <TouchableOpacity 
            onPress={()=>this.updateData()}
            style={{height:40,width:120,borderRadius:4,backgroundColor:'#3F51B5',justifyContent:'center',alignItems:'center'}}
            >
            <Text style={{fontSize:18,color:'#fff'}}>Reload</Text>
            </TouchableOpacity>
            </View>
          :
          <View style={{flexDirection:'row'}}>
            <View style={{width:this.props.navigation.getParam("visibleParallelView") ? '50%' : '100%'}}>
            {this.props.navigation.getParam("visibleParallelView") &&
              <Header style={{height:40}}>
                    <Button transparent onPress={()=>{this.props.navigation.navigate("SelectionTab",{getReference:this.getReference,bookId:this.props.bookId,chapterNumber:this.state.currentVisibleChapter,totalChapters:this.props.totalChapters,totalVerses:this.props.totalVerses})}}>
                        <Title style={{fontSize:16}}>{getBookNameFromMapping(this.props.bookId,this.props.language).length > 8 ? getBookNameFromMapping(this.props.bookId,this.props.language).slice(0,7)+"..." : getBookNameFromMapping(this.props.bookId,this.props.language)} {this.state.currentVisibleChapter}</Title>
                        <Icon name="arrow-drop-down" color="#fff" size={20}/>
                    </Button>
              </Header>
            }
            <ScrollView ref={(ref) => { this.scrollViewRef = ref; }} showsVerticalScrollIndicator={false}>
         
            { (this.state.verseInLine) ?
                    <View style={this.styles.chapterList}>
                     <FlatList
                      style={{padding:10}}
                      data={this.state.chapterContent }
                      extraData={this.state}
                      renderItem={({item, index}) => 
                      <VerseView
                          ref={child => (this[`child_${item.chapterNumber}_${index}`] = child)}
                          verseData = {item}
                          index = {index}
                          styles = {this.styles}
                          selectedReferences = {this.state.selectedReferenceSet}
                          getSelection = {(verseIndex, chapterNumber, verseNumber,text) => {
                          this.getSelectedReferences(verseIndex, chapterNumber, verseNumber,text)
                          }}
                          
                          HightlightedVerse = {this.state.HightlightedVerseArray}
                          chapterNumber ={this.state.currentVisibleChapter}
                          showBottomBar={this.state.showBottomBar}
                      />
                      }
                      keyExtractor={this._keyExtractor}
                      ListFooterComponent={<View style={styles.addToSharefooterComponent} />}
                      />
                      </View>
                  :
                
                      <View style={this.styles.chapterList}>
                        {this.state.chapterContent.map((verse, index) => 
                        <View 
                        onLayout={event => {
                          const layout = event.nativeEvent.layout;
                          arrLayout[index] = layout.y;
                          this.setState({arrLayout})
                        }}>
                        <Text letterSpacing={24}
                            style={this.styles.verseWrapperText}>
                              <VerseView
                              ref={child => (this[`child_${verse.chapterNumber}_${index}`] = child)}
                              verseData = {verse}
                              index = {index}
                              styles = {this.styles}
                              selectedReferences = {this.state.selectedReferenceSet}
                              getSelection = {(verseIndex, chapterNumber, verseNumber,text) => {
                              this.getSelectedReferences(verseIndex, chapterNumber, verseNumber,text)
                              }}
                              HightlightedVerse = {this.state.HightlightedVerseArray}
                              chapterNumber ={this.state.currentVisibleChapter}
                              showBottomBar={this.state.showBottomBar}
                              // verseSelected ={this.props.verseNumber}
                            />
                        </Text>
                        {index == this.state.chapterContent.length - 1  && ( this.state.showBottomBar ? <View style={{height:64, marginBottom:4}} />: null ) }
                        </View>
                        )}
                      </View>
                  }
              </ScrollView>
              <View style={{justifyContent:(this.state.currentVisibleChapter != 1 &&  this.state.currentVisibleChapter == this.state.currentVisibleChapter != this.props.totalChapters) ? 'center' : 'space-around',alignItems:'center'}}>
            {
            this.state.currentVisibleChapter == 1 
            ? null :
            <View style={this.props.navigation.getParam("visibleParallelView") ? this.styles.bottomBarParallelPrevView : this.styles.bottomBarPrevView }>
                <Icon name={'chevron-left'} color="#3F51B5" size={this.props.navigation.getParam("visibleParallelView") ? 16 : 32} 
                    style={this.styles.bottomBarChevrontIcon} 
                    onPress={()=>this.queryBookFromAPI(-1)}
                    />
            </View>
            }
          <View style={this.styles.bottomBarAudioCenter}>
          {
            this.state.status && <Player 
            languageCode={this.props.languageCode} 
            versionCode={this.props.versionCode}  
            bookId={this.props.bookId}
            chapter={this.state.currentVisibleChapter}
            />
          }
          </View>
            {
              this.state.currentVisibleChapter == this.props.totalChapters
            ? null :
            <View style={this.props.navigation.getParam("visibleParallelView") ? this.styles.bottomBarNextParallelView : this.styles.bottomBarNextView }>
                <Icon name={'chevron-right'} color="#3F51B5" size={this.props.navigation.getParam("visibleParallelView") ? 16 : 32} 
                    style={this.styles.bottomBarChevrontIcon} 
                    onPress={()=>this.queryBookFromAPI(1)}
                    />
            </View>
            }
        </View>
        {this.props.navigation.getParam("visibleParallelView") ? null :
        (
          this.state.showBottomBar 
          ? 
          <View style={this.styles.bottomBar}>
  
            <View style={this.styles.bottomOption}>
            <TouchableOpacity onPress={this.doHighlight}  
            >
              <Text style={this.styles.bottomOptionText}>
                {this.state.bottomHighlightText == true ? 'HIGHLIGHT' : 'REMOVE HIGHLIGHT' }
              </Text>
              <Icon name={'border-color'} color="white" size={24} style={this.styles.bottomOptionIcon} />
              </TouchableOpacity>
            </View>
            
            <View style={this.styles.bottomOptionSeparator} />
            
            <View style={this.styles.bottomOption}>  
              <TouchableOpacity onPress={this.addToNotes} 
              >        
                <Text style={this.styles.bottomOptionText}>
                  NOTES
                </Text>
                <Icon name={'note'} color="white" size={24} 
                style={this.styles.bottomOptionIcon} 
                />
              </TouchableOpacity>
            </View>
            
            <View style={this.styles.bottomOptionSeparator} />          
  
            <View style={this.styles.bottomOption}>   
              <TouchableOpacity onPress={this.addToShare}>       
                <Text style={this.styles.bottomOptionText}>
                  SHARE
                </Text>
                <Icon name={'share'} color="white" size={24} style={this.styles.bottomOptionIcon} />
              </TouchableOpacity>
            </View>
            <View style={this.styles.bottomOptionSeparator} />   
          </View>
          : null )}

            </View>
            {/**parallelView**/}
            {this.props.navigation.getParam("visibleParallelView")== true ? (
            <View style={{width:'50%',borderLeftWidth: 1,  borderLeftColor: '#eee'}}>
             {this.props.contentType == 'bible' ? <BibleChapter 
              currentChapter={this.state.currentVisibleChapter}
              id={this.props.bookId}
              bookName={this.props.bookName}
              toggleParallelView={(value)=>this.toggleParallelView(value)}
              totalChapters={this.props.totalChapters}
              totalVerses={this.props.totalVerses}
              navigation={this.props.navigation}
               /> : 
               <Commentary 
                toggleParallelView={(value)=>this.toggleParallelView(value)} 
                currentVisibleChapter={this.state.currentVisibleChapter}

               />}  
            </View>
            )
             : null}
        </View>}
        </View>
      )
  }
}


const navStyles = StyleSheet.create({

headerLeftStyle:{
  alignItems:'center',
  justifyContent:'center',
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
})


const mapStateToProps = state =>{
  return{
    language: state.updateVersion.language,
    languageCode:state.updateVersion.languageCode,
    versionCode:state.updateVersion.versionCode,
    sourceId:state.updateVersion.sourceId,
    downloaded:state.updateVersion.downloaded,
    contentType:state.updateVersion.parallelContentType,

    chapterNumber:state.updateVersion.chapterNumber,
    totalChapters:state.updateVersion.totalChapters,
    totalVerses:state.updateVersion.totalVerses,
    bookName:state.updateVersion.bookName,
    bookId:state.updateVersion.bookId,
    fontFamily:state.updateStyling.fontFamily,

    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
    verseInLine:state.updateStyling.verseInLine,
    close:state.updateSplitScreen.close,

    // fetchedData:state.versionFetch,
    // chapterContent:state.versionFetch.chapterContent,
    // error:state.versionFetch.error,
    // verseNumber:state.updateVersion.verseNumber,
    // isLoading:state.versionFetch.loading,
    // audioURL:state.audioFetch.url,
    availableCommentaries:state.commentaryFetch.availableCommentaries,
    commentary:state.commentaryFetch.commentaryContent,

  }
}
const mapDispatchToProps = dispatch =>{
  return {
    closeSplitScreen :(close)=>dispatch(closeSplitScreen(close)),
    fetchVersionLanguage:()=>dispatch(fetchVersionLanguage()),
    fetchVersionContent:(payload)=>dispatch(fetchVersionContent(payload)),
    updateVersion: (payload)=>dispatch(updateVersion(payload)),
    queryDownloadedBook:(payload)=>dispatch(queryDownloadedBook(payload)),
    // fetchAudioUrl:(payload)=>dispatch(fetchAudioUrl(payload)),
    updateVersionBook: (value)=>dispatch(updateVersionBook(value)),
    // fetchDownloadedVersionContent:(payload)=>dispatch(fetchDownloadedVersionContent(payload))
  }
}
export  default connect(mapStateToProps,mapDispatchToProps)(Bible)