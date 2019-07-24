import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Share
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
import {
  MenuContext
} from 'react-native-popup-menu';
import { styles } from './styles.js';

import  grammar from 'usfm-grammar'
import BottomTab from './BottomTab'
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;



export default class Bible extends Component {
  static navigationOptions = ({navigation}) =>{
    const { params = {} } = navigation.state

    return{
        headerTitle:(
          <View style={{flexDirection:'row',flex:1}}>
          
            <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>{navigation.navigate("SelectBook")}}>
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
            <TouchableOpacity onPress={() =>{params.openLanguages()}}  style={{flexDirection:'row',alignSelf:'center',alignItems:'center'
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

    this.updateCurrentChapter = this.updateCurrentChapter.bind(this)
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
      downloaded:false
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

      // bookId:props.screenProps.bookId,
      // bookName:props.screenProps.bookName,
      currentChapter:props.screenProps.currentChapter
    })
  //   console.log("WILL RECIEVE PROPS VALUE"+JSON.stringify(props))
  //   this.styles = styles(props.screenProps.colorFile, props.screenProps.sizeFile);   
  }

  async componentDidMount(){
    console.log("hi did miount call")
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
    // });
    this.props.navigation.setParams({
      onBookmark: this.onBookmarkPress,
      isBookmark:this.state.isBookmark,
      openLanguages:this.openLanguages,
     
      currentChapter:this.state.currentVisibleChapter,
      bibleLanguage: this.props.screenProps.languageName, 
      bibleVersion: this.props.screenProps.versionCode
  }) 
    console.log("DID  MOUNT "+this.props.screenProps.isConnected)
      this.queryBookFromAPI()
       
  }

  // render data onAPI Call 
    async queryBookFromAPI(){
      // console.log("dataa "+data)
      // if(downloaded==true && downloaded !=null ){
      // console.log("download "+downloaded)
      //   var  data  = await DbQueries.queryVersion(langName,versCode)
      //   if(data !=null){
      //     console.log("data verses  "+data[0].chapters)
      //   this.setState({chapters:data[0].chapters,
      //     bookId:data[0].bookId,
      //     bookName:data[0].bookName,
      //     dataLength:getBookChaptersFromMapping(data[0].bookId)
      //   },()=>this.props.navigation.setParams({
      //     bookName: this.state.bookName,
      //   }))
      // }
      // }
      // else{
        APIFetch.getContent(18,"json",this.state.bookNumber).then(bibleContent =>{
          console.log("response "+JSON.stringify(bibleContent)+"booknumber "+this.state.bookNumber)
         
          if(bibleContent.success == false){
            this.setState({message:"book Not Available "})
          }
          else{
            for(var i in bibleContent){
              // bibleContent[i].chapters
            console.log("visible chapters "+JSON.stringify(bibleContent[i].chapters[0]))
              this.setState({chapters:bibleContent[i].chapters,
              bookId:i.toUpperCase(),
              
              dataLength:getBookChaptersFromMapping(i)
            },()=>this.props.navigation.setParams({
              bookName:getBookNameFromMapping(i,this.state.languageName),
            })
          )
          this.getHighlights()
          this.getBookMarks()
            }
            
          }
        
        })
        // .catch(erorr=>alert("error",erorr))
      // }
      console.log("booknumber "+this.state.bookNumber +" chapternumber "+ this.state.currentVisibleChapter)
       

      
        
    // else {
    //   console.log("already have data "+JSON.stringify(this.state.modelData))
    //   return
    // }
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
      // console.log("mode lnull")
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
    index = this.state.bookmarksList.findIndex(chapInd => chapInd.chapterNumber ===this.state.currentVisibleChapter);
    console.log("index "+index)

    await DbQueries.updateBookmarkInBook(this.state.languageName,this.state.versionCode,this.state.bookId,this.state.currentVisibleChapter, index > -1 ? false : true);
    this.setState({isBookmark: index > -1 ? false : true}, () => {
      this.props.navigation.setParams({isBookmark: this.state.isBookmark}) 
        if(index > -1){
          this.state.bookmarksList.splice(index, 1)
            console.log("BOOK MARK SLICE ")
        }
        else{
          this.setState({bookmarksList:[...this.state.bookmarksList,{bookId:this.state.bookId,chapterNumber:this.state.currentVisibleChapter}]})
          
          console.log("bookmark list "+JSON.stringify(this.state.bookmarksList))
      }
    })

  }
  onBookmarkRemove = async( id,chapterNum ) =>{
    index = this.state.bookmarksList.findIndex(chapInd => chapInd.chapterNumber ===this.state.currentVisibleChapter);
    for(var i = 0; i<=this.state.bookmarksList.length;i++ ){
      console.log("book list  "+this.state.bookmarksList[i].chapterNumber)
      if(this.state.bookmarksList[i].chapterNumber == chapterNum && this.state.bookmarksList[i].bookId == id ){
      this.props.navigation.setParams({isBookmark:false }) 
        await DbQueries.updateBookmarkInBook(this.state.languageName,this.state.versionCode,id,chapterNum,false);
        console.log("chapter "+chapterNum+"book mark list "+this.state.bookmarksList[i])
        this.state.bookmarksList.splice(index, 1)
        this.setState({bookmarksList:this.state.bookmarksList,isBookmark:false})
      } 
    }
  }

  getSelectedReferences(vIndex, chapterNum, vNum) {
    console.log(" selected index "+vIndex+"  chapter number "+chapterNum+" verse number "+vNum)
    let obj = chapterNum + '_' + vIndex + '_' + vNum
    console.log("obj "+ chapterNum + '_' + vIndex + '_' + vNum)
    
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
              console.log("chapters  "+this.state.chapters[tempVal[0] - 1].verses[tempVal[1]].number)
              highlightCount++
            }
            console.log("highlightCount "+highlightCount)
          }
      }
      console.log("highlightCount "+highlightCount+" selected count "+this.state.selectedReferenceSet.length)
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
    console.log("highlight text "+JSON.stringify(this.state.HightlightedVerseArray))
    console.log("ishighlight in do highlight "+this.state.menuHighlightedText)
    if (this.state.menuHighlightedText == true) {
      for (let item of this.state.selectedReferenceSet) {

        let tempVal = item.split('_')
        console.log("json parser temp 1"+item)
        await DbQueries.updateHighlightsInVerse( this.props.screenProps.languageName, this.state.versionCode,this.state.bookId,JSON.parse(tempVal[0]), tempVal[2], true)
        this.setState({HightlightedVerseArray:[...this.state.HightlightedVerseArray,{"chapterNumber":JSON.parse(tempVal[0]),"verseNumber":tempVal[2]}]})
      }
    } else {
      for (let item of this.state.selectedReferenceSet) {
        let tempVal = item.split('_')
        console.log("json parser temp 2"+item)
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
    console.log(" HIGHLIGHTED IN REMOVE ",this.state.menuHighlightedText)
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

  updateCurrentChapter(val){
      let currChapter = this.state.currentVisibleChapter + val
   
      this.setState({
        currentVisibleChapter: currChapter,
        dataLength: getBookChaptersFromMapping(this.state.bookId)
        // isBookmark: this.state.bookmarksList.findIndex(chapInd => chapInd.chapterNumber === currChapter) > -1 ? true : false
      }, () => { 
            // this.queryBookFromAPI()
            this.props.navigation.setParams({
                isBookmark: this.state.isBookmark,
                currentChapter:this.state.currentVisibleChapter,
            })
        })
  }

  openLanguages = ()=>{
    this.props.navigation.navigate("LanguageList", {updateLanguage:this.updateLanguage})
  } 
  updateLanguage = (language,version,downloaded) =>{
    // if(downloaded == true){
    //   this.queryBookFromAPI(downloaded)

    // }
    // this.setState({downloaded})
    
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
  // componentDidUpdate(){
  //   if(this.props.screenProps.isConnected==true){
  //     this.queryBookFromAPI()
  //   }
  // }

  _renderItem = ({item}) => (
    <View>
      {/* <TouchableWithoutFeedback onPress={this.openMenu}> */}
    <Text 
    style={{fontSize: 16,textAlign: 'justify',lineHeight: 24}}>
     {item.number} {item.text}
    </Text>
    <Text>
       {
          item.metadata == null ? null : 
          item.metadata.map((val)=>{
            <Text>{val.styling.map((tag)=><Text>{tag}</Text>)}</Text>
          })   
        }
         </Text>
      {/* </TouchableWithoutFeedback> */}
      </View>
    
  )
  _keyExtractor = (item, index) => item.number;

  render() {
    
    console.log("highlights BAR ",this.state.HightlightedVerseArray)
    //  console.log("current chapter "+this.state.currentVisibleChapter)

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
                     data={this.state.chapters[this.state.currentVisibleChapter-1].verses}
                     extraData={this.state}
                     renderItem={({item, index}) => 
                        // <Text letterSpacing={24} 
                          // style={this.styles.verseWrapperText}> 
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
                          
                        // </Text> 
                        }
                      //  renderItem={this._renderItem}
                     keyExtractor={this._keyExtractor}
                     />
                 {/* }) */}
                  
               </ScrollView>
                
                  {
                    this.state.currentVisibleChapter == 1 
                    ? null :
                    <View style={this.styles.bottomBarPrevView}>
                        <Icon name={'chevron-left'} color="#3F51B5" size={32} 
                            style={this.styles.bottomBarChevrontIcon} 
                            onPress={()=> this.updateCurrentChapter(-1)}
                            />
                    </View>
                    }
                    {
                      this.state.currentVisibleChapter == this.state.dataLength 
                    ? null :
                    <View style={this.styles.bottomBarNextView}>
                        <Icon name={'chevron-right'} color="#3F51B5" size={32} 
                            style={this.styles.bottomBarChevrontIcon} 
                            onPress={()=> this.updateCurrentChapter(1)}
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
        </View>
      )
  }
}


