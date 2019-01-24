import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions
} from 'react-native';

export default class SelectChapter extends Component {

  constructor(props){
    super(props)
    console.log("props SELECT  CHAPTER : "+JSON.stringify(props.screenProps))

    this.onChapterSelected = this.onChapterSelected.bind(this)
    
    this.state = {
      numOfChapters: this.props.screenProps.numOfChapters,
      bookData: Array.from(new Array(this.props.screenProps.numOfChapters), (x,i) => i+1),
      selectedIndex: 0,
    }
    
  }

  onChapterSelected(item, index) {
    this.setState({selectedIndex: index})
    // shift to tab 2
    console.log("on select" + index)
    this.props.screenProps.updateSelectedChapter(index, item)
    this.props.navigation.navigate('TabItemVerse');
  }
  
  render() {
    var styles = this.props.screenProps.styles
    return (
      <View style={styles.tabContainer}>
        <FlatList
        numColumns={4}
        data={this.state.bookData}
        renderItem={({item, index}) => 
        <TouchableOpacity style={[styles.selectGridNum,
          {backgroundColor:'transparent'}]}
          onPress={()=>this.onChapterSelected(item, index)}
          >
                <Text style={[styles.selectText, 
                  {fontWeight: this.state.selectedIndex == index ? "bold" : "normal"}]}>{item}</Text>
            </TouchableOpacity>
        }
      />
      </View>
    );
  }
};