import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, Alert} from 'react-native';
import HTMLParser from'../utils/HTMLParser'

export default class AddData extends Component {

  componentDidMount(){
    const parser = new HTMLParser()
    parser.parseFile()
  }
  render() {
    return (
     <Text>Hi</Text>
    );
  }
}





