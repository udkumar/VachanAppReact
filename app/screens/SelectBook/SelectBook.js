import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Linking,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Segment,Button,Tab,Tabs} from 'native-base'
import { SelectBookPageStyle } from './styles.js';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import {AsyncStorageConstants} from '../../utils/AsyncStorageConstants'
import AsyncStorageUtil from '../../utils/AsyncStorageUtil'
import {id_name_map} from '../../assets/mappings.json'

import {NavigationActions} from 'react-navigation'
import APIFetch from '../../utils/APIFetch'
import {getBookNameFromMapping,getBookSectionFromMapping,getBookNumberFromMapping,getBookChaptersFromMapping} from '../../utils/UtilFunctions';

import DbQueries from '../../utils/dbQueries.js';
export default class SelectBook extends Component {

  constructor(props){
    super(props)
    console.log("props "+JSON.stringify(props))
    this.state = {
      colorFile:this.props.screenProps.colorFile,
      sizeFile:this.props.screenProps.sizeFile,
      colorMode:this.props.screenProps.colorMode,
      activeTab:true,
      booksList: [],
      OTSize:this.getOTSize(this.props.screenProps.booksList),
      NTSize:this.getNTSize(this.props.screenProps.booksList),
      isLoading:false
    }
    console.log("IN SelectBook, bok len"  + JSON.stringify(this.props.screenProps.booksList))
    this.styles = SelectBookPageStyle(this.state.colorFile, this.state.sizeFile);
    this.navigateToChapter = this.navigateToChapter.bind(this)
    this.viewabilityConfig = {
        itemVisiblePercentThreshold: 100,
        waitForInteraction: true
    }
  }

  toggleButton(value){
    this.setState({activeTab:value})
    if(value == false){
      console.log("pressed")
      this.flatlistRef.scrollToIndex({index:this.state.OTSize,viewPosition:0,animated: false,viewOffset:0})
    }
    else{
      this.flatlistRef.scrollToIndex({index:0,viewPosition:0,animated: false,viewOffset:0})
    }
  }
   componentWillReceiveProps(props){
     this.setState({
        colorFile:props.screenProps.colorFile,
        colorMode: props.screenProps.colorMode,
        sizeFile:props.screenProps.sizeFile,
        lastRead: props.screenProps.lastRead,
        // booksList: props.screenProps.booksList,
        OTSize:this.getOTSize(props.screenProps.booksList),
        NTSize:this.getNTSize(props.screenProps.booksList)
      })
   
    this.styles = SelectBookPageStyle(props.screenProps.colorFile, props.screenProps.sizeFile);   
  }
 
  getItemLayout = (data, index) => (
    { length: 48, offset: 48 * index, index }
  )

  async componentDidMount(){
    var bookListData=[]
    // this.setState({isLoading:bookListData.length == 0 ? true : false})
    if(this.props.screenProps.downloaded == true){
        this.setState({isLoading:true})
        var booksid = await DbQueries.getDownloadedBook(this.props.screenProps.languageName,this.props.screenProps.versionCode)
        console.log(" books .......",booksid)
        for(var i = 0; i<=booksid.length-1;i++){
        console.log(" books inside....... ",booksid[i])
          var bookId = booksid[i]
          var bookList = {
                bookId:bookId,
                bookName:getBookNameFromMapping(bookId,this.props.screenProps.languageName),
                section:getBookSectionFromMapping(bookId),
                bookNumber:getBookNumberFromMapping(bookId),
                languageName: this.props.screenProps.languageName, 
                versionCode:this.props.screenProps.versionCode, 
                numOfChapters:getBookChaptersFromMapping(bookId)
            }
                bookListData.push(bookList)
          }

      }
    else{
      this.setState({isLoading:true})
      var booksid = await APIFetch.availableBooks(this.props.screenProps.sourceId)
      console.log("response ",JSON.stringify(booksid))
        if(booksid.length !=0){
          if(booksid.status == 500){
            alert("sorry are unavailable ")
          }
          else{
            for(var key in booksid[0].books){
              // console.log(" key and books id "+key+" book vakue "+JSON.stringify(booksid[0].books[key]),)
              var bookId = booksid[0].books[key].abbreviation
              var bookList = {bookId:bookId,
                    bookName: getBookNameFromMapping(bookId,this.props.screenProps.languageName),
                    section:getBookSectionFromMapping(bookId),bookNumber:getBookNumberFromMapping(bookId),
                    languageName: this.props.screenProps.languageName, 
                    versionCode:this.props.screenProps.versionCode, 
                    numOfChapters:getBookChaptersFromMapping(bookId)}
                    bookListData.push(bookList)
            }
          }
          
        }
        else{
          alert("check internet connection")
        }
       
    }
    this.setState({booksList:bookListData,isLoading:false})
    console.log("bookList data ",bookListData)
  }
 
  navigateToChapter(item){
    // console.log("  from book chapter length",item.numOfChapter)
    AsyncStorageUtil.setItem(AsyncStorageConstants.Keys.BookId, item.bookId); 
    this.props.screenProps.updateSelectedBook(item.bookId,item.numOfChapters)
    this.props.navigation.navigate('Chapters',{bookId:item.bookId,chaptersLength:item.numOfChapters})
  }
renderItem = ({item, index})=> {
    return (
      <TouchableOpacity 
          onPress={()=>{this.navigateToChapter(item,index)}}>
          <View 
            style={this.styles.bookList}>
            <Text
              style={
                [this.styles.textStyle,{fontWeight:item.bookName == this.props.screenProps.bookName ? "bold" : "normal"}]
              }
              >
              {item.bookName}
            </Text>
            <Icon 
              name='chevron-right' 
              color="gray" 
              style={this.styles.iconCustom}
              />
          </View>
        </TouchableOpacity>
    );
  }

  getOTSize(bookList){
    var count = 0;
    for(var i=0 ; i<bookList.length ; i++){
      if(bookList[i].bookNumber <= 39){
        count ++;
      }
      else{
        break;
      }

    }
    return count 
  }

  getNTSize(bookList){
    var count = 0;
    for(var i=bookList.length-1 ; i>=0 ; i--){
      if(bookList[i].bookNumber >= 41){
        count++
      }
      else{
        break;
      }
    }
    return count 
  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
      // console.log("Visible items are", viewableItems);
      if (viewableItems.length > 0) {
        if (viewableItems[0].index < this.state.OTSize) {
          // toggel to OT
          this.setState({activeTab:true})
        } else {
          // toggle to NT
          this.setState({activeTab:false})
        }
      }
  }


  render(){
    // console.log("book id ",t)
    let activeBgColor = 
      this.state.colorMode == AsyncStorageConstants.Values.DayMode ? '#3F51B5' : '#fff'
    let inactiveBgColor = 
      this.state.colorMode == AsyncStorageConstants.Values.DayMode ? '#fff' : '#3F51B5'
   
      console.log("loader ",this.state.isLoading)
    return (
      <View style={this.styles.container}>
        <ActivityIndicator animating ={this.state.isLoading ? true : false} size="large" color="#0000ff"/>
        <View style={this.styles.bookNameContainer}>
            <FlatList
              ref={ref => this.flatlistRef = ref}
              data={this.state.booksList}
              getItemLayout={this.getItemLayout}
              onScroll={this.handleScroll}
              renderItem={this.renderItem}
              extraData={this.styles}
              keyExtractor={item => item.bookNumber}
              onViewableItemsChanged={this.onViewableItemsChanged}
              viewabilityConfig={this.viewabilityConfig}
            />
        </View> 
      </View>
    );
  }

}