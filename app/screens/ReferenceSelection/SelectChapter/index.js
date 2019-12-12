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


class ChapterSelection extends Component {

  constructor(props){
    super(props)

    this.state = {
      isLoading:false,
      chapterData:[]
    }
    this.styles = numberSelection(this.props.colorFile, this.props.sizeFile);   
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

   onNumPress(item){

    var time =  new Date()
    DbQueries.addHistory(this.props.language, this.props.version, 
    this.props.bookId, item, time)
    this.setState({isLoading:true},async()=>{
    try{
      if(this.props.downloaded == true ){
        let response = await DbQueries.queryVersions(this.props.language,this.props.version,this.props.bookId,item)
        if(response.length != 0){
          this.props.selectedChapter(item,response[0].verses.length)
        }
        else{
          alert("no book found of ",this.props.bookId)
        }
      }
      else{
        let response =  await APIFetch.getChapterContent(this.props.sourceId,this.props.bookId,item)
        if(response.length != 0){
          if(response.success == false){
            alert("response success false")
          }else{
            console.log("item length  ",response.chapterContent.verses.length)
            this.props.selectedChapter(item,response.chapterContent.verses.length)
  
          }
        }
      }
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
    return (
      <View style={this.styles.chapterSelectionContainer}>
      {this.state.isLoading && 
         <Spinner
         visible={true}
         textContent={'Loading...'}
        //  textStyle={styles.spinnerTextStyle}
      />}
        <FlatList

        numColumns={4}
        data={this.state.chapterData}
        renderItem={({item}) => 
        <TouchableOpacity 
        style={[this.styles.selectGridNum,
          {backgroundColor:'transparent'}]}
          onPress={()=>{this.onNumPress(item)}}>
            <View>
                <Text style={[this.styles.chapterNum,{fontWeight: item == this.props.chapterNumber ? "bold":"normal"}]}>{item}</Text>
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

    
    bookId:state.updateVersion.bookId,
    bookName:state.updateVersion.bookName,
    totalChapters:state.updateVersion.totalChapters,
    chapterNumber:state.updateVersion.chapterNumber,
    
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