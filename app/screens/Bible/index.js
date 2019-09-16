import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Share,
  Button
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {createResponder } from 'react-native-gesture-responder';

import DbQueries from '../../utils/dbQueries'
import VerseView from './VerseView'
import AsyncStorageUtil from '../../utils/AsyncStorageUtil';
import {AsyncStorageConstants} from '../../utils/AsyncStorageConstants'

import {getResultText} from '../../utils/UtilFunctions';
import {getBookNameFromMapping,getBookChaptersFromMapping} from '../../utils/UtilFunctions';
import APIFetch from '../../utils/APIFetch'
import {
  MenuContext
} from 'react-native-popup-menu';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import { styles } from './styles.js';

import BottomTab from './BottomTab'
import dbQueries from '../../utils/dbQueries';



export default class Bible extends Component {
  static navigationOptions = ({navigation}) =>{
    const { params = {} } = navigation.state
    return{
        headerTitle:(
          <View style={{flexDirection:'row',flex:1}}>
          
            <TouchableOpacity style={{flexDirection:'row'}}  onPress={() =>{navigation.navigate("SelectionTab", 
              {
                queryBookFromAPI:params.queryBookFromAPI,
                bookName:params.bookName,
                bookId:params.bookId,
                chapterNumber:params.currentChapter,
                languageName:params.bibleLanguage,
                downloaded:params.downloaded,
                sourceId:params.sourceId,
                versionCode:params.bibleVersion,
                totalChapters:params.totalChapters
              }
            )}
            }>
              <Text 
                style={{fontSize:16,color:"#fff",alignSelf:'center',alignItems:'center',marginHorizontal:4}}
                >{params.bookName}
              </Text>
              <Text 
                style={{fontSize:16,color:"#fff",alignSelf:'center',alignItems:'center',marginHorizontal:4}}
                >{params.currentChapter }
              </Text>
            </TouchableOpacity>
         
      </View>
       
      ), 
        headerTintColor:"#fff",
        headerRight:(
          <View  style={{flexDirection:'row',flex:1}}>
            <TouchableOpacity onPress={() =>{navigation.navigate("LanguageList", {queryBookFromAPI:params.queryBookFromAPI})}}  style={{flexDirection:'row',alignSelf:'center',alignItems:'center'
              }}>
              <Text style={{
                fontSize:16,color:"#fff",alignSelf:'center',alignItems:'center'
              }}>{params.bibleLanguage} {params.bibleVersion}</Text>
              <Icon name="arrow-drop-down" color="#fff" size={28}/>
            </TouchableOpacity>
            <Icon 
                onPress={()=> {params.onBookmark()}} 
                name={'bookmark'} 
                color={params.isBookmark ? "red" : "white"} 
                size={24} 
                style={{marginHorizontal:8}} 
            />    
          </View>
        )
    }
  }

