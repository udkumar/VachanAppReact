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
import {AsyncStorageConstants} from '../../utils/AsyncStorageConstants'
import AsyncStorageUtil from '../../utils/AsyncStorageUtil'

import {getBookChaptersFromMapping} from '../../utils/UtilFunctions';


export default class ChapterSelection extends Component {

  constructor(props){
    super(props)

    this.state = {
      bookId: this.props.screenProps.bookId,
     
      chapterData:[]
    }
    //  console.log("bookdata"+ this.state.bookData)
    this.styles = numberSelection(props.screenProps.colorFile, props.screenProps.sizeFile);   
    // this.onNumPress = this.onNumPress.bind(this)
  }
  //get no of chapters from api
  //  componentWillReceiveProps(){
  //   this.fetchChapters()
  // }
  async componentWillReceiveProps(props){
    console.log(" componentWillReceiveProps ",props.screenProps.bookId)
    var totalChapter = props.screenProps.totalChapters
    var chapterData = []
    for(var i=1;i<=totalChapter;i++){
      chapterData.push(i)
  }
  this.setState({chapterData})

  // this.fetchChapters()
  }
  componentDidMount(){
    console.log("DID MOUNT CALLING CHAPTER PAGE ",this.props.screenProps.bookId)
    this.fetchChapters()
  }
  async fetchChapters(){
    var totalChapter = getBookChaptersFromMapping(this.props.screenProps.bookId)

    var chapterData = []
    for(var i=1;i<=totalChapter;i++){
      chapterData.push(i)
  }
  this.setState({chapterData})
    // console.log("chapternumber ",this.props.screenProps.totalNumberOfChapter)
  // var response = await APIFetch.getNumberOfChapter(this.props.screenProps.sourceId,this.state.bookId)
  //   var chapters = []
  //     for(var i=0; i<response.length;i++){
  //       var number = response[i].chapter.number
  //       console.log("number chapter "+JSON.stringify(response[i].chapter.number))
  //       chapters.push(number)
  //     }
  //     this.setState({chapterData:chapters})
}

  onNumPress(item){
    var time =  new Date()
    DbQueries.addHistory(this.props.screenProps.languageName, this.props.screenProps.versionCode, 
    this.state.bookId, item, time)
    // const resetAction = NavigationActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName: 'Bible' })]
    // })
    // this.props.navigation.dispatch(resetAction)
    // this.props.navigation.replace('Bible', {bookId: this.state.bookId, bookNumber:this.state.bookNumber,
      // bookName: this.state.bookName, chapterNumber: item })
      AsyncStorageUtil.setItem(AsyncStorageConstants.Keys.ChapterNumber, item); 
      this.props.screenProps.updateSelectedChapter(item)
      this.props.navigation.navigate('Verses',)
  }

  
  render() {
    console.log("book id  ",this.props.screenProps.bookId)
    console.log("chapter number ",this.state.chapterData.length)
    return (
      
      <View style={this.styles.chapterSelectionContainer}>
        <FlatList
        numColumns={4}
        data={this.state.chapterData}
        renderItem={({item}) => 
        <TouchableOpacity 
        style={this.styles.chapterSelectionTouchable}
          onPress={()=>{this.onNumPress(item)}}>
            <View
            //  style={{flex:0.25,borderColor:'black',borderRightWidth:1, borderBottomWidth:1,
            // height:width/4, justifyContent:"center"}}
            >
                <Text style={[this.styles.chapterNum,{fontWeight: item == this.props.screenProps.chapterNumber ? "bold":"normal"}]}>{item}</Text>
            </View>
            </TouchableOpacity>
        }
      />
      </View>
    );
  }
};