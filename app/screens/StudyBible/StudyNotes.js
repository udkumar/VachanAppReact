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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {createResponder } from 'react-native-gesture-responder';

import DbQueries from '../../utils/dbQueries'
import VerseView from './VerseView'
import AsyncStorageUtil from '../../utils/AsyncStorageUtil';
import AsyncStorageConstants from '../../utils/AsyncStorageConstants';
const Constants = require('../../utils/constants')

import {getResultText} from '../../utils/UtilFunctions';

import { styles } from './styles.js';
import id_name_map from '../../assets/mappings.json'
import {NavigationActions} from 'react-navigation'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class StudyNotes extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTitle: navigation.state.params.bookName,
    headerRight: (
      <Icon 
          onPress={()=> {navigation.state.params.onIconPress()}} 
          name={'bookmark'} 
          color={navigation.state.params.isBookmark ? "red" : "white"} 
          size={24} 
          style={{marginHorizontal:8}} 
      />      
    ),
  });

  constructor(props) {
    super(props);
    console.log("PROPS IN BOOKS "+JSON.stringify(props))
    console.log()
    this.queryBook = this.queryBook.bind(this)

    this.state = {
      languageCode: this.props.screenProps.languageCode,
      versionCode: this.props.screenProps.versionCode,
      modelData: [],
      isLoading: false,
      bookId: this.props.navigation.state.params.bookId,
      bookName: this.props.navigation.state.params.bookName,
      bookmarksList: [],
      currentVisibleChapter: this.props.navigation.state.params.chapterNumber,

      colorFile:this.props.screenProps.colorFile,
      sizeFile:this.props.screenProps.sizeFile,

    }

    this.styles = styles(this.state.colorFile, this.state.sizeFile);    

  }

  
  

  componentDidMount() {
    this.setState({isLoading: true}, () => {
      this.queryBook()
    })
  }
  
  async queryBook() {
    let model = await DbQueries.queryBookWithId(this.props.screenProps.versionCode, 
        this.props.screenProps.languageCode, this.state.bookId);
    this.setState({isLoading:false})
        console.log("book chappter "+model)
      if (model == null) {
      // console.log("mode lnull")
    } else {
      if (model.length > 0) {
        this.setState({modelData: model[0].chapterModels, bookmarksList: model[0].bookmarksList}, () => {
              this.setState({isBookmark: this.state.bookmarksList.indexOf(this.state.currentVisibleChapter) > -1}, () => {
                this.props.navigation.setParams({isBookmark: this.state.isBookmark})      
              })
        })
      }
    }
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
 
  // componentWillUnmount(){
  //   let lastRead = {
  //       languageCode:this.state.languageCode,
  //       versionCode:this.state.versionCode,
  //       bookId:this.state.bookId,
  //       chapterNumber:this.state.currentVisibleChapter,
  //   }
  //   AsyncStorageUtil.setItem(AsyncStorageConstants.Keys.LastReadReference, lastRead);
  //   this.props.screenProps.updateLastRead(lastRead);
  //   console.log("this.props.navigation back book page "+JSON.stringify(this.props))
  //   // sceneProps.scene.route.routeName 

  //   if(this.props.navigation.state.params.prevScreen =='bookmark'){
  //     this.props.navigation.state.params.updateBookmark()
  //   }
  //   else if(this.props.navigation.state.params.prevScreen == 'highlights'){
  //     this.props.navigation.state.params.updateHighlights()
  //   }
   
  // }

 
  render() {
    // console.log("this.state.modelData[this.state.currentVisibleChapter - 1].verseComponentsModels "+JSON.stringify(this.state.modelData))
      return (
        <View>
        {this.state.modelData.length>0 ? 
            <View>

                <ScrollView
                >
                  <View>
                            <FlatList
                            data={this.state.modelData[this.state.currentVisibleChapter - 1].verseComponentsModels}
                            renderItem={({item,index}) => 
                            <Text style={{margin:8}}>
                               <VerseView
                                  ref={child => (this[`child_${item.chapterNumber}_${index}`] = child)}
                                  verseData = {item}
                                  index = {index}
                                  styles = {this.styles}
                                        />
                            </Text>
                            }

                            />
                            </View>
                        
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