import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import APIFetch from '../../../utils/APIFetch'
import { numberSelection } from './styles.js';
import DbQueries from '../../../utils/dbQueries'
import {AsyncStorageConstants} from '../../../utils/AsyncStorageConstants'
import AsyncStorageUtil from '../../../utils/AsyncStorageUtil'

import {connect} from 'react-redux'
import {selectedChapter,addChapterToNote} from '../../../store/action/'
import Spinner from 'react-native-loading-spinner-overlay';
import SelectionGrid from '../../../components/SelectionGrid/';
import { Item } from 'native-base';


class ChapterSelection extends Component {

  constructor(props){
    super(props)
    this.state = {
      isLoading:true,
      totalChapters:[],
      bookId:this.props.bookId,
    }

    this.styles = numberSelection(this.props.colorFile, this.props.sizeFile);   
    // this.onNumPress = this.onNumPress.bind(this)
  }
  static getDerivedStateFromProps(nextProps, prevState){
    var chapterData = []
    if(nextProps.bookId !== prevState.bookId){
      for(var i=0;i<=nextProps.totalChapters.length-1;i++){
        chapterData.push(i+1)
      }
      return{totalChapters:chapterData,bookId:nextProps.bookId}
    }
   else return null
  }

  getChapters(){
  var chapterData = []
  for(var i=0;i<=this.state.totalChapters.length-1;i++){
    chapterData.push(i+1)
  }
  this.setState({totalChapters:chapterData,isLoading:false})
  }

  componentDidMount(){
    console.log("SELECT CHAPTER")
    this.getChapters()
  }
 
   onNumPress=(item,index)=>{
    var time =  new Date()
    DbQueries.addHistory(this.props.language, this.props.versionCode, this.props.bookId, item, time)
    this.setState({isLoading:true},async()=>{
    try{
      this.props.selectedChapter(item,this.props.totalChapters[index])

      this.setState({isLoading:false})
      AsyncStorageUtil.setAllItems([
        [AsyncStorageConstants.Keys.ChapterNumber, JSON.stringify(item)],
      ]); 
      this.props.navigation.navigate('Verses')
    }
      catch(error){
        console.log(error)
      }
    }
    )
   
    // const resetAction = NavigationActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName: 'Bible' })]
    // })
    // this.props.navigation.dispatch(resetAction)
    // this.props.navigation.replace('Bible', {bookId: this.state.bookId, bookNumber:this.state.bookNumber,
      // bookName: this.state.bookName, chapterNumber: item })
    
  }

  
  render() {
    // console.log("is loading ",this.state.isLoading)
    return (
      <SelectionGrid
      styles={this.styles}
      onNumPress={(item,index)=>{this.onNumPress(item,index)}}
      numbers={this.state.totalChapters}
      loader={this.state.isLoading}
      heighlightedNumber={this.props.chapterNumber}
      />
    );
  }
};

const mapStateToProps = state =>{
  return{
    language: state.updateVersion.language,
    versionCode:state.updateVersion.versionCode,
    sourceId:state.updateVersion.sourceId,
    downloaded:state.updateVersion.downloaded,
    
    bookId:state.updateVersion.bookId,
    bookName:state.updateVersion.bookName,
    totalChapters:state.updateVersion.totalChapters,
    chapterNumber:state.updateVersion.chapterNumber,
    contentType:state.updateVersion.contentType,
    
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    selectedChapter: (chapterNumber,totalVerses)=>dispatch(selectedChapter(chapterNumber,totalVerses)),
    addChapterToNote:(chapterNumber,totalVerses)=>dispatch(addChapterToNote(chapterNumber,totalVerses))
  }
}
export  default connect(mapStateToProps,mapDispatchToProps)(ChapterSelection)