import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {createResponder } from 'react-native-gesture-responder';

import DbQueries from '../../utils/dbQueries'
import VerseView from './VerseView'
import AsyncStorageUtil from '../../utils/AsyncStorageUtil';
import AsyncStorageConstants from '../../utils/AsyncStorageConstants';
const Constants = require('../../utils/constants')

import {getResultText} from '../../utils/UtilFunctions';

import {getBookNameFromMapping} from '../../utils/UtilFunctions';

import {
  MenuContext
} from 'react-native-popup-menu';
import { styles } from './styles.js';
import id_name_map from '../../assets/mappings.json'

import BottomTab from './BottomTab'
import bible_data from '../../assets/TestLangApi.json'
import USFMParser from '../../utils/USFMParser'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class Bible extends Component {
  static navigationOptions = ({navigation}) =>{
    const { params = {} } = navigation.state

    return{
        headerTitle:(
          <View style={{flexDirection:'row',flex:1}}>
           <TouchableOpacity onPress={()=> params.currentChapter == 1 ? null : params.updateChapter(-1)}>
              <Icon name={'chevron-left'} color="black" size={36} 
                  style={{
                      alignItems:'center',
                      zIndex:2, 
                      alignSelf:'center',
                      color:"#fff",
                      fontSize: 22,
                      marginTop:2
                  }} 
                  
                  />
            </TouchableOpacity>
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
            <TouchableOpacity onPress={()=>params.currentChapter == params.dataLength ? null : params.updateChapter(1)}>
                <Icon name={'chevron-right'} 
                  style={{
                      alignItems:'center',
                      zIndex:2, 
                      alignSelf:'center',
                      color:"#fff",
                      fontSize:22,
                      marginTop:2
                  }} 
                  />
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

    this.mappingData = id_name_map;
    this.getSelectedReferences = this.getSelectedReferences.bind(this)
    this.queryBook = this.queryBook.bind(this)
    this.onBookmarkPress = this.onBookmarkPress.bind(this)
    // this.onScroll = this.onScroll.bind(this)

    this.updateCurrentChapter = this.updateCurrentChapter.bind(this)
    this.state = {
      languageCode: this.props.screenProps.languageCode,
      versionCode: this.props.screenProps.versionCode,
      modelData: this.props.navigation.state.params ? this.props.navigation.state.params.chapterModels : null ,
      isLoading: false,
      showBottomBar: false,
      bookId: this.props.screenProps.bookId,
      bookName:this.props.screenProps.bookName,
      HighlightedText: false,
      bookmarksList: [],
      isBookmark: false,
      currentVisibleChapter:this.props.screenProps.chapterNumber,
      selectedReferenceSet: [],
      verseInLine: this.props.screenProps.verseInLine,

      colorFile:this.props.screenProps.colorFile,
      sizeFile:this.props.screenProps.sizeFile,
      HightlightedVerseArray:[],
      gestureState: {},
      thumbSize: 100,
      left: width / 2,
      top: height / 2,

      scrollDirection:'up',
      close:true,
      // bookInfo:this.props.navigation.state.params ? this.props.navigation.state.params.bookInfo : null 
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
      // currentChapter:props.screenProps.currentChapter
    })
    this.styles = styles(props.screenProps.colorFile, props.screenProps.sizeFile);   
  }

  componentDidMount(){
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
    console.log("book did mount "+this.state.bookName)
    this.props.navigation.setParams({
        onBookmark: this.onBookmarkPress,
        isBookmark:this.state.isBookmark,
        updateChapter:this.updateCurrentChapter,
        openLanguages:this.openLanguages,
        bookName: this.state.bookName,
        currentChapter:this.state.currentVisibleChapter,
        bibleLanguage: this.props.screenProps.languageName, 
        bibleVersion: this.props.screenProps.versionCode
    })  
     
    this.setState({isLoading: true}, () => {
      // this.queryBook()
      this.queryBookFromAPI()
      
    })
  }
  
  // render data onAPI Call 
  async queryBookFromAPI() {
    const parsedData =  await new USFMParser()
    var bookData = parsedData.parseFile(bible_data.usfm_text)
      const bookInfo = { 
        bookId: bookData.bookId,
        bookName: bookData.bookName,
        chapterModels: bookData.chapterModels,
        section:bookData.section,
        bookNumber:bookData.bookNumber
    }

    let model2 = await  DbQueries.queryHighlights(bible_data.language_code,bible_data.version_code,bookData.bookId)
      if(model2  == null ){
        console.log("MODEL null 2")
      }
      else{
        if(model2.length > 0){
          console.log("model2 "+JSON.stringify(model2))
          for(var i = 0; i<=model2.length-1;i++){
            this.setState({HightlightedVerseArray:[...this.state.HightlightedVerseArray,{"bookId":model2[i].bookId,"chapterNumber":model2[i].chapterNumber,"verseNumber":model2[i].verseNumber}]})
          }
        }
    }
    let model = await  DbQueries.queryBookmark(bible_data.language_code,bible_data.version_code,bookData.bookId)
    if (model == null) {
      console.log(" MODEL null")
    }else{
      console.log("bookmark list did mount "+JSON.stringify(model))
      if(model.length > 0){
        console.log("model book mark "+JSON.stringify(model))
        for(var i = 0; i<=model.length-1;i++){
          var index =  model.findIndex(chapInd => chapInd.chapterNumber === this.state.currentVisibleChapter)
          console.log("BOOKMARK INDEX index "+index)
          this.setState({ bookmarksList:[...this.state.bookmarksList,{"bookId":model[i].bookId,"chapterNumber":model[i].chapterNumber}]}, () => {
            this.setState({isBookmark: this.state.bookmarksList.findIndex(chapInd => chapInd.chapterNumber === this.state.currentVisibleChapter) > -1 ? true : false}, () => {
             
              this.props.navigation.setParams({
                  isBookmark: this.state.isBookmark,
                  dataLength: bookInfo.chapterModels.length
              })      
            })
          })
   
        }
      }


    }
  
    var bookListData  = [{bookId: bookInfo.bookId,bookName: bookInfo.bookName,
        section:bookInfo.section,  bookNumber:bookInfo.bookNumber,
        languageCode: "HIN", versionCode: "IRV", numOfChapters:bookData.chapterModels.length }]
    this.props.screenProps.updateBookList(bookListData)

    this.setState({modelData:bookInfo.chapterModels,languageCode:"HIN",versionCode:"IRV"})
       
  }

  // render data from local db
  async queryBook() {
    let model = await DbQueries.queryBookWithId(this.props.screenProps.versionCode, 
        this.props.screenProps.languageCode, this.state.bookId);
    this.setState({isLoading:false})
    if (model == null) {
      // console.log("mode lnull")
    } else {
      if (model.length > 0) {
        this.setState({modelData: model[0].chapterModels, bookmarksList: model[0].bookmarksList}, () => {
              this.setState({isBookmark: this.state.bookmarksList.indexOf(this.state.currentVisibleChapter) > -1}, () => {
                this.props.navigation.setParams({
                    isBookmark: this.state.isBookmark,
                    dataLength: model[0].chapterModels.length
                })      
              })
        })
      }
    }
  }

  async onBookmarkPress( ) {
    index = this.state.bookmarksList.findIndex(chapInd => chapInd.chapterNumber ===this.state.currentVisibleChapter);
    console.log("index "+index)

    await DbQueries.updateBookmarkInBook(this.state.languageCode,this.state.versionCode,this.state.bookId,this.state.currentVisibleChapter, index > -1 ? false : true);
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
    console.log("chapter "+chapterNum)
    index = this.state.bookmarksList.findIndex(chapInd => chapInd.chapterNumber ===this.state.currentVisibleChapter);
    for(var i = 0; i<=this.state.bookmarksList.length;i++ ){
      console.log("book list  "+this.state.bookmarksList[i].chapterNumber)
      if(this.state.bookmarksList[i].chapterNumber == chapterNum && this.state.bookmarksList[i].bookId == id ){
      this.props.navigation.setParams({isBookmark:false }) 
        await DbQueries.updateBookmarkInBook(this.state.languageCode,this.state.versionCode,id,chapterNum,false);
        console.log("chapter "+chapterNum+"book mark list "+this.state.bookmarksList[i])
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
            if (this.state.modelData[tempVal[0] - 1].verseComponentsModels[tempVal[1]].verseNumber == this.state.HightlightedVerseArray[i].verseNumber && this.state.modelData[tempVal[0] - 1].verseComponentsModels[tempVal[1]].chapterNumber == this.state.HightlightedVerseArray[i].chapterNumber) {
              highlightCount++
            }
            console.log("highlightCount "+highlightCount)
          }
      }
      console.log("highlightCount "+highlightCount+" selected count "+this.state.selectedReferenceSet.length)
      this.setState({showBottomBar: this.state.selectedReferenceSet.length > 0 ? true : false, HighlightedText: selectedCount == highlightCount ? false : true})
    })
  }
  

  getBookNameFromMapping(bookId) {
    var obj = this.mappingData.id_name_map;
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (key == bookId) {
                var val = obj[key];
                return val.book_name;
            }
        }
    }
    return null;
  }
 
  addToNotes = () => {
    let refList = []
    let id = this.state.bookId
    let name = this.getBookNameFromMapping(this.state.bookId)
    for (let item of this.state.selectedReferenceSet) {
      let tempVal = item.split('_')
      let refModel = {bookId: id, bookName: name, chapterNumber: parseInt(tempVal[0]), verseNumber: tempVal[2], 
        versionCode: this.props.screenProps.versionCode, languageCode: this.props.screenProps.languageCode};
      refList.push(refModel)
    }
    this.props.navigation.navigate('Notes', {referenceList: refList})
    this.setState({selectedReferenceSet: [], showBottomBar: false})
  }

  doHighlight = async () => {
    console.log("highlight text "+JSON.stringify(this.state.HightlightedVerseArray))
    console.log("ishighlight in do highlight "+this.state.HighlightedText)
    if (this.state.HighlightedText == true) {
      for (let item of this.state.selectedReferenceSet) {
        let tempVal = item.split('_')
        await DbQueries.updateHighlightsInVerse(this.state.languageCode, this.state.versionCode,this.state.bookId,JSON.parse(tempVal[0]), tempVal[2], true)
        this.setState({HightlightedVerseArray:[...this.state.HightlightedVerseArray,{"bookId":this.state.bookId,"chapterNumber":JSON.parse(tempVal[0]),"verseNumber":tempVal[2]}]})
      }
    } else {
      for (let item of this.state.selectedReferenceSet) {
        let tempVal = item.split('_')
        await DbQueries.updateHighlightsInVerse(this.state.languageCode, this.state.versionCode,this.state.bookId,JSON.parse(tempVal[0]), tempVal[2], false)
        for(var i=0; i<=this.state.HightlightedVerseArray.length-1; i++){
          if(this.state.HightlightedVerseArray[i].chapterNumber ==JSON.parse(tempVal[0]) && this.state.HightlightedVerseArray[i].verseNumber ==tempVal[2]){
            this.state.HightlightedVerseArray.splice(i, 1)
          }
        }
      }
    }
    this.setState({ selectedReferenceSet: [], showBottomBar: false})
  }

  removeHighlight = async( chapterNum,verseNum)=>{
    await DbQueries.updateHighlightsInVerse(this.state.languageCode, this.state.versionCode,this.state.bookId,chapterNum, verseNum, false)
    for(var i=0; i<=this.state.HightlightedVerseArray.length-1; i++){
      if(this.state.HightlightedVerseArray[i].chapterNumber == chapterNum && this.state.HightlightedVerseArray[i].verseNumber == verseNum){
        this.state.HightlightedVerseArray.splice(i, 1)
        this.setState({HightlightedVerseArray:this.state.HightlightedVerseArray})
      }
    }
  }

  getBookNameFromMapping(bookId) {
    var obj = this.mappingData.id_name_map;
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (key == bookId) {
                var val = obj[key];
                return val.book_name;
            }
        }
    }
    return null;
  }

  getVerseText(cNum, vIndex) {
    return getResultText(this.state.modelData[cNum - 1].verseComponentsModels[vIndex].text)
  }

  addToShare = () => {
    let bookName = this.getBookNameFromMapping(this.state.bookId)
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
        languageCode:this.state.languageCode,
        versionCode:this.state.versionCode,
        bookId:this.state.bookId,
        chapterNumber:this.state.currentVisibleChapter,
    }
    AsyncStorageUtil.setItem(AsyncStorageConstants.Keys.LastReadReference, lastRead);
    this.props.screenProps.updateLastRead(lastRead);
    console.log("this.props.navigation back book page "+JSON.stringify(this.props))
    // sceneProps.scene.route.routeName 

    if(this.props.navigation.state.params.prevScreen =='bookmark'){
      this.props.navigation.state.params.updateBookmark()
    }
    else if(this.props.navigation.state.params.prevScreen == 'highlights'){
      this.props.navigation.state.params.updateHighlights()
    }
   
  }

  updateCurrentChapter(val){
    let currChapter = this.state.currentVisibleChapter + val;
    this.setState({
        currentVisibleChapter: currChapter,
        isBookmark: this.state.bookmarksList.findIndex(chapInd => chapInd.chapterNumber === currChapter) > -1 ? true : false
      }, () => {

            this.props.navigation.setParams({
                isBookmark: this.state.isBookmark,
                currentChapter:this.state.currentVisibleChapter,
                dataLength:this.state.modelData.length
            })
            this.scrollViewRef.scrollTo({x: 0, y: 0, animated: false})
        })
  }

  openLanguages = ()=>{
    this.props.navigation.navigate("Language", {updateLanguage:this.updateLanguage})
  } 
  updateLanguage = (language,version) =>{
    this.props.navigation.setParams({
      bibleLanguage: language,
      bibleVersion: version
    })
  }

    closeSplitScreen = ()=>{
     this.setState({close:!this.state.close})
  }

  changeBookFromSplit = ( id,chapterNum) => {
    this.setState({bookId:id,currentVisibleChapter:chapterNum,bookName:getBookNameFromMapping(id)})
    this.props.navigation.setParams({
      currentChapter:chapterNum,
      bookName:getBookNameFromMapping(id),
      isBookmark:true
    })
  }
  render() {
    console.log("bookmark "+this.state.isBookmark )
    const thumbSize = this.state.thumbSize;
      return (
        <View style={this.styles.container} >
          <MenuContext style={this.styles.verseWrapperText}>
            {this.state.modelData == null  ?   
            <ActivityIndicator 
            animating={this.state.isLoading ? true : false} 
            size="large" 
            color="#0000ff" />:
            <View>
                <ScrollView  
                   ref={(ref) => { this.scrollViewRef = ref; }}
                  //  onScroll={e => {
                  //     if (!this.leftIsScrolling) {
                  //       this.rigthIsScrolling = true;
                  //       var scrollY = e.nativeEvent.contentOffset.y;
                  //       this.scrollViewRef.scrollTo({ y: scrollY });
                  //     }
                  //     this.leftIsScrolling = false;
                  //   }}
                
                    // style={this.styles.recyclerListView}
                  >
                 {    (this.state.verseInLine) ?
                          <View style={this.styles.chapterList}>
                            <FlatList
                            data={this.state.modelData[this.state.currentVisibleChapter - 1].verseComponentsModels}
                            renderItem={({item, index}) => 
                                  <Text letterSpacing={24} 
                                     style={this.styles.verseWrapperText}> 
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
                                            HighlightedText={this.state.HighlightedText}
                                            showFootNote = {this.state.showFootNote}
                                            HightlightedVerse = {this.state.HightlightedVerseArray}
                                            chapterNumber ={this.state.currentVisibleChapter}
                                        />
                                     
                                  </Text> 
                            }
                            ListFooterComponent={<View style={styles.addToSharefooterComponent} />}
                            />
                            </View>
                        :

                            <View style={this.styles.chapterList}>
                                  
                                    {this.state.modelData[this.state.currentVisibleChapter - 1].verseComponentsModels.map((verse, index) => 
                                        <View>
                                            {/* <Text letterSpacing={24}
                                                 >   */}
                                                <VerseView
                                                    ref={child => (this[`child_${verse.chapterNumber}_${index}`] = child)}
                                                    verseData = {verse}
                                                    index = {index}
                                                    styles = {this.styles}
                                                    selectedReferences = {this.state.selectedReferenceSet}
                                                    getSelection = {(verseIndex, chapterNumber, verseNumber) => {
                                                    this.getSelectedReferences(verseIndex, chapterNumber,verseNumber)
                                                    }}
                                                    makeHighlight={this.doHighlight}
                                                    makeNotes={this.addToNotes}
                                                    share={this.addToShare}
                                                    HighlightedText={this.state.HighlightedText}
                                                    onPressfootNote = {this.onPressfootNote}
                                                    showFootNote = {this.state.showFootNote}
                                                    HightlightedVerse = {this.state.HightlightedVerseArray}
                                                    chapterNumber ={this.state.currentVisibleChapter}
                                                />
                                               
                                            {/* </Text> */}
                                            
                                            {index == this.state.modelData[this.state.currentVisibleChapter - 1].verseComponentsModels.length - 1
                                            ? <View style={{height:25, marginBottom:4}} />
                                            : null
                                            }
                                            
                                          </View>
                                    )}
                            </View>
                        }

                </ScrollView>
                
            </View>
          
          }
          </MenuContext>
          {/* {this.state.currentVisibleChapter == 1
                ? null :
                <View style={[this.styles.bottomBarPrevView]}>
                    <Icon name={'chevron-left'} color="black" size={36} 
                        style={this.styles.bottomBarChevrontIcon} 
                        onPress={()=> this.updateCurrentChapter(-1)}
                        />
                </View>
                }
                {this.state.currentVisibleChapter == this.state.modelData.length 
                ? null :
                <View style={this.styles.bottomBarNextView}>
                    <Icon name={'chevron-right'} 
                        style={this.styles.bottomBarChevrontIcon} 
                        onPress={()=> this.updateCurrentChapter(1)}
                        />
                </View>
                } */}
          {
              this.state.close == true ? 
              <TouchableOpacity style={{backgroundColor:"#3F51B5",flexDirection:'row',justifyContent:'flex-end'}} onPress={()=>this.setState({close:!this.state.close})}>
                <Text style={{color:'#fff',textAlign:'center',fontSize:16}}>See More </Text>
                <Icon name="expand-less" size={24} color="#fff" style={{paddingHorizontal:16}}/>
              </TouchableOpacity>:
                <BottomTab
                  colorFile={this.props.screenProps.colorFile}
                  sizeFile={this.props.screenProps.sizeFile}
                  currentVisibleChapter={this.state.currentVisibleChapter}
                  bookId = {this.state.bookId}
                  versionCode = {this.state.versionCode}
                  languageCode = {this.state.languageCode}
                  close={this.state.close}
                  closeSplitScreen ={this.closeSplitScreen}
                  HightlightedVerseArray= {this.state.HightlightedVerseArray}
                  removeHighlight = {this.removeHighlight}
                  bookmarksList={this.state.bookmarksList}
                  onBookmarkRemove = {this.onBookmarkRemove}
                  changeBookFromSplit={this.changeBookFromSplit}

              />
              }
        </View>
        // <View>
        //   {/* <FlatList
        //     data={this.state.modelData[this.state.currentVisibleChapter - 1].verseComponentsModels}
        //     renderItem={({item, index}) => 
        //           <Text letterSpacing={24} 
        //               style={this.styles.verseWrapperText}> 
                        
        //           </Text> 
        //     }
        //     /> */}
        //     <Text>Hi</Text>
        // </View>
      )
  }

}