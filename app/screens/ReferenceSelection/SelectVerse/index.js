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
import {selectedVerse} from '../../../store/action/'


class SelectVerse extends Component {

  constructor(props){
    super(props)
    this.onVerseSelected = this.onVerseSelected.bind(this)
    this.queryBook = this.queryBook.bind(this)

    this.state = {
      isLoading: false,      
      bookData: [], 
      // selectedIndex: 0,
    }
    this.styles = numberSelection(props.screenProps.colorFile, props.screenProps.sizeFile);   
    
  }
async componentWillReceiveProps(props){
    var totalVerses = props.totalVerses
    var bookData = []
    for(var i=1;i<=props.totalVerses;i++){
      bookData.push(i)
  }
  this.setState({bookData})

  // this.fetchChapters()
  }
  componentDidMount() {
      this.queryBook()
  }

  queryBook() {
    const bookData = []
      for(var i = 1; i<=this.props.totalVerses; i++ ){
          bookData.push(i)
      }
        this.setState({bookData})
    }

  onVerseSelected(item, index) {
    console.log("on select" + item)
    this.props.selectedVerse(item)
    this.props.screenProps.navigateBack()
  }
  
  render() {

    return (
      <View style={this.styles.tabContainer}>
        <FlatList
        numColumns={4}
        data={this.state.bookData}
        renderItem={({item, index}) => 
        <TouchableOpacity style={[this.styles.selectGridNum,
          {backgroundColor:'transparent'}]}
          onPress={()=>this.onVerseSelected(item, index)}
          >
                <Text style={this.styles.selectText}>{item}</Text>
            </TouchableOpacity>
        }
      />
      </View>
    );
  }
};

const mapStateToProps = state =>{
  return{
    language: state.updateVersion.language,
    version:state.updateVersion.version,
    sourceId:state.updateVersion.sourceId,
    downloaded:state.updateVersion.downloaded,
    
    totalVerses:state.selectReference.totalVerses,
    // chapterNumber:state.selectReference.chapterNumber,
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    selectedVerse: (verseNumber)=>dispatch(selectedVerse(verseNumber)),
  }
}
export  default connect(mapStateToProps,mapDispatchToProps)(SelectVerse)