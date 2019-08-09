import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import DbQueries from '../../utils/dbQueries'
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import {NavigationActions} from 'react-navigation'
import APIFetch from '../../utils/APIFetch'
import { numberSelection } from './styles.js';

export default class ChapterSelection extends Component {

  constructor(props){
    super(props)

    this.state = {
      bookId: this.props.navigation.state.params.bookId,
      bookName: this.props.navigation.state.params.bookName,
      bookIndex: this.props.navigation.state.params.bookIndex,
      numOfChapters: this.props.navigation.state.params.numOfChapters,
      bookNumber:this.props.navigation.state.params.bookNumber,
      chapterData:[]
      // bookData: Array.from(new Array(this.props.navigation.state.params.numOfChapters), (x,i) => i+1),
    }
    //  console.log("bookdata"+ this.state.bookData)
    this.styles = numberSelection(props.screenProps.colorFile, props.screenProps.sizeFile);   
  }
  //get no of chapters from api
  async componentDidMount(){

  var response = await APIFetch.getNumberOfChapter(22,this.props.navigation.state.params.bookId)
  console.log("chapters"+JSON.stringify(response))
    var chapters = []
      for(var i=0; i<response.length;i++){
        var number = response[i].chapter.number
        console.log("number chapter "+JSON.stringify(response[i].chapter.number))
        chapters.push(number)
      }
      this.setState({chapterData:chapters})
  }

  onNumPress(item) {
    var time =  new Date()
    DbQueries.addHistory(this.props.screenProps.languageName, this.props.screenProps.versionCode, 
    this.state.bookId, item, time)
    this.props.screenProps.updateBookData(this.state.bookId, this.state.bookName,item,this.state.bookNumber)
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Bible' })]
    })
    this.props.navigation.dispatch(resetAction)
    this.props.navigation.replace('Bible', {bookId: this.state.bookId, bookNumber:this.state.bookNumber,
      bookName: this.state.bookName, chapterNumber: item })
  }

  
  render() {
    console.log("book data "+JSON.stringify(this.state.chapterData))
    return (
      <View style={this.styles.chapterSelectionContainer}>
        <FlatList
        numColumns={4}
        data={this.state.chapterData}
        renderItem={({item}) => 
        <TouchableOpacity 
        style={this.styles.chapterSelectionTouchable}
          onPress={()=> this.onNumPress(item)}
          >
            <View style={{flex:0.25,borderColor:'black',borderRightWidth:1, borderBottomWidth:1,
            height:width/4, justifyContent:"center"}}>
                <Text style={this.styles.chapterNum}>{item}</Text>
            </View>
            </TouchableOpacity>
        }
      />
      </View>
    );
  }
};