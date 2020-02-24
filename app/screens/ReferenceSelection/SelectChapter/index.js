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
import {selectedChapter,addChapterToNote,parallelSelectedChapter} from '../../../store/action/'
import Spinner from 'react-native-loading-spinner-overlay';
import SelectionGrid from '../../../components/SelectionGrid/';
import { Item } from 'native-base';


class ChapterSelection extends Component {

  constructor(props){
    super(props)
    console.log("props navigation",props)
    this.state = {
      isLoading:true,
      totalChapters:!this.props.screenProps.parallelBible ||this.props.screenProps.parallelBible ==null ? this.props.totalChapters : this.props.paralleltotalChapters,
      chapterData:[],
      bookId:!this.props.screenProps.parallelBible ||this.props.screenProps.parallelBible == null ? this.props.bookId : this.props.parallelBookId,
    }

    this.styles = numberSelection(this.props.colorFile, this.props.sizeFile);   
    // this.onNumPress = this.onNumPress.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState){
    console.log('screen props ',nextProps.screenProps.parallelBible)
    if(!nextProps.screenProps.parallelBible || nextProps.screenProps.parallelBible==null){
      if(nextProps.bookId !== prevState.bookId || prevState.totalChapters !== nextProps.totalChapters){
        var chapterData = []
        // console.log("chapter data ",nextProps.totalChapters)
        for(var i=0;i<nextProps.totalChapters.length;i++){
          chapterData.push(i+1)
        }
        return{totalChapters:nextProps.totalChapters,bookId:nextProps.bookId,chapterData:chapterData,isLoading:false}
      }
    }
    else{
      if(nextProps.parallelBookId !== prevState.bookId  || nextProps.paralleltotalChapters !== prevState.totalChapters){
        var chapterData = []
        for(var i=0;i<nextProps.paralleltotalChapters.length;i++){
          chapterData.push(i+1)
        }
        return{totalChapters:nextProps.paralleltotalChapters,bookId:nextProps.parallelBookId,chapterData:chapterData,isLoading:false}
      }
    }
     
  //  else return{totalChapters:prevState.totalChapters,bookId:prevState.bookId,chapterData:prevState.chapterData}
  }
  getChapters(){
    console.log("totalchapters ",this.props.totalChapters)
  var chapterData = []
  for(var i=0;i<this.state.totalChapters.length;i++){
    chapterData.push(i+1)
  }
  this.setState({chapterData,isLoading:false})
  }

  componentDidMount(){
    console.log("SELECT CHAPTER")
    this.getChapters()
  }
 
   onNumPress=(item,index)=>{
    if(!this.props.screenProps.parallelBible || this.props.screenProps.parallelBible==null){
      var time =  new Date()
      DbQueries.addHistory(this.props.sourceId,this.props.language,this.props.languageCode, this.props.versionCode, this.props.bookId, item,this.props.downloaded, time)
      this.setState({isLoading:true},async()=>{
      try{
        this.props.selectedChapter(item,this.state.totalChapters[index])
        this.setState({isLoading:false})
        AsyncStorageUtil.setAllItems([
          [AsyncStorageConstants.Keys.ChapterNumber, JSON.stringify(item)],
        ]); 
      }
        catch(error){
          console.log(error)
        }
      }
      )
    }
    else{
      this.props.parallelSelectedChapter(item,this.state.totalChapters[index])
    }
    this.props.navigation.navigate('Verses')
    // this.props.navigation.navigate('Verses',{bookId:this.props.navigation.state.params.bookId,totalChapters:item,totalVerses:this.state.totalChapters[index]})
   
    // const resetAction = NavigationActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName: 'Bible' })]
    // })
    // this.props.navigation.dispatch(resetAction)
    // this.props.navigation.replace('Bible', {bookId: this.state.bookId, bookNumber:this.state.bookNumber,
      // bookName: this.state.bookName, chapterNumber: item })
    
  }

  
  render() {
    // console.log("SELECT CHAPTER",this.props.totalChapters)
    // console.log("is loading ",this.state.isLoading)
    return (
      <SelectionGrid
      styles={this.styles}
      onNumPress={(item,index)=>{this.onNumPress(item,index)}}
      numbers={this.state.chapterData}
      loader={this.state.isLoading}
      heighlightedNumber={this.props.chapterNumber}
      />
    );
  }
};

const mapStateToProps = state =>{
  return{
   
    language: state.updateVersion.language,
    languageCode:state.updateVersion.languageCode,
    versionCode:state.updateVersion.versionCode,
    sourceId:state.updateVersion.sourceId,
    downloaded:state.updateVersion.downloaded,

    bookId:state.updateVersion.bookId,
    bookName:state.updateVersion.bookName,
    totalChapters:state.updateVersion.totalChapters,

    parallelBookId:state.parallel.bookId,
    parallelBookName:state.parallel.bookName,
    paralleltotalChapters:state.parallel.totalChapters,
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    selectedChapter: (chapterNumber,totalVerses)=>dispatch(selectedChapter(chapterNumber,totalVerses)),
    addChapterToNote:(chapterNumber,totalVerses)=>dispatch(addChapterToNote(chapterNumber,totalVerses)),
    parallelSelectedChapter: (chapterNumber,totalVerses)=>dispatch(parallelSelectedChapter(chapterNumber,totalVerses)),
  }
}
export  default connect(mapStateToProps,mapDispatchToProps)(ChapterSelection)