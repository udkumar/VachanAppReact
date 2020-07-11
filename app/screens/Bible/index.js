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
  AppState,
  // ToastAndroid,
  Modal,
  NetInfo,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import DbQueries from '../../utils/dbQueries'
import VerseView from './VerseView'
import APIFetch from '../../utils/APIFetch'
import {fetchAudioUrl,fetchVersionBooks,userInfo,updateVersionBook,updateVersion,updateMetadata} from '../../store/action/'
import SelectContent from '../../components/Bible/SelectContent'
import SelectBottomTabBar from '../../components/Bible/SelectBottomTabBar'
import ChapterNdAudio from '../../components/Bible/ChapterNdAudio';
import ReloadButton from '../../components/ReloadButton';
import Spinner from 'react-native-loading-spinner-overlay';
import { styles } from './styles.js';
import {connect} from 'react-redux'
import Commentary from '../StudyHelp/Commentary/'
import Dictionary from '../StudyHelp/Dictionary/'
import Color from '../../utils/colorConstants'

import {Header, Button,Title,Toast} from 'native-base'
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
                        color={Color.White}
                        size={24}
                    />
                    </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={params.navigateToSelectionTab}
                        style={[navStyles.headerLeftStyle,{paddingHorizontal:8}]}> 
                          <Text style={[navStyles.headerTextStyle,{ paddingRight:4}]}>{params.bookName}</Text>
                          <Text style={[navStyles.headerTextStyle,{fontWeight:'bold'}]}>{params.currentChapter }</Text>
                          <Icon name="arrow-drop-down" color={Color.White} size={20} style={{alignSelf:'center'}}/>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={params.navigateToLanguage}  
                        style={[navStyles.headerLeftStyle]}>
                          <Text style={[navStyles.headerTextStyle,{paddingRight:4}]}>{params.languageName}</Text>
                          <Text style={[navStyles.headerTextStyle,{fontWeight:'bold'}]}>{params.versionCode}</Text>
                          <Icon name="arrow-drop-down" color={Color.White} style={{alignSelf:'center'}} size={20}/>
                      </TouchableOpacity>
                </View>
            ), 
       
            headerTintColor:Color.White,
            headerStyle: {
              backgroundColor: Color.Blue_Color,
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
                    color={Color.White}
                /> 
              </TouchableOpacity>
              }
                  <TouchableOpacity  style={[navStyles.touchableStyleRight,{flexDirection:'row'}]}>
                    <Icon 
                      onPress={params.onSearch} 
                      name='search'
                      color={Color.White}
                      size={24} 
                  /> 
                  </TouchableOpacity>
                  <TouchableOpacity  style={[navStyles.touchableStyleRight,{flexDirection:'row'}]}>
                    <Icon 
                      onPress={()=> {params.onBookmark(params.isBookmark)}} 
                      name='bookmark'
                      color={params.isBookmark ? Color.Red : Color.White} 
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
    this.itemHeights = [];
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
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );
    AppState.addEventListener('change', this._handleAppStateChange);
  // this._handleConnectivityChange
  // NetInfo.isConnected.fetch().done((isConnected) => {
  //   if(isConnected == true){
  //     this.setState({connection_Status : true})
  //   }else{
  //     this.setState({connection_Status : false})
  //   }
  // });
    this.props.navigation.setParams({
      visibleParallelView:false,
      modalVisible:false,
      updatelangVer:this.updateLangVer,
      getRef:this.getReference,
      audio:this.state.audio,
      onBookmark: this.onBookmarkPress,
      toggleAudio:this.toggleAudio,
      onSearch:this.onSearch,
      navigateToLanguage:this.navigateToLanguage,
      navigateToSelectionTab:this.navigateToSelectionTab,
      onSearchHideHeader:this.state.onSearchHideHeader
      // toggleModal:this.setState({modalVisible:!this.state.modalVisible}),
    })
    this.subs = this.props.navigation.addListener("didFocus", () =>{
      
    this.setState({isLoading:true,selectedReferenceSet:[],showBottomBar: false,bookId:this.props.bookId,currentVisibleChapter:this.props.chapterNumber},()=>{
      console.log("IS DOWNLOADED ",this.props.bookName)
      this.getChapter()
      this.audioComponentUpdate()
      this.getHighlights()
      this.getBookMarks()
      this.getNotes()
      this.fetchAudio()
      // this.getBookName()
      const shortName =  this.props.language.toLowerCase()  == ('malayalam' ||'tamil' || 'kannada') ?
        (this.props.bookName.length > 4 ? this.props.bookName.slice(0,3)+"..." : this.props.bookName ) : 
        this.props.bookName.length > 8 ? this.props.bookName.slice(0,7)+"..." : this.props.bookName
        console.log("sort name ",shortName)
      
        this.props.navigation.setParams({
        bookId:this.props.bookId,
        bookName:shortName,
        currentChapter:this.state.currentVisibleChapter,
        languageName: this.props.language.substring(0,3), 
        versionCode: this.props.versionCode,
        audio:this.state.audio,
        numOfChapter:this.props.totalChapters,
        isBookmark:this.isBookmark()
      })
      this.setState({isLoading:false})
    })
    })
  }
  _handleConnectivityChange = (isConnected) => {
    // console.log(" handle connection", this.state.error,this.state.connection_Status,)
    this.setState({connection_Status : isConnected == true ? true : false },()=>{
      if(this.state.connection_Status){
        Toast.show({
          text: "Online. Now content available.",
          buttonText: "Okay",
          type: "success",
          duration: 3000
        })
        this.queryBookFromAPI(null)
        this.props.fetchVersionBooks({
          language:this.props.language,
          versionCode:this.props.versionCode,
          downloaded:this.props.downloaded,
          sourceId:this.props.sourceId
        })

      }else{
        Toast.show({
          text: "Offline. Check your internet Connection.",
          buttonText: "Okay",
          type: "warning",
          duration: 3000
        })
        this.setState({chapterContent:[]})
      }
    })
  };

  _handleAppStateChange=(currentAppState) =>{
    if(currentAppState == "background") {
        this.setState({audio:false,status:false})
    } 
    
    if(currentAppState == "inactive") {
      this.setState({audio:false,status:false})
    }
  }

  getReference = async(item)=>{
    this.setState({selectedReferenceSet: [], showBottomBar: false})

    if(item){
      var time =  new Date()
      DbQueries.addHistory(this.props.sourceId,this.props.language,this.props.languageCode, 
        this.props.versionCode, item.bookId,item.bookName, JSON.parse(item.chapterNumber), this.props.downloaded, time)
        const shortName =  this.props.language.toLowerCase()  == ('malayalam' ||'tamil') ? 
        (item.bookName.length > 6 ? item.bookName.slice(0,5)+"..." : item.bookName) : 
         item.bookName.length > 10 ? item.bookName.slice(0,9)+"..." : item.bookName
        console.log("sort name ",shortName)

        this.props.navigation.setParams({
        bookId:item.bookId,
        bookName:shortName,
        currentChapter:JSON.parse(item.chapterNumber),
        numOfChapter:item.totalChapters,
      })
      this.props.updateVersionBook({
        bookId:item.bookId,
        bookName:item.bookName,
        chapterNumber:JSON.parse(item.chapterNumber),
        totalChapters:item.totalChapters,
      })
    }
    else{
      return
    }
  }

  updateLangVer=async(item)=>{
    this.setState({selectedReferenceSet: [], showBottomBar: false})

    // console.log(" ITEM ",item)
    if(item){
      console.log(" Book List ",item.metadata)
      var bookName = null 
     for(var i = 0 ;i<=item.books.length-1;i++){
       if(item.books[i].bookId == this.props.bookId){
         bookName = item.books[i].bookName
       }
     }
    //  bookN = bookName != null && 
     this.props.updateMetadata({
      copyrightHolder:item.metadata[0].copyrightHolder,
      description:item.metadata[0].description,
      license:item.metadata[0].license,
      source:item.metadata[0].source,
      technologyPartner:item.metadata[0].technologyPartner,
      revision:item.metadata[0].revision,
      versionNameGL:item.metadata[0].versionNameGL
    }) 

      this.props.updateVersion({language:item.languageName,languageCode:item.languageCode,
      versionCode:item.versionCode,sourceId:item.sourceId,downloaded:item.downloaded})

      if(bookName != null){
        const shortName =  this.props.language.toLowerCase()  == ('malayalam' ||'tamil' || 'kannada') ?
        (bookName.length > 6 ? bookName.slice(0,5)+"..." : bookName) : 
        bookName.length > 10 ? bookName.slice(0,9)+"..." : bookName
        console.log("sort name ",shortName)
       this.props.navigation.setParams({
       languageName:item.languageName.substring(0,3),
       versionCode:item.versionCode,
       bookName: shortName 
       })
      }
      this.props.updateVersionBook({
        bookId:this.props.bookId,
        bookName:bookName,
        chapterNumber:JSON.parse(this.state.currentVisibleChapter),
        totalChapters:this.props.totalChapters,
      })
      var time =  new Date()
      DbQueries.addHistory(item.sourceId,item.languageName,item.languageCode, 
      item.versionCode,this.props.bookId,bookName, 
      JSON.parse(this.state.currentVisibleChapter),item.downloaded,time)

      this.props.fetchVersionBooks({language:item.languageName,versionCode:item.versionCode,
      downloaded:item.downloaded,sourceId:item.sourceId})

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
          this.setState({chapterContent:[],isLoading:false})
          console.log("not able to fetch book from local database")
        }
        
  }

  async getChapter(){
    try{
      // this.setState({isLoading:true},async()=>{
        this.props.navigation.setParams({
          isBookmark:this.isBookmark()
        })
        if(this.props.downloaded){
          this.getDownloadedContent()
          }else{
            var content = await APIFetch.getChapterContent(this.props.sourceId, this.props.bookId, this.state.currentVisibleChapter)
            this.setState({chapterContent:content.chapterContent.verses,error:null,isLoading:false,currentVisibleChapter:this.state.currentVisibleChapter})
          }
          // this.setState({isLoading:false})
      // })
    }
    catch(error){
      this.setState({error:error,isLoading:false,chapterContent:[]})
    }
    this.setState({selectedReferenceSet: [], showBottomBar: false})
  }

  queryBookFromAPI = async(val)=>{
    this.setState({isLoading:true,selectedReferenceSet: [], showBottomBar: false,currentVisibleChapter: val != null ? JSON.parse(this.state.currentVisibleChapter)  + val : this.state.currentVisibleChapter,error:null },async()=>{
      try{
      const shortName =  this.props.language.toLowerCase()  == ('malayalam' ||'tamil' || 'kannada') ? 
      (this.props.bookName.length > 6 ? this.props.bookName.slice(0,5)+"..." : this.props.bookName ) :
      this.props.bookName.length > 10 ? this.props.bookName.slice(0,9)+"..." : this.props.bookName
      console.log("sort name ",shortName)

            this.props.navigation.setParams({
              languageName:this.props.language.substring(0,3),
              versionCode:this.props.versionCode,
              bookId:this.props.bookId,
              bookName:shortName,
              currentChapter:JSON.parse(this.state.currentVisibleChapter),
              numOfChapter:this.props.totalChapters,
              isBookmark:this.isBookmark()
            })
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
              }else{
                try{
                  var content = await APIFetch.getChapterContent(this.props.sourceId, this.props.bookId, this.state.currentVisibleChapter)
                  this.setState({chapterContent:content.chapterContent.verses,isLoading:false,currentVisibleChapter:this.state.currentVisibleChapter})
                  this.props.navigation.setParams({numOfVerse:content.chapterContent.verses.length})
                }
                catch(error){
                  console.log("erorr ",error)
                  this.setState({isLoading:false,error:error,chapterContent:[]})
                }
              }
            
            this.props.updateVersionBook({
              bookId:this.props.bookId,
              bookName:this.props.bookName,
              chapterNumber:JSON.parse(this.state.currentVisibleChapter),
              totalChapters:this.props.totalChapters,
            })
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
    Toast.show({
      text: "Offline. Content unavailable.",
      buttonText: "Okay",
      duration: 3000
    })
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
        let name = this.props.bookName
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
            bookName:this.props.bookName,
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
      item.versionCode, this.props.bookId,this.props.bookName, this.state.currentVisibleChapter, item.downloaded, time)
      this.subs.remove();
      NetInfo.isConnected.removeEventListener(
        'connectionChange',
        this._handleConnectivityChange
      )
      AppState.removeEventListener('change', this._handleAppStateChange);
      if(this.unsubscriber) {
        this.unsubscriber();
      }  
  }

  _keyExtractor = (item, index) => item.number;

  onSearch=()=>{
    this.props.navigation.navigate('Search')
  }
  navigateToLanguage=()=>{
    this.setState({audio:false,status:false})
    this.props.navigation.navigate("LanguageList",{updateLangVer:this.updateLangVer})
  }
  navigateToSelectionTab=()=>{
    this.setState({audio:false,status:false})
    this.props.navigation.navigate("SelectionTab",{getReference:this.getReference,
      parallelContent:false,bookId:this.props.bookId,bookName:this.props.bookName,
      chapterNumber:this.props.currentVisibleChapter,totalChapters:this.props.totalChapters})
  }
  toggleParallelView(value){
    this.props.navigation.setParams({visibleParallelView:value,})
  }
  renderFooter = () => {
    console.log("licence ",this.props.license)
    if(this.state.chapterContent.length === 0 ){
      return null
    }else{
      return(
        <View style={this.styles.addToSharefooterComponent}>
          {
          <View style ={this.styles.footerView}>
           {(this.props.revision !==null && this.props.revision !== '') &&  <Text style={this.styles.textListFooter}><Text style={this.styles.footerText}>Copyright:</Text>{' '}{this.props.revision}</Text>}
           {(this.props.license !==null && this.props.license !=='') && <Text style={this.styles.textListFooter}><Text style={this.styles.footerText}>License:</Text>{' '}{this.props.license}</Text>}
           {(this.props.technologyPartner !==null && this.props.technologyPartner !=='' )&& <Text style={this.styles.textListFooter}><Text style={this.styles.footerText}>Technology partner:</Text>{' '}{this.props.technologyPartner}</Text>}
          </View>
          }
        </View>
        )
    }
  }

  render() {
    console.log(" COPYRIGHT ",this.props.revision)
    return(
    <View style={this.styles.container}>
      {
        this.props.navigation.getParam("visibleParallelView") &&
        <View style={{position:'absolute',top:0,zIndex:2,width:'50%'}}>
          <Header style={{height:40}}>
            <Button transparent onPress={()=>{this.props.navigation.navigate("SelectionTab",{getReference:this.getReference,bookId:this.props.bookId,bookName:this.props.bookName,chapterNumber:this.state.currentVisibleChapter,totalChapters:this.props.totalChapters})}}>
                <Title style={{fontSize:16}}>{this.props.bookName.length > 10 ? this.props.bookName.slice(0,9)+"..." : this.props.bookName} {this.state.currentVisibleChapter}</Title>
                <Icon name="arrow-drop-down" color={Color.White} size={20}/>
            </Button>
          </Header>
        </View>
        }
      {
      this.state.isLoading &&
        <Spinner
        visible={true}
        textContent={'Loading...'}
        //  textStyle={styles.spinnerTextStyle}
      />
      }
      {/** Main View for the single or parrallel View */}
      <View style={this.styles.singleView}>
        {/** Single view with only bible text */}
        <View style={{width:this.props.navigation.getParam("visibleParallelView") ? '50%' :width }}>
          <FlatList
                data={this.state.chapterContent }
                contentContainerStyle={this.state.chapterContent.length === 0 ? this.styles.centerEmptySet : {margin:16,marginTop:this.props.navigation.getParam("visibleParallelView") ? 48 : 16}}
                extraData={this.state}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => 
                  <VerseView
                      ref={child => (this[`child_${item.chapterNumber}_${index}`] = child)}
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
                ListFooterComponent={this.renderFooter}
                ListEmptyComponent={<ReloadButton styles={this.styles} reloadFunction={this.queryBookFromAPI}/>}
                // ListFooterComponentStyle={{}}
          />
          {
          this.state.chapterContent.length > 0 &&   
          <View style={{flex:1}}>
          <ChapterNdAudio
            styles={this.styles}
            audio={this.props.navigation.getParam("visibleParallelView") ? false : this.state.audio}
            currentVisibleChapter={this.state.currentVisibleChapter}
            status={this.props.navigation.getParam("visibleParallelView") ? false : this.state.status}
            languageCode={this.props.languageCode}
            versionCode={this.props.versionCode}
            bookId={this.props.bookId}
            totalChapters={this.props.totalChapters}
            navigation={this.props.navigation}
            queryBookFromAPI={this.queryBookFromAPI}
          /> 
          {this.props.navigation.getParam("visibleParallelView") == false && 
            this.state.showBottomBar &&
              <SelectBottomTabBar 
              styles={this.styles}
              bottomHighlightText={this.state.bottomHighlightText}
              doHighlight={this.doHighlight}
              addToNotes={this.addToNotes}
              addToShare={this.addToShare}
              />}
          </View>
        }
     
        </View>
            {/** 2nd view as  parallelView**/}
        {
          this.props.navigation.getParam("visibleParallelView")== true && (
          <View style={this.styles.parallelView}>
            {
              this.props.contentType == 'bible' &&
              <BibleChapter 
                currentChapter={this.state.currentVisibleChapter}
                id={this.props.bookId}
                bookName={this.props.bookName}
                toggleParallelView={(value)=>this.toggleParallelView(value)}
                totalChapters={this.props.totalChapters}
                navigation={this.props.navigation}
            /> }
            {
              this.props.contentType == 'commentary' &&
              <Commentary 
              toggleParallelView={(value)=>this.toggleParallelView(value)} 
              currentVisibleChapter={this.state.currentVisibleChapter}
            />
            }
            {
              this.props.contentType =='dictionary' &&
              <Dictionary 
              toggleParallelView={(value)=>this.toggleParallelView(value)} 
              currentVisibleChapter={this.state.currentVisibleChapter}
            />
            }

          </View>
        )}
        </View>
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
  borderColor:Color.White
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
    // alignSelf:'baseline',
    // flexShrink: 1,
    // fontWeight:'400',
    color:Color.White,
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
    bookName:state.updateVersion.bookName,
    bookId:state.updateVersion.bookId,

    revision:state.updateVersion.revision,
    license:state.updateVersion.license,
    technologyPartner:state.updateVersion.technologyPartner,

    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
    verseInLine:state.updateStyling.verseInLine,

    email:state.userInfo.email,
    userId:state.userInfo.uid,
    
    books:state.versionFetch.data,
   
    availableCommentaries:state.commentaryFetch.availableCommentaries,
    commentary:state.commentaryFetch.commentaryContent,
    parallelContentType:state.updateVersion.parallelContentType,

  }
}
const mapDispatchToProps = dispatch =>{
  return {
    updateVersion: (payload)=>dispatch(updateVersion(payload)),
    fetchAudioUrl:(payload)=>dispatch(fetchAudioUrl(payload)),
    updateVersionBook: (value)=>dispatch(updateVersionBook(value)),
    userInfo:(payload)=>dispatch(userInfo(payload)),
    fetchVersionBooks:(payload)=>dispatch(fetchVersionBooks(payload)),
    updateMetadata:(payload)=>dispatch(updateMetadata(payload)),
    // fetchAllContent:()=>dispatch(fetchAllContent()),
    // fetchDownloadedVersionContent:(payload)=>dispatch(fetchDownloadedVersionContent(payload))
  }
}
export  default connect(mapStateToProps,mapDispatchToProps)(Bible)