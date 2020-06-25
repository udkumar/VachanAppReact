import React, { Component} from 'react';
import {
  Text,
  View,
  FlatList,
  Alert,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Share,
  ToastAndroid,
  Modal,
  NetInfo,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import DbQueries from '../../utils/dbQueries'
import VerseView from './VerseView'
import {getBookNameFromMapping} from '../../utils/UtilFunctions';
import APIFetch from '../../utils/APIFetch'
import {fetchAudioUrl,fetchVersionLanguage,fetchVersionContent,queryDownloadedBook,userInfo,updateVersionBook,updateVersion} from '../../store/action/'
import SelectContent from '../../components/Bible/SelectContent'
import SelectBottomTabBar from '../../components/Bible/SelectBottomTabBar'
import ChapterNdAudio from '../../components/Bible/ChapterNdAudio'
import Spinner from 'react-native-loading-spinner-overlay';
import { styles } from './styles.js';
import {connect} from 'react-redux'
import Commentary from '../StudyHelp/Commentary/'
import Dictionary from '../StudyHelp/Dictionary/'

import {Header, Button,Title} from 'native-base'
import BibleChapter from '../../components/Bible/BibleChapter';
import firebase from 'react-native-firebase'
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

class Bible extends Component {
  static navigationOptions = ({navigation}) =>{
        const { params={} } = navigation.state 
        return{
          header: params.visibleParallelView  && null,
          headerLeft:(
                <View style={navStyles.headerLeftStyle}>
                  <TouchableOpacity style={[navStyles.touchableStyleLeft]}  
                      onPress={() =>{navigation.toggleDrawer()}}>
                    <Icon 
                        name="menu"  
                        color="#fff"
                        size={24}
                    />
                    </TouchableOpacity>
                      <TouchableOpacity style={navStyles.touchableStyleLeft} 
                        onPress={() =>{navigation.navigate("SelectionTab", 
                        {getReference:params.getRef,parallelContent:false,bookId:params.bookId,chapterNumber:params.currentChapter,totalChapters:params.numOfChapter,totalVerses:params.numOfVerse})}}
                        style={[navStyles.headerLeftStyle,{paddingRight:8}]}> 
                        {/* <View > */}
                          <Text style={[navStyles.headerTextStyle,{paddingRight:4}]}>{params.bookName} </Text>
                          <Text style={[navStyles.headerTextStyle,{fontWeight:'bold'}]}>{params.currentChapter }</Text>
                          <Icon name="arrow-drop-down" color="#fff" size={20} style={{alignSelf:'center'}}/>
                        {/* </View> */}
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() =>{{navigation.navigate("LanguageList",{updateLangVer:params.updatelangVer})}}} 
                        style={navStyles.headerLeftStyle}>
                        {/* <View > */}
                          <Text style={[navStyles.headerTextStyle,{paddingRight:4}]}>{params.languageName}</Text>
                          <Text style={[navStyles.headerTextStyle,{fontWeight:'bold'}]}>{params.versionCode}</Text>
                          <Icon name="arrow-drop-down" color="#fff" style={{alignSelf:'center'}} size={20}/>
                        {/* </View> */}
                      </TouchableOpacity>
                </View>
            ), 
       
            headerTintColor:"#fff",
            headerStyle: {
              backgroundColor: "#3F51B5",
              elevation: 0,
              shadowOpacity: 0,
              // height:40,
              width:params.visibleParallelView ? '50%' :width
          },
            headerRight:(
              <View style={navStyles.headerRightStyle}>
              {params.audio &&
              <TouchableOpacity  onPress={params.toggleAudio}
                style={[navStyles.touchableStyleRight,{flexDirection:'row'}]}>
                <Icon
                    name='volume-up'
                    size={24} 
                    color={ "#fff" }
                /> 
              </TouchableOpacity>
              }
                  <TouchableOpacity  style={[navStyles.touchableStyleRight,{flexDirection:'row'}]}>
                    <Icon 
                      onPress={params.onSeach} 
                      name='search'
                      color={"#fff"} 
                      size={24} 
                  /> 
                  </TouchableOpacity>
                  <TouchableOpacity  style={[navStyles.touchableStyleRight,{flexDirection:'row'}]}>
                    <Icon 
                      onPress={()=> {params.onBookmark(params.isBookmark)}} 
                      name='bookmark'
                      color={params.isBookmark ? "red" : "#fff"} 
                      size={24} 
                  /> 
                 </TouchableOpacity>
                 <SelectContent visible={params.modalVisible} visibleParallelView={params.visibleParallelView} navigation={navigation} navStyles={navStyles} />
              </View>
            )
        }
    }
    

  constructor(props) {
    super(props);
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
      colorFile:this.props.colorFile,
      sizeFile:this.props.sizeFile,
      downloadedBook:[],
      audio:false,
      chapterContent:[],
      error:null,
      isLoading: false,
      showBottomBar: false,
      bookmarksList: [],
      isBookmark: false,
      currentVisibleChapter:JSON.parse(this.props.chapterNumber),
      bookNumber:this.props.bookNumber,
      selectedReferenceSet: [],
      verseInLine: this.props.verseInLine,
      bottomHighlightText:false,
      HightlightedVerseArray:[],
      gestureState: {},
      thumbSize: 100,
      left: width / 2,
      top: height / 2,
      connection_Status:true,
      scrollDirection:'up',
      message:'',
      status:false,
      modalVisible: false,
      onSearchHideHeader:false,
      // loginModal:false,
      arrLayout:[],
      notesList:[],

      initializing:true,
      user:this.props.email,
      imageUrl:this.props.photo,
      userData:'',
    }

    this.getSelectedReferences = this.getSelectedReferences.bind(this)
    this.onBookmarkPress = this.onBookmarkPress.bind(this)
    this.alertPresent
    this.pinchDiff = 0
    this.pinchTime = new Date().getTime()
    this.styles = styles(this.props.colorFile, this.props.sizeFile);    
  }

  componentWillReceiveProps(nextProps,prevState){
    this.setState({
      colorFile:nextProps.colorFile,
      sizeFile:nextProps.sizeFile,
      // arrLayout:nextProps.arrLayout
    })
    this.styles = styles(nextProps.colorFile, nextProps.sizeFile);  
  }
  async componentDidMount(){
    if (this.state.initializing){
      this.setState({initializing:false})}
    this.unsubscriber = firebase.auth().onAuthStateChanged((user)=>{
      if (!user) {
          return
      }
      else{
        this.setState({user:user._user.email,userData:user,isLoading:false,imageUrl:user._user.photoURL})
        this.props.userInfo({email:user._user.email,uid:user._user.uid,
        userName:user._user.displayName,phoneNumber:null,photo:user._user.photoURL})
        // this.setState({isLoading:true})
      }
    })  

    console.log("props in bible page ",this.props.email)
    // this.gestureResponder = createResponder({
    //   onStartShouldSetResponder: (evt, gestureState) => true,
    //   onStartShouldSetResponderCapture: (evt, gestureState) => true,
    //   onMoveShouldSetResponder: (evt, gestureState) => true,
    //   onMoveShouldSetResponderCapture: (evt, gestureState) => true,
    //   onResponderGrant: (evt, gestureState) => {},
    //   onResponderMove: (evt, gestureState) => {
    //     let thumbSize = this.state.thumbSize;
    //     if (gestureState.pinch && gestureState.previousPinch) {
    //       thumbSize *= (gestureState.pinch / gestureState.previousPinch)
    //       let currentDate = new Date().getTime()
    //       let diff = currentDate - this.pinchTime
    //       console.log("time diff : " + diff + " prev diff : " + this.pinchDiff)
    //       if (diff > this.pinchDiff) {
    //           console.log("gesture pinch diff = " + (gestureState.pinch - gestureState.previousPinch))
    //          if (gestureState.pinch - gestureState.previousPinch > 5) {
    //             // large
    //             console.log("large")
    //             this.props.screenProps.changeSizeByOne(1)              
    //         } else if (gestureState.previousPinch - gestureState.pinch > 5) {
    //             console.log("small")
    //             // small
    //             this.props.screenProps.changeSizeByOne(-1)              
    //         }
    //       }
    //       this.pinchDiff = diff
    //       this.pinchTime = currentDate
    //     }
    //     let {left, top} = this.state;
    //     left += (gestureState.moveX - gestureState.previousMoveX);
    //     top += (gestureState.moveY - gestureState.previousMoveY);
    //     this.setState({
    //       gestureState: {
    //         ...gestureState
    //       },
    //       left, top, thumbSize
    //     })  
    //   },
    //   onResponderTerminationRequest: (evt, gestureState) => true,
    //   onResponderRelease: (evt, gestureState) => {
    //     this.setState({
    //       gestureState: {
    //         ...gestureState
    //       }
    //     })
    //   },
    //   onResponderTerminate: (evt, gestureState) => {},
      
    //   onResponderSingleTapConfirmed: (evt, gestureState) => {
    //     console.log('onResponderSingleTapConfirmed...' + JSON.stringify(gestureState));
    //   },
    //   moveThreshold: 2,
    //   debug: false
    // })

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange

  );
  NetInfo.isConnected.fetch().done((isConnected) => {
    if(isConnected == true){
      this.setState({connection_Status : true})
    }else{
      this.setState({connection_Status : false})
    }
  });
    this.props.navigation.setParams({
      visibleParallelView:false,
      modalVisible:false,
      updatelangVer:this.updateLangVer,
      getRef:this.getReference,
      audio:this.state.audio,
      onBookmark: this.onBookmarkPress,
      toggleAudio:this.toggleAudio,
      onSeach:this.onSeach,
      onSearchHideHeader:this.state.onSearchHideHeader
      // toggleModal:this.setState({modalVisible:!this.state.modalVisible}),
    })
    this.subs = this.props.navigation.addListener("didFocus", () =>{
    this.setState({isLoading:true,selectedReferenceSet:[],bookId:this.props.bookId,currentVisibleChapter:this.props.chapterNumber},()=>{
    console.log("IS DOWNLOADED ",this.props.sourceId,this.props.downloaded,this.state.currentVisibleChapter,this.props.bookId)
      this.getChapter()
      this.audioComponentUpdate()
      this.getHighlights()
      this.getBookMarks()
      this.getNotes()
      this.fetchAudio()
      this.props.navigation.setParams({
        bookName:getBookNameFromMapping(this.props.bookId,this.props.language).length > 12 ? getBookNameFromMapping(this.props.bookId,this.props.language).slice(0,11)+"..." : getBookNameFromMapping(this.props.bookId,this.props.language),
        currentChapter:this.state.currentVisibleChapter,
        languageName: this.props.language.substring(0,3), 
        versionCode: this.props.versionCode,
        bookId:this.props.bookId,
        audio:this.state.audio,
        numOfChapter:this.props.totalChapters,
        isBookmark:this.isBookmark()
      })
      this.props.updateVersionBook({
        bookId:this.props.bookId,
        bookName:getBookNameFromMapping(this.props.bookId,this.props.language),
        chapterNumber:this.state.currentVisibleChapter,
        totalChapters:this.props.totalChapters,
        totalVerses:this.props.totalVerses,
        verseNumber:this.state.verseNumber
      })
      this.props.updateVersion({language:this.props.language,languageCode:this.props.languageCode,
      versionCode:this.props.versionCode,sourceId:this.props.sourceId,downloaded:this.props.downloaded})
      this.setState({isLoading:false})
    })
   
      //Your logic, this listener will call when you open the class every time
    })

    
  }
  _handleConnectivityChange = (isConnected) => {
    console.log(" handle connection")
    if(isConnected == true)
      {
        this.setState({connection_Status : true})
      }
      else
      {
        this.setState({connection_Status : false})
      }
  };

  getReference = async(item)=>{
    if(item){
  // this.scrollToVerse(item.verseNumber)
      var time =  new Date()
      DbQueries.addHistory(this.props.sourceId,this.props.language,this.props.languageCode, this.props.versionCode, item.bookId,JSON.parse(item.chapterNumber), this.props.downloaded, time)
      this.props.navigation.setParams({
        bookId:item.bookId,
        bookName:getBookNameFromMapping(item.bookId,this.props.language).length > 12 ? getBookNameFromMapping(item.bookId,this.props.language).slice(0,11)+"..." : getBookNameFromMapping(item.bookId,this.props.language),
        currentChapter:JSON.parse(item.chapterNumber),
        numOfChapter:item.totalChapters,
      })
      this.props.updateVersionBook({
        bookId:item.bookId,
        bookName:item.bookName,
        chapterNumber:JSON.parse(item.chapterNumber),
        totalChapters:item.totalChapters,
        verseNumber:item.verseNumber
      })
    }
    else{
      return
    }
  
  }

  updateLangVer=async(item)=>{
    if(item){
      var time =  new Date()
      DbQueries.addHistory(item.sourceId, item.languageName,item.languageCode, 
      item.versionCode, this.props.bookId, JSON.parse(this.state.currentVisibleChapter), 
      item.downloaded, time)
  
      this.props.updateVersion({language:item.languageName,languageCode:item.languageCode,
      versionCode:item.versionCode,sourceId:item.sourceId,downloaded:item.downloaded})
      
      this.props.navigation.setParams({
      languageName:item.languageName.substring(0,3),
      versionCode:item.versionCode,
      bookName:getBookNameFromMapping(this.props.bookId,item.languageName).length > 12 ? getBookNameFromMapping(this.props.bookId,item.languageName).slice(0,11)+"..." : getBookNameFromMapping(this.props.bookId,item.languageName),
        // chapterNumber:this.state.currentVisibleChapter
      })
      // this.getBookMarks()
    }else{
      return
    }

  }

  async getDownloadedContent(){
      this.setState({isLoading:true})
        var content = await DbQueries.queryVersions(this.props.language,this.props.versionCode,this.props.bookId,this.props.currentVisibleChapter) 
        // console.log("content ",content)
        if(content  !=null){
          this.setState({
            downloadedBook:content[0].chapters,
            chapterContent:content[0].chapters[this.state.currentVisibleChapter-1].verses,
            isLoading:false,
            error:null,
            // currentVisibleChapter:this.state.currentVisibleChapter,
          })
          this.props.navigation.setParams({numOfVerse:content[0].chapters[this.state.currentVisibleChapter-1].verses.length})

        }
        else{
          alert("not able to fetch book from db")
        }
        
  }

  async getChapter(){
    try{
      // console.log(" get chapter ",this.props.downloaded)
      this.props.navigation.setParams({
        isBookmark:this.isBookmark()
      })
      if(this.props.downloaded){
        this.getDownloadedContent()
        }else{
          var content = await APIFetch.getChapterContent(this.props.sourceId, this.props.bookId, this.state.currentVisibleChapter)
          this.setState({chapterContent:content.chapterContent.verses,error:null,isLoading:false,currentVisibleChapter:this.state.currentVisibleChapter})
        }
    }
    catch(error){
      this.setState({error:error,isLoading:false,chapterContent:[]})
    }
  }

  queryBookFromAPI = async(val)=>{
    this.setState({isLoading:true,currentVisibleChapter: val != null ? JSON.parse(this.state.currentVisibleChapter)  + val : this.state.currentVisibleChapter,error:null },async()=>{
      try{
            this.props.navigation.setParams({
              languageName:this.props.language.substring(0,3),
              versionCode:this.props.versionCode,
              bookId:this.props.bookId,
              bookName:getBookNameFromMapping(this.props.bookId,this.props.language).length > 12 ? getBookNameFromMapping(this.props.bookId,this.props.language).slice(0,11)+"..." : getBookNameFromMapping(this.props.bookId,this.props.language),
              currentChapter:JSON.parse(this.state.currentVisibleChapter),
              numOfChapter:this.props.totalChapters,
              isBookmark:this.isBookmark()
            })
            if(this.state.connection_Status){
              try{
                var content = await APIFetch.getChapterContent(this.props.sourceId, this.props.bookId, this.state.currentVisibleChapter)
                this.setState({chapterContent:content.chapterContent.verses,isLoading:false,currentVisibleChapter:this.state.currentVisibleChapter})
                console.log("Total verses  ",content.chapterContent.verses.length)
                this.props.navigation.setParams({numOfVerse:content.chapterContent.verses.length})
              }
              catch(error){
                console.log("erorr ",error)
                this.setState({isLoading:false,error:error,chapterContent:[]})
              }
            }
            else{
              console.log(" book is downloaded",this.props.downloaded)
              if(this.props.downloaded){
                if(this.state.downloadedBook.length > 0){
                 this.setState({
                  chapterContent:this.state.downloadedBook[this.state.currentVisibleChapter-1].verses,
                  isLoading:false
                 })
                this.props.navigation.setParams({numOfVerse:this.state.downloadedBook[this.state.currentVisibleChapter-1].verses.length})
                }
                else{
                  this.getDownloadedContent()
                }
              }
              else{
              console.log("not internet no downloaded book ")
                this.setState({ isLoading:false,error:'book not downloaded'})
                //  Alert.alert("Please check internet Connection")
              }
            }
            this.props.updateVersionBook({
              bookId:this.props.bookId,
              bookName:getBookNameFromMapping(this.props.bookId,this.props.language),
              chapterNumber:JSON.parse(this.state.currentVisibleChapter),
              totalChapters:this.props.totalChapters,
              totalVerses:this.props.totalVerses,
              verseNumber:this.state.verseNumber
            })
            // this.props.updateVersion({language:this.props.language,languageCode:this.props.languageCode,
            // versionCode:this.props.versionCode,sourceId:this.props.sourceId,downloaded:this.props.downloaded})
            this.getHighlights()
            this.getNotes()
            this.fetchAudio()
          }
          catch(error) {
            this.setState({isLoading:false,error:error,chapterContent:[]})
            console.log("ERROR ",error)
          }
    })
}

