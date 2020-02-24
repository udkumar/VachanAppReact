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
    console.log('props value verses ',props.navigation.state.params)
    this.onVerseSelected = this.onVerseSelected.bind(this)
    this.queryBook = this.queryBook.bind(this)

    this.state = {
      isLoading: true,      
      totalVerses:!this.props.screenProps.parallelBible ||this.props.screenProps.parallelBible ==null ? this.props.totalVerses : this.props.parallelTotalVerse,
      verseData:[],
      totalChapters:!this.props.screenProps.parallelBible ||this.props.screenProps.parallelBible ==null ? this.props.totalChapters : this.props.paralleltotalChapters,
      bookId:!this.props.screenProps.parallelBible ||this.props.screenProps.parallelBible == null ? this.props.bookId : this.props.parallelBookId,
    }

    this.styles = numberSelection(this.props.colorFile, this.props.sizeFile);   
    
  }
  static getDerivedStateFromProps(nextProps, prevState){
    if(!nextProps.screenProps.parallelBible || nextProps.screenProps.parallelBible==null){
      if(nextProps.bookId !== prevState.bookId || prevState.totalChapters !== nextProps.totalChapters || prevState.totalVerses  !== nextProps.totalVerses){
        var verses = []
            for(var i = 1; i<=nextProps.totalVerses; i++ ){
              verses.push(i)
            }
            return{totalVerses:nextProps.totalVerses,verseData:verses}
      }
    }
    else{
      if(nextProps.parallelBookId !==prevState.bookId  || nextProps.paralleltotalChapters !== prevState.totalChapters || prevState.totalVerses  !== nextProps.parallelTotalVerse){
        var verses = []
        for(var i=0;i<=nextProps.parallelTotalVerse; i++){
          verses.push(i+1)
        }
        return{totalVerses:nextProps.parallelTotalVerse,verseData:verses}

      }
    }
      // else return{totalVerses:prevState.totalVerses,verseData:prevState.verseData}
  }
  
  queryBook() {
    this.setState({verseData:[],isLoading:true},()=>{
      const verses = []
      for(var i = 1; i<=this.state.totalVerses; i++ ){
        verses.push(i)
      }
        this.setState({verseData:verses,isLoading:false})
    })
    }

  componentDidMount(){
    console.log("SELECT VERSE")
      this.queryBook()
  }

  onVerseSelected=(item)=> {
    if(!this.props.screenProps.parallelBible || this.props.screenProps.parallelBible==null){
      this.props.selectedVerse(item)
      this.props.addVerseToNote(item)
    }
    else{

    }
    this.props.screenProps.navigateBack()
  }
  
  render() {

    return (
      <SelectionGrid
      styles={this.styles}
      onNumPress={(item)=>{this.onVerseSelected(item)}}
      numbers={this.state.verseData}
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
    bookName:state.updateVersion.bookName,
    totalChapters:state.updateVersion.totalChapters,
    totalVerses:state.updateVersion.totalVerses,

    parallelBookId:state.parallel.bookId,
    parallelBookName:state.parallel.bookName,
    paralleltotalChapters:state.parallel.totalChapters,
    parallelTotalVerse:state.parallel.totalVerses,
    // bookId:state.updateVersion.bookId,
    // totalChapters:state.updateVersion.totalChapters,
    // totalVerses:state.updateVersion.totalVerses,
    

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