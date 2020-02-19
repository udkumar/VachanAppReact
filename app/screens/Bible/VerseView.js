import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated
} from 'react-native';
const Constants = require('../../utils/constants')

export default class VerseView extends Component {
  constructor(){
    super()
    this.Animation = new Animated.Value(0);
  }
  onPress() {
    this.props.getSelection(
        this.props.index, 
        this.props.chapterNumber,
        this.props.verseData.number,
        this.props.verseData.text
    );
  }
  matchedVerse = () =>{
    this.Animation.setValue(0);
    Animated.timing(
        this.Animation,
        {
            toValue: 1,
            duration: 4000
        }
    ).start();
  }
  componentDidMount(){
    this.matchedVerse()
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


    const BackgroundColorConfig = this.Animation.interpolate(
      {
          inputRange: [ 0, 1 ],
          
          outputRange: [ '#3F51B5', '#fff', ]

      });

        return (
          <Animated.Text onPress={() => {this.onPress()}} style={{backgroundColor: (this.props.verseSelected == this.props.verseData.number) ?  BackgroundColorConfig : '#fff'}}>
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
          </Animated.Text>
        );
     
  }
}