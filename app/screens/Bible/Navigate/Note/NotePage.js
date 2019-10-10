import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Dimensions,
  FlatList,
  WebView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Card, CardItem, Content, Right, Left } from 'native-base';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import DbQueries from '../../../../utils/dbQueries'
import { noteStyle } from './styles.js';

var moment = require('moment');

export default class NotePage extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTitle: 'My Content',
    headerRight:(
      <TouchableOpacity style={{margin:8}} >
         <Icon name="note-add" size={24} color="#fff"/>
     </TouchableOpacity>
    )
  });

  constructor(props){
    super(props);
    this.state = {
      colorFile:this.props.screenProps.colorFile,
    }
    this.styles = noteStyle(props.screenProps.colorFile, props.screenProps.sizeFile);   
    
  }

 

  render() {
    return (
      <View style={this.styles.container}>
        <Text style={{fontWeight:'bold',fontSize:20}}> {this.props.navigation.state.params.note.bookId}  {this.props.navigation.state.params.note.chapterNumber}  {this.props.navigation.state.params.note.verseNumber}</Text>
      </View>

    );
  }
}


