import React, { Component, version } from 'react';
import {
  Text,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
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

// import {getResultText} from '../../utils/UtilFunctions';
import {getBookNameFromMapping,getBookChaptersFromMapping} from '../../utils/UtilFunctions';
import APIFetch from '../../utils/APIFetch'
import SplashScreen from 'react-native-splash-screen'

import Spinner from 'react-native-loading-spinner-overlay';
import {
  MenuContext
} from 'react-native-popup-menu';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import { styles } from './styles.js';

// import BottomTab from './BottomTab'

import {connect} from 'react-redux'


class Bible extends Component {
  static navigationOptions = ({navigation}) =>{
    const { params={} } = navigation.state 

    return{
        headerTitle:(
          <View style={navStyles.headerLeftStyle}>
            <View style={{marginRight:10}}>
              <TouchableOpacity style={navStyles.touchableStyleLeft}  onPress={() =>{navigation.navigate("SelectionTab", {bookId:params.bookId,chapterNumber:params.currentChapter,totalVerses:params.totalVerses,getReference:params.callBackForUpdateBook})}}>
                <Text  style={navStyles.headerTextStyle}>{params.bookName}  {params.currentChapter }</Text>
              <Icon name="arrow-drop-down" color="#fff" size={24}/>
              </TouchableOpacity>
            </View>
            <View style={{marginRight:10}}>
              <TouchableOpacity onPress={() =>{navigation.navigate("LanguageList", {callBackForUpdateBook:params.callBackForUpdateBook})}} style={navStyles.headerLeftStyle}>
                <Text style={navStyles.headerTextStyle}>{params.languageName}  {params.versionCode}</Text>
                <Icon name="arrow-drop-down" color="#fff" size={24}/>
              </TouchableOpacity>
           
            </View>
          </View>
       
      ), 
        headerTintColor:"#fff",
        headerRight:(
          <View style={navStyles.headerRightStyle}>
              <TouchableOpacity  style={[navStyles.touchableStyleRight,{flexDirection:'row'}]}>
              <Icon 
                  onPress={()=> {params.onBookmark(params.bookId,params.currentChapter,params.isBookmark)}} 
                  name='bookmark'
                  color={params.isBookmark ? "red" : "white"} 
                  size={24} 
              /> 
              </TouchableOpacity>
              <TouchableOpacity onPress={() =>{navigation.navigate("More",{languageName:params.languageName,versionCode:params.versionCode,bookId:params.bookId})}} style={[navStyles.touchableStyleRight,{flexDirection:'row'}]}>
                <Icon name="more-vert" color="#fff" size={24} />
              </TouchableOpacity>
             
          </View>
        )
    }
  }

  constructor(props) {
    super(props);
    this.leftIsScrolling = false;
    this.rigthIsScrolling = false;

    this.getSelectedReferences = this.getSelectedReferences.bind(this)
    this.onBookmarkPress = this.onBookmarkPress.bind(this)
    // this.onScroll = this.onScroll.bind(this)
    console.log("book  id ",this.props.bookId)

    // this.updateCurrentChapter = this.updateCurrentChapter.bind(this)
    this.state = {
      isLoading: false,
      showBottomBar: false,
      bookName:getBookNameFromMapping(this.props.bookId,this.props.language),
      bookId:this.props.bookId,
      // menuHighlightedText: false,
      bookmarksList: [],
      isBookmark: false,
      currentVisibleChapter:this.props.screenProps.chapterNumber,
      bookNumber:this.props.screenProps.bookNumber,
      selectedReferenceSet: [],
      verseInLine: this.props.screenProps.verseInLine,
      totalChapters:0,
      bottomHighlightText:false,

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
      totalVerses:0,


      //modal value for showing chapter grid 
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
      
      bookName:getBookNameFromMapping(this.props.bookId,this.props.language).length > 8 ? getBookNameFromMapping(this.props.bookId,this.props.language).slice(0,7)+"..." : getBookNameFromMapping(this.props.bookId,this.props.language),
      // bookName:this.state.bookName.length > 8 ? this.state.bookName.slice(0,7)+"..." : this.state.bookName,
      currentChapter:this.state.currentVisibleChapter,
      languageName: this.props.language, 
      versionCode: this.props.version,
      bookId:this.props.bookId,
      callBackForUpdateBook:this.queryBookFromAPI,
      totalVerses:this.state.totalVerses
    })   
    SplashScreen.hide();
    this.queryBookFromAPI(null)
  }
  // render data onAPI Call 
    queryBookFromAPI = async(val)=>{
        this.setState({isLoading:true,chapter:[],currentVisibleChapter: val != null ? this.state.currentVisibleChapter + val : this.props.chapterNumber },async()=>{
          console.log("current visible chapter ",this.state.currentVisibleChapter) 
          if(this.props.downloaded == true ){
              let response = await DbQueries.queryVersions(this.props.language,this.props.version,this.props.bookId,this.state.currentVisibleChapter)
              if(response.length != 0){
                this.setState({
                  chapter:response[0].verses,
                  totalVerses:response[0].verses.length,
                  currentVisibleChapter:this.state.currentVisibleChapter,
                  totalChapters: getBookChaptersFromMapping(this.props.bookId),
                  isLoading:false
                })
                this.props.navigation.setParams({
                  totalVerses:response[0].verses.length,
                  languageName:this.props.language,
                  versionCode:this.props.version,
                  bookName:getBookNameFromMapping(this.props.bookId,this.props.language).length > 8 ? getBookNameFromMapping(this.props.bookId,this.props.language).slice(0,7)+"..." : getBookNameFromMapping(this.props.bookId,this.props.language),
                  currentChapter:this.state.currentVisibleChapter
                })
              }
              else{
                alert("no book found of ",this.props.bookId)
              }
              
            }
            else{
              try{
                //check sourceid 
                console.log("SOURCE ID   ",this.props.sourceId)
              let response =  await APIFetch.getChapterContent(this.props.sourceId,this.props.bookId,this.state.currentVisibleChapter)
              console.log("response ",response)  
              if(response.length !=0){
                  if(response.ok == false && response.status == 500){
                    this.setState({isLoading:false,currentVisibleChapter:this.props.chapterNumber})
                    alert(" please check internet connected or slow  OR book is not available ")
                  }else{
                    this.setState({chapter:response.chapterContent.verses,
                      totalChapters: getBookChaptersFromMapping(this.props.bookId),
                      totalVerses:response.chapterContent.verses.length,
                      isLoading:false,
                      currentVisibleChapter:this.state.currentVisibleChapter
                    })
                    this.props.navigation.setParams({
                      totalVerses:response.chapterContent.verses.length,
                      languageName:this.props.language,
                      versionCode:this.props.version,
                      bookName:getBookNameFromMapping(this.props.bookId,this.props.language).length > 8 ? getBookNameFromMapping(this.props.bookId,this.props.language).slice(0,7)+"..." : getBookNameFromMapping(this.props.bookId,this.props.language),
                      currentChapter:this.state.currentVisibleChapter
                    })

                  }
              }
              else{
                alert("check internet connection")
              }
              }
              catch(error) {
                console.log("error on fetching content ",error)

                alert("It seems no version available or check your internet connection ",error)
               
              }
            }
            this.getHighlights()
            this.getBookMarks(this.props.bookId,this.state.currentVisibleChapter)
        })
      
     
  }
 
  async getHighlights(){
    let model2 = await  DbQueries.queryHighlights(this.props.language,this.props.version,this.props.bookId)
    if(model2  == null ){
    }
    else{
      if(model2.length > 0){
        const HightlightedVerseArray = []
        for(var i = 0; i<=model2.length-1;i++){
          const obj = {"bookId":model2[i].bookId,"chapterNumber":model2[i].chapterNumber,"verseNumber":model2[i].verseNumber}
          HightlightedVerseArray.push(obj)
        }
        
        this.setState({HightlightedVerseArray})
       
      }
  }
  }

  //get bookmarks from local db
  async getBookMarks(bookId,chapter){
    console.log("book id",bookId,chapter)
    let model = await  DbQueries.queryBookmark(this.props.language,this.props.version,bookId,chapter)
      if(model.length > 0){
          if(model[0].bookId == bookId && model[0].chapterNumber == chapter){
            this.setState({isBookmark:true},
              ()=>{
                this.props.navigation.setParams({
                  isBookmark:true
                })
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
  onBookmarkPress(bookId,chapter,isbookmark){
    DbQueries.updateBookmarkInBook(this.props.language,this.props.version,bookId,chapter, isbookmark  ? false : true);
      this.setState({isBookmark: isbookmark ? false : true}, () => {
      this.props.navigation.setParams({isBookmark: this.state.isBookmark}) 
    })
  }

//selected reference for highlighting verse
  getSelectedReferences(vIndex, chapterNum, vNum,text) {

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
    // console.log("HightlightedVerseArray get selected ",this.state.HightlightedVerseArray)
    this.setState({selectedReferenceSet}, () => {
      let selectedCount = this.state.selectedReferenceSet.length, highlightCount = 0;
      for (let item of this.state.selectedReferenceSet) {
          let tempVal = item.split('_')
          for(var i=0; i<=this.state.HightlightedVerseArray.length-1; i++ ){

              if (this.state.HightlightedVerseArray[i].verseNumber == JSON.parse(tempVal[2]) && this.state.HightlightedVerseArray[i].chapterNumber ==JSON.parse(tempVal[0]) && this.state.HightlightedVerseArray[i].bookId == this.state.bookId  ) {
                console.log("selected highlight",this.state.HightlightedVerseArray[i].verseNumber)
                highlightCount++
              }
              
          }
      }
      console.log("SELECT COUNT ",selectedCount,"HIGHLIGHTED COUNT ",highlightCount)

      this.setState({showBottomBar: this.state.selectedReferenceSet.length > 0 ? true : false, bottomHighlightText: selectedCount == highlightCount ?  false : true})
    })
  }
  
  addToNotes = () => {
    let refList = []
    let id = this.props.bookId
    let name = getBookNameFromMapping(this.props.bookId,this.props.language)
    for (let item of this.state.selectedReferenceSet) {
    console.log(this.state.selectedReferenceSet)

      let tempVal = item.split('_')
      const verseNumber =  tempVal[2].toString()
      let refModel = {
        bookId: id, bookName: name, 
        chapterNumber: parseInt(tempVal[0]), 
        verseNumber: verseNumber, 
        verseText:tempVal[3],
        versionCode: this.props.version, 
        languageName: this.props.language,
      };
      refList.push(refModel)
    }
    this.props.navigation.navigate('EditNote', {
        referenceList: refList,
        bookId:id,
        onbackNote:this.onbackNote,
        chapterNumber:this.state.currentVisibleChapter,
        totalVerses:this.state.totalVerses,
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
    // let HightlightedVerseArray = [...this.state.HightlightedVerseArray]
      console.log("bottom highlight ",this.state.bottomHighlightText )
    if (this.state.bottomHighlightText == true) {
      // do highlight
      var arr = []
      for (let item of this.state.selectedReferenceSet){
        console.log("selected reference ",this.state.selectedReferenceSet)
        let tempVal = item.split('_')
        await DbQueries.updateHighlightsInVerse( this.props.language, this.props.version,this.props.bookId,this.state.currentVisibleChapter, tempVal[2], true)
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
          if(this.state.HightlightedVerseArray[i].chapterNumber == JSON.parse(tempVal[0]) && this.state.HightlightedVerseArray[i].verseNumber == JSON.parse(tempVal[2]) &&  this.state.HightlightedVerseArray[i].bookId == this.state.bookId) {
            await DbQueries.updateHighlightsInVerse( this.props.language, this.props.version,this.props.bookId,this.state.currentVisibleChapter, tempVal[2],false)
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
      shareText = shareText.concat(this.state.bookName + " " + chapterNumber + ":" + verseNumber + " ");
      shareText = shareText.concat(this.getVerseText(chapterNumber, vIndex));
      shareText = shareText.concat("\n");
    }
    Share.share({message: shareText})
    this.setState({selectedReferenceSet: [], showBottomBar: false})
  }

  componentWillUnmount(){
    let lastRead = {
        languageName:this.props.language,
        versionCode:this.props.version,
        bookId:this.props.bookId,
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
    this.setState({bookId:id,currentVisibleChapter:chapterNum,bookName:this.state.bookName})
    this.props.navigation.setParams({
      currentChapter:chapterNum,
      bookName:this.state.bookName,
      isBookmark:true
    })
  }
 
  _keyExtractor = (item, index) => item.number;

  render() {
    console.log("HightlightedVerseArray  ",this.state.HightlightedVerseArray)
      return (
        <View style={this.styles.container}>
        <MenuContext style={this.styles.verseWrapperText}>
          {this.state.chapter.length  == 0 ?
            <Spinner
                visible={true}
                textContent={'Loading...'}
                // textStyle={styles.spinnerTextStyle}
            />
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
                                getSelection = {(verseIndex, chapterNumber, verseNumber,text) => {
                                this.getSelectedReferences(verseIndex, chapterNumber, verseNumber,text)
                                }}
                                
                                HightlightedVerse = {this.state.HightlightedVerseArray}
                                chapterNumber ={this.state.currentVisibleChapter}
                                bookId={this.state.bookId}
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
                          onPress={()=>this.queryBookFromAPI(-1)}
                          />
                  </View>
                  }
                  {
                    this.state.currentVisibleChapter == this.state.totalChapters 
                  ? null :
                  <View style={this.styles.bottomBarNextView}>
                      <Icon name={'chevron-right'} color="#3F51B5" size={32} 
                          style={this.styles.bottomBarChevrontIcon} 
                          onPress={()=>this.queryBookFromAPI(1)}
                          />
                  </View>
                  }
                  
              </View>

        } 
    
        </MenuContext>
        {/* {
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
                versionCode = {this.props.version}
                languageName = {this.props.language}
                close={this.state.close}
                closeSplitScreen ={this.closeSplitScreen}
                HightlightedVerseArray= {this.state.HightlightedVerseArray}
                removeHighlight = {this.removeHighlightFromBottom}
                bookmarksList={this.state.bookmarksList}
                onBookmarkRemove = {this.onBookmarkRemove}
                changeBookFromSplit={this.changeBookFromSplit}
            />
            } */}
              {this.state.showBottomBar 
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
              <TouchableOpacity onPress={this.addToShare}  
              >       
                <Text style={this.styles.bottomOptionText}>
                  SHARE
                </Text>
                <Icon name={'share'} color="white" size={24} style={this.styles.bottomOptionIcon} />
              </TouchableOpacity>
            </View>
  
          </View>
          : null }
      </View>
      )
  }
}


const navStyles = StyleSheet.create({

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
})

const mapStateToProps = state =>{
  return{
    language: state.updateVersion.language,
    version:state.updateVersion.version,
    sourceId:state.updateVersion.sourceId,
    downloaded:state.updateVersion.downloaded,

    chapterNumber:state.updateVersion.chapterNumber,
    bookName:state.updateVersion.bookName,
    bookId:state.updateVersion.bookId,

  }
}

export  default connect(mapStateToProps,null)(Bible)