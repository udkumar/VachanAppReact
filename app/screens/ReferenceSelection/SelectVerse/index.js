import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions
} from 'react-native';
import DbQueries from '../../../utils/dbQueries'
import { numberSelection } from './styles.js';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import {nightColors, dayColors} from '../../../utils/colors.js'
import {connect} from 'react-redux'
import {selectedVerse,addVerseToNote} from '../../../store/action/'
import SelectionGrid from '../../../components/SelectionGrid/';




class SelectVerse extends Component {

  constructor(props){
    super(props)
    this.onVerseSelected = this.onVerseSelected.bind(this)
    this.queryBook = this.queryBook.bind(this)

    this.state = {
      isLoading: true,      
      totalVerses:[],
      totalChapters:this.props.totalChapters,
      bookId:this.props.bookId

      // selectedIndex: 0,
    }
    this.styles = numberSelection(this.props.colorFile, this.props.sizeFile);   
    
  }

  static getDerivedStateFromProps(nextProps, prevState){
    // console.log("verses nextProps",nextProps," prevState",prevState)

    if(nextProps.bookId !== prevState.bookId || nextProps.totalChapters !== prevState.totalChapters){
      var verses = []
        for(var i = 1; i < nextProps.totalVerses; i++ ){
          verses.push(i)
    }
      return{totalVerses:verses,isLoading:false}
    }
   else return null
  }
//  componentDidUpdate(prevProps,prevState){
//   var verses = []
//   if(prevState.totalChapters !== this.state.totalChapters || prevState.totalChapters !== this.state.totalVerses){
//     for(var i = 1; i<= this.props.totalVerses; i++ ){
//       verses.push(i)
//     }
//  }
//  else return null;
//  }
  queryBook() {
    const verseArray = []
      for(var i = 1; i<=this.state.totalVerses; i++ ){
        verseArray.push(i)
      }
        this.setState({totalVerses:verseArray,isLoading:false})
    }

  componentDidMount(){
      this.queryBook()
  }
  onVerseSelected=(item)=> {
    this.props.selectedVerse(item)
    this.props.addVerseToNote(item)
    this.props.screenProps.navigateBack()
  }
  
  render() {

    return (
      <SelectionGrid
      styles={this.styles}
      onNumPress={(item)=>{this.onVerseSelected(item)}}
      numbers={this.state.totalVerses}
      loader={this.state.isLoading}
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
    totalChapters:state.updateVersion.totalChapters,
    totalVerses:state.updateVersion.totalVerses,
    

    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    selectedVerse: (verseNumber)=>dispatch(selectedVerse(verseNumber)),
    addVerseToNote: (verseNumber,verseText)=>dispatch(addVerseToNote(verseNumber,verseText)),
  }
}
export  default connect(mapStateToProps,mapDispatchToProps)(SelectVerse)