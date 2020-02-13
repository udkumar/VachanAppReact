import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
const Constants = require('../../utils/constants')

export default class VerseView extends Component {

  onPress() {
    this.props.getSelection(
        this.props.index, 
        this.props.chapterNumber,
        this.props.verseData.number,
        this.props.verseData.text
    );
  }

  has(selectedReferences, obj) {
    for(var i = 0; i < selectedReferences.length; i++) {
      if (selectedReferences[i] == obj) {
        return true;
      }
    }
    return false;
  }
  isHighlight(){
    for(var i = 0 ;i<this.props.HightlightedVerse.length; i++ ){
        if( this.props.HightlightedVerse[i].bookId  == this.props.bookId && this.props.HightlightedVerse[i].verseNumber == this.props.verseData.number && this.props.chapterNumber == this.props.HightlightedVerse[i].chapterNumber){
          return true
        }
       
    }
    return false
  }
  render() {
    let obj = this.props.chapterNumber + '_' + this.props.index + '_' + this.props.verseData.number+ '_' +this.props.verseData.text;
    let isSelect = this.has(this.props.selectedReferences, obj)
    let isHighlight = this.isHighlight()
        return (
          <Text onPress={() => {this.onPress()}}>
            <Text style={this.props.styles.verseNumber} >
              {this.props.verseData.number}{" "}
            </Text>
            <Text style={ [isSelect && isHighlight 
                    ? this.props.styles.verseTextSelectedHighlighted 
                    : !isSelect && !isHighlight 
                    ? this.props.styles.verseTextNotSelectedNotHighlighted
                    : !isSelect && isHighlight
                    ? this.props.styles.verseTextNotSelectedHighlighted
                    : this.props.styles.verseTextSelectedNotHighlighted,{fontFamily:'NotoSans-Regular'}]}
                    >
              {/* {this.getResultText(this.props.verseData.text)} */}
              {this.props.verseData.text}
            </Text>         
          </Text>
        );
     
  }
}