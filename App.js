
import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, Text, View} from 'react-native';
import Book from './src/screens/Book'
const width = Dimensions.get('window').width;


export default class App extends Component {
  
  render() {
    return (
              <Book/>
          )
  }
}


