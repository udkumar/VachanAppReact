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
import {
  MenuContext
} from 'react-native-popup-menu';
import { styles } from './styles.js';
import id_name_map from '../../assets/mappings.json'

import BottomTab from './BottomTab'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class Bible extends Component {
  static navigationOptions = ({navigation}) =>{
    const { params = {} } = navigation.state;

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
                onPress={()=> {params.onIconPress()}} 
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
      modelData: [],
      isLoading: false,
      showBottomBar: false,
      bookId: this.props.screenProps.bookId,
      bookName:this.props.screenProps.bookName,
      bottomHighlightText: true,
      bookmarksList: [],
      isBookmark: false,
      currentVisibleChapter:this.props.screenProps.chapterNumber,
      selectedReferenceSet: [],
      verseInLine: this.props.screenProps.verseInLine,

      colorFile:this.props.screenProps.colorFile,
      sizeFile:this.props.screenProps.sizeFile,

      gestureState: {},
      thumbSize: 100,
      left: width / 2,
      top: height / 2,

      scrollDirection:'up',
      close:true,
      bookInfo:this.props.navigation.state.params ? this.props.navigation.state.params.bookInfo : null 
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
        onIconPress: this.onBookmarkPress,
        updateChapter:this.updateCurrentChapter,
        openLanguages:this.openLanguages,
        bookName: this.state.bookName,
        currentChapter:this.state.currentVisibleChapter,
        bibleLanguage: this.props.screenProps.languageName, 
        bibleVersion: this.props.screenProps.versionCode
    })  
     
    this.setState({isLoading: true}, () => {
      this.queryBook()
    })
  }
  
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

  async onBookmarkPress() {
    var index = this.state.bookmarksList.indexOf(this.state.currentVisibleChapter);
    await DbQueries.updateBookmarkInBook(this.state.bookmarksList, this.state.currentVisibleChapter, index > -1 ? false : true);
    this.setState({isBookmark: index > -1 ? false : true}, () => {
        this.props.navigation.setParams({isBookmark: this.state.isBookmark})      
    })

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
          if (this.state.modelData[tempVal[0] - 1].verseComponentsModels[tempVal[1]].highlighted) {
            highlightCount++
          }
      }
      this.setState({showBottomBar: this.state.selectedReferenceSet.length > 0 ? true : false, bottomHighlightText: selectedCount == highlightCount ? false : true})
    })
  }

  doHighlight = async () => {
    let modelData = [...this.state.modelData]
    if (this.state.bottomHighlightText == true) {
      // do highlight
      for (let item of this.state.selectedReferenceSet) {
        let tempVal = item.split('_')
        await DbQueries.updateHighlightsInBook(this.state.modelData, tempVal[0] - 1, tempVal[1], true)
      }
    } else {
      // remove highlight
      for (let item of this.state.selectedReferenceSet) {
        let tempVal = item.split('_')
        await DbQueries.updateHighlightsInBook(this.state.modelData, tempVal[0] - 1, tempVal[1], false)
      }
    }
    this.setState({modelData, selectedReferenceSet: [], showBottomBar: false})
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
    this.setState({currentVisibleChapter: currChapter, 
            isBookmark: this.state.bookmarksList.indexOf(currChapter) > -1}, () => {
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
  // onScroll(event){
  //   var currentOffset = event.nativeEvent.contentOffset.y;
  //   var direction = currentOffset > this.state.offset ? 'down' : 'up';
  //   this.state.offset = currentOffset;
  //   this.setState({scrollDirection:direction})
  //   console.log(direction);
  // }
    closeSplitScreen = ()=>{
     this.setState({close:!this.state.close})
  }
  render() {
    const thumbSize = this.state.thumbSize;
    console.log("CLOSE VALUE FROM BIBLE PAGE  BOOK INFO "+JSON.stringify(this.state.bookInfo))
      return (
        <View style={this.styles.container} >
          <MenuContext style={this.styles.verseWrapperText}>
            {this.state.modelData.length>0 ? 
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
                                            HighlightText={this.state.bottomHighlightText}
                                            showFootNote = {this.state.showFootNote}

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
                                                    HighlightText={this.state.bottomHighlightText}
                                                    onPressfootNote = {this.onPressfootNote}
                                                    showFootNote = {this.state.showFootNote}
                                                    
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
            :
            <ActivityIndicator 
            animating={this.state.isLoading ? true : false} 
            size="large" 
            color="#0000ff" />
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
              />
              }
        </View>
      );
  }

}


  