import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Share,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {createResponder } from 'react-native-gesture-responder';

import DbQueries from '../../utils/dbQueries'
import VerseView from './VerseView'
import AsyncStorageUtil from '../../utils/AsyncStorageUtil';
import AsyncStorageConstants from '../../utils/AsyncStorageConstants';
const Constants = require('../../utils/constants')
import { styles } from './styles.js';
import id_name_map from '../../assets/mappings.json'
import {NavigationActions} from 'react-navigation'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class Book extends Component {

  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <TouchableOpacity 
          name={'bookmark'} 
          color={navigation.state.params.isBookmark ? "red" : "white"} 
          size={24} 
          style={{marginHorizontal:8}} 
      >
      <Text style={{fontSize:18,color:"white"}}>{navigation.state.params.bookName}</Text>
      </TouchableOpacity>      
    ),
  })
  constructor(props) {
    super(props);

    this.queryBook = this.queryBook.bind(this)
    // this.updateCurrentChapter =this.updateCurrentChapter.bind(this)

    this.state = {
      languageCode: this.props.screenProps.languageCode,
      versionCode: this.props.screenProps.versionCode,
      modelData: [],
      bookIntro:[],
      isLoading: false,
      bookId: this.props.navigation.state.params.bookId,
      bookName: this.props.navigation.state.params.bookName,
      currentVisibleChapter: this.props.navigation.state.params.chapterNumber,

      colorFile:this.props.screenProps.colorFile,
      sizeFile:this.props.screenProps.sizeFile,


      notesData:[]
    }

    this.pinchDiff = 0
    this.pinchTime = new Date().getTime()
    this.styles = styles(this.state.colorFile, this.state.sizeFile);    

  }

  


  componentDidMount() {
    this.setState({isLoading: true}, () => {
      this.queryBook()
    })
  }
  
  async queryBook() {
    let model = await DbQueries.queryBookWithId(this.state.versionCode, 
        this.state.languageCode, this.state.bookId);
    this.setState({isLoading:false})
    if (model == null) {
      // console.log("mode lnull")
    } else {
      if (model.length > 0) {
        this.setState({
          modelData: model[0].chapterModels,bookIntro:model[0].bookIntroModels}
             
        )
      }
      var notesData = []
              var quotationText = null
              for(i=0 ; i<=model[0].chapterModels[this.state.currentVisibleChapter - 1].verseComponentsModels.length-1; i++){
                this.state.modelData[this.state.currentVisibleChapter - 1].verseComponentsModels[i]
              if(this.state.modelData[this.state.currentVisibleChapter - 1].verseComponentsModels[i].type == Constants.MarkerTypes.MARKER_FOOT_NOTES_QUOTATION){
                  console.log("foot not quotation "+this.state.modelData[this.state.currentVisibleChapter - 1].verseComponentsModels[i].text)
                  quotationText=this.state.modelData[this.state.currentVisibleChapter - 1].verseComponentsModels[i].text
             
              }
              if(this.state.modelData[this.state.currentVisibleChapter - 1].verseComponentsModels[i].type == Constants.MarkerTypes.MARKER_FOOT_NOTES_TEXT){
                console.log("foot note text "+this.state.modelData[this.state.currentVisibleChapter - 1].verseComponentsModels[i].text)
                notesData.push({
                  'quotationText':quotationText,
                  'notesText':this.state.modelData[this.state.currentVisibleChapter - 1].verseComponentsModels[i].text,
                  'verseNumber':this.state.modelData[this.state.currentVisibleChapter - 1].verseComponentsModels[i].verseNumber
                })
              }
              this.setState({notesData})
             }
    }
  }

  async onBookmarkPress() {
    var index = this.state.bookmarksList.indexOf(this.state.currentVisibleChapter);
    await DbQueries.updateBookmarkInBook(this.state.bookmarksList, this.state.currentVisibleChapter, index > -1 ? false : true);
    this.setState({isBookmark: index > -1 ? false : true}, () => {
        this.props.navigation.setParams({isBookmark: this.state.isBookmark,modalVisible:false})      
    })

  }

  getBookNameFromMapping(bookId) {
    var obj = this.mappingData.id_name_map;
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (key == bookId) {
                var val = obj[key];
                return val.book_name;
            }
        }
    }
    return null;
  }
 
 

 
  render() {
    console.log("book intro ductio part "+JSON.stringify(this.state.bookIntro))
      return (
        <View style={this.styles.container}>
        {this.state.notesData.length>0 && this.state.bookIntro.length> 0 ? 
            <View style={{flex:1}}>
                <ScrollView>
                  {
                    this.state.currentVisibleChapter == 1 ? 
                      <FlatList
                      data={this.state.bookIntro}
                      renderItem={({ item,index }) => (
                        <VerseView
                          verseData = {item}
                          index = {index}
                      />
                      )}
                        />:null
                  }
              
                <FlatList
                data={this.state.notesData}
                renderItem={({ item }) => (
                  <Text style={{margin:8,alignItems:'center',justifyContent:'center'}}>
                    <Text>{item.verseNumber}<Text style={{fontWeight:'bold'}}>{item.quotationText}</Text>: {item.notesText}</Text>
                  </Text>
                )}
                  />
                </ScrollView>
              
            </View>
               : 
            <ActivityIndicator 
            animating={this.state.isLoading ? true : false} 
            size="large" 
            color="#0000ff" />
         }
        </View>
      );
  }

}


