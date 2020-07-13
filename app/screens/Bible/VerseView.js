import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated
} from 'react-native';
const Constants = require('../../utils/constants')
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { array } from 'prop-types';

import {getResultText}  from  '../../utils/UtilFunctions'
  
// import { styles } from './styles.js';


class VerseView extends Component {
  constructor(props){
    super(props)
      this.itemHeights =[]
    // this.Animation = new Animated.Value(0);
    // this.styles = styles(this.props.colorFile, this.props.sizeFile);    

  }
  onPress() {
    this.props.getSelection(
        this.props.index, 
        this.props.chapterNumber,
        this.props.verseData.number,
        this.props.verseData.text
    );
  }
  // matchedVerse = () =>{
  //   this.Animation.setValue(0);
  //   Animated.timing(
  //       this.Animation,
  //       {
  //           toValue: 1,
  //           duration: 2000
  //       }
  //   ).start();
  // }
  // componentDidMount(){
  //   this.matchedVerse()
  // }
  has(selectedReferences, obj) {
    for(var i = 0; i < selectedReferences.length; i++) {
      if (selectedReferences[i] == obj) {
        return true;
      }
    }
    return false;
  }
  isHighlight(){
      for(var i = 0 ; i<=this.props.HightlightedVerse.length; i++ ){
        if(this.props.HightlightedVerse[i] == this.props.verseData.number){
          return true
          }
      }
    return false
  }
  // isNoted(){
  //   var arr =[]
  //   for(var i = 0 ;i<=this.props.notesList.length-1; i++ ){
  //     for(var j = 0 ;j<=this.props.notesList[i].verses.length-1; j++ ){
  //       var index = arr.indexOf(this.props.notesList[i].verses[j])
  //       if(index == -1){
  //         arr.push(this.props.notesList[i].verses[j])
  //       }
  //     }
  //     }
  //   var value = arr.filter(v=> v == this.props.verseData.number)
  //   if(value[0]){
  //     return true
  //   }
  //   else{ 
  //     return false
  //   }
  // }
  render() {
    let obj = this.props.chapterNumber + '_' + this.props.index + '_' + this.props.verseData.number+ '_' +this.props.verseData.text;
    let isSelect = this.has(this.props.selectedReferences, obj)
    let isHighlight = this.isHighlight()
      if(this.props.verseData.number == 1){
        return (
          <Text style ={this.props.styles.textStyle} onPress={() => {this.onPress()}}  
          >
          <Text style={this.props.styles.sectionHeading}>
            {this.props.verseData.metadata ? (this.props.verseData.metadata[0].section && this.props.verseData.metadata[0].section.text+"\n") : null }
          </Text>
          <Text style={this.props.styles.verseChapterNumber}>
        {this.props.chapterNumber}{" "}
          </Text>
        <Text style={ [isSelect && isHighlight 
                ? this.props.styles.verseTextSelectedHighlighted 
                : !isSelect && !isHighlight 
                ? this.props.styles.verseTextNotSelectedNotHighlighted
                : !isSelect && isHighlight
                ? this.props.styles.verseTextNotSelectedHighlighted
                : this.props.styles.verseTextSelectedNotHighlighted,
              ]}
                >
          {getResultText(this.props.verseData.text)}
        </Text> 
        {/* {isNoted ? <Icon name="note-outline" size={20} style={{padding:8}} /> :null}  */}
          </Text>
        )
      }
        return (
          <Text style ={this.props.styles.textStyle} onPress={() => {this.onPress()}} 
            >
          <Text style={this.props.styles.sectionHeading}>
          {this.props.verseData.metadata ? (this.props.verseData.metadata[0].section && this.props.verseData.metadata[0].section.text+"\n"): null }
          </Text>
            <Text style={this.props.styles.verseNumber}>
              {this.props.verseData.number}{" "}
            </Text>
            <Text style={[isSelect && isHighlight 
                    ? this.props.styles.verseTextSelectedHighlighted 
                    : !isSelect && !isHighlight 
                    ? this.props.styles.verseTextNotSelectedNotHighlighted
                    : !isSelect && isHighlight
                    ? this.props.styles.verseTextNotSelectedHighlighted
                    : this.props.styles.verseTextSelectedNotHighlighted,
                  ]}
              >
              {getResultText(this.props.verseData.text) } 
            </Text>   
            {/* {isNoted ? <Icon name="note-outline" size={20} style={{padding:8}} /> :null}  */}
          </Text>
        )
  }
}

const mapStateToProps = state =>{
  return{

    // chapterNumber:state.updateVersion.chapterNumber,
    bookId:state.updateVersion.bookId,
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,

  }
}

export  default connect(mapStateToProps,null)(VerseView)