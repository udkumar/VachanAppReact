import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions
} from 'react-native';
import {connect} from 'react-redux'
import {SelectionTab} from './routes/index'
import {fetchVersionBooks} from '../../store/action/'


class ReferenceSelection extends Component {

  static navigationOptions = {
    headerTitle: 'Select Reference',
  };

  constructor(props){
    super(props)
    console.log("REFERNCE SELECTION NAVIGATION : " + JSON.stringify(props.navigation))
    console.log("REFERNCE SELECTION SCREEN : " + JSON.stringify(props.screenProps))    
    
    this.state = {
    //   selectedBookIndex: 0,
      selectedBookId: this.props.navigation.state.params.bookId,
      selectedBookName: this.props.navigation.state.params.bookName,
      numOfChapters: [],
      totalChapters:this.props.navigation.state.params.totalChapters,
      selectedChapterIndex: 0,
      selectedChapterNumber: this.props.navigation.state.params.chapterNumber,
      
      selectedVerseIndex: 0,
      selectedVerseNumber: '',
      totalVerses:this.props.navigation.state.params.totalVerses

    }

  }

  updateSelectedBook = (item) => {
    this.setState({
        // selectedBookIndex: index,
        selectedBookId: item.bookId, 
        selectedBookName: item.bookName, 
        numOfChapters: item.numOfChapters
    })
  }

  updateSelectedChapter = (chapterNumber,index) => {
    console.log("this.state.numOfChapters[index] ",this.state.numOfChapters[index])
    this.setState({
        selectedChapterIndex: index, 
        selectedChapterNumber: chapterNumber,
        totalVerses:this.state.numOfChapters[index]
    })
  }

  updateSelectedVerse = (verseNumber, index) => {
    this.setState({selectedVerseIndex: index, selectedVerseNumber: verseNumber})
    // pop current screen, and pass data
    this.props.navigation.state.params.getReference({
      bookId:this.state.selectedBookId,bookName:this.state.selectedBookName,
      chapterNumber:this.state.selectedChapterNumber,
      totalChapters:this.state.numOfChapters.length,
      totalVerses:this.state.totalVerses,
      verseNumber:verseNumber})
      this.props.navigation.pop()
  }

  componentDidMount(){
    console.log(" downloaded ",this.props.downloaded)
    this.props.fetchVersionBooks({language:this.props.language,versionCode:this.props.versionCode,isDownloaded:this.props.downloaded,sourceId:this.props.sourceId})
  }
  render() {
    return (
        <SelectionTab 
        screenProps={{

          selectedBookIndex: this.state.selectedBookIndex,
          selectedBookId: this.state.selectedBookId,
          numOfChapters: this.state.numOfChapters,
          selectedChapterIndex: this.state.selectedChapterIndex,
          selectedChapterNumber: this.state.selectedChapterNumber,
          selectedVerseIndex: this.state.selectedVerseIndex,
          selectedVerseNumber: this.state.selectedVerseNumber,
          totalVerses:this.state.totalVerses,
          totalChapters:this.state.totalChapters,

          updateSelectedBook: this.updateSelectedBook,
          updateSelectedChapter: this.updateSelectedChapter,
          updateSelectedVerse: this.updateSelectedVerse,

        }}/>
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
    }
  }
  const mapDispatchToProps = dispatch =>{
    return {
    fetchVersionBooks:(payload)=>dispatch(fetchVersionBooks(payload)),
    }
  }
  export  default connect(mapStateToProps,mapDispatchToProps)(ReferenceSelection)