fetchAudio=()=>{
  this.props.fetchAudioUrl({
    languageCode:this.props.languageCode,
    versionCode:this.props.versionCode,
    bookId:this.props.bookId,
    chapter:this.state.currentVisibleChapter
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
    if(this.state.connection_Status){
      if(this.props.email){
        firebase.database().ref("users/"+this.props.userId+"/highlights/"+this.props.sourceId+"/"+this.props.bookId+"/"+this.state.currentVisibleChapter).on('value', (snapshot)=>{
            if(snapshot.val() != null){
              this.setState({
                HightlightedVerseArray: snapshot.val()
            })
            }
            else{
              this.setState({
                HightlightedVerseArray: []
            })
            }
          })
      }
      else{
        this.setState({
          HightlightedVerseArray:[]
      })
      }
    }else{
      this.setState({
        HightlightedVerseArray:[]
    })
    // Alert.alert("Please check internet connection")
    }
  }
  async getBookMarks(){
    if(this.state.connection_Status){
      if(this.props.email){
        firebase.database().ref("users/"+this.props.userId+"/bookmarks/"+this.props.sourceId+"/"+this.props.bookId).once('value', (snapshot)=>{
          if(snapshot.val() === null){
            this.setState({bookmarksList:[]},
          ()=> this.props.navigation.setParams({isBookmark:this.isBookmark()}))
          }
          else{
          this.setState({bookmarksList:snapshot.val()},
          ()=> this.props.navigation.setParams({isBookmark:this.isBookmark()}))
          }
        })
      }
      else{
        this.setState({bookmarksList:[]},
          ()=> this.props.navigation.setParams({isBookmark:this.isBookmark()}))
        console.log("not logged in")
      }
    }else{
      this.setState({bookmarksList:[]},
          ()=> this.props.navigation.setParams({isBookmark:this.isBookmark()}))
       }
  }

getNotes(){
  if(this.state.connection_Status){
    if(this.props.email){
      firebase.database().ref("users/"+this.props.userId+"/notes/"+this.props.sourceId+"/"+this.props.bookId+"/"+this.state.currentVisibleChapter).once('value', (snapshot)=>{
        this.state.notesList = []
          if(snapshot.val() === null){
            this.setState({notesList:[]})
          } 
          else{
            if(Array.isArray(snapshot.val())){
              this.setState({notesList:snapshot.val()})
            }
            else{
              this.setState({
                notesList:[snapshot.val()]
              })
            }
          }
        })
      }
      else{
        this.setState({
          notesList:[]
        })
      }
    }else{
      this.setState({
        notesList:[]
      })
      // Alert.alert("Please check internet connection")
    }
}
  isBookmark(){
  if(this.state.bookmarksList.length > 0){
    let isBookmark = false
        console.log("BOOKMARK LIST ",this.state.bookmarksList[i])
          for(var i = 0; i < this.state.bookmarksList.length;i++){
            console.log("BOOKMARK LIST ",this.state.bookmarksList[i])
            if(this.state.bookmarksList[i] == this.state.currentVisibleChapter){
              isBookmark = true
            }
          }
          if(!isBookmark){
            return false
          }
          else{
            return true
          }
  }
  return false
}

  //add book mark from header icon 
   onBookmarkPress=(isbookmark)=>{
     if(this.state.connection_Status){
      if(this.props.email){
        // || this.state.bookmarksList.indexOf(a)===-1
            var newBookmarks = isbookmark
            ? this.state.bookmarksList.filter((a) => a !== this.state.currentVisibleChapter )
            : this.state.bookmarksList.concat(this.state.currentVisibleChapter)
            // console.log(" book mark list ",newBookmarks)
            console.log(" book mark ",newBookmarks)
           firebase.database().ref("users/"+this.props.userId+"/bookmarks/"+this.props.sourceId+"/"+this.props.bookId).set(newBookmarks)
            this.setState({
              bookmarksList:newBookmarks
            },()=>{
              this.props.navigation.setParams({isBookmark:this.isBookmark()})
            })
      }
      else{
        this.setState({bookmarksList:[] },()=>{this.props.navigation.setParams({isBookmark:this.isBookmark()}) })
        // this.setState({loginModal:!this.state.loginModal})
        // Alert.alert("Please login")
        this.props.navigation.navigate("Login")
      }
     }
     else{
      this.setState({bookmarksList:[] },()=>{this.props.navigation.setParams({isBookmark:this.isBookmark()}) })
       Alert.alert("Please check your internet connecion")
     }
    
  }



//selected reference for highlighting verse
  getSelectedReferences = (vIndex, chapterNum, vNum,text)=> {
      console.log("vIndex, chapterNum, vNum,text ", chapterNum,vIndex, vNum,text)
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
            // for(var j=0; j<=this.state.HightlightedVerseArray[i].verses.length-1; j++ ){
              if(this.state.HightlightedVerseArray[i] == JSON.parse(tempVal[2])){
                highlightCount++
              }
            // }
          }
      }
      this.setState({showBottomBar: this.state.selectedReferenceSet.length > 0 ? true : false, bottomHighlightText: selectedCount == highlightCount ?  false : true})
    })
  }
  
  addToNotes = () => {
    if(this.state.connection_Status){
      if(this.props.email){
        let refList = []
        let id = this.props.bookId
        let name = getBookNameFromMapping(this.props.bookId,this.props.language)
        var verses = []
        for (let item of this.state.selectedReferenceSet) {
    
          let tempVal = item.split('_')
          const verseNumber =  JSON.parse(tempVal[2])
          let refModel = {
            bookId: id, 
            bookName: name, 
            chapterNumber: parseInt(tempVal[0]), 
            verseNumber: verseNumber, 
            verseText:tempVal[3],
            versionCode: this.props.versionCode, 
            languageName: this.props.language,
          };
          refList.push(refModel)
          verses.push(verseNumber)
        }
        // let res = await DbQueries.queryNotes();
        // console.log("QWERY NOTES ",res)
        this.props.navigation.navigate('EditNote',{
            referenceList: refList,
            notesList:this.state.notesList,
            bcvRef:{
            bookId: id, 
            chapterNumber:this.state.currentVisibleChapter,
            verses:verses
            },
            contentBody:'',
            onbackNote:this.onbackNote,
            noteIndex:-1,
        })
      }
      else{
        // this.setState({loginModal:!this.state.loginModal})
        // Alert.alert("Please login")
        this.props.navigation.navigate("Login")

      }
    }else{
      Alert.alert("Please check internet connection")
    }

  
    this.setState({selectedReferenceSet: [], showBottomBar: false})
  }
  onbackNote=()=>{
    console.log("onback nothing in bible page")
  }

  doHighlight = async() => {
    if(this.state.connection_Status){
      if(this.props.email){
        var array = [...this.state.HightlightedVerseArray]
        for (let item of this.state.selectedReferenceSet){
          let tempVal = item.split('_')
            var index = array.indexOf(JSON.parse(tempVal[2]))
            if(this.state.bottomHighlightText){
                if(index == -1){
                    array.push(JSON.parse(tempVal[2]))
                  }
                  this.setState({HightlightedVerseArray:array})
              }
            else{
              array.splice(index,1)
              this.setState({HightlightedVerseArray:array})
            }
          }
          firebase.database().ref("users/"+this.props.userId+"/highlights/"+this.props.sourceId+"/"+this.props.bookId+"/"+this.state.currentVisibleChapter).set(array)
        }
        else{
          // alert("Please login")
          // this.setState({loginModal:!this.state.loginModal})
        this.props.navigation.navigate("Login")
        }
    }else{

      Alert.alert("Please check internet connection")
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
      shareText = shareText.concat(getBookNameFromMapping(this.props.bookId,this.props.language) + " " + chapterNumber + ":" + verseNumber + " ");
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
      this.subs.remove();
      NetInfo.isConnected.removeEventListener(
        'connectionChange',
        this._handleConnectivityChange
 
    );
    if(this.unsubscriber) {
      this.unsubscriber();
    }  
  }

  _keyExtractor = (item, index) => item.number;

  onScroll=(event)=> {
    var currentOffset = event.nativeEvent.contentOffset.y;
    var direction = currentOffset > this.state.offset ? 'down' : 'up';
    this.setState({offset:currentOffset,direction:direction})
    console.log(direction)
  }
  onSeach=()=>{
    this.props.navigation.navigate('Search')
    // console.log(" HEADER HIDE ",this.state.onSearchHideHeader)
    // this.setState({onSearchHideHeader:!this.state.onSearchHideHeader})
    // this.props.navigation.setParams({onSearchHideHeader:!this.state.onSearchHideHeader})
  }
  toggleParallelView(value){
    this.props.navigation.setParams({visibleParallelView:value,})
  }
  render() {
    return(
    <View  style={this.styles.container}>
      {this.state.isLoading &&
        <Spinner
        visible={true}
        textContent={'Loading...'}
        //  textStyle={styles.spinnerTextStyle}
      />}
      {this.state.error !=null ?
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <TouchableOpacity 
          onPress={()=>this.queryBookFromAPI(null)}
          style={{height:40,width:120,borderRadius:4,backgroundColor:'#3F51B5',
          justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:18,color:'#fff'}}>Reload</Text>
          </TouchableOpacity>
        </View>
      :
      <View style={{flexDirection:'row'}}>
        <View style={{width:this.props.navigation.getParam("visibleParallelView") ? '50%' :width}}>
          {this.props.navigation.getParam("visibleParallelView") &&
            <Header style={{height:40}}>
                  <Button transparent onPress={()=>{this.props.navigation.navigate("SelectionTab",{getReference:this.getReference,bookId:this.props.bookId,chapterNumber:this.state.currentVisibleChapter,totalChapters:this.props.totalChapters,totalVerses:this.props.totalVerses})}}>
                      <Title style={{fontSize:16}}>{getBookNameFromMapping(this.props.bookId,this.props.language).length > 12 ? getBookNameFromMapping(this.props.bookId,this.props.language).slice(0,11)+"..." : getBookNameFromMapping(this.props.bookId,this.props.language)} {this.state.currentVisibleChapter}</Title>
                      <Icon name="arrow-drop-down" color="#fff" size={20}/>
                  </Button>
            </Header>
          }
          <FlatList
                data={this.state.chapterContent }
                contentContainerStyle={{margin:16}}
                // extraData={this.state}
                // showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => 
                  <VerseView
                      // ref={child => (this[`child_${item.chapterNumber}_${index}`] = child)}
                      verseData = {item}
                      index = {index}
                      styles = {this.styles}
                      selectedReferences = {this.state.selectedReferenceSet}
                      getSelection = {(verseIndex, chapterNumber, verseNumber,text) => {
                        this.props.navigation.getParam("visibleParallelView")== false && this.getSelectedReferences(verseIndex, chapterNumber, verseNumber,text)}}
                      HightlightedVerse = {this.state.HightlightedVerseArray}
                      notesList={this.state.notesList}
                      chapterNumber ={this.state.currentVisibleChapter}
                      showBottomBar={this.state.showBottomBar}
                  />
                }
                keyExtractor={this._keyExtractor}
                ListFooterComponent={<View style={this.styles.addToSharefooterComponent}></View>}
                // ListFooterComponentStyle={}

              />
              {/* <View style={{marginBottom:20}}/> */}
          {
            this.state.chapterContent.length > 0 &&
            <View>
            <ChapterNdAudio
            styles={this.styles}
            currentVisibleChapter={this.state.currentVisibleChapter}
            status={this.state.status}
            languageCode={this.props.languageCode}
            versionCode={this.props.versionCode}
            bookId={this.props.bookId}
            totalChapters={this.props.totalChapters}
            navigation={this.props.navigation}
            queryBookFromAPI={this.queryBookFromAPI}
            />
          {
            this.props.navigation.getParam("visibleParallelView") == false && 
                this.state.showBottomBar &&
                <SelectBottomTabBar 
                styles={this.styles}
                bottomHighlightText={this.state.bottomHighlightText}
                doHighlight={this.doHighlight}
                addToNotes={this.addToNotes}
                addToShare={this.addToShare}
                />
              
          }
          </View>
          }
     
        </View>
            {/**parallelView**/}
        {
          this.props.navigation.getParam("visibleParallelView")== true && (
          <View style={{width:'50%',borderLeftWidth: 1,  borderLeftColor: '#eee'}}>
            {
              this.props.contentType == 'bible' &&
              <BibleChapter 
                currentChapter={this.state.currentVisibleChapter}
                id={this.props.bookId}
                bookName={getBookNameFromMapping(this.props.bookId,this.props.language)}
                toggleParallelView={(value)=>this.toggleParallelView(value)}
                totalChapters={this.props.totalChapters}
                totalVerses={this.props.totalVerses}
                navigation={this.props.navigation}
            /> }
            {
              this.props.contentType =='commentary' &&
              <Commentary 
              toggleParallelView={(value)=>this.toggleParallelView(value)} 
              currentVisibleChapter={this.state.currentVisibleChapter}
              // commentaryFullScreen={()=>this.props.navigation.navigate('Commentary')}
              // bookId={this.props.bookId}
            />
            }
            {
              this.props.contentType =='dictionary' &&
              <Dictionary 
              toggleParallelView={(value)=>this.toggleParallelView(value)} 
              currentVisibleChapter={this.state.currentVisibleChapter}
              // bookId={this.props.bookId}
            />
            }

          </View>
        )}
        </View>}
        </View>
      )
  }
}