  constructor(props) {
    super(props);
    this.leftIsScrolling = false;
    this.rigthIsScrolling = false;
    console.log("PROPS VALUE BIBLE "+JSON.stringify(props))

    this.getSelectedReferences = this.getSelectedReferences.bind(this)
    this.onBookmarkPress = this.onBookmarkPress.bind(this)
    // this.onScroll = this.onScroll.bind(this)

    // this.updateCurrentChapter = this.updateCurrentChapter.bind(this)
    this.state = {
      // languageCode: this.props.screenProps.languageCode,
      languageName:AsyncStorageConstants.Values.DefLanguageName,
      versionCode: AsyncStorageConstants.Values.DefLanguageCode,
      isLoading: false,
      showBottomBar: false,
      bookId:AsyncStorageConstants.Values.DefBookId,
      bookName:AsyncStorageConstants.Values.DefBookName,
      menuHighlightedText: false,
      bookmarksList: [],
      isBookmark: false,
      currentVisibleChapter:AsyncStorageConstants.Values.DefBookChapter,
      bookNumber:AsyncStorageConstants.Values.DefBookNumber,
      selectedReferenceSet: [],
      verseInLine: this.props.screenProps.verseInLine,
      totalChapters:0,

      colorFile:this.props.screenProps.colorFile,
      sizeFile:this.props.screenProps.sizeFile,
      HightlightedVerseArray:[],
      gestureState: {},
      thumbSize: 100,
      left: width / 2,
      top: height / 2,

      scrollDirection:'up',
      close:true,
      chapter:[],
      // chaptersArray:[],
      message:'',
      downloaded:false,

      //modal value for showing chapter grid 
      sourceId:AsyncStorageConstants.Values.DefSourceId
    }

    this.pinchDiff = 0
    this.pinchTime = new Date().getTime()
    this.styles = styles(this.state.colorFile, this.state.sizeFile);    
    this.modelValue = "modal1"
    
  }

  
  componentWillReceiveProps(props){
    this.setState({
      colorFile:props.screenProps.colorFile,
      sizeFile:props.screenProps.sizeFile,
    //   bookId:props.screenProps.bookId,
    //   bookName:props.screenProps.bookName,
    //   currentChapter:props.screenProps.currentChapter
    })
    this.styles = styles(props.screenProps.colorFile, props.screenProps.sizeFile);   
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
    });
    this.props.navigation.setParams({
      onBookmark: this.onBookmarkPress,
      isBookmark:this.state.isBookmark,
      queryBookFromAPI:this.queryBookFromAPI,
      
    })   
    this.queryBookFromAPI()
       
  }

  // render data onAPI Call 
    queryBookFromAPI = async()=>{
      this.state.chapter = []
      let res = await AsyncStorageUtil.getAllItems([
        AsyncStorageConstants.Keys.LanguageName,
        AsyncStorageConstants.Keys.VersionCode,
        AsyncStorageConstants.Keys.BookId,
        AsyncStorageConstants.Keys.ChapterNumber,
        AsyncStorageConstants.Keys.SourceId,
        AsyncStorageConstants.Keys.Downloaded,
      ])
      const   isLoading = true
      var languageName = res[0][1] == null ? AsyncStorageConstants.Values.DefLanguageName : res[0][1]
      var versionCode = res[1][1] == null ? AsyncStorageConstants.Values.DefVersionCode : res[1][1]
      var bookId = res[2][1] == null ? AsyncStorageConstants.Values.DefBookId : res[2][1]
      var currentVisibleChapter = res[3][1] == null ? AsyncStorageConstants.Values.DefBookChapter : parseInt(res[3][1])
      var sourceId = res[4][1] == null ? AsyncStorageConstants.Values.DefSourceId : parseInt(res[4][1])
      var downloaded = res[5][1] == null ? AsyncStorageConstants.Values.DefDownloaded : JSON.parse(res[5][1])
      
      console.log("book id is ",bookId )

      this.props.navigation.setParams({
        bookName:getBookNameFromMapping(bookId,languageName),
        currentChapter:currentVisibleChapter,
        bibleLanguage: languageName, 
        bibleVersion: versionCode,
        downloaded:downloaded,
        sourceId:sourceId,
        bookId:bookId,
        totalChapters:getBookChaptersFromMapping(bookId)
      })
        if(downloaded == true ){
          console.log("chapter number ...........in bible page",currentVisibleChapter)
          let response = await dbQueries.queryVersions(languageName,versionCode,bookId,currentVisibleChapter)
          
          console.log("response of downloaded bible ",response)
          if(response.length != 0){
            this.setState({
              chapter:response[0].verses,
              totalChapters: getBookChaptersFromMapping(bookId),
              isLoading:false
            })
          }
          else{
            alert("no book found of ",bookId)
          }
          
        }
        else{
          let response =  await APIFetch.getChapterContent(sourceId,bookId,currentVisibleChapter)
          console.log("response of not downloaded book ",response)
          if(response.length !=0){
          this.setState({chapter:response.chapterContent.verses,
            totalChapters: getBookChaptersFromMapping(bookId),
            isLoading:false
          })
        }
        else{
          alert("check internet connection")
        }
        }

        this.setState({isLoading:true, languageName,versionCode,bookId,currentVisibleChapter,sourceId,downloaded})
       
      this.getHighlights()
      this.getBookMarks()
      let model = await  DbQueries.queryBookmark(languageName,versionCode,bookId,currentVisibleChapter)
      if (model == null) {
      }
      else{
        if(model.length > 0){
        console.log("book mark in query page  ",model)

        //   for(var i = 0; i<=model.length-1;i++){
        //     var index =  model.findIndex(chapInd => chapInd.chapterNumber === this.state.currentVisibleChapter)
        //     console.log("Index ",index)
        //     this.setState({ 
        //       bookmarksList:[...this.state.bookmarksList,{"bookId":model[i].bookId,"chapterNumber":model[i].chapterNumber}],
        //       isBookmark: index == -1  ? false : true
        //       }, () => {
        //         this.props.navigation.setParams({
        //             isBookmark: this.state.isBookmark,
        //         })      
        //     })
        //     console.log("is book mark in get bookmarks ",this.state.isBookmark)
        //   }
        }
      }
  }
  
  //update chapter number on right or left icon button 
  async updateCurrentChapter(val){
    let currChapter = this.state.currentVisibleChapter + val

    var index =  this.state.bookmarksList.findIndex(chapInd => chapInd.chapterNumber === currChapter)
    this.setState({ 
      isBookmark: index == -1  ? false : true,
      currentVisibleChapter: currChapter,
      }, () => {
        this.props.navigation.setParams({
            isBookmark: this.state.isBookmark,
            currentChapter:this.state.currentVisibleChapter,
        })      
    })

    if(this.state.downloaded == true){
        let response = await dbQueries.queryVersions(this.state.languageName,this.state.versionCode,this.state.bookId,this.state.currentVisibleChapter)
        if(response.length !=0){
          this.setState({
            chapter:response[0].verses,
            totalChapters: getBookChaptersFromMapping(this.state.bookId),
            })
        }
        else{
          alert("book not found")
        }
   
    }
    else{
      APIFetch.getChapterContent(this.state.sourceId,this.state.bookId,currChapter ).then(res =>{
        this.setState({
          chapter:res.chapterContent.verses,
          totalChapters: getBookChaptersFromMapping(this.state.bookId)
        })
    })
    }
     
    AsyncStorageUtil.setItem(AsyncStorageConstants.Keys.ChapterNumber, currChapter);    
}
  //get highlights from local db  
  async getHighlights(){
    let model2 = await  DbQueries.queryHighlights(this.state.languageName,this.state.versionCode,this.state.bookId)
    if(model2  == null ){
    }
    else{
      // conosole.log("model highlight "+)
      if(model2.length > 0){
        for(var i = 0; i<=model2.length-1;i++){
          this.setState({
            HightlightedVerseArray:[...this.state.HightlightedVerseArray,{"chapterNumber":model2[i].chapterNumber,"verseNumber":model2[i].verseNumber}]
          })
        }
      }
  }
  }
  //get bookmarks from local db
  async getBookMarks(){
    let model = await  DbQueries.queryBookmark(this.state.languageName,this.state.versionCode,this.state.bookId,this.state.currentVisibleChapter)
    if (model == null) {
    }
    else{
      console.log("book mark ",model)
      if(model.length > 0){
        for(var i = 0; i<=model.length-1;i++){
          var index =  model.findIndex(chapInd => chapInd.chapterNumber === this.state.currentVisibleChapter)
          console.log("Index ",index)
          this.setState({ 
            bookmarksList:[...this.state.bookmarksList,{"bookId":model[i].bookId,"chapterNumber":model[i].chapterNumber}],
            isBookmark: index == -1  ? false : true
            }, () => {
              this.props.navigation.setParams({
                  isBookmark: this.state.isBookmark,
              })      
          })
          console.log("is book mark in get bookmarks ",this.state.isBookmark)
        }
      }
    }
  }

  //add book mark from header icon 
  onBookmarkPress(){
    console.log("bookmarksList ",this.state.bookmarksList)
    index = this.state.bookmarksList.findIndex(chapInd => chapInd.chapterNumber === this.state.currentVisibleChapter);
    console.log(" index ",index)
     DbQueries.updateBookmarkInBook(this.state.languageName,this.state.versionCode,this.state.bookId,this.state.currentVisibleChapter, index > -1 ? false : true);
    this.setState({isBookmark: index > -1 ? false : true}, () => {
      console.log("is bookmark ",this.state.isBookmark)
      this.props.navigation.setParams({isBookmark: this.state.isBookmark}) 
        if(index > -1){
          this.state.bookmarksList.splice(index, 1)
        }
        else{
          this.setState({bookmarksList:[...this.state.bookmarksList,{bookId:this.state.bookId,chapterNumber:this.state.currentVisibleChapter}]})
      }
    })
  }
