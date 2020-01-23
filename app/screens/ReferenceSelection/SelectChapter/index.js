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

import {connect} from 'react-redux'
import {selectedChapter,addChapterToNote} from '../../../store/action/'
import Spinner from 'react-native-loading-spinner-overlay';
import SelectionGrid from '../../../components/SelectionGrid/';
import { Item } from 'native-base';


class ChapterSelection extends Component {

  constructor(props){
    super(props)
    console.log("props in chapter selection ",props)
    this.state = {
      isLoading:false,
      chapterData:[],
      bookId:this.props.bookId,
      totalChapters:this.props.totalChapters
    }
    this.styles = numberSelection(this.props.colorFile, this.props.sizeFile);   
    // this.onNumPress = this.onNumPress.bind(this)
  }
  static getDerivedStateFromProps(nextProps, prevState){
    var chapters = []
    if(nextProps.bookId !== prevState.bookId || nextProps.totalChapters !== prevState.totalChapters){
      for(var i=0;i<=nextProps.totalChapters.length-1;i++){
        chapters.push(i+1)
      }
      return { bookId: nextProps.bookId, totalChapters: nextProps.totalChapters,chapterData:chapters};
   }
   else return null;
 }
  getChapters(){
  var chapterData = []
  for(var i=0;i<=this.props.totalChapters.length-1;i++){
    chapterData.push(i+1)
  }
  this.setState({chapterData})
  }

  componentDidMount(){
    this.getChapters()
  }
  
   onNumPress=(item,index)=>{
    var time =  new Date()
    DbQueries.addHistory(this.props.language, this.props.version, this.props.bookId, item, time)
    this.setState({isLoading:true},async()=>{
    try{
      this.props.selectedChapter(item,this.props.totalChapters[index])
      this.setState({isLoading:false})
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
    console.log("chapters ",this.state.chapterData)
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
    version:state.updateVersion.version,
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