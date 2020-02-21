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
import {Segment,Button,Tab,Tabs, Item} from 'native-base'
import { SelectBookPageStyle } from './styles.js';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import {AsyncStorageConstants} from '../../../utils/AsyncStorageConstants'
import AsyncStorageUtil from '../../../utils/AsyncStorageUtil'

import APIFetch from '../../../utils/APIFetch'
import {getBookNameFromMapping,getBookSectionFromMapping,getBookNumberFromMapping,getBookChaptersFromMapping} from '../../../utils/UtilFunctions';
import DbQueries from '../../../utils/dbQueries.js';
import {connect} from 'react-redux'
import {selectedBook,addBookToNote,fetchVersionBooks} from '../../../store/action/'
import Spinner from 'react-native-loading-spinner-overlay';


 class SelectBook extends Component {
  constructor(props){
    super(props)
    this.state = {
      colorFile:this.props.colorFile,
      sizeFile:this.props.sizeFile,
      colorMode:this.props.colorMode,
      activeTab:true,
      bookList: [],
      NTSize:0,
      OTSize:0,
      isLoading:false
    }
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
      this.flatlistRef.scrollToIndex({index:this.state.OTSize,viewPosition:0,animated: false,viewOffset:0})
    }
    else{
      this.flatlistRef.scrollToIndex({index:0,viewPosition:0,animated: false,viewOffset:0})
    }
  }
  getItemLayout = (data, index) => (
    { length: 48, offset: 48 * index, index }
  )

  componentDidMount(){
  this.getBooks()  
  }
  async getBooks(){
    this.props.fetchVersionBooks({language:this.props.language,versionCode:this.props.versionCode,isDownloaded:this.props.downloaded,sourceId:this.props.sourceId})
  }

  navigateToChapter(item){
    this.props.selectedBook(item.bookId,item.bookName,item.numOfChapters)
    this.props.addBookToNote(item.bookId,item.bookName,item.numOfChapters)
    AsyncStorageUtil.setAllItems([
      [AsyncStorageConstants.Keys.BookId,item.bookId],
      [AsyncStorageConstants.Keys.BookName,item.bookName]
      
    ]); 
    this.props.navigation.navigate('Chapters')
  } 

  getOTSize=()=>{
    var count = 0;
    if(this.props.books.length == 0){
      this.setState({OTSize:0})
    }else{
      for(var i=0 ; i<this.props.books.length ; i++){
        if(this.props.books[i].bookNumber <= 39){
          count ++;
        }
        else{
          break;
        }
      }
  }
  this.setState({OTSize:count})
  }

getNTSize=()=>{
  var count = 0;
  if(this.props.books.length == 0 ){
    this.setState({NTSize:0})
  }else{
    for(var i=this.props.books.length-1 ; i>=0 ; i--){
      if(this.props.books[i].bookNumber >= 40){
        count++
      }
      else{
        break;
      }
    }
  }
  this.setState({NTSize:count})
}
  componentDidUpdate(prevProps,prevState){
    if(prevProps.books !==this.props.books ){
      this.getOTSize()
      this.getNTSize()
    }
  }
renderItem = ({item, index})=> {
    return (
      <TouchableOpacity 
          onPress={()=>this.navigateToChapter(item)}>
          <View 
            style={this.styles.bookList}>
            <Text
              style={
                [this.styles.textStyle,{fontWeight:item == this.props.bookName ? "bold" : "normal"}]
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

  onViewableItemsChanged = ({ viewableItems, changed }) => {
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
    // console.log("BOOKS ",this.props.books)
    let activeBgColor = this.state.colorMode == AsyncStorageConstants.Values.DayMode ? '#3F51B5' : '#fff'
    let inactiveBgColor =  this.state.colorMode == AsyncStorageConstants.Values.DayMode ? '#fff' : '#3F51B5'
    return (
      <View style={this.styles.container}>
      {this.props.isLoading ? 
         <Spinner
         visible={true}
         textContent={'Loading...'}
        //  textStyle={styles.spinnerTextStyle}
          />
        :
        <View style={this.styles.bookNameContainer}>
        <Segment>
              {
                this.state.OTSize > 0 
              ?
              <Button 
                active={this.state.activeTab} 
                style={[{
                  backgroundColor: this.state.activeTab ? activeBgColor : inactiveBgColor,
                  width: this.state.NTSize == 0 ? width : width*1/2,
                  },this.styles.segmentButton]} 
                onPress={this.toggleButton.bind(this,true)
                }
              >
                <Text 
                  style={{color:this.state.activeTab ? inactiveBgColor : activeBgColor
                  }}>
                  Old Testament
                </Text>
              </Button>
              : null}
              {
                this.state.NTSize > 0 

              ?
              <Button 
                active={!this.state.activeTab} 
                style={[{
                  backgroundColor: !this.state.activeTab ? activeBgColor : inactiveBgColor,
                  width: this.state.OTSize == 0 ? width : width*1/2,                  
                },this.styles.segmentButton]} 
                onPress={this.toggleButton.bind(this,false)}>
                <Text 
                  active={!this.state.activeTab} 
                  style={[
                    {
                      color:!this.state.activeTab ? inactiveBgColor : activeBgColor
                    },this.styles.buttonText]
                  }>
                  New Testament
                </Text>
              </Button>
              :null}
            </Segment>
            <FlatList
              ref={ref => this.flatlistRef = ref}
              data={this.props.books}
              getItemLayout={this.getItemLayout}
              onScroll={this.handleScroll}
              renderItem={this.renderItem}
              extraData={this.styles}
              keyExtractor={item => item.bookNumber}
              onViewableItemsChanged={this.onViewableItemsChanged}
              viewabilityConfig={this.viewabilityConfig}
            />
        </View> 
      }
      </View>
    );
  }

}


const mapStateToProps = state =>{
  return{
    language: state.updateVersion.language,
    versionCode:state.updateVersion.versionCode,
    sourceId:state.updateVersion.sourceId,
    downloaded:state.updateVersion.downloaded,
    
    bookId:state.updateVersion.bookId,
    bookName:state.updateVersion.bookName,
    books:state.versionFetch.data,
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
    colorMode:state.updateStyling.colorMode,
    isLoading:state.versionFetch.loading
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    selectedBook:(bookId,bookName,totalChapters) =>dispatch(selectedBook(bookId,bookName,totalChapters)),
    addBookToNote:(bookId,bookName,totalChapters)=>dispatch(addBookToNote(bookId,bookName,totalChapters)),
    fetchVersionBooks:(payload)=>dispatch(fetchVersionBooks(payload)),
  }
}
export  default connect(mapStateToProps,mapDispatchToProps)(SelectBook)