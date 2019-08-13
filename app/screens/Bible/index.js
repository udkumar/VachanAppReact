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
import AsyncStorageConstants from '../../utils/AsyncStorageConstants';
const Constants = require('../../utils/constants')

import {getResultText} from '../../utils/UtilFunctions';
import {getBookNameFromMapping,getBookSectionFromMapping,getBookNumberFromMapping,getBookChaptersFromMapping} from '../../utils/UtilFunctions';
import APIFetch from '../../utils/APIFetch'
import ModalForChapter from './component/ModalForChapter'
import {
  MenuContext
} from 'react-native-popup-menu';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import { styles } from './styles.js';

import BottomTab from './BottomTab'



export default class Bible extends Component {
  static navigationOptions = ({navigation}) =>{
    const { params = {} } = navigation.state
    console.log("params navigation bible ")

    return{
        headerTitle:(
          <View style={{flexDirection:'row',flex:1}}>
          
            <TouchableOpacity style={{flexDirection:'row'}}  onPress={() =>{navigation.navigate("SelectionTab", {chapterUpdate:params.queryBookFromAPI})}}>
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
            <TouchableOpacity onPress={() =>{navigation.navigate("LanguageList", {updateLanguage:params.updateLanguage})}}  style={{flexDirection:'row',alignSelf:'center',alignItems:'center'
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
    this.queryBook = this.queryBook.bind(this)
    this.onBookmarkPress = this.onBookmarkPress.bind(this)
    // this.onScroll = this.onScroll.bind(this)

    // this.updateCurrentChapter = this.updateCurrentChapter.bind(this)
    this.state = {
      // languageCode: this.props.screenProps.languageCode,
      languageName:this.props.screenProps.languageName,
      versionCode: this.props.screenProps.versionCode,
      // isLoading: false,
      showBottomBar: false,
      bookId: this.props.screenProps.bookId,
      bookName:this.props.screenProps.bookName,
      menuHighlightedText: false,
      bookmarksList: [],
      isBookmark: false,
      currentVisibleChapter:this.props.screenProps.chapterNumber,
      bookNumber:this.props.screenProps.bookNumber,
      selectedReferenceSet: [],
      verseInLine: this.props.screenProps.verseInLine,
      dataLength:0,

      colorFile:this.props.screenProps.colorFile,
      sizeFile:this.props.screenProps.sizeFile,
      HightlightedVerseArray:[],
      gestureState: {},
      thumbSize: 100,
      left: width / 2,
      top: height / 2,

      scrollDirection:'up',
      close:true,
      chapters:[],
      message:'',
      downloaded:false,

      //modal value for showing chapter grid 
      totalChapter:null,
      sourceId:22
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
      bookId:props.screenProps.bookId,
      bookName:props.screenProps.bookName,
      currentChapter:props.screenProps.currentChapter
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
      openLanguages:this.openLanguages,
      updateModalValue:this.updateModalValue,
      currentChapter:this.state.currentVisibleChapter,
      bibleLanguage: this.props.screenProps.languageName, 
      bibleVersion: this.props.screenProps.versionCode,
      updateChapter:this.updateChapter,
      queryBookFromAPI:this.queryBookFromAPI,
      updateLanguage:this.updateLanguage,
      bookName:this.state.bookName


  }) 
      this.queryBookFromAPI()
       
  }

  // render data onAPI Call 
     queryBookFromAPI(chapter){
       console.log("current chapter")
      const chapterValue = chapter == null ? this.state.currentVisibleChapter : chapter
        // APIFetch.getChapterContent(this.state.sourceId,this.state.bookId,chapterValue ).then(res =>{
        //  console.log("BIBLE CONTENT ",res.chapterContent.verses)
        //  this.setState({chapters:res.chapterContent.verses})
         
        //   this.getHighlights()
        //   this.getBookMarks()
        
        // })
        APIFetch.getChapterContent(22,this.props.screenProps.bookId,chapterValue ).then(res =>{
          console.log("BIBLE CONTENT ",res.chapterContent.verses)
          this.setState({chapters:res.chapterContent.verses})
          
           this.getHighlights()
           this.getBookMarks()
         
         })
  }
  
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
  async getBookMarks(book){
    let model = await  DbQueries.queryBookmark(this.state.languageName,this.state.versionCode,this.state.bookId)
    if (model == null) {
    }else{
      if(model.length > 0){
        for(var i = 0; i<=model.length-1;i++){
          var index =  model.findIndex(chapInd => chapInd.chapterNumber === this.state.currentVisibleChapter)
          this.setState({ bookmarksList:[...this.state.bookmarksList,{"bookId":model[i].bookId,"chapterNumber":model[i].chapterNumber}]}, () => {
            this.setState({isBookmark: this.state.bookmarksList.findIndex(chapInd => chapInd.chapterNumber === this.state.currentVisibleChapter) > -1 ? true : false}, () => {
              this.props.navigation.setParams({
                  isBookmark: this.state.isBookmark,
                  dataLength:getBookChaptersFromMapping(this.state.bookId)
              })      
            })
          })
        }
      }
    }
  }
  // render data from local db
  async queryBook() {
    let model = await DbQueries.queryBookWithId(this.props.screenProps.versionCode, 
        this.props.screenProps.languageName, this.state.bookId);
    if (model == null) {
    } else {
      if (model.length > 0) {
        this.setState({chapters: model[0].chapters, bookmarksList: model[0].bookmarksList}, () => {
              this.setState({isBookmark: this.state.bookmarksList.indexOf(this.state.currentVisibleChapter) > -1}, () => {
                this.props.navigation.setParams({
                    isBookmark: this.state.isBookmark,
                    dataLength:getBookChaptersFromMapping(this.state.bookId)
                })      
              })
        })
      }
    }
  }

  async onBookmarkPress(){
    index = this.state.bookmarksList.findIndex(chapInd => chapInd.chapterNumber === this.state.currentVisibleChapter);

    await DbQueries.updateBookmarkInBook(this.state.languageName,this.state.versionCode,this.state.bookId,this.state.currentVisibleChapter, index > -1 ? false : true);
    this.setState({isBookmark: index > -1 ? false : true}, () => {
      this.props.navigation.setParams({isBookmark: this.state.isBookmark}) 
        if(index > -1){
          this.state.bookmarksList.splice(index, 1)
        }
        else{
          this.setState({bookmarksList:[...this.state.bookmarksList,{bookId:this.state.bookId,chapterNumber:this.state.currentVisibleChapter}]})
          
      }
    })

  }
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
            if (this.state.chapters[tempVal[0] - 1].verses[tempVal[1]].number == this.state.HightlightedVerseArray[i].verseNumber && this.state.currentVisibleChapter == this.state.HightlightedVerseArray[i].chapterNumber) {
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
    return getResultText(this.state.chapters[cNum - 1].verseModels[vIndex].text)
  }

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

  updateCurrentChapter = (val)=>{
      let currChapter = this.state.currentVisibleChapter + val

      APIFetch.getChapterContent(this.state.sourceId,this.state.bookId,currChapter ).then(res =>{
        console.log("BIBLE CONTENT ",res.chapterContent.verses)
        this.setState({
          currentVisibleChapter: currChapter,
          dataLength: getBookChaptersFromMapping(this.state.bookId),
          chapters:res.chapterContent.verses,
  
        }, () => { 
              this.props.navigation.setParams({
                  isBookmark: this.state.isBookmark,
                  currentChapter:this.state.currentVisibleChapter,
              })
          })
      })

        
  }

  // openLanguages = ()=>{
  //   this.props.navigation.navigate("LanguageList", {updateLanguage:this.updateLanguage})
  // } 
  // updateChapter = ()=>{
  //   // this.props.navigation.navigate("SelectionTab", {chapterUpdate:this.state.currentVisibleChapter})
  //   this.props.navigation.navigate("SelectionTab", {chapterUpdate:this.queryBookFromAPI()})

  // }
  updateLanguage = (language,version) =>{
    this.props.navigation.setParams({
      bibleLanguage: language,
      bibleVersion: version,
    })
  }

    closeSplitScreen = ()=>{
     this.setState({close:!this.state.close})
  }

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
    console.log("from book chapters ",this.props.navigation.state.params ? this.props.navigation.state.params.totalChapter : null)
    const thumbSize = this.state.thumbSize;
      return (
        <View style={this.styles.container}>
        
          <MenuContext style={this.styles.verseWrapperText}>
            {this.state.chapters.length == 0   ?
            <View style={{alignItems: 'center',justifyContent:'center',flex:1}}>   
            <ActivityIndicator 
            size="large" 
            color="#0000ff"/>
            </View> :(this.state.message == '' && this.state.chapters.length != 0 ? 
                 <View>
                 <ScrollView  
                 ref={(ref) => { this.scrollViewRef = ref; }}
                 >
                     <FlatList
                     style={{padding:10}}
                     data={this.state.chapters}
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
                      this.state.currentVisibleChapter == this.state.dataLength 
                    ? null :
                    <View style={this.styles.bottomBarNextView}>
                        <Icon name={'chevron-right'} color="#3F51B5" size={32} 
                            style={this.styles.bottomBarChevrontIcon} 
                            onPress={()=>this.updateCurrentChapter(1)}
                            />
                    </View>
                    }
                </View>

                : <Text style={{textAlign:'center'}}>{this.state.message}</Text>
            )
           
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
              {/* <ModalForChapter/> */}
        </View>
      )
  }
}