//remove bookmark from bottom bar 
  onBookmarkRemove = async( id,chapterNum ) =>{
    index = this.state.bookmarksList.findIndex(chapInd => chapInd.chapterNumber ===this.state.currentVisibleChapter);
    for(var i = 0; i<=this.state.bookmarksList.length;i++ ){
      if(this.state.bookmarksList[i].chapterNumber == chapterNum && this.state.bookmarksList[i].bookId == id ){
        this.props.navigation.setParams({isBookmark:false }) 
        await DbQueries.updateBookmarkInBook(this.state.languageName,this.state.versionCode,id,chapterNum,false);
        this.state.bookmarksList.splice(index, 1)
        this.setState({bookmarksList:this.state.bookmarksList,isBookmark:false})
      } 
    }

  }
//selected reference for highlighting verse
  getSelectedReferences(vIndex, chapterNum, vNum) {
    let obj = chapterNum + '_' + vIndex + '_' + vNum
    
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
            if (this.state.chapter[tempVal[0] - 1].verses[tempVal[1]].number == this.state.HightlightedVerseArray[i].verseNumber && this.state.currentVisibleChapter == this.state.HightlightedVerseArray[i].chapterNumber) {
              highlightCount++
            }
          }
      }
      this.setState({showBottomBar: this.state.selectedReferenceSet.length > 0 ? true : false, menuHighlightedText: selectedCount == highlightCount ? false : true})
    })
  }
  
  addToNotes = () => {
    let refList = []
    let id = this.state.bookId
    let name = getBookNameFromMapping(this.state.bookId,this.state.languageName)
    for (let item of this.state.selectedReferenceSet) {
      let tempVal = item.split('_')
      let refModel = {bookId: id, bookName: name, chapterNumber: parseInt(tempVal[0]), verseNumber: tempVal[2], 
        versionCode: this.props.screenProps.versionCode, languageName: this.props.screenProps.languageName};
      refList.push(refModel)
    }
    this.props.navigation.navigate('Notes', {referenceList: refList})
    this.setState({selectedReferenceSet: [], showBottomBar: false})
  }

  //after selected reference do highlight 
  doHighlight = async () => {
    if (this.state.menuHighlightedText == true) {
      for (let item of this.state.selectedReferenceSet) {

        let tempVal = item.split('_')
        await DbQueries.updateHighlightsInVerse( this.props.screenProps.languageName, this.state.versionCode,this.state.bookId,JSON.parse(tempVal[0]), tempVal[2], true)
        this.setState({HightlightedVerseArray:[...this.state.HightlightedVerseArray,{"chapterNumber":JSON.parse(tempVal[0]),"verseNumber":tempVal[2]}]})
      }
    } else {
      for (let item of this.state.selectedReferenceSet) {
        let tempVal = item.split('_')
        await DbQueries.updateHighlightsInVerse( this.props.screenProps.languageName, this.state.versionCode,this.state.bookId,JSON.parse(tempVal[0]), tempVal[2], false)
        for(var i=0; i<=this.state.HightlightedVerseArray.length-1; i++){
          if(this.state.HightlightedVerseArray[i].chapterNumber ==JSON.parse(tempVal[0]) && this.state.HightlightedVerseArray[i].verseNumber ==tempVal[2]){
            this.state.HightlightedVerseArray.splice(i, 1)
          }
        }
      }
    }
    this.setState({ selectedReferenceSet: [], showBottomBar: false})
  }

