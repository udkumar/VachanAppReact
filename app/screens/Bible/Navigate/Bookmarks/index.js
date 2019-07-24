import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  FlatList,
  TextInput,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DbQueries from '../../../../utils/dbQueries'
import { bookStyle } from './styles.js'
import {getBookNameFromMapping} from '../../../../utils/UtilFunctions';
Dimensions.get('window').width

export default class BookMarks extends Component {
  static navigationOptions = {
    headerTitle: 'Bookmarks',
    // headerTitle: (
     
    // ),
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
    // headerRight:(
    //   // <SearchBar
    //   //   placeholder="Type Here..."
    //   //   onChangeText={this.updateSearch}
    //   //   value={search}
    //   // />
    // )
  };
  
  constructor(props) {
    super(props)

    // this.removeBookmark = this.removeBookmark.bind(this)
    // this.refreshData = this.refreshData.bind(this)

    this.state = {
      // bookmarkList: [],
      // modelData: [],
      isLoading:false
    }
    
    this.styles = bookStyle(props.screenProps.colorFile, props.screenProps.sizeFile);   
    // this.refreshData = this.refreshData.bind(this)
  }

  async componentDidMount() {
    // this.refreshData()  
  } 

  // getItemLayout = (data, index) => {
  //   return { length: height, offset: height * index, index };
  // }

  // componentWillReceiveProps(props) {
  //   console.log("RECEIVE PROPS ::: " + JSON.stringify(props))
  //   console.log("RECEIVE PROPS BOOK<ARKS ::: " + JSON.stringify(props.screenProps.updateBookmarks))
  //   if (props.screenProps.updateBookmarks == true) {
  //     this.refreshData()
  //   }
  // }


  // refreshData(){
  //   this.setState({isLoading: true}, async () => {
  //     let modelData = await DbQueries.queryBooks(this.props.screenProps.versionCode, 
  //     this.props.screenProps.languageCode);
  //     console.log("model len= " + modelData.length)
  //     this.setState({modelData})
  //     var bookmarkList = []
  //     for (var i=0; i<modelData.length; i++) {
  //       var list = modelData[i].bookmarksList
  //       if (list) {
  //         console.log("loist len = "+modelData[i].bookId+" : "+modelData[i].bookmarksList.length)
  //         for (var j=0; j<list.length; j++) {
  //           var model={bookId: modelData[i].bookId, bookName: getBookNameFromMapping(modelData[i].bookId), 
  //             chapterNumber: list[j]}
  //           bookmarkList.push(model)
  //         }
  //       }
  //     }
  //     this.setState({bookmarkList,isLoading:false})
  //   }
  // )
  // }

  updateBookmark = ()=>{
    this.refreshData()
  }
  // componentWillUnmount(){
  //   console.log("book mark add")
  //   this.props.navigation.setParams({updateBookmark:this.updateBookmark})
  // }
  
  render() {
    console.log("book mark list from bookmark page "+this.props.screenProps.bookmarksList)
    return (
        <View style={this.styles.container}>
        <FlatList
          data={this.props.screenProps.bookmarksList}
          contentContainerStyle={this.props.screenProps.bookmarksList.length === 0 && this.styles.centerEmptySet}
          // getItemLayout={this.getItemLayout}
          renderItem={({item, index}) => 
            <TouchableOpacity style={this.styles.bookmarksView}
              onPress = { ()=> {this.props.screenProps.changeBookFromSplit(item.bookId,item.chapterNumber)}}
              >

              <Text style={this.styles.bookmarksText}>
              {getBookNameFromMapping(item.bookId,this.props.screenProps.languageName)} {":"} {item.chapterNumber}
              </Text>
              <Icon name='delete-forever' style={this.styles.iconCustom}   
                onPress={() => {this.props.screenProps.onBookmarkRemove(item.bookId,item.chapterNumber)} } 
              />
          
            </TouchableOpacity>
          }
          ListEmptyComponent={
            <View style={this.styles.emptyMessageContainer}>
            <Icon name="collections-bookmark" style={this.styles.emptyMessageIcon}/>
              <Text
                style={this.styles.messageEmpty}
              >
               No Bookmark added
              </Text>
              
            </View>
          }
          extraData={this.props}
        />
        </View>
    );
  }
}