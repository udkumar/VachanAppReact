import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DbQueries from '../../utils/dbQueries'
import {getBookNameFromMapping} from '../../utils/UtilFunctions';
import id_name_map from '../../assets/mappings.json'
import {constantFont} from '../../utils/dimens.js'
import { highlightstyle } from './styles'

export default class HighLights extends Component {
  static navigationOptions = {
    headerTitle: 'Highlights',
  };

  constructor(props) {
    super(props)

    this.mappingData = id_name_map;
    this.styles = highlightstyle(props.screenProps.colorFile, props.screenProps.sizeFile);  
    
  }


  render() {
    return (
      <View style={this.styles.container}>
      <FlatList
      contentContainerStyle={this.props.screenProps.HightlightedVerseArray.length === 0 && this.styles.centerEmptySet}
      data={this.props.screenProps.HightlightedVerseArray}
      ListEmptyComponent={
        <View style={this.styles.emptyMessageContainer}>
        <Icon name="border-color" style={this.styles.emptyMessageIcon}/>
          <Text
            style={this.styles.messageEmpty}
          >
           No reference highlighted</Text>
        </View>
       
        }
      // getItemLayout={this.getItemLayout}
      renderItem={({item, index}) =>
      <TouchableOpacity style={this.styles.highlightsView}
        // onPress={()=>this.props.navigation.navigate('Bible', {bookId: item.bookId, 
        //   bookName: getBookNameFromMapping(item.bookId), 
        //   chapterNumber: item.chapterNumber, verseNumber: item.verseNumber,
        //   updateHighlights:this.updateHighlights,prevScreen:'highlights'
        //   })}
          >
         <Text style={this.styles.hightlightsText}>
          {getBookNameFromMapping(item.bookId)} {':'} {item.chapterNumber} {':'} {item.verseNumber}
          </Text>
        <Icon name='delete-forever' style={this.styles.iconCustom}  onPress={() => {this.props.screenProps.removeHighlight(item.chapterNumber,item.verseNumber)}} />
      </TouchableOpacity>
    }
      />
      </View>
    );
  }
}
