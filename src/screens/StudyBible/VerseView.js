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
      
      case Constants.MarkerTypes.MARKER_FOOT_NOTES_QUOTATION: {
        return (
            <Text style={{fontWeight:"bold",margin:8}} >
              {this.props.verseData.verseNumber} {this.props.verseData.text}
          </Text>
        );
      }
      case Constants.MarkerTypes.MARKER_FOOT_NOTES_TEXT: {
              return (
                <Text style={{margin:8}} >
                {this.props.verseData.text}
              </Text>
            )
      }
     
      default: {
      return <Text>{}</Text>;
      }
    }
  }
}