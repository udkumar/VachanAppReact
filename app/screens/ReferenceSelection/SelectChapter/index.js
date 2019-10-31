import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import DbQueries from '../../../utils/dbQueries'
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import {NavigationActions} from 'react-navigation'
import APIFetch from '../../../utils/APIFetch'
import { numberSelection } from './styles.js';

import {getBookChaptersFromMapping} from '../../../utils/UtilFunctions';

import {connect} from 'react-redux'
import {selectedChapter} from '../../../store/action/'



class ChapterSelection extends Component {

  constructor(props){
    super(props)

    this.state = {
      chapterData:[]
    }
    this.styles = numberSelection(this.props.screenProps.colorFile, this.props.screenProps.sizeFile);   
  }

  componentWillReceiveProps(props){
    var chapterData = []
    for(var i=1;i<=props.totalChapters;i++){
      chapterData.push(i)
  }
  this.setState({chapterData})

  }
  componentDidMount(){
    var chapterData = []
    for(var i=1;i<=this.props.totalChapters;i++){
      chapterData.push(i)
  }
  this.setState({chapterData})
  }

  async onNumPress(item){
    var time =  new Date()
    DbQueries.addHistory(this.props.language, this.props.version, 
    this.props.bookId, item, time)

    try{
      let response =  await APIFetch.getChapterContent(this.props.sourceId,this.props.bookId,item)
      if(response.length != 0){
        // console.log("res",response.chapterContent.verses[vNum-1].text)
        if(response.success == false){
          alert("response success false")
        }else{
          console.log("item length  ",response.chapterContent.verses.length)
          // this.props.screenProps.updateSelectedChapter(item,response.chapterContent.verses.length)
          this.props.selectedChapter(item,response.chapterContent.verses.length)
          this.props.navigation.navigate('Verses')

        }
      }
    }
      catch(error){
        console.log(error)
      }
    // const resetAction = NavigationActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName: 'Bible' })]
    // })
    // this.props.navigation.dispatch(resetAction)
    // this.props.navigation.replace('Bible', {bookId: this.state.bookId, bookNumber:this.state.bookNumber,
      // bookName: this.state.bookName, chapterNumber: item })
    
  }

  
  render() {
    return (
      <View style={this.styles.chapterSelectionContainer}>
        <FlatList
        numColumns={4}
        data={this.state.chapterData}
        renderItem={({item}) => 
        <TouchableOpacity 
        style={this.styles.chapterSelectionTouchable}
          onPress={()=>{this.onNumPress(item)}}>
            <View>
                <Text style={[this.styles.chapterNum,{fontWeight: item == this.props.screenProps.chapterNumber ? "bold":"normal"}]}>{item}</Text>
            </View>
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
    
    bookId:state.selectReference.bookId,
    bookName:state.selectReference.bookName,
    totalChapters:state.selectReference.totalChapters
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    selectedChapter: (chapterNumber,totalVerses)=>dispatch(selectedChapter(chapterNumber,totalVerses)),
  }
}
export  default connect(mapStateToProps,mapDispatchToProps)(ChapterSelection)