import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DbQueries from '../../../../utils/dbQueries'
import {getBookNameFromMapping} from '../../../../utils/UtilFunctions';
import { highlightstyle } from './styles'

export default class HighLights extends Component {
  static navigationOptions = {
    headerTitle: 'Highlights',
    headerRight:(
      <View style={{flexDirection:"row",justifyContent:"flex-end"}}>
      <TextInput
      // placeholder="Search"
      underlineColorAndroid = '#fff'
      placeholderTextColor={'#fff'} 
      returnKeyType="search"
      multiline={false}
      numberOfLines={1}
      style={{width:Dimensions.get('window').width/4}}
     
    />
      <Icon name='search' color="#fff" size={28} style={{marginHorizontal:8}} />
    </View>
    )
  };

  constructor(props) {
    super(props)
    this.styles = highlightstyle(props.screenProps.colorFile, props.screenProps.sizeFile);  
    
  }


  render() {
    console.log("langugueg name "+this.props.screenProps.languageName)
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
        onPress = { ()=> {this.props.screenProps.changeBookFromSplit(this.props.screenProps.bookId,item.chapterNumber)}}
      >
         <Text style={this.styles.hightlightsText}>
          {getBookNameFromMapping(this.props.screenProps.bookId,this.props.screenProps.languageName)} {':'} {item.chapterNumber} {':'} {item.verseNumber}
          </Text>
        <Icon name='delete-forever' style={this.styles.iconCustom}  onPress={() => {this.props.screenProps.removeHighlight(item.chapterNumber,item.verseNumber)}} />
      </TouchableOpacity>
    }
      />
      </View>
    );
  }
}