//remove highlight from bottom or split screen on press delete or cross icon
  removeHighlightFromBottom = async( chapterNum,verseNum)=>{
    for(var i=0; i<=this.state.HightlightedVerseArray.length-1; i++){
      if(this.state.HightlightedVerseArray[i].chapterNumber == chapterNum && this.state.HightlightedVerseArray[i].verseNumber == verseNum){
        this.state.HightlightedVerseArray.splice(i, 1)
        await DbQueries.updateHighlightsInVerse(this.props.screenProps.languageName, this.state.versionCode,this.state.bookId,chapterNum, verseNum,this.state.menuHighlightedText)
        this.setState({HightlightedVerseArray:this.state.HightlightedVerseArray})
      }
    }
  }

  getVerseText(cNum, vIndex) {
    return getResultText(this.state.chapter[cNum - 1].verseModels[vIndex].text)
  }

  //share verse
  addToShare = () => {
    let bookName = getBookNameFromMapping(this.state.bookId,this.state.languageName)
    let shareText = ''
    for (let item of this.state.selectedReferenceSet) {
      let tempVal = item.split('_')
      let chapterNumber= parseInt(tempVal[0])
      let vIndex= parseInt(tempVal[1])
      let verseNumber= tempVal[2]
      shareText = shareText.concat(bookName + " " + chapterNumber + ":" + verseNumber + " ");
      shareText = shareText.concat(this.getVerseText(chapterNumber, vIndex));
      shareText = shareText.concat("\n");
    }
    Share.share({message: shareText})
    this.setState({selectedReferenceSet: [], showBottomBar: false})
  }

  componentWillUnmount(){
    let lastRead = {
        languageName:this.state.languageName,
        versionCode:this.state.versionCode,
        bookId:this.state.bookId,
        chapterNumber:this.state.currentVisibleChapter,
    }
    AsyncStorageUtil.setItem(AsyncStorageConstants.Keys.LastReadReference, lastRead);
    this.props.screenProps.updateLastRead(lastRead);

    if(this.props.navigation.state.params.prevScreen =='bookmark'){
      this.props.navigation.state.params.updateBookmark()
    }
    else if(this.props.navigation.state.params.prevScreen == 'highlights'){
      this.props.navigation.state.params.updateHighlights()
    }

  }

  //close split screen 
    closeSplitScreen = ()=>{
     this.setState({close:!this.state.close})
  }
