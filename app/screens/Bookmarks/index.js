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
import DbQueries from '../../utils/dbQueries'
import { bookStyle } from './styles.js'
import {getBookNameFromMapping} from '../../utils/UtilFunctions';
Dimensions.get('window').width
import {connect} from 'react-redux'

class BookMarks extends Component {
  static navigationOptions = {
    headerTitle: 'Bookmarks',
    // headerTitle: (
     
    // ),
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
      bookmarksList: [],
      isLoading:false,
      languageName:this.props.navigation.state.params.languageName,
      versionCode:this.props.navigation.state.params.versionCode,
      bookId:this.props.navigation.state.params.bookId
    }
    
    this.styles = bookStyle(this.props.colorFile, this.props.sizeFile);   
    // this.refreshData = this.refreshData.bind(this)
  }

  async componentDidMount() {
    this.getBookMarks()  
  } 
  async getBookMarks(){
    const params = this.props.navigation.state.params
    let model = await  DbQueries.queryBookmark(this.state.languageName,this.state.versionCode,null,null)
    if (model == null) {
      
    }
    else{
      if(model.length > 0){
        console.log("book marked ",model)
        this.setState({bookmarksList:model})
       
      }
    }
  }
  navigateToBible(book,chapterNumber){
    this.props.navigation.navigate("Bible")
  }
  // getItemLayout = (data, index) => {
  //   return { length: height, offset: height * index, index };
  // }

    
  async onBookmarkRemove(id,chapterNum){
  await DbQueries.updateBookmarkInBook(this.state.languageName,this.state.versionCode,id,chapterNum,false);
      index = this.state.bookmarksList.findIndex(chapInd => chapInd.chapterNumber ===this.state.currentVisibleChapter);
      for(var i = 0; i<=this.state.bookmarksList.length;i++ ){
        if(this.state.bookmarksList[i].chapterNumber == chapterNum && this.state.bookmarksList[i].bookId == id ){
          this.props.navigation.setParams({isBookmark:false }) 
          await DbQueries.updateBookmarkInBook(this.state.languageName,this.state.versionCode,id,chapterNum,false);
          this.state.bookmarksList.splice(index, 1)
          this.setState({bookmarksList:this.state.bookmarksList.splice(index, 1),isBookmark:false})
        } 
      }
  }

  render() {
    return (
        <View style={this.styles.container}>
        <FlatList
          data={this.state.bookmarksList}
          contentContainerStyle={this.state.bookmarksList.length === 0 && this.styles.centerEmptySet}
          // getItemLayout={this.getItemLayout}
          renderItem={({item, index}) => 
            <TouchableOpacity style={this.styles.bookmarksView}
              // onPress = { ()=> {this.navigateToBible(item.bookId,item.chapterNumber)}}
              >

              <Text style={this.styles.bookmarksText}>
              {getBookNameFromMapping(item.bookId,this.props.languageName)} {":"} {item.chapterNumber}
              </Text>
              <Icon name='delete-forever' style={this.styles.iconCustom}   
                onPress={() => {this.onBookmarkRemove(item.bookId,item.chapterNumber)} } 
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

const mapStateToProps = state =>{
  return{
    languageName: state.updateVersion.language,
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
  }
}


export  default connect(mapStateToProps,null)(BookMarks)

