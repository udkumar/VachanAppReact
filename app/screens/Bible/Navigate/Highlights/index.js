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
    // headerRight:(
    //   <View style={{flexDirection:"row",justifyContent:"flex-end"}}>
    //   <TextInput
    //   // placeholder="Search"
    //   underlineColorAndroid = '#fff'
    //   placeholderTextColor={'#fff'} 
    //   returnKeyType="search"
    //   multiline={false}
    //   numberOfLines={1}
    //   style={{width:Dimensions.get('window').width/4}}
     
    // />
    //   <Icon name='search' color="#fff" size={28} style={{marginHorizontal:8}} />
    // </View>
    // )
  };

  constructor(props) {
    super(props)
    this.state = {
      HightlightedVerseArray:[],
      languageName:this.props.navigation.state.params.languageName,
      versionCode:this.props.navigation.state.params.versionCode,
      bookId:this.props.navigation.state.params.bookId
    }
    this.styles = highlightstyle(props.screenProps.colorFile, props.screenProps.sizeFile);  
    
  }
  async getHighlights(){
    let model2 = await  DbQueries.queryHighlights(this.state.languageName,this.state.versionCode,this.state.bookId)
    if(model2  == null ){
    }
    else{
      if(model2.length > 0){
        for(var i = 0; i<=model2.length-1;i++){
          this.setState({
            HightlightedVerseArray:[...this.state.HightlightedVerseArray,{"chapterNumber":model2[i].chapterNumber,"verseNumber":model2[i].verseNumber}]
          })
        }
      }
  }
  }
  removeHighlight = async( chapterNum,verseNum)=>{
    for(var i=0; i<=this.state.HightlightedVerseArray.length-1; i++){
      if(this.state.HightlightedVerseArray[i].chapterNumber == chapterNum && this.state.HightlightedVerseArray[i].verseNumber == verseNum){
        this.state.HightlightedVerseArray.splice(i, 1)
        await DbQueries.updateHighlightsInVerse(this.state.languageName, this.state.versionCode,this.state.bookId,chapterNum,verseNum,false)
        this.setState({HightlightedVerseArray:this.state.HightlightedVerseArray})
      }
    }
  }


  render() {
    console.log("langugueg name "+this.state.languageName)
    return (
      <View style={this.styles.container}>
      <FlatList
      contentContainerStyle={this.state.HightlightedVerseArray.length === 0 && this.styles.centerEmptySet}
      data={this.state.HightlightedVerseArray}
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
        // onPress = { ()=> {this.navigateToBible(item.bookId,item.chapterNumber)}}
      >
         <Text style={this.styles.hightlightsText}>
          {getBookNameFromMapping(this.state.bookId,this.state.languageName)} {':'} {item.chapterNumber} {':'} {item.verseNumber}
          </Text>
        <Icon name='delete-forever' style={this.styles.iconCustom}  onPress={() => {this.removeHighlight(item.chapterNumber,item.verseNumber)}} />
      </TouchableOpacity>
    }
      />
      </View>
    );
  }
}