//change book from split screen 
  changeBookFromSplit = ( id,chapterNum) => {
    this.setState({bookId:id,currentVisibleChapter:chapterNum,bookName:getBookNameFromMapping(id,this.state.languageName)})
    this.props.navigation.setParams({
      currentChapter:chapterNum,
      bookName:getBookNameFromMapping(id,this.state.languageName),
      isBookmark:true
    })
  }
 
  _keyExtractor = (item, index) => item.number;

  render() {
    console.log("BOOKMARK LIST value in bible page ",this.state.bookmarksList)
    console.log("IS BOOKMARK ",this.state.isBookmark)

      return (
        <View style={this.styles.container}>
        
        <MenuContext style={this.styles.verseWrapperText}>
          {this.state.chapter.length  == 0   ?
          // <View style={{alignItems: 'center',justifyContent:'center',flex:1}}>   
          <ActivityIndicator 
          size="large" 
          color="#0000ff"
          />
          // </View> 
          :
               <View>
               <ScrollView  
               ref={(ref) => { this.scrollViewRef = ref; }}
               >
                   <FlatList
                   style={{padding:10}}
                   data={this.state.chapter }
                   extraData={this.state}
                   renderItem={({item, index}) => 
                            <VerseView
                                ref={child => (this[`child_${item.chapterNumber}_${index}`] = child)}
                                verseData = {item}
                                index = {index}
                                styles = {this.styles}
                                selectedReferences = {this.state.selectedReferenceSet}
                                getSelection = {(verseIndex, chapterNumber, verseNumber) => {
                                this.getSelectedReferences(verseIndex, chapterNumber, verseNumber)
                                }}
                                makeHighlight={this.doHighlight}
                                makeNotes={this.addToNotes}
                                share={this.addToShare}
                                menuHighlightedText={this.state.menuHighlightedText}
                                showFootNote = {this.state.showFootNote}
                                HightlightedVerse = {this.state.HightlightedVerseArray}
                                chapterNumber ={this.state.currentVisibleChapter}
                                showBottomBar={this.state.showBottomBar}
                            />
                        
                      }
                   keyExtractor={this._keyExtractor}
                   />
                
             </ScrollView>
              
                {
                  this.state.currentVisibleChapter == 1 
                  ? null :
                  <View style={this.styles.bottomBarPrevView}>
                      <Icon name={'chevron-left'} color="#3F51B5" size={32} 
                          style={this.styles.bottomBarChevrontIcon} 
                          onPress={()=>this.updateCurrentChapter(-1)}
                          />
                  </View>
                  }
                  {
                    this.state.currentVisibleChapter == this.state.totalChapters 
                  ? null :
                  <View style={this.styles.bottomBarNextView}>
                      <Icon name={'chevron-right'} color="#3F51B5" size={32} 
                          style={this.styles.bottomBarChevrontIcon} 
                          onPress={()=>this.updateCurrentChapter(1)}
                          />
                  </View>
                  }
              </View>

        } 
    
        </MenuContext>
        {
            this.state.close == true ? 
            <TouchableOpacity style={{ width:width,backgroundColor:"#3F51B5",flexDirection:'row',justifyContent:'flex-end'}} onPress={()=>this.setState({close:!this.state.close})}>
              <Text style={{color:'#fff',textAlign:'center',fontSize:16}}>See More </Text>
              <Icon name="expand-less" size={24} color="#fff" style={{paddingHorizontal:16}}/>
            </TouchableOpacity>  :
              <BottomTab
              style={{flex:1,height:height}}
                colorFile={this.props.screenProps.colorFile}
                sizeFile={this.props.screenProps.sizeFile}
                currentVisibleChapter={this.state.currentVisibleChapter}
                bookId = {this.state.bookId}
                versionCode = {this.state.versionCode}
                languageName = {this.state.languageName}
                close={this.state.close}
                closeSplitScreen ={this.closeSplitScreen}
                HightlightedVerseArray= {this.state.HightlightedVerseArray}
                removeHighlight = {this.removeHighlightFromBottom}
                bookmarksList={this.state.bookmarksList}
                onBookmarkRemove = {this.onBookmarkRemove}
                changeBookFromSplit={this.changeBookFromSplit}

            />
            }
      </View>
      )
  }
}
