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


export default class SelectVerse extends Component {

  constructor(props){
    super(props)
    console.log("props number : "+JSON.stringify(props.navigation))


    this.onVerseSelected = this.onVerseSelected.bind(this)
    this.queryBook = this.queryBook.bind(this)

    this.state = {
      isLoading: false,      
      selectedBookId: this.props.screenProps.bookId,
      selectedChapterNumber: this.props.screenProps.chapterNumber,
      bookData: [], 
      // selectedIndex: 0,
    }
    this.styles = numberSelection(props.screenProps.colorFile, props.screenProps.sizeFile);   
    
  }
async componentWillReceiveProps(props){
    console.log(" componentWillReceiveProps ",props.screenProps.totalVerses)
    var totalVerses = props.screenProps.totalVerses
    var bookData = []
    for(var i=1;i<=totalVerses;i++){
      bookData.push(i)
  }
  this.setState({bookData})

  // this.fetchChapters()
  }
  componentDidMount() {
      this.queryBook()
  }

  queryBook() {
   console.log("total verse in verse page",this.props.screenProps.totalVerses)
    const bookData = []
      for(var i = 1; i<=this.props.screenProps.totalVerses; i++ ){
          console.log("total verse ",i)
          bookData.push(i)
      }
        this.setState({bookData})
    }

  onVerseSelected(item, index) {
    // shift to tab 2
    console.log("on select" + item)
    this.props.screenProps.updateSelectedVerse(item)
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