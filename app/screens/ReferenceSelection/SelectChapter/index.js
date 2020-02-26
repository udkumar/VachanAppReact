import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';

import SelectionGrid from '../../../components/SelectionGrid/';
import { numberSelection } from './styles.js';
import {connect} from 'react-redux'


class ChapterSelection extends Component {

  constructor(props){
    super(props)
    console.log("props navigation",this.props.screenProps.totalChapters )
    this.state = {
      numOfChapters:this.props.screenProps.numOfChapters,
      chapterData:Array.from(new Array(this.props.screenProps.numOfChapters.length == 0 ? this.props.screenProps.totalChapters : this.props.screenProps.numOfChapters.length ), (x,i) => i+1),
    }
    this.styles = numberSelection(this.props.colorFile, this.props.sizeFile);   
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.screenProps.numOfChapters !== prevState.numOfChapters){
      return{chapterData:Array.from(new Array(nextProps.screenProps.numOfChapters.length == 0 ? nextProps.screenProps.totalChapters : nextProps.screenProps.numOfChapters.length), (x,i) => i+1)}
    }
    else{
      return{chapterData:Array.from(new Array( nextProps.screenProps.totalChapters), (x,i) => i+1)}
    }
  }
   onNumPress=(item,index)=>{
    this.props.screenProps.updateSelectedChapter(item,index)
    this.props.navigation.navigate('Verses')
  }
  render() {
    console.log("value ",this.state.chapterData," total chapters ",this.props.screenProps.totalChapters)
    return (
      <SelectionGrid
      styles={this.styles}
      onNumPress={(item,index)=>{this.onNumPress(item,index)}}
      numbers={this.state.chapterData}
      />
    )
  }
}
const mapStateToProps = state =>{
  return{
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
  }
}
 export default connect(mapStateToProps,null)(ChapterSelection)