import React, { Component } from 'react';
import {
  Text,
  View,
  Linking,
  ScrollView
} from 'react-native';

import USFMParser from './USFMParser'
import DbQueries from './dbQueries'
import TextParser from './TextParser'

export default class AddData extends Component {

  componentDidMount(){
    // parseFile
    const usfmText = new TextParser()
      usfmText.parseFile()
    // const usfmParse = new USFMParser()
      // usfmParse.parseFile()
    // DbQueries.deleteLanguage("HIN", "IRV")
  }
  render() {
    return (
        <Text>hello</Text>
    )
  }
}