const navStyles = StyleSheet.create({

headerLeftStyle:{
  alignItems:'stretch',
  justifyContent:'space-evenly',
  flexDirection:'row',
  flex:1,
  // paddingLeft:8,
},
border:{
  paddingHorizontal:4,
  paddingVertical:4,

  borderWidth:0.2,
  // marginLeft:4,
  borderColor:'#fff'
},
headerRightStyle:{
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'center',
  paddingRight:2,
  flex:1,
},
touchableStyleRight:{
    flexDirection:"row",
    marginRight:8
},
touchableStyleLeft:{
  flexDirection:"row",
    marginHorizontal:8
},
headerTextStyle:{
    fontSize:18,
    // fontWeight:'400',
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

    email:state.userInfo.email,
    userId:state.userInfo.uid,

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
    fetchVersionLanguage:()=>dispatch(fetchVersionLanguage()),
    fetchVersionContent:(payload)=>dispatch(fetchVersionContent(payload)),
    updateVersion: (payload)=>dispatch(updateVersion(payload)),
    queryDownloadedBook:(payload)=>dispatch(queryDownloadedBook(payload)),
    fetchAudioUrl:(payload)=>dispatch(fetchAudioUrl(payload)),
    updateVersionBook: (value)=>dispatch(updateVersionBook(value)),
    userInfo:(payload)=>dispatch(userInfo(payload))
    // fetchDownloadedVersionContent:(payload)=>dispatch(fetchDownloadedVersionContent(payload))
  }
}
export  default connect(mapStateToProps,mapDispatchToProps)(Bible)