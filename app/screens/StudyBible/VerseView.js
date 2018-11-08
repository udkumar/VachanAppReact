import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
const Constants = require('../../utils/constants')

export default class VerseView extends Component {

  render() {
    switch(this.props.verseData.type) {
      
      case Constants.MarkerTypes.MARKER_INTRO_SECTION: {
        return (
            <Text style={{fontWeight:"bold",margin:8}} >
               {this.props.verseData.introText}
          </Text>
        );
      }
      case Constants.MarkerTypes.MARKER_INTRO_PARAGRAPH: {
              return (
                <Text style={{margin:8}} >
                {this.props.verseData.introText}
              </Text>
            )
      }
      case Constants.MarkerTypes. MARKER_INTRO_OUTLINE_TITLE: {
        return (
            <Text style={{fontWeight:"bold",margin:8}} >
               {this.props.verseData.introText}
          </Text>
        );
      }
      case Constants.MarkerTypes.MARKER_INTRO_OUTLINE_CONTENT: {
              return (
                <Text style={{margin:8}} >
                {this.props.verseData.introText}
              </Text>
            )
      }
     
      default: {
      return<Text>{null}</Text>;
      }
    }
  }
